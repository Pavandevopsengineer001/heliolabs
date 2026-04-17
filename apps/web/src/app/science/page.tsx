import type { Metadata } from "next";
import Link from "next/link";

import { ingredientContent } from "@/data/discovery";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Science | HelioLabs",
  description: "Ingredient philosophy, formulation principles, and the skincare logic behind HelioLabs.",
  path: "/science",
});

export default function SciencePage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-ember">Science</p>
          <h1 className="mt-5 font-serif text-6xl leading-none text-ink">The ingredient story behind calm, elegant performance.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-smoke">
            HelioLabs is built around formulas that deliver visible utility without making everyday adherence harder. We optimize for barrier support, comfortable textures, and products that fit real routines.
          </p>
        </div>
        <div className="grid gap-4">
          {[
            "Protect first: sunscreen is the most important anti-pigmentation and anti-aging step.",
            "Treat intelligently: actives should help, not force you into recovery mode every week.",
            "Repair continuously: barrier support is not a rescue step, it is the base layer.",
          ].map((item) => (
            <div key={item} className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
              <p className="text-base leading-7 text-smoke">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {Object.entries(ingredientContent).map(([slug, ingredient]) => (
          <Link
            key={slug}
            href={`/ingredient/${slug}`}
            className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-glow"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-ember">Ingredient</p>
            <h2 className="mt-4 text-3xl font-semibold text-ink">{ingredient.title}</h2>
            <p className="mt-4 text-sm leading-7 text-smoke">{ingredient.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

