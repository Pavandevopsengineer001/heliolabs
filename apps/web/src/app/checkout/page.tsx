"use client";

import { startTransition, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { createCheckout } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

const schema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  line1: z.string().min(4),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postal_code: z.string().min(4),
  country: z.string().min(2).default("India"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const cart = useCartStore((state) => state.cart);
  const sync = useCartStore((state) => state.sync);
  const ensureSession = useCartStore((state) => state.ensureSession);
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email ?? "",
      full_name: user?.full_name ?? "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      phone: "",
      notes: "",
    },
  });

  useEffect(() => {
    sync(token);
  }, [sync, token]);

  useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email);
    }
    if (user?.full_name) {
      form.setValue("full_name", user.full_name);
    }
  }, [form, user]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    setStatus(params.get("status"));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.35em] text-ember">Checkout</p>
        <h1 className="mt-5 font-serif text-6xl leading-none text-ink">Finish your HelioLabs order with one secure step.</h1>
      </div>

      {status ? (
        <div className="mb-8 rounded-[1.6rem] border border-black/5 bg-white p-5 text-sm text-smoke">
          {status === "success"
            ? "Stripe returned successfully. Your order status will update as soon as the webhook confirms payment."
            : "Your checkout session was cancelled or interrupted. Your cart is still available."}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={form.handleSubmit((values) =>
            startTransition(async () => {
              const sessionId = ensureSession();
              try {
                const response = await createCheckout(
                  sessionId,
                  {
                    email: values.email,
                    shipping_address: {
                      full_name: values.full_name,
                      line1: values.line1,
                      line2: values.line2,
                      city: values.city,
                      state: values.state,
                      postal_code: values.postal_code,
                      country: values.country,
                      phone: values.phone,
                    },
                    notes: values.notes,
                    success_url: `${window.location.origin}/checkout?status=success`,
                    cancel_url: `${window.location.origin}/checkout?status=cancelled`,
                  },
                  token
                );
                window.location.assign(response.checkout_url);
              } catch (error) {
                setFeedback(error instanceof Error ? error.message : "Unable to start checkout.");
              }
            })
          )}
          className="grid gap-5 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <input {...form.register("email")} className="input" placeholder="Email" />
            <input {...form.register("full_name")} className="input" placeholder="Full name" />
          </div>
          <input {...form.register("line1")} className="input" placeholder="Address line 1" />
          <input {...form.register("line2")} className="input" placeholder="Address line 2" />
          <div className="grid gap-5 md:grid-cols-3">
            <input {...form.register("city")} className="input" placeholder="City" />
            <input {...form.register("state")} className="input" placeholder="State" />
            <input {...form.register("postal_code")} className="input" placeholder="Postal code" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <input {...form.register("country")} className="input" placeholder="Country" />
            <input {...form.register("phone")} className="input" placeholder="Phone" />
          </div>
          <textarea
            {...form.register("notes")}
            rows={4}
            className="input min-h-32 resize-none"
            placeholder="Delivery notes"
          />
          <Button type="submit" disabled={!cart.items.length}>
            Continue to Stripe
          </Button>
          {feedback ? <p className="text-sm text-ember">{feedback}</p> : null}
        </form>

        <aside className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
          <p className="text-xs uppercase tracking-[0.28em] text-ember">Order Summary</p>
          <div className="mt-6 space-y-4">
            {cart.items.map((item) => (
              <div key={item.product_id} className="flex items-center justify-between gap-4 rounded-[1.4rem] bg-sand p-4">
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-smoke">
                    {item.quantity} × {formatCurrency(item.unit_price_cents)}
                  </p>
                </div>
                <p className="font-semibold text-ink">{formatCurrency(item.subtotal_cents)}</p>
              </div>
            ))}
            {!cart.items.length ? (
              <p className="rounded-[1.4rem] border border-dashed border-black/10 p-6 text-sm text-smoke">
                Your cart is empty. Add products before starting checkout.
              </p>
            ) : null}
          </div>
          <div className="mt-6 border-t border-black/5 pt-6">
            <div className="flex items-center justify-between text-sm text-smoke">
              <span>Subtotal</span>
              <span>{formatCurrency(cart.subtotal_cents)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-lg font-semibold text-ink">
              <span>Total</span>
              <span>{formatCurrency(cart.subtotal_cents)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
