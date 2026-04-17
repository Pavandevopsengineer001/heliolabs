"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export function StoreBootstrap() {
  const syncCart = useCartStore((state) => state.sync);
  const ensureSession = useCartStore((state) => state.ensureSession);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshSession = useAuthStore((state) => state.refreshSession);

  useEffect(() => {
    ensureSession();
    refreshSession().finally(() => {
      syncCart(accessToken);
    });
  }, [accessToken, ensureSession, refreshSession, syncCart]);

  return null;
}

