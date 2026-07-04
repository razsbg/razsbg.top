import library from "@repo/eslint-config/library.js"
import tseslint from "typescript-eslint"
import eslintPluginAstro from "eslint-plugin-astro"

export default [
  {
    ignores: ["dist/**", ".astro/**", ".vercel/**", "drizzle/**"],
  },
  ...library,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"],
  {
    rules: {
      "turbo/no-undeclared-env-vars": [
        "warn",
        {
          // DEV is a Vite built-in; the rest are only read by manual
          // scripts/ helpers, never by turbo tasks, so they don't belong
          // in turbo.json hash inputs
          allowList: [
            "DEV",
            "EXPORT_DATABASE_URL",
            "PRODUCTION_SEED_CONFIRM",
            "PRODUCTION_UPDATE_CONFIRM",
          ],
        },
      ],
    },
  },
]
