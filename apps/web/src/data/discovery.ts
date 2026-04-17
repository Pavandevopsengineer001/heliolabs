export const skinTypeContent = {
  oily: {
    title: "Oily Skin",
    description:
      "Balance shine, maintain barrier health, and choose textures that feel light enough for humid climates.",
    routine: [
      "Use a non-stripping cleanser morning and night.",
      "Pair niacinamide with broad-spectrum sunscreen daily.",
      "Reach for satin or gel-cream textures that dry down quickly.",
    ],
  },
  dry: {
    title: "Dry Skin",
    description:
      "Support lipid replenishment and keep hydration sealed in with high-comfort, low-irritation formulas.",
    routine: [
      "Cleanse gently and avoid hot water.",
      "Layer humectants under a ceramide-rich moisturizer.",
      "Protect every morning with a sunscreen that feels nourishing, not tight.",
    ],
  },
  sensitive: {
    title: "Sensitive Skin",
    description:
      "Choose low-friction routines centered around repair, soothing support, and clinically elegant textures.",
    routine: [
      "Introduce one active at a time.",
      "Keep fragrance-free and barrier-focused formulas at the center.",
      "Use sunscreen daily to reduce inflammation triggers.",
    ],
  },
} as const;

export const concernContent = {
  acne: {
    title: "Acne",
    description:
      "Target congestion while protecting the moisture barrier, so breakouts improve without rebound irritation.",
    strategy: [
      "Oil-balancing ingredients such as niacinamide work well alongside sunscreen.",
      "Keep treatment frequency consistent before increasing potency.",
      "Choose moisturizers that cushion the skin without clogging.",
    ],
  },
  hyperpigmentation: {
    title: "Hyperpigmentation",
    description:
      "Fading marks depends on both targeted ingredients and relentless sun protection.",
    strategy: [
      "Use brightening support such as niacinamide consistently.",
      "Never skip sunscreen, especially with corrective routines.",
      "Avoid over-exfoliating, which can prolong inflammation.",
    ],
  },
  dryness: {
    title: "Dryness",
    description:
      "The best dry-skin routines are less about layering endlessly and more about sealing in recovery.",
    strategy: [
      "Prioritize ceramides, cholesterol, and soothing lipids.",
      "Apply moisturizer onto slightly damp skin.",
      "Reduce overly frequent acid or retinoid nights while restoring comfort.",
    ],
  },
} as const;

export const ingredientContent = {
  niacinamide: {
    title: "Niacinamide",
    summary:
      "A multitasking vitamin B3 derivative that supports tone balance, oil control, and barrier resilience.",
    facts: [
      "Works well in both acne and pigmentation routines.",
      "Pairs comfortably with sunscreen, humectants, and moisturizers.",
      "Often chosen for routines that need visible results without a harsh feel.",
    ],
  },
  ceramides: {
    title: "Ceramides",
    summary:
      "Skin-identical lipids that help maintain structure, reduce transepidermal water loss, and improve comfort.",
    facts: [
      "Best supported by cholesterol and fatty acids.",
      "Useful after exfoliation, retinoids, or environmental stress.",
      "A core ingredient family for dry and sensitive skin routines.",
    ],
  },
  retinaldehyde: {
    title: "Retinaldehyde",
    summary:
      "A potent vitamin A derivative that sits between retinol and prescription retinoic acid in conversion pathway.",
    facts: [
      "Supports smoother texture, clarity, and signs of aging.",
      "Start slowly and pair with nourishing skincare.",
      "Always use sunscreen consistently while using retinal products.",
    ],
  },
} as const;

