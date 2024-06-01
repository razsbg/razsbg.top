/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'rz-2xl': ['var(--rz-2xl)', 1.5],
        'rz-xl': ['var(--rz-xl)', 1.5],
        'rz-lg': ['var(--rz-lg)', 1.5],
        'rz-md': ['var(--rz-md)', 1.5],
      }
    },
  },
  plugins: [],
}
