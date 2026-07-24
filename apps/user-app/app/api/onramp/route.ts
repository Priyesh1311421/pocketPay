import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

const requestSchema = z.object({
  provider: z.string().min(1),
  amount: z.number().positive()
});

export const POST = async (request: Request) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthenticated request" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request body", errors: parsed.error.errors },
      { status: 400 }
    );
  }

  const userId = Number(session.user.id);
  const { provider, amount } = parsed.data;
  const token = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

  const transaction = await prisma.onRampTransaction.create({
    data: {
      provider,
      status: "Pending",
      startTime: new Date(),
      token,
      userId,
      amount: amount * 100
    }
  });

  return NextResponse.json({
    message: "Transaction initiated and pending confirmation",
    transaction: {
      id: transaction.id,
      provider: transaction.provider,
      amount: transaction.amount,
      status: transaction.status,
      token: transaction.token
    }
  });
};
