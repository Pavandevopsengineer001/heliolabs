import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getBlogPost } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    return buildMetadata({
      title: "Article Not Found | HelioLabs",
      description: "The requested article could not be found.",
    });
  }
  return buildMetadata({
    title: `${post.title} | HelioLabs`,
    description: post.seo_description,
    path: `/blog/${post.slug}`,
    image: post.hero_image,
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-5xl px-5 py-16 md:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-ember">{post.tags.join(" • ")}</p>
      <h1 className="mt-5 font-serif text-6xl leading-none text-ink">{post.title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-smoke">{post.excerpt}</p>
      <div className="relative mt-10 h-[420px] overflow-hidden rounded-[2.5rem] border border-black/5">
        <Image src={post.hero_image} alt={post.title} fill className="object-cover" />
      </div>
      <div className="mt-10 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
        <MarkdownContent markdown={post.content_markdown} />
      </div>
    </article>
  );
}

function MarkdownContent({ markdown }: { markdown: string }) {
  const blocks = markdown.split("\n\n");
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.startsWith("# ")) {
          return (
            <h2 key={index} className="font-serif text-4xl text-ink">
              {block.replace("# ", "")}
            </h2>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h3 key={index} className="text-2xl font-semibold text-ink">
              {block.replace("## ", "")}
            </h3>
          );
        }
        if (block.split("\n").every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="space-y-3">
              {block.split("\n").map((line) => (
                <li key={line} className="rounded-[1.25rem] bg-sand px-5 py-4 text-sm leading-7 text-smoke">
                  {line.replace("- ", "")}
                </li>
              ))}
            </ul>
          );
        }
        if (block.split("\n").every((line) => /^\d+\.\s/.test(line))) {
          return (
            <ol key={index} className="space-y-3">
              {block.split("\n").map((line) => (
                <li key={line} className="rounded-[1.25rem] bg-sand px-5 py-4 text-sm leading-7 text-smoke">
                  {line.replace(/^\d+\.\s/, "")}
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={index} className="text-base leading-8 text-smoke">
            {block}
          </p>
        );
      })}
    </div>
  );
}

