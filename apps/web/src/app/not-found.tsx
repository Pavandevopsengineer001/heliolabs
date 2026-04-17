import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center md:px-8">
      <p className="text-xs uppercase tracking-[0.35em] text-ember">404</p>
      <h1 className="mt-5 font-serif text-6xl leading-none text-ink">This page drifted out of the HelioLabs routine.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-smoke">
        The link may have changed, or the page may not exist yet. You can head back to the catalog and continue browsing.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-flex rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(255,106,0,0.22)] transition hover:bg-[#ff7f26]"
      >
        Browse Products
      </Link>
    </section>
  );
}

