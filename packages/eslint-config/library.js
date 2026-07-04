import js from "@eslint/js"
import globals from "globals"
import turboConfig from "eslint-config-turbo/flat"
import prettierConfig from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"

/**
 * Shared flat config: eslint recommended + turbo env-var checks, with
 * prettier-conflicting rules off and everything demoted to warnings.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    ignores: ["**/dist/**", "**/.astro/**", "**/node_modules/**"],
  },
  js.configs.recommended,
  ...turboConfig,
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "only-warn": onlyWarn,
    },
  },
]
