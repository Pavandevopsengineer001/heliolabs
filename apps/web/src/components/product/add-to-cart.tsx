"use client";

import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export function AddToCart({
  productId,
  stock,
}: {
  productId: string;
  stock: number;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const token = useAuthStore((state) => state.accessToken);
  const addItem = useCartStore((state) => state.addItem);

  if (stock <= 0) {
    return (
      <Button className="w-full" disabled>
        Out of stock
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        className="w-full"
        onClick={() =>
          startTransition(async () => {
            try {
              await addItem(productId, 1, token);
              setMessage("Added to cart.");
            } catch (error) {
              setMessage(error instanceof Error ? error.message : "Could not add product.");
            }
          })
        }
      >
        Add to Cart
      </Button>
      {message ? <p className="text-sm text-smoke">{message}</p> : null}
    </div>
  );
}

