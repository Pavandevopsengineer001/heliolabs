"use client";

import { startTransition, useEffect, useState } from "react";

import { AuthPanel } from "@/components/forms/auth-panel";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function AccountDashboard() {
  const [message, setMessage] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const orders = useAuthStore((state) => state.orders);
  const fetchAccount = useAuthStore((state) => state.fetchAccount);
  const saveProfile = useAuthStore((state) => state.saveProfile);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    if (user && !profile) {
      fetchAccount();
    }
  }, [fetchAccount, profile, user]);

  if (!user) {
    return <AuthPanel />;
  }

  const defaultAddress = profile?.addresses[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-ember">Profile</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">{profile?.full_name || user.email}</h2>
          </div>
          <Button variant="secondary" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            defaultValue={profile?.full_name ?? ""}
            id="fullName"
            className="input"
            placeholder="Full name"
          />
          <input defaultValue={user.email} disabled className="input bg-sand" />
          <input
            defaultValue={defaultAddress?.line1 ?? ""}
            id="line1"
            className="input"
            placeholder="Address line 1"
          />
          <input
            defaultValue={defaultAddress?.city ?? ""}
            id="city"
            className="input"
            placeholder="City"
          />
          <input
            defaultValue={defaultAddress?.state ?? ""}
            id="state"
            className="input"
            placeholder="State"
          />
          <input
            defaultValue={defaultAddress?.postal_code ?? ""}
            id="postalCode"
            className="input"
            placeholder="Postal code"
          />
        </div>
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <Button
            onClick={() =>
              startTransition(async () => {
                const fullName = (
                  document.getElementById("fullName") as HTMLInputElement | null
                )?.value;
                const line1 = (document.getElementById("line1") as HTMLInputElement | null)?.value;
                const city = (document.getElementById("city") as HTMLInputElement | null)?.value;
                const state = (document.getElementById("state") as HTMLInputElement | null)?.value;
                const postalCode = (
                  document.getElementById("postalCode") as HTMLInputElement | null
                )?.value;
                try {
                  await saveProfile({
                    full_name: fullName,
                    default_address: {
                      label: "Primary",
                      full_name: fullName || profile?.full_name || user.email,
                      line1: line1 || "",
                      city: city || "",
                      state: state || "",
                      postal_code: postalCode || "",
                      country: "India",
                      is_default: true,
                    },
                  });
                  setMessage("Profile updated.");
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : "Unable to save changes.");
                }
              })
            }
          >
            Save Profile
          </Button>
          {message ? <p className="text-sm text-smoke">{message}</p> : null}
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
        <p className="text-xs uppercase tracking-[0.28em] text-ember">Orders</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Your recent orders</h2>
        <div className="mt-6 space-y-4">
          {orders.length ? (
            orders.map((order) => (
              <div key={order.id} className="rounded-[1.5rem] border border-black/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-smoke">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ember">
                      {order.status.replaceAll("_", " ")}
                    </p>
                    <p className="text-sm text-ink">{formatCurrency(order.total_amount_cents)}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-smoke">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.product_id}`} className="flex justify-between">
                      <span>{item.product_name}</span>
                      <span>
                        {item.quantity} × {formatCurrency(item.unit_price_cents)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-[1.5rem] border border-dashed border-black/10 p-8 text-sm text-smoke">
              No orders yet. Your next sunscreen run will show up here.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

