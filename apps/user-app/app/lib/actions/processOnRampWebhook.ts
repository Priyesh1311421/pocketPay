import prisma from "@repo/db/client";

interface ProcessOnRampInput {
  token: string;
}

export async function processOnRampWebhook({ token }: ProcessOnRampInput) {
  const pendingTransaction = await prisma.onRampTransaction.findFirst({
    where: {
      token,
      status: "Pending"
    }
  });

  if (!pendingTransaction) {
    return {
      success: false,
      message: "Pending transaction not found or already processed"
    };
  }

  await prisma.$transaction([
    prisma.balance.updateMany({
      where: {
        userId: pendingTransaction.userId
      },
      data: {
        amount: {
          increment: pendingTransaction.amount
        }
      }
    }),
    prisma.onRampTransaction.updateMany({
      where: {
        token
      },
      data: {
        status: "Completed"
      }
    })
  ]);

  return {
    success: true,
    message: "Transaction completed successfully",
    token,
    amount: pendingTransaction.amount
  };
}

export async function rejectOnRampTransaction({ token }: ProcessOnRampInput) {
  const pendingTransaction = await prisma.onRampTransaction.findFirst({
    where: {
      token,
      status: "Pending"
    }
  });

  if (!pendingTransaction) {
    return {
      success: false,
      message: "Pending transaction not found or already processed"
    };
  }

  await prisma.onRampTransaction.updateMany({
    where: {
      token
    },
    data: {
      status: "Failed"
    }
  });

  return {
    success: true,
    message: "Transaction rejected",
    token
  };
}
