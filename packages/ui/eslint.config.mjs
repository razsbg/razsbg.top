import library from "@repo/eslint-config/library.js"

export default [
  // .astro components need eslint-plugin-astro to parse; skip them here
  // (they are checked by the consuming apps' `astro check`).
  {
    ignores: ["**/*.astro"],
  },
  ...library,
]
