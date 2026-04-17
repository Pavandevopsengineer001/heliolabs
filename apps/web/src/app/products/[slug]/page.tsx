import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/catalog/product-card";
import { AddToCart } from "@/components/product/add-to-cart";
import { ProductGallery } from "@/components/product/product-gallery";
import { SectionIntro } from "@/components/ui/section-intro";
import { getProductBySlug, getProducts } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: "Product Not Found | HelioLabs",
      description: "The requested product could not be found.",
    });
  }
  return buildMetadata({
    title: `${product.name} | HelioLabs`,
    description: product.short_description,
    path: `/products/${product.slug}`,
    image: product.image_url,
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProducts())
    .filter((item) => item.slug !== product.slug)
    .filter((item) => item.concerns.some((concern) => product.concerns.includes(concern)))
    .slice(0, 3);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.gallery,
    description: product.description,
    brand: "HelioLabs",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.price_cents / 100).toFixed(2),
      availability: product.stock_available > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery name={product.name} images={product.gallery} />
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="text-xs uppercase tracking-[0.3em] text-ember">{product.concerns.join(" • ")}</p>
          <h1 className="mt-4 font-serif text-5xl leading-none text-ink">{product.name}</h1>
          <p className="mt-5 text-lg leading-8 text-smoke">{product.description}</p>
          <div className="mt-8 rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-smoke">Price</p>
                <p className="mt-2 text-3xl font-semibold text-ink">{formatCurrency(product.price_cents)}</p>
              </div>
              <div className="text-right text-sm text-smoke">
                <p>{product.rating.toFixed(1)} / 5 rating</p>
                <p>{product.review_count} verified reviews</p>
              </div>
            </div>
            <div className="mt-6">
              <AddToCart productId={product.id} stock={product.stock_available} />
            </div>
            <div className="mt-6 grid gap-4 border-t border-black/5 pt-6 text-sm text-smoke md:grid-cols-3">
              <div>
                <p className="font-semibold text-ink">Skin types</p>
                <p className="mt-2">{product.skin_types.join(", ")}</p>
              </div>
              <div>
                <p className="font-semibold text-ink">Primary focus</p>
                <p className="mt-2">{product.concerns.join(", ")}</p>
              </div>
              <div>
                <p className="font-semibold text-ink">Stock status</p>
                <p className="mt-2">{product.stock_available > 0 ? "Available now" : "Sold out"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
          <p className="text-xs uppercase tracking-[0.28em] text-ember">Ingredient Breakdown</p>
          <div className="mt-6 space-y-5">
            {product.ingredients.map((ingredient) => (
              <div key={ingredient.name} className="rounded-[1.5rem] border border-black/5 p-5">
                <h3 className="text-xl font-semibold text-ink">{ingredient.name}</h3>
                <p className="mt-3 text-sm leading-7 text-smoke">{ingredient.benefit}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            <p className="text-xs uppercase tracking-[0.28em] text-ember">Benefits</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {product.benefits.map((benefit) => (
                <div key={benefit} className="rounded-[1.5rem] border border-black/5 bg-sand p-5 text-sm leading-7 text-smoke">
                  {benefit}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            <p className="text-xs uppercase tracking-[0.28em] text-ember">How to Use</p>
            <ol className="mt-6 space-y-4">
              {product.how_to_use.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-[1.5rem] border border-black/5 p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ember text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-smoke">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <SectionIntro
          eyebrow="Reviews"
          title="Short, high-confidence proof from daily use."
          description="Clinical trust should still feel emotional. These are the moments people notice: easier reapplication, better finish, less routine resistance."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {product.reviews.map((review) => (
            <div key={`${review.name}-${review.title}`} className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
              <p className="text-lg leading-8 text-ink">“{review.title}”</p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink">{review.name}</p>
                  <p className="text-sm text-smoke">Verified customer</p>
                </div>
                <p className="text-sm uppercase tracking-[0.22em] text-ember">{review.rating}/5</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionIntro
          eyebrow="Suggested Pairings"
          title="Build a complete regimen around the same skin goal."
          description="HelioLabs pages are internally connected by concern, ingredient, and skin-type logic to support discovery and SEO depth."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {relatedProducts.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>

      <div className="mt-16 rounded-[2rem] border border-black/5 bg-white p-6">
        <div className="flex items-center gap-3">
          <Image src="/heliolabs-logo.png" alt="HelioLabs logo" width={56} height={56} />
          <div>
            <p className="text-sm font-semibold text-ink">HelioLabs Journal Link Paths</p>
            <p className="text-sm text-smoke">
              Explore <Link href="/ingredient/niacinamide" className="text-ember">ingredient deep dives</Link>,{" "}
              <Link href="/skin-type/oily" className="text-ember">skin type guides</Link>, and{" "}
              <Link href="/concern/acne" className="text-ember">concern-led pages</Link> for programmatic discovery.
            </p>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </div>
  );
}

