const js = require("@eslint/js")
const globals = require("globals")
// The CJS build wraps the config array in a `default` property
const turboConfig = require("eslint-config-turbo/flat").default
const prettierConfig = require("eslint-config-prettier")
const onlyWarn = require("eslint-plugin-only-warn")

/**
 * Shared flat config: eslint recommended + turbo env-var checks, with
 * prettier-conflicting rules off and everything demoted to warnings.
 *
 * @type {import("eslint").Linter.Config[]}
 */
module.exports = [
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
