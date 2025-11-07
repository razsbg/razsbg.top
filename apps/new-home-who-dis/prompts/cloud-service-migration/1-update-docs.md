Update all documentation files to reflect Railway migration from Vercel. Current state: static build only, no database/API configured yet.

FILES TO UPDATE:

1. DEPLOYMENT_GUIDE.md: Complete overhaul - replace Vercel setup with Railway, simplify subdomain architecture (party.razsbg.top only, TV at /tv-display route), update all CLI commands, DNS config, environment variables, monitoring sections
2. TECHNICAL_SPEC.md: Replace "Vercel" with "Railway", update deployment config, emphasize persistent SSE benefits, update domain architecture
3. DEVELOPMENT_ROADMAP.md: Update Day 1 database setup (railway add), Day 3 deployment (railway up), environment variables (DATABASE_URL not POSTGRES_URL)
4. prd.md: Minimal hosting/infrastructure updates

CRITICAL SUBDOMAIN CHANGE:

- OLD: party.razsbg.top (main) + tv.razsbg.top (TV display)
- NEW: party.razsbg.top (main) + /tv-display route (TV display)
- Remove all tv.razsbg.top references, update Samsung TV instructions to use route instead

KEY REPLACEMENTS:

- "Vercel Postgres" → "Railway PostgreSQL"
- "vercel --prod" → "railway up"
- "POSTGRES_URL" → "DATABASE_URL"
- "vercel postgres create" → "railway add (PostgreSQL)"
- "Vercel Analytics" → "Railway dashboard metrics"
- Dual subdomains → Single subdomain with routes

PRESERVE: Satirical features, Astro 5 stack, party details (Nov 8), Samsung TV specs (UE50RU7102KXXH), Drizzle ORM, monorepo structure, all UX dark patterns.

TECHNICAL EMPHASIS: Railway's persistent connections for SSE, no cold starts, no function timeout limits, unified infrastructure.

Keep tone: technical, specific, party-focused. Maintain existing structure and formatting.
