"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";

interface ConfirmPaymentCardProps {
  token: string;
  provider: string;
  amount: number;
}

export const ConfirmPaymentCard = ({ token, provider, amount }: ConfirmPaymentCardProps) => {
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleAction = async (action: "accept" | "reject") => {
    setError("");
    setStatus(`${action === "accept" ? "Accepting" : "Rejecting"} payment...`);

    try {
      const response = await fetch("/api/onramp/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, action })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to complete payment confirmation");
      }

      router.push("/transfer");
    } catch (err) {
      setStatus("");
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to complete payment confirmation");
      }
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-lg font-semibold">Pending Payment</div>
      <div className="mt-4 text-sm text-slate-600">Provider: {provider}</div>
      <div className="mt-2 text-sm text-slate-600">Amount: ₹{(amount / 100).toFixed(2)}</div>
      <div className="mt-2 text-sm text-slate-600">Token: {token}</div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {status && <p className="mt-4 text-green-500">{status}</p>}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button onClick={() => handleAction("accept")}>Accept Payment</Button>
        <Button onClick={() => handleAction("reject")}>Reject Payment</Button>
      </div>
    </div>
  );
};
