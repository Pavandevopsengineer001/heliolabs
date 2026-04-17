import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/catalog/product-card";
import { concernContent } from "@/data/discovery";
import { getProducts } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: keyof typeof concernContent }>;
};

export function generateStaticParams() {
  return Object.keys(concernContent).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = concernContent[slug];
  if (!content) {
    return buildMetadata({
      title: "Skin Concern Guide | HelioLabs",
      description: "Target acne, pigmentation, and dryness with HelioLabs routines.",
    });
  }
  return buildMetadata({
    title: `${content.title} Solutions | HelioLabs`,
    description: content.description,
    path: `/concern/${slug}`,
  });
}

export default async function ConcernPage({ params }: PageProps) {
  const { slug } = await params;
  const content = concernContent[slug];
  if (!content) {
    notFound();
  }
  const products = (await getProducts()).filter((product) => product.concerns.includes(slug));

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-ember">Concern Guide</p>
      <h1 className="mt-5 font-serif text-6xl leading-none text-ink">{content.title} care built around calm correction.</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-smoke">{content.description}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {content.strategy.map((tip) => (
          <div key={tip} className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] text-sm leading-7 text-smoke">
            {tip}
          </div>
        ))}
      </div>
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

