import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/catalog/product-card";
import { skinTypeContent } from "@/data/discovery";
import { getProducts } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: keyof typeof skinTypeContent }>;
};

export function generateStaticParams() {
  return Object.keys(skinTypeContent).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = skinTypeContent[slug];
  if (!content) {
    return buildMetadata({
      title: "Skin Type Guide | HelioLabs",
      description: "Explore HelioLabs skincare pathways by skin type.",
    });
  }
  return buildMetadata({
    title: `${content.title} Skincare | HelioLabs`,
    description: content.description,
    path: `/skin-type/${slug}`,
  });
}

export default async function SkinTypePage({ params }: PageProps) {
  const { slug } = await params;
  const content = skinTypeContent[slug];
  if (!content) {
    notFound();
  }
  const products = (await getProducts()).filter((product) => product.skin_types.includes(slug));

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-ember">Skin Type Guide</p>
      <h1 className="mt-5 font-serif text-6xl leading-none text-ink">{content.title} routines that stay elegant in real life.</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-smoke">{content.description}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {content.routine.map((tip) => (
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

