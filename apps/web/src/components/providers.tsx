"use client";

import type { ReactNode } from "react";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { StoreBootstrap } from "@/components/store-bootstrap";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <StoreBootstrap />
      {children}
      <CartDrawer />
    </>
  );
}

