import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import solid from "@astrojs/solid-js"
import vercel from "@astrojs/vercel/serverless"
import node from "@astrojs/node"

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), solid()],
  output: "server",
  adapter:
    process.env.NODE_ENV === "production"
      ? vercel()
      : node({
          mode: "standalone",
        }),
  server: {
    port: 4000, // Different port from main website
    host: true,
  },
  vite: {
    define: {
      __REVOLUT_USERNAME__: JSON.stringify("razsbg"),
    },
  },
  // For monorepo setup - this will be deployed as separate Vercel project
  // Main app: party.razsbg.top
  // TV display: tv.razsbg.top
  site:
    process.env.NODE_ENV === "production"
      ? "https://party.razsbg.top"
      : "http://localhost:4000",
})
