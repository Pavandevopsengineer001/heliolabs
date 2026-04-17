import { cn } from "@/lib/utils";

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ember">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-4xl tracking-tight text-ink md:text-5xl">{title}</h2>
      <p className="mt-5 text-base leading-7 text-smoke">{description}</p>
    </div>
  );
}

