/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Core duotone
        "bg-dark": "#1A1A1A", // Base background
        "bg-card": "#232323", // Card/elevated surfaces
        "text-primary": "#F5F5F0", // Main text (Option A white)
        "text-secondary": "#9CA3AF", // Muted text

        // Accent (keep existing)
        "brand-primary": "#FF3D71", // Hot pink chaos
        "brand-accent": "#FFE66D", // Warning yellow
        "brand-secondary": "#4ECDC4", // Teal highlight

        // Tier colors (existing are perfect)
        "ultra-tier": "#9B59B6",
        "gold-tier": "#F1C40F",
        "silver-tier": "#95A5A6",
        "bronze-tier": "#E67E22",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"], // Body/UI
        display: ["Space Grotesk", "Inter", "sans-serif"], // Headers/brand
        mono: ["JetBrains Mono", "Consolas", "monospace"], // Countdown digits
        satirical: ["Comic Sans MS", "cursive"], // Keep for jokes
      },
      fontSize: {
        countdown: ["6rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        hero: ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-fast": "pulse 1s infinite",
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      screens: {
        tv: "1440px",
      },
    },
  },
  plugins: [],
}
