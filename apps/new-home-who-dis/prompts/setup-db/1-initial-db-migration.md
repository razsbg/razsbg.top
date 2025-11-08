You are setting up a PostgreSQL database for a satirical gift registry app using Drizzle ORM. The existing Drizzle schema is defined in src/db/schema.ts with the following tables: users, gifts, commitments, smokingSessions, and config.

Generate a SQL migration file in the drizzle/ directory that:

1. Creates all tables defined in the schema with proper constraints
2. Adds CHECK constraints for the gifts.wishlist_type column to only allow: 'traditional', 'receipt', 'bandcamp'
3. Adds CHECK constraints for the gifts.priority column to only allow: 'essential', 'nice-to-have', 'luxury', 'digital'
4. Adds CHECK constraints for the commitments.status column to only allow: 'active', 'cancelled'
5. Creates all indexes as defined in the schema
6. Ensures proper foreign key relationships between tables

The migration should be idempotent (safe to run multiple times) and follow Drizzle's migration naming convention: YYYYMMDDHHMMSS_migration_name.sql

Output the complete SQL migration file.
