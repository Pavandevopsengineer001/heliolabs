import type { BlogPost, Product } from "@/types/api";

export const fallbackProducts: Product[] = [
  {
    id: "solar-reset-spf-50-fluid",
    name: "Solar Reset SPF 50 Fluid",
    slug: "solar-reset-spf-50-fluid",
    short_description: "Weightless broad-spectrum protection with niacinamide and ectoin.",
    description:
      "A featherlight daily sunscreen built for humid routines, indoor workdays, and post-procedure comfort. The formula shields, calms, and leaves a satin finish.",
    price_cents: 189900,
    image_url:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=1200&q=80",
    ],
    ingredients: [
      { name: "Niacinamide", benefit: "Reinforces barrier support and visibly evens tone." },
      { name: "Ectoin", benefit: "Helps defend skin against urban and UV stress." },
      { name: "Zinc Oxide", benefit: "Mineral UV protection with sensitive-skin comfort." },
    ],
    benefits: [
      "No white cast on deep skin tones",
      "Satin-matte finish under makeup",
      "Barrier-friendly daily wear",
    ],
    how_to_use: [
      "Apply generously as the final step in your morning routine.",
      "Use two finger lengths for face and neck.",
      "Reapply every two hours when outdoors.",
    ],
    skin_types: ["oily", "combination", "sensitive"],
    concerns: ["sun protection", "post-acne marks", "sensitivity"],
    reviews: [
      { name: "Aarav", title: "The finish feels invisible.", rating: 5 },
      { name: "Maya", title: "My daily office SPF.", rating: 5 },
    ],
    featured: true,
    rating: 4.9,
    review_count: 184,
    stock_available: 120,
  },
  {
    id: "niacinamide-clarity-serum",
    name: "Niacinamide Clarity Serum",
    slug: "niacinamide-clarity-serum",
    short_description: "Oil-balancing serum for texture, pores, and post-acne marks.",
    description:
      "A fast-absorbing serum with niacinamide, N-acetyl glucosamine, and panthenol that helps refine texture while keeping the barrier calm.",
    price_cents: 149900,
    image_url:
      "https://images.unsplash.com/photo-1601612628452-9e99ced43524?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1601612628452-9e99ced43524?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556228578-dd6ae3942e3d?auto=format&fit=crop&w=1200&q=80",
    ],
    ingredients: [
      { name: "Niacinamide", benefit: "Helps regulate visible oiliness and uneven tone." },
      { name: "N-Acetyl Glucosamine", benefit: "Supports a smoother, clearer complexion." },
      { name: "Panthenol", benefit: "Maintains hydration and soothing comfort." },
    ],
    benefits: [
      "Targets congestion without sting",
      "Layers well with actives and sunscreen",
      "Supports brighter-looking skin",
    ],
    how_to_use: [
      "Use one to two pumps after cleansing.",
      "Follow with moisturizer and SPF in the morning.",
      "Start once daily, then increase if well tolerated.",
    ],
    skin_types: ["oily", "combination", "normal"],
    concerns: ["acne", "pores", "hyperpigmentation"],
    reviews: [
      { name: "Ria", title: "Keeps my midday shine under control.", rating: 5 },
      { name: "Dev", title: "Texture improved in two weeks.", rating: 4 },
    ],
    featured: true,
    rating: 4.8,
    review_count: 128,
    stock_available: 150,
  },
  {
    id: "barrier-restore-cream",
    name: "Barrier Restore Cream",
    slug: "barrier-restore-cream",
    short_description: "Ceramide-rich moisturizer that seals in hydration without heaviness.",
    description:
      "A restorative cream with ceramides, cholesterol, and peptides designed for dry, reactive, and over-exfoliated skin.",
    price_cents: 169900,
    image_url:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=1200&q=80",
    ],
    ingredients: [
      { name: "Ceramides", benefit: "Support the skin barrier and reduce moisture loss." },
      { name: "Cholesterol", benefit: "Works with ceramides for barrier replenishment." },
      { name: "Peptides", benefit: "Helps skin feel firmer and more resilient." },
    ],
    benefits: [
      "Comforts sensitized skin overnight",
      "Non-greasy sealed hydration",
      "Excellent after actives or retinoids",
    ],
    how_to_use: [
      "Massage onto damp skin after serum.",
      "Use morning and evening.",
      "Pair with SPF during the day.",
    ],
    skin_types: ["dry", "sensitive", "normal"],
    concerns: ["dryness", "redness", "barrier repair"],
    reviews: [
      { name: "Sara", title: "Saved my skin after over-exfoliating.", rating: 5 },
      { name: "Nikhil", title: "Rich but surprisingly breathable.", rating: 5 },
    ],
    featured: true,
    rating: 4.9,
    review_count: 94,
    stock_available: 95,
  },
  {
    id: "night-repair-retinal-emulsion",
    name: "Night Repair Retinal Emulsion",
    slug: "night-repair-retinal-emulsion",
    short_description: "Encapsulated retinal serum for renewal, clarity, and smoother texture.",
    description:
      "A beginner-friendly overnight emulsion with retinaldehyde, bisabolol, and squalane for visible renewal with minimized irritation.",
    price_cents: 219900,
    image_url:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
    ],
    ingredients: [
      { name: "Retinaldehyde", benefit: "Promotes clearer-looking, refined skin." },
      { name: "Bisabolol", benefit: "Helps calm the look of redness." },
      { name: "Squalane", benefit: "Offsets dryness for a soft, cushioned feel." },
    ],
    benefits: [
      "Gentle step-up from retinol",
      "Smooths texture and softens fine lines",
      "Balanced with soothing support",
    ],
    how_to_use: [
      "Apply a pea-sized amount at night after cleansing.",
      "Use two to three nights per week initially.",
      "Avoid combining with strong acids on the same evening.",
    ],
    skin_types: ["normal", "combination", "oily"],
    concerns: ["texture", "fine lines", "acne"],
    reviews: [
      { name: "Anika", title: "Visible glow without the usual peeling.", rating: 5 },
      { name: "Ishaan", title: "A thoughtful first retinal.", rating: 4 },
    ],
    featured: false,
    rating: 4.7,
    review_count: 72,
    stock_available: 80,
  },
];

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "spf-guide-for-indian-summers",
    slug: "spf-guide-for-indian-summers",
    title: "The HelioLabs SPF Guide for Indian Summers",
    excerpt:
      "How much sunscreen you actually need, how often to reapply, and which textures work best in humidity.",
    seo_description:
      "A dermatologist-informed sunscreen guide covering amount, reapplication, and formulas for hot, humid climates.",
    hero_image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80",
    tags: ["SPF", "Sun Care", "Education"],
    published_at: "2026-01-08T00:00:00Z",
    content_markdown: `# The daily sunscreen reset

Daily protection works best when it fits your real routine. Look for a formula you will wear generously, every day.

## How much is enough?

Use two finger lengths for face and neck. If you are outdoors, reapply every two hours.

## Texture matters

In humid climates, elegant fluids and satin gels tend to be easier to wear consistently.`,
  },
  {
    id: "acne-solutions-that-respect-the-barrier",
    slug: "acne-solutions-that-respect-the-barrier",
    title: "Acne Solutions That Respect the Barrier",
    excerpt:
      "A calmer route to clearer skin, built around inflammation control, oil balance, and barrier repair.",
    seo_description:
      "Learn how to build an acne routine that supports the skin barrier while targeting congestion, marks, and oiliness.",
    hero_image:
      "https://images.unsplash.com/photo-1556228578-dd6ae3942e3d?auto=format&fit=crop&w=1400&q=80",
    tags: ["Acne", "Routine", "Barrier"],
    published_at: "2026-02-14T00:00:00Z",
    content_markdown: `# Clear skin without over-stripping

Breakouts respond best to routines that stay consistent for months, not days.

## Focus on three levers

- Gentle cleansing
- Targeted actives
- Barrier-first hydration

Pair oil-balancing ingredients like niacinamide with sunscreen so post-acne marks fade more effectively.`,
  },
  {
    id: "a-minimal-skincare-routine-that-still-works",
    slug: "a-minimal-skincare-routine-that-still-works",
    title: "A Minimal Skincare Routine That Still Works",
    excerpt:
      "A premium routine does not need twelve steps. It needs clear roles, strong textures, and smart consistency.",
    seo_description:
      "Build a high-performing minimalist skincare routine with just cleanser, treatment, moisturizer, and sunscreen.",
    hero_image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80",
    tags: ["Routine", "Minimal", "Skin Health"],
    published_at: "2026-03-04T00:00:00Z",
    content_markdown: `# Less, but better

Most skin routines improve when each product has a clear job.

## The essential structure

- Cleanse
- Treat
- Moisturize
- Protect

This foundation creates space for better adherence and better outcomes.`,
  },
];

