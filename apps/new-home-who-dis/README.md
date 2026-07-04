# new-home-who-dis™️

A satirical gift registry web application for a housewarming party in Iași, Romania (November 8, 2025).

> **Status**: the party happened, the Railway deployment is gone (July 2026).
> This app is kept runnable locally for posterity — see below to relive it.

## Running the Party Archive Locally

The final production database was exported to `data/production-export.json`
before the Railway project was destroyed (60 guests, 119 gifts,
23 commitments — sanitized for the public repo). To run the app exactly as
the party ended:

```bash
pnpm start-db:local          # start the docker postgres
pnpm db:migrate              # apply schema migrations
pnpm db:seed:from-export     # restore the production export
pnpm build && pnpm start     # serve on http://localhost:4321
```

Requires Docker and a `.env` with the local database URL (see
`.env.example`). Stop the database with `pnpm stop-db:local` when done —
the data persists in the docker volume.

## Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

3. **Set up database:**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

4. **Start development:**
   ```bash
   pnpm dev
   ```

## Project Structure

- `new-home-who-dis-PRD.md` - Complete product requirements document
- `TECHNICAL_SPEC.md` - Technical implementation specification
- `DEVELOPMENT_ROADMAP.md` - 3-day development plan with factory.ai CLI integration
- `gift-data-structure.json` - All gift data (traditional, receipt, bandcamp wishlists)
- `src/types/index.ts` - TypeScript interfaces
- `src/db/schema.ts` - Database schema with Drizzle ORM

## Key Features

- **Three Wishlists**: Traditional gifts, receipt reimbursement, Bandcamp music
- **Anonymous Identity**: Auto-generated pseudonyms (Adjective + Animal)
- **Tier System**: Bronze → Silver → Gold → Ultra with real party perks
- **Satirical UX**: Aggressive dark patterns that are actually funny
- **Real-time Updates**: Live leaderboard via Server-Sent Events
- **Multi-device**: Mobile-first with Samsung TV display mode

## Factory.ai CLI Integration

This project is designed for hands-on development with factory.ai CLI + Zed editor. See `DEVELOPMENT_ROADMAP.md` for specific CLI prompts and integration strategies.

## Tech Stack

- **Framework**: Astro 7 with TypeScript
- **Styling**: Tailwind CSS with custom tier colors
- **Database**: PostgreSQL (local docker) with Drizzle ORM
- **Real-time**: Server-Sent Events (SSE)
- **Deployment**: retired — formerly Railway at party.razsbg.top

## Payment Integration

- **Revolut**: `https://revolut.me/razsbg/{amount}`
- **Bandcamp**: Native "Buy as Gift" functionality

Ready to build something hilariously functional! 🚀
