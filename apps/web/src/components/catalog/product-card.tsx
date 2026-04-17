import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import type { ProductCard as ProductCardType } from "@/types/api";

export function ProductCard({ product }: { product: ProductCardType }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-[2rem] border border-black/5 bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative overflow-hidden rounded-[1.5rem] bg-sand">
        <Image
          src={product.image_url}
          alt={product.name}
          width={900}
          height={1100}
          className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-ink backdrop-blur">
          {product.featured ? "Featured" : product.skin_types[0]}
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-smoke">
            {product.concerns.join(" • ")}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-ink">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-smoke">{product.short_description}</p>
        </div>
        <ArrowUpRight className="mt-2 size-5 text-ember" />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
        <p className="text-lg font-semibold text-ink">{formatCurrency(product.price_cents)}</p>
        <p className="text-sm text-smoke">
          {product.rating.toFixed(1)} / 5 ({product.review_count})
        </p>
      </div>
    </Link>
  );
}

