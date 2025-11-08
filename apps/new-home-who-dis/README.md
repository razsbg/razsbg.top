# new-home-who-dis™️

A satirical gift registry web application for a housewarming party in Iași, Romania (November 8, 2025).

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

- **Framework**: Astro 5 with TypeScript
- **Styling**: Tailwind CSS with custom tier colors
- **Database**: Railway PostgreSQL with Drizzle ORM
- **Real-time**: Server-Sent Events (SSE)
- **Deployment**: Railway (razsbg.top subdomain)

## Payment Integration

- **Revolut**: `https://revolut.me/razsbg/{amount}`
- **Bandcamp**: Native "Buy as Gift" functionality

Ready to build something hilariously functional! 🚀
