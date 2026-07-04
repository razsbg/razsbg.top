import library from "@repo/eslint-config/library.js"
import tseslint from "typescript-eslint"
import eslintPluginAstro from "eslint-plugin-astro"

export default [
  {
    ignores: ["dist/**", ".astro/**"],
  },
  ...library,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"],
]
