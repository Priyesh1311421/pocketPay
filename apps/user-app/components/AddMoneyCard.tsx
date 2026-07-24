"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";

const SUPPORTED_BANKS = [
    { name: "HDFC Bank" },
    { name: "Axis Bank" }
];

export const AddMoney = () => {
    const router = useRouter();
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [value, setValue] = useState(0);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");

    const handleAddMoney = async () => {
        setError("");
        setStatus("");

        if (value < 1) {
            setError("Amount must be greater than 1");
            return;
        }

        try {
            const response = await fetch("/api/onramp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ provider, amount: value })
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to add funds");
            }

            setStatus("Redirecting to payment confirmation...");
            router.push(`/transfer/confirm/${result.transaction.token}`);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unable to initiate dummy transaction");
            }
        }
    };

    return (
        <Card title="Add Money">
            <div className="w-full">
                <TextInput
                    label={"Amount"}
                    placeholder={"Amount"}
                    onChange={(val) => {
                        setValue(Number(val));
                    }}
                />
                {error && <p className="text-red-500">{error}</p>}
                {status && <p className="text-green-500">{status}</p>}
                <div className="py-4 text-left">
                    Bank
                </div>
                <Select
                    onSelect={(value) => {
                        setProvider(value);
                    }}
                    options={SUPPORTED_BANKS.map(x => ({
                        key: x.name,
                        value: x.name
                    }))}
                />
                <div className="flex justify-center pt-4">
                    <Button onClick={handleAddMoney}>
                        Add Money
                    </Button>
                </div>
            </div>
    
        </Card>
    );
};