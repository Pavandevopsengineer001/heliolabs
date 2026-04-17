import type { Metadata } from "next";

import { ProductsExplorer } from "@/components/catalog/products-explorer";
import { SectionIntro } from "@/components/ui/section-intro";
import { getProducts } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Products | HelioLabs",
  description: "Explore HelioLabs sunscreen, serums, moisturizers, and treatment essentials.",
  path: "/products",
});

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <SectionIntro
        eyebrow="Product Library"
        title="A premium clinical catalog, filtered around real skin decisions."
        description="Shop by skin type, concern, or finish preference. HelioLabs keeps the assortment tight so the path to a working routine feels immediate."
      />
      <div className="mt-12">
        <ProductsExplorer products={products} />
      </div>
    </section>
  );
}

