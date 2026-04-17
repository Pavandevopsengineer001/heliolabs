import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getBlogPosts } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Journal | HelioLabs",
  description: "SPF guides, acne education, ingredient explainers, and minimalist routine thinking from HelioLabs.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-ember">Journal</p>
      <h1 className="mt-5 max-w-4xl font-serif text-6xl leading-none text-ink">
        Skincare education built to support discovery, trust, and better daily behavior.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-smoke">
        Programmatic SEO pages do the heavy lifting, but editorial content deepens authority. Here are the HelioLabs cornerstone articles.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-glow"
          >
            <div className="relative h-72 overflow-hidden bg-sand">
              <Image
                src={post.hero_image}
                alt={post.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-smoke">{post.tags.join(" • ")}</p>
              <h2 className="mt-4 text-3xl font-semibold text-ink">{post.title}</h2>
              <p className="mt-4 text-sm leading-7 text-smoke">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

