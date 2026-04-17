import type { Metadata } from "next";

import { AccountDashboard } from "@/components/account/account-dashboard";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Account | HelioLabs",
  description: "Manage your HelioLabs profile, orders, and saved address details.",
  path: "/account",
});

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.35em] text-ember">Account</p>
        <h1 className="mt-5 font-serif text-6xl leading-none text-ink">Orders, profile, and saved routine details.</h1>
      </div>
      <AccountDashboard />
    </section>
  );
}

