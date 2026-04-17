"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { ProductCard } from "@/components/catalog/product-card";
import { Button } from "@/components/ui/button";
import type { ProductCard as ProductCardType } from "@/types/api";

const skinTypes = ["all", "oily", "dry", "combination", "sensitive", "normal"];
const concerns = ["all", "acne", "hyperpigmentation", "dryness", "texture", "sun protection"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function ProductsExplorer({ products }: { products: ProductCardType[] }) {
  const [skinType, setSkinType] = useState("all");
  const [concern, setConcern] = useState("all");
  const [sort, setSort] = useState("featured");

  const deferredFilters = useDeferredValue({ skinType, concern, sort });

  const filteredProducts = useMemo(() => {
    const base = products.filter((product) => {
      const skinMatch =
        deferredFilters.skinType === "all" ||
        product.skin_types.includes(deferredFilters.skinType);
      const concernMatch =
        deferredFilters.concern === "all" ||
        product.concerns.includes(deferredFilters.concern);
      return skinMatch && concernMatch;
    });

    if (deferredFilters.sort === "price_asc") {
      return [...base].sort((left, right) => left.price_cents - right.price_cents);
    }
    if (deferredFilters.sort === "price_desc") {
      return [...base].sort((left, right) => right.price_cents - left.price_cents);
    }
    if (deferredFilters.sort === "rating") {
      return [...base].sort((left, right) => right.rating - left.rating);
    }
    return [...base].sort((left, right) => Number(right.featured) - Number(left.featured));
  }, [products, deferredFilters]);

  return (
    <div className="space-y-10">
      <div className="sticky top-[84px] z-20 rounded-[1.75rem] border border-black/5 bg-white/90 p-4 shadow-[0_20px_45px_rgba(0,0,0,0.04)] backdrop-blur">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_220px]">
          <div className="flex flex-wrap gap-2">
            {skinTypes.map((item) => (
              <Button
                key={item}
                variant={skinType === item ? "primary" : "secondary"}
                className="px-4 py-2"
                onClick={() => setSkinType(item)}
              >
                {item === "all" ? "All Skin Types" : item}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {concerns.map((item) => (
              <Button
                key={item}
                variant={concern === item ? "primary" : "secondary"}
                className="px-4 py-2"
                onClick={() => setConcern(item)}
              >
                {item === "all" ? "All Concerns" : item}
              </Button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-full border border-black/10 px-4 py-3 text-sm text-ink outline-none transition focus:border-ember"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {!filteredProducts.length && (
        <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-12 text-center">
          <p className="text-lg text-ink">No products match those filters yet.</p>
          <p className="mt-2 text-sm text-smoke">
            Try widening your concern or skin type selection.
          </p>
        </div>
      )}
    </div>
  );
}

