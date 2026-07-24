import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "./lib/auth";

export const metadata: Metadata = {
  title: "PocketPay",
  description: "PocketPay is a modern wallet for fast transfers, secure top-ups, and easy transaction tracking.",
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
              PocketPay Wallet
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                Your money, in one smart wallet.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Send money, top up your balance, and monitor every transaction from a single secure experience. Designed to feel like the payment apps you already trust.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-base font-semibold text-white transition hover:bg-slate-700"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-900 bg-white px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-200">
            <div className="flex items-center justify-between rounded-3xl bg-slate-100 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Wallet balance</p>
                <p className="text-3xl font-semibold text-slate-900">₹ 8,920.00</p>
              </div>
              <span className="rounded-2xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">
                Available
              </span>
            </div>
            <div className="mt-8 space-y-5">
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">Next payment</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">₹ 2,500 to Rent</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Recent transfer</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">₹ 1,250 to Aisha</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Pending top-up</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">₹ 3,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                title: "Top up wallet",
                description: "Add funds instantly and keep your balance ready for payments and transfers.",
              },
              {
                title: "Send with ease",
                description: "Transfer money to contacts, review payment details, and confirm securely.",
              },
              {
                title: "Track history",
                description: "View completed and pending transactions in one clear timeline.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl bg-slate-50 p-8">
                <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-4 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">How PocketPay works</p>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">A familiar payment flow, built for speed.</h2>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Start with a secure sign-in, choose your top-up amount, confirm the payment, and move money in one smooth flow. The app guides users through each step exactly like modern payment platforms.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  step: "01",
                  title: "Sign in securely",
                  detail: "Use your credentials to access your PocketPay wallet and start transacting.",
                },
                {
                  step: "02",
                  title: "Top up funds",
                  detail: "Initiate a dummy transaction, then confirm or cancel from the payment page.",
                },
                {
                  step: "03",
                  title: "Send & review",
                  detail: "Transfer money to friends or businesses and track every activity in dashboard.",
                },
              ].map((item) => (
                <div key={item.step} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-base font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
