import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr] md:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember">HelioLabs</p>
          <h3 className="mt-4 max-w-md font-serif text-3xl text-ink">
            Clinical skincare designed for everyday trust and elegant daily wear.
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-smoke">
            Minimal formulas, clear routines, and premium textures built for modern skin in bright climates.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink">Shop</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-smoke">
            <Link href="/products">All Products</Link>
            <Link href="/science">Ingredient Science</Link>
            <Link href="/skin-type/oily">Oily Skin</Link>
            <Link href="/concern/acne">Acne Care</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink">Company</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-smoke">
            <Link href="/blog">Journal</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/account">Account</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

