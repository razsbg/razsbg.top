import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import solid from "@astrojs/solid-js"
import node from "@astrojs/node"

export default defineConfig({
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
