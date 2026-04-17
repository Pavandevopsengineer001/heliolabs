import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact | HelioLabs",
  description: "Reach the HelioLabs team for product guidance, press, wholesale, or customer support.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-ember">Contact</p>
          <h1 className="mt-5 font-serif text-6xl leading-none text-ink">Talk to the team behind the formulas.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-smoke">
            Product questions, routine guidance, partnerships, press, and customer support all start here. The form is wired directly to the backend contact API.
          </p>
          <div className="mt-10 space-y-4 rounded-[2rem] border border-black/5 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            <div>
              <p className="text-sm font-semibold text-ink">General support</p>
              <p className="text-sm text-smoke">care@heliolabs.skin</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Press & collaborations</p>
              <p className="text-sm text-smoke">partners@heliolabs.skin</p>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

