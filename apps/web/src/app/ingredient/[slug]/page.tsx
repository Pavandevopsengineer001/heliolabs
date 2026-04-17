import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/catalog/product-card";
import { ingredientContent } from "@/data/discovery";
import { getProductBySlug, getProducts } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: keyof typeof ingredientContent }>;
};

export function generateStaticParams() {
  return Object.keys(ingredientContent).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = ingredientContent[slug];
  if (!content) {
    return buildMetadata({
      title: "Ingredient Guide | HelioLabs",
      description: "Deep dives into HelioLabs hero ingredients.",
    });
  }
  return buildMetadata({
    title: `${content.title} | HelioLabs`,
    description: content.summary,
    path: `/ingredient/${slug}`,
  });
}

export default async function IngredientPage({ params }: PageProps) {
  const { slug } = await params;
  const content = ingredientContent[slug];
  if (!content) {
    notFound();
  }

  const productCards = await getProducts();
  const productDetails = await Promise.all(
    productCards.map((product) => getProductBySlug(product.slug))
  );
  const products = productDetails.filter((product): product is NonNullable<(typeof productDetails)[number]> => {
    if (!product) {
      return false;
    }
    return product.ingredients.some((ingredient) =>
      ingredient.name.toLowerCase().includes(slug.replaceAll("-", " "))
    );
  });

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-ember">Ingredient Guide</p>
      <h1 className="mt-5 font-serif text-6xl leading-none text-ink">{content.title} in clear, useful language.</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-smoke">{content.summary}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {content.facts.map((fact) => (
          <div key={fact} className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] text-sm leading-7 text-smoke">
            {fact}
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
