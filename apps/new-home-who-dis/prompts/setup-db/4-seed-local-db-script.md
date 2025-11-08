Create a Node.js TypeScript script named scripts/seed-local.ts that:

1. Reads the gift data from apps/new-home-who-dis/data/gift-data-structure.json
2. Seeds the local PostgreSQL database with all items from traditionalWishlist, receiptWishlist, and bandcampWishlist
3. Uses Drizzle ORM to insert data
4. Implements proper error handling and transaction management
5. Optionally creates test users with pseudonyms for development

The script should:

- Import the database connection from src/db/index.ts
- Import the schema from src/db/schema.ts
- Parse gift-data-structure.json and map each gift object to the gifts table schema
- Handle all three wishlist types properly (traditional, receipt, bandcamp)
- Set appropriate values for optional fields based on wishlistType
- Create 5 test users with generated pseudonyms (format: "Adjective-Animal-XXX")
- Insert all gifts in a single transaction
- Clear existing data before seeding (DELETE FROM gifts, commitments, users)
- Log progress for each section (users, traditional gifts, receipt gifts, bandcamp gifts)
- Display summary statistics when complete (total gifts, total users)

Additional requirements:

- Use the tier thresholds: Ultra=30000 bani, Gold=25000, Silver=20000, Bronze=15000
- Preserve all fields from the JSON including notes, imageUrl, receiptId, bandcampUrl, etc.
- Handle null values appropriately
- Make the script runnable via: pnpm tsx scripts/seed-local.ts
