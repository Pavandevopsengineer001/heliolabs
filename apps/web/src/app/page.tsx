import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, SunMedium, TestTube2 } from "lucide-react";

import { ProductCard } from "@/components/catalog/product-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Reveal } from "@/components/ui/reveal";
import { SectionIntro } from "@/components/ui/section-intro";
import { getFeaturedProducts } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const trustBadges = [
  "Broad-spectrum UV protection",
  "Barrier-first formulations",
  "Clinically elegant textures",
  "Designed for humid climates",
];

const testimonials = [
  {
    quote: "The finish is premium, invisible, and finally something I enjoy reapplying.",
    name: "Meera S.",
    title: "HelioLabs customer",
  },
  {
    quote: "It feels like a dermatology recommendation dressed like a luxury product.",
    name: "Rohan P.",
    title: "Long-term sunscreen user",
  },
  {
    quote: "The formulas are stripped of noise but not stripped of performance.",
    name: "Dr. Isha N.",
    title: "Aesthetic physician",
  },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const spotlightProduct = featuredProducts[0];

  return (
    <div className="pb-20">
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-14 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-ember">Daily defense, elevated</p>
          <h1 className="mt-6 font-serif text-6xl leading-none text-ink sm:text-7xl">
            Minimal skincare for high-exposure, modern skin.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-smoke">
            HelioLabs blends clinical credibility with premium D2C restraint: elegant formulas, dermatologist-level trust, and a storefront built around the products first.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(255,106,0,0.22)] transition hover:bg-[#ff7f26]"
            >
              Shop the Routine
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/science"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-black/20 hover:bg-sand"
            >
              Explore the Science
            </Link>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { label: "SPF in every daylight routine", value: "100%" },
              { label: "Barrier-supportive actives", value: "3 core pillars" },
              { label: "Average review score", value: "4.8/5" },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.6rem] border border-black/5 bg-white/90 p-5">
                <p className="text-2xl font-semibold text-ink">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-smoke">{item.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="relative">
          <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-ember/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-5 shadow-glow">
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-[2rem] bg-sand p-6">
                <div className="rounded-[1.75rem] border border-white/80 bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-smoke">Hero Product</p>
                  <h2 className="mt-3 text-2xl font-semibold text-ink">{spotlightProduct?.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-smoke">{spotlightProduct?.short_description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-lg font-semibold text-ink">
                      {spotlightProduct ? formatCurrency(spotlightProduct.price_cents) : ""}
                    </p>
                    <span className="rounded-full bg-ember/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-ember">
                      Bestseller
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fff8f2] via-white to-[#f1f1f1] p-6">
                <Image
                  src={spotlightProduct?.image_url ?? "/heliolabs-logo.png"}
                  alt={spotlightProduct?.name ?? "HelioLabs"}
                  width={1200}
                  height={1400}
                  priority
                  className="h-[520px] w-full rounded-[1.6rem] object-cover"
                />
                <div className="absolute bottom-8 left-8 rounded-[1.5rem] border border-white/70 bg-white/88 px-5 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.28em] text-smoke">Clinical Promise</p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    Lightweight wear. Broad-spectrum defense. No routine friction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-black/5 bg-white/85">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 md:grid-cols-4 md:px-8">
          {trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-3 text-sm text-smoke">
              <ShieldCheck className="size-4 text-ember" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <Reveal>
          <SectionIntro
            eyebrow="Featured Products"
            title="A tight edit of routines people actually finish."
            description="No bloated catalog. Each HelioLabs formula earns its place by improving adherence, texture, or everyday confidence."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <Reveal key={product.slug} transition={{ duration: 0.55, delay: index * 0.08 }}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <div className="grid gap-6 rounded-[2.5rem] bg-ink p-8 text-white md:grid-cols-3 md:p-10">
          {[
            {
              icon: SunMedium,
              title: "Sun-first",
              copy: "Every daytime routine is designed to make sunscreen generous, elegant, and repeatable.",
            },
            {
              icon: TestTube2,
              title: "Evidence-led",
              copy: "Ingredient choices are built around barrier health, efficacy, and long-term consistency.",
            },
            {
              icon: Sparkles,
              title: "Premium wear",
              copy: "Textures are tuned for daily life, humidity, layering, and modern minimalism.",
            },
          ].map((item) => (
            <Reveal key={item.title} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
              <item.icon className="size-6 text-ember" />
              <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{item.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <Reveal>
          <SectionIntro
            eyebrow="Education"
            title="Dermatology logic, translated for daily behavior."
            description="HelioLabs content is built to reduce guesswork. Learn when to prioritize sunscreen, when to pause actives, and how to build routines that hold up in real climates."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              href: "/ingredient/niacinamide",
              title: "Ingredient intelligence",
              copy: "Understand niacinamide, ceramides, and retinaldehyde in plain, decision-useful language.",
            },
            {
              href: "/skin-type/oily",
              title: "Skin-type pathways",
              copy: "Explore routines shaped around oily, dry, and sensitive skin needs without clutter.",
            },
            {
              href: "/concern/acne",
              title: "Concern-led discovery",
              copy: "Navigate acne, pigmentation, and dryness through targeted, internal-link-rich pages.",
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-glow"
            >
              <h3 className="text-2xl font-semibold text-ink">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-smoke">{card.copy}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <Reveal>
          <SectionIntro
            eyebrow="Testimonials"
            title="Quiet confidence from routines that feel easy to trust."
            description="The best skincare experiences don’t ask for more effort. They reduce friction and feel immediately at home in your shelf and your schedule."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal
              key={item.name}
              className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]"
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <p className="text-lg leading-8 text-ink">“{item.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="text-sm text-smoke">{item.title}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-16 md:px-8">
        <Reveal className="rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)] md:p-10">
          <SectionIntro
            eyebrow="Newsletter"
            title="Join the HelioLabs field notes."
            description="Routine breakdowns, sunscreen guidance, and ingredient explainers delivered with the same restraint as the products."
          />
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </div>
  );
}

