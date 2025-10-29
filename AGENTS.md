# Agent Guide for `razsbg.top`

## Overview
- Purpose: arm new agents with a fast orientation to the monorepo (currently only the Astro landing page) and keep delivery aligned with low-cognitive-load, KISS-first decisions.

## Project Snapshot
- Workspace: pnpm + Turbo monorepo (`pnpm-workspace.yaml`).
- Node.js: v18 or newer.
- Primary app: `apps/landing-page` (Astro 5 + Tailwind + strict TypeScript).
- Shared tooling: `packages/eslint-config`, `packages/typescript-config`.
- Formatting: Prettier (`.prettierrc.js`) → 2 spaces, `printWidth` 80, no semicolons, Astro parser.
- Linting: ESLint via `@repo/eslint-config` (extends `eslint:recommended`, `prettier`, `eslint-config-turbo`, `eslint-plugin-only-warn`).
- CSS: Tailwind (utility-first) with overrides in `tailwind.config.mjs` and scoped `<style>` blocks when necessary.

## Core Principles
- Default to the simplest viable solution; prefer small, composable Astro components over complex client-side bundles.
- Keep data-driven sections (e.g., playlists) in JSON or other declarative sources and render them through lightweight view components.
- Maintain single-responsibility modules and delete obsolete code promptly to reduce mental overhead.
- Avoid premature abstractions; only extract shared utilities when at least two consumers exist.

## Module & File Organization
- Pages (`src/pages`) map directly to routes; use subfolders for nested routes (`/playlists/lust.astro`).
- Components live in `src/components` using kebab-case filenames (`anchor-icon.astro`). Co-locate component-specific styles via scoped `<style>` tags when utility classes are insufficient.
- Shared styles belong in `src/styles` (e.g., `typography.ts`) and are imported where needed.
- Static data resides in `src/data`; prefer typed imports (e.g., `Astro.props` types) to ensure clarity.
- Global CSS entry point is `src/styles.css` (Tailwind directives only); extend Tailwind via config rather than ad-hoc global styles.

## Coding Conventions
- TypeScript: strict mode; favor explicit types for props and data models to keep contracts obvious.
- Imports: use relative paths; group external before internal modules.
- Styling: Tailwind utility classes first, supported by shared tokens like `typography` map. Keep inline styles minimal and scoped.
- Accessibility: supply `aria-label`, `role`, and `rel="noopener noreferrer"` on outbound links—follow existing patterns (`emoji-icon.astro`, playlist pages).
- Testing/validation: rely on Astro’s `astro check` (part of `pnpm build`).

## Workflow & Quality Checks
- Install deps: `pnpm install` (workspace root).
- Local dev: `pnpm --filter landing-page dev` or `pnpm dev` (Turbo orchestrated).
- Lint: `pnpm lint` (runs Turbo across packages).
- Format: `pnpm format` before committing significant changes.
- Build: `pnpm --filter landing-page build` (runs `astro check` + `astro build`). Ensure builds pass before PRs.

## Collaboration Tips
- Keep PRs narrowly scoped; when applicable, use stacking PRs (https://www.stacking.dev/) and surface design decisions in commit messages instead of expanding documentation.
- Review generated HTML/CSS in the browser for regressions—visual QA is critical for the design-heavy pages.
- Align new contributions with existing typography and icon patterns; reuse components like `TopTenList` where applicable.
- Reference this guide in PR descriptions when introducing structural changes or new shared modules.

## Quick Links
- `apps/landing-page/src/pages/index.astro`
- `apps/landing-page/src/pages/playlists/lust.astro`
- `apps/landing-page/src/components/top-ten-list.astro`
- `apps/landing-page/src/styles/typography.ts`
- `packages/eslint-config/library.js`
- `packages/typescript-config/base.json`