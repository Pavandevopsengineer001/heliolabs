"use client";

import { useEffect, useRef } from "react";

import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export function StoreBootstrap() {
  const syncCart = useCartStore((state) => state.sync);
  const ensureSession = useCartStore((state) => state.ensureSession);
  const authIsHydrated = useAuthStore((state) => state.isHydrated);
  const cartIsHydrated = useCartStore((state) => state.isHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshSession = useAuthStore((state) => state.refreshSession);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Wait for both stores to be hydrated from localStorage
    if (!authIsHydrated || !cartIsHydrated) {
      return;
    }

    // Prevent multiple initializations
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    // Ensure guest session ID is generated
    ensureSession();

    // Refresh token if exists, then sync cart
    (async () => {
      try {
        await refreshSession();
      } catch (error) {
        console.error("Failed to refresh session:", error);
      } finally {
        // Always sync cart, whether refresh succeeded or not
        try {
          await syncCart(accessToken);
        } catch (error) {
          console.error("Failed to sync cart:", error);
        }
      }
    })();
  }, [authIsHydrated, cartIsHydrated, accessToken, ensureSession, refreshSession, syncCart]);

  return null;
}
