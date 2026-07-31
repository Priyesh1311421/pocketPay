import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import { ConfirmPaymentCard } from "../ConfirmPaymentCard";

async function getPendingTransaction(token: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const transaction = await prisma.onRampTransaction.findFirst({
    where: {
      token,
      userId: Number(session.user.id),
      status: "Pending"
    }
  });

  return transaction;
}

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const transaction = await getPendingTransaction(token);

  if (!transaction) {
    redirect("/transfer");
  }

  return (
    <div className="pr-2 w-full">
      <div className="flex items-center justify-center text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        <span>Confirm Payment</span>
      </div>
      <div className="grid grid-col-1 sm:grid-cols-1 gap-4 p-4 max-md:p-0 max-md:pr-2 w-full">
        <div>
          <ConfirmPaymentCard
            token={transaction.token}
            provider={transaction.provider}
            amount={transaction.amount}
          />
        </div>
      </div>
    </div>
  );
}
