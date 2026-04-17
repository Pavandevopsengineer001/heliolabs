"use client";

import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getCart, removeCartItem, upsertCartItem } from "@/lib/api";
import type { Cart } from "@/types/api";

type CartState = {
  sessionId: string;
  cart: Cart;
  isOpen: boolean;
  loading: boolean;
  error?: string;
  isHydrated: boolean;
  ensureSession: () => string;
  open: () => void;
  close: () => void;
  hydrate: (cart: Cart) => void;
  sync: (token?: string | null) => Promise<void>;
  addItem: (productId: string, quantity?: number, token?: string | null) => Promise<void>;
  setQuantity: (productId: string, quantity: number, token?: string | null) => Promise<void>;
  removeItem: (productId: string, token?: string | null) => Promise<void>;
};

const emptyCart: Cart = {
  items: [],
  total_items: 0,
  subtotal_cents: 0,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      sessionId: "",
      cart: emptyCart,
      isOpen: false,
      loading: false,
      isHydrated: false,
      ensureSession: () => {
        const existing = get().sessionId;
        if (existing) {
          return existing;
        }
        const generated = nanoid(24);
        set({ sessionId: generated });
        return generated;
      },
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      hydrate: (cart) => set({ cart, error: undefined }),
      sync: async (token) => {
        const sessionId = get().ensureSession();
        set({ loading: true, error: undefined });
        try {
          const cart = await getCart(sessionId, token);
          set({ cart, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Unable to load your cart.",
          });
        }
      },
      addItem: async (productId, quantity = 1, token) => {
        const sessionId = get().ensureSession();
        set({ loading: true, error: undefined });
        try {
          const cart = await upsertCartItem(
            { product_id: productId, quantity, mode: "add" },
            sessionId,
            token
          );
          set({ cart, loading: false, isOpen: true });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Unable to add product.",
          });
          throw error;
        }
      },
      setQuantity: async (productId, quantity, token) => {
        const sessionId = get().ensureSession();
        if (quantity <= 0) {
          await get().removeItem(productId, token);
          return;
        }
        set({ loading: true, error: undefined });
        try {
          const cart = await upsertCartItem(
            { product_id: productId, quantity, mode: "set" },
            sessionId,
            token
          );
          set({ cart, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Unable to update quantity.",
          });
        }
      },
      removeItem: async (productId, token) => {
        const sessionId = get().ensureSession();
        set({ loading: true, error: undefined });
        try {
          const cart = await removeCartItem(productId, sessionId, token);
          set({ cart, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Unable to remove item.",
          });
        }
      },
    }),
    {
      name: "heliolabs-cart",
      partialize: (state) => ({
        sessionId: state.sessionId,
        cart: state.cart,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);

