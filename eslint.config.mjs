// This configuration only applies to the package manager root.
import library from "@repo/eslint-config/library.js"

export default [
  {
    ignores: ["apps/**", "packages/**"],
  },
  ...library,
]
