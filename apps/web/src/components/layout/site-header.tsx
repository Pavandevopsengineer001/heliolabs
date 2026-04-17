"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/science", label: "Science" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/account", label: "Account" },
];

export function SiteHeader() {
  const open = useCartStore((state) => state.open);
  const count = useCartStore((state) => state.cart.total_items);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/heliolabs-logo.png"
            alt="HelioLabs"
            width={48}
            height={48}
            className="rounded-full border border-black/5 bg-white"
          />
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-smoke">Science Sun Skin</p>
            <p className="text-lg font-semibold tracking-[0.22em] text-ink">HELIO LABS</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-smoke lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <Button variant="secondary" className="px-4 py-2.5" onClick={open}>
          Cart
          <span className="rounded-full bg-ember px-2 py-0.5 text-xs text-white">{count}</span>
          <ShoppingBag className="size-4" />
        </Button>
      </div>
    </header>
  );
}

