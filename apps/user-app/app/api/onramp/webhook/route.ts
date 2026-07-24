import { z } from "zod";
import { NextResponse } from "next/server";
import { processOnRampWebhook, rejectOnRampTransaction } from "../../../lib/actions/processOnRampWebhook";

const webhookSchema = z.object({
  token: z.string().min(1),
  action: z.enum(["accept", "reject"])
});

export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = webhookSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request body", errors: parsed.error.errors },
      { status: 400 }
    );
  }

  const { token, action } = parsed.data;

  if (action === "accept") {
    const result = await processOnRampWebhook({ token });
    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({ message: result.message, token });
  }

  const result = await rejectOnRampTransaction({ token });
  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ message: result.message, token });
};
