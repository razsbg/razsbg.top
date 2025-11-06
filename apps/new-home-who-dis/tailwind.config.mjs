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
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "digit-flip": "digit-flip 0.4s ease-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { borderColor: "rgba(255, 61, 113, 0.2)" },
          "50%": { borderColor: "rgba(255, 61, 113, 0.6)" },
        },
        "pulse-slow": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "digit-flip": {
          "0%": { transform: "rotateX(0deg)", opacity: "1" },
          "50%": { transform: "rotateX(90deg)", opacity: "0" },
          "100%": { transform: "rotateX(0deg)", opacity: "1" },
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
