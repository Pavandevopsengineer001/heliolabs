"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export function CartDrawer() {
  const token = useAuthStore((state) => state.accessToken);
  const { cart, isOpen, close, setQuantity, removeItem, loading, error } = useCartStore((state) => ({
    cart: state.cart,
    isOpen: state.isOpen,
    close: state.close,
    setQuantity: state.setQuantity,
    removeItem: state.removeItem,
    loading: state.loading,
    error: state.error,
  }));

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white p-6 shadow-[0_20px_90px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-ember">Cart</p>
                <h3 className="mt-1 text-2xl font-semibold text-ink">Your regimen</h3>
              </div>
              <button type="button" onClick={close} className="rounded-full border border-black/10 p-2">
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
              {cart.items.length ? (
                cart.items.map((item) => (
                  <div key={item.product_id} className="rounded-[1.5rem] border border-black/5 p-4">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-sand">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-ink">{item.name}</p>
                            <p className="mt-1 text-sm text-smoke">
                              {formatCurrency(item.unit_price_cents)} each
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product_id, token)}
                            className="text-xs uppercase tracking-[0.18em] text-smoke"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-black/10 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => setQuantity(item.product_id, item.quantity - 1, token)}
                              className="rounded-full p-1"
                            >
                              <Minus className="size-4" />
                            </button>
                            <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(item.product_id, item.quantity + 1, token)}
                              className="rounded-full p-1"
                            >
                              <Plus className="size-4" />
                            </button>
                          </div>
                          <p className="font-semibold text-ink">{formatCurrency(item.subtotal_cents)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-black/10 bg-sand p-10 text-center">
                  <p className="text-lg text-ink">Your cart is empty.</p>
                  <p className="mt-2 text-sm text-smoke">
                    Add a few HelioLabs essentials to begin checkout.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-black/5 pt-6">
              {error ? <p className="mb-3 text-sm text-ember">{error}</p> : null}
              <div className="flex items-center justify-between text-sm text-smoke">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.subtotal_cents)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-lg font-semibold text-ink">
                <span>Total</span>
                <span>{formatCurrency(cart.subtotal_cents)}</span>
              </div>
              <Link
                href="/checkout"
                className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  !cart.items.length || loading
                    ? "pointer-events-none bg-black/10 text-black/40"
                    : "bg-ember text-white shadow-[0_18px_35px_rgba(255,106,0,0.22)] hover:bg-[#ff7f26]"
                }`}
                onClick={close}
              >
                Proceed to Checkout
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
