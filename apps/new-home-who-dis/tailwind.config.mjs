/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Brand colors
        "brand-primary": "#FF6B6B", // Satirical red
        "brand-secondary": "#4ECDC4", // Playful teal
        "brand-accent": "#FFE66D", // Warning yellow

        // Tier colors
        "ultra-tier": "#9B59B6", // Purple
        "gold-tier": "#F1C40F", // Gold
        "silver-tier": "#95A5A6", // Silver
        "bronze-tier": "#E67E22", // Bronze

        // Dark pattern colors
        "annoying-popup": "#FF3838", // Bright red
        "fake-urgency": "#FF9500", // Orange
        "chatbot-bg": "#00D4AA", // Bright teal
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        satirical: ["Comic Sans MS", "cursive"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
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
