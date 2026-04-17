import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#F7F7F7",
        ink: "#1A1A1A",
        smoke: "#666666",
        ember: "#FF6A00",
      },
      boxShadow: {
        glow: "0 24px 60px rgba(26, 26, 26, 0.12)",
      },
      backgroundImage: {
        halo:
          "radial-gradient(circle at top, rgba(255,106,0,0.18), transparent 38%), radial-gradient(circle at bottom right, rgba(255,106,0,0.08), transparent 24%)",
      },
    },
  },
  plugins: [],
};

export default config;

