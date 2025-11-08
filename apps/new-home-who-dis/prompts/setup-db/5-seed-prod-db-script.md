Create a Node.js TypeScript script named scripts/seed-production.ts that:

1. Reads gift data from apps/new-home-who-dis/data/gift-data-structure.json
2. Seeds the Railway PostgreSQL production database with all wishlist items
3. Uses Drizzle ORM with the DATABASE_URL environment variable
4. Implements transaction safety and rollback on errors
5. Does NOT create test users (production should start clean)

The script should:

- Import the database connection using process.env.DATABASE_URL
- Import the schema from src/db/schema.ts
- Parse gift-data-structure.json and seed all three wishlists
- Use proper Drizzle transactions with rollback capability
- Validate that DATABASE_URL is set before running
- Include a confirmation prompt requiring PRODUCTION_SEED_CONFIRM="YES" environment variable
- Clear ONLY the gifts table before seeding (preserve any existing users)
- Do NOT delete from users or commitments tables
- Log detailed progress with timestamps
- Display summary: total gifts inserted per wishlist type
- Create a seed completion timestamp in the config table

Safety features:

- Require explicit confirmation via environment variable
- Show a warning about production data changes
- Use a transaction that can be fully rolled back
- Validate JSON structure before processing
- Exit gracefully with error messages if validation fails
- Make runnable via: PRODUCTION_SEED_CONFIRM=YES pnpm tsx scripts/seed-production.ts

Tier thresholds to use:

- Ultra: 30000 bani (300 Lei)
- Gold: 25000 bani (250 Lei)
- Silver: 20000 bani (200 Lei)
- Bronze: 15000 bani (150 Lei)
