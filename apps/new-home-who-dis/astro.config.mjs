import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import solid from "@astrojs/solid-js"
import node from "@astrojs/node"

export default defineConfig({
  // Astro 7 strips whitespace between inline elements by JSX rules; these
  // text-heavy pages rely on HTML whitespace semantics, so keep the old mode
  compressHTML: true,
  integrations: [solid()],
  adapter: node({ mode: "standalone" }),
  site:
    process.env.NODE_ENV === "production"
      ? "https://party.razsbg.top"
      : "http://localhost:4000",
  output: "server", // SSR mode for Railway
  server: {
    port: parseInt(process.env.PORT || "4321"),
    host: "0.0.0.0",
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
