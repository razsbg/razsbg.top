import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { gifts, config } from "../src/db/schema.js"
import { sql } from "drizzle-orm"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Types for the JSON structure
interface GiftData {
  id: string
  name: string
  description?: string
  estimatedPrice: number
  category: string
  priority: string
  wishlistType: string
  isCommitted: boolean
  imageUrl?: string | null
  notes?: string
  // Receipt-specific
  receiptId?: string
  alreadyPurchased?: boolean
  reimbursementMethod?: string
  // Bandcamp-specific
  bandcampUrl?: string
  artist?: string
  albumTitle?: string
  releaseType?: string
  digitalDelivery?: boolean
}

interface GiftDataStructure {
  traditionalWishlist: GiftData[]
  receiptWishlist: GiftData[]
  bandcampWishlist: GiftData[]
  tierThresholds?: {
    Ultra: number
    Gold: number
    Silver: number
    Bronze: number
  }
}

function log(message: string) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${message}`)
}

async function seedProductionDatabase() {
  console.log("")
  console.log("🚀 PRODUCTION DATABASE SEEDING")
  console.log("================================")
  console.log("")

  // Check for confirmation environment variable
  log("Checking PRODUCTION_SEED_CONFIRM...")
  if (process.env.PRODUCTION_SEED_CONFIRM !== "YES") {
    console.error("❌ ERROR: PRODUCTION_SEED_CONFIRM is not set to 'YES'")
    console.error("")
    console.error("To run this script, you must set:")
    console.error("  export PRODUCTION_SEED_CONFIRM=YES")
    console.error("")
    console.error("This is a safety measure to prevent accidental production seeding.")
    process.exit(1)
  }
  log("✓ PRODUCTION_SEED_CONFIRM verified")
  console.log("")

  // Check for DATABASE_URL
  log("Checking DATABASE_URL...")
  if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL environment variable is not set")
    console.error("")
    console.error("Set it using:")
    console.error("  export DATABASE_URL=<your-railway-postgres-url>")
    process.exit(1)
  }
  log("✓ DATABASE_URL is set")
  
  // Extract and mask host for verification
  const dbHost = process.env.DATABASE_URL.match(/@([^:/]+)/)?.[1] || "unknown"
  const maskedHost = dbHost.length > 8 
    ? `${dbHost.slice(0, 4)}****${dbHost.slice(-4)}`
    : "****"
  log(`Database host: ${maskedHost}`)
  console.log("")

  // Display warning
  console.log("⚠️  WARNING: Production Database Seeding")
  console.log("=========================================")
  console.log("This script will:")
  console.log("  • DELETE all existing gifts")
  console.log("  • INSERT new gifts from gift-data-structure.json")
  console.log("  • PRESERVE existing users and commitments")
  console.log("")
  log("Starting seeding process...")
  console.log("")

  let client: ReturnType<typeof postgres> | null = null
  
  try {
    // Connect to database
    log("Connecting to production database...")
    client = postgres(process.env.DATABASE_URL)
    const db = drizzle(client, { schema: { gifts, config } })
    log("✓ Connected to database")
    console.log("")

    // Read gift data
    log("Reading gift data from JSON file...")
    const giftDataPath = join(__dirname, "../data/gift-data-structure.json")
    let giftDataRaw: string
    
    try {
      giftDataRaw = readFileSync(giftDataPath, "utf-8")
    } catch (error) {
      throw new Error(`Failed to read gift data file: ${error}`)
    }

    let giftData: GiftDataStructure
    try {
      giftData = JSON.parse(giftDataRaw)
    } catch (error) {
      throw new Error(`Failed to parse gift data JSON: ${error}`)
    }

    // Validate JSON structure
    if (!giftData.traditionalWishlist || !giftData.receiptWishlist || !giftData.bandcampWishlist) {
      throw new Error("Invalid JSON structure: missing required wishlist arrays")
    }

    log(`Found ${giftData.traditionalWishlist.length} traditional gifts`)
    log(`Found ${giftData.receiptWishlist.length} receipt gifts`)
    log(`Found ${giftData.bandcampWishlist.length} bandcamp gifts`)
    console.log("")

    // Start transaction
    log("Starting transaction...")
    await db.transaction(async (tx) => {
      // Clear existing gifts
      log("Clearing existing gifts...")
      await tx.delete(gifts)
      log("✓ Gifts table cleared")

      // Prepare all gifts
      log("Preparing gifts for insertion...")
      const allGifts = [
        ...giftData.traditionalWishlist.map(gift => ({
          id: gift.id,
          name: gift.name,
          description: gift.description || null,
          estimatedPrice: gift.estimatedPrice,
          category: gift.category,
          priority: gift.priority,
          wishlistType: "traditional" as const,
          isCommitted: gift.isCommitted,
          committedBy: null,
          committedAt: null,
          imageUrl: gift.imageUrl || null,
          notes: gift.notes || null,
          receiptId: null,
          alreadyPurchased: null,
          reimbursementMethod: null,
          bandcampUrl: null,
          artist: null,
          albumTitle: null,
          releaseType: null,
          digitalDelivery: null,
        })),
        ...giftData.receiptWishlist.map(gift => ({
          id: gift.id,
          name: gift.name,
          description: gift.description || null,
          estimatedPrice: gift.estimatedPrice,
          category: gift.category,
          priority: gift.priority,
          wishlistType: "receipt" as const,
          isCommitted: gift.isCommitted,
          committedBy: null,
          committedAt: null,
          imageUrl: gift.imageUrl || null,
          notes: gift.notes || null,
          receiptId: gift.receiptId || null,
          alreadyPurchased: gift.alreadyPurchased || false,
          reimbursementMethod: gift.reimbursementMethod || null,
          bandcampUrl: null,
          artist: null,
          albumTitle: null,
          releaseType: null,
          digitalDelivery: null,
        })),
        ...giftData.bandcampWishlist.map(gift => ({
          id: gift.id,
          name: gift.name,
          description: gift.description || null,
          estimatedPrice: gift.estimatedPrice,
          category: gift.category,
          priority: gift.priority,
          wishlistType: "bandcamp" as const,
          isCommitted: gift.isCommitted,
          committedBy: null,
          committedAt: null,
          imageUrl: gift.imageUrl || null,
          notes: gift.notes || null,
          receiptId: null,
          alreadyPurchased: null,
          reimbursementMethod: null,
          bandcampUrl: gift.bandcampUrl || null,
          artist: gift.artist || null,
          albumTitle: gift.albumTitle || null,
          releaseType: gift.releaseType || null,
          digitalDelivery: gift.digitalDelivery || false,
        })),
      ]

      // Insert gifts
      log("Inserting gifts into database...")
      await tx.insert(gifts).values(allGifts)
      log(`✓ Inserted ${giftData.traditionalWishlist.length} traditional gifts`)
      log(`✓ Inserted ${giftData.receiptWishlist.length} receipt gifts`)
      log(`✓ Inserted ${giftData.bandcampWishlist.length} bandcamp gifts`)

      // Store tier thresholds in config if present
      if (giftData.tierThresholds) {
        log("Storing tier thresholds in config...")
        await tx.insert(config)
          .values({
            key: "tier_thresholds",
            value: JSON.stringify(giftData.tierThresholds),
          })
          .onConflictDoUpdate({
            target: config.key,
            set: {
              value: JSON.stringify(giftData.tierThresholds),
              updatedAt: sql`now()`,
            },
          })
        log("✓ Tier thresholds stored")
      }

      // Record seed completion
      log("Recording seed completion timestamp...")
      await tx.insert(config)
        .values({
          key: "last_seed_timestamp",
          value: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: config.key,
          set: {
            value: new Date().toISOString(),
            updatedAt: sql`now()`,
          },
        })
      log("✓ Seed timestamp recorded")

      log("Transaction complete")
    })

    console.log("")
    console.log("📊 Seeding Summary")
    console.log("==================")
    console.log(`Total Gifts:  ${giftData.traditionalWishlist.length + giftData.receiptWishlist.length + giftData.bandcampWishlist.length}`)
    console.log(`  • Traditional: ${giftData.traditionalWishlist.length}`)
    console.log(`  • Receipt:     ${giftData.receiptWishlist.length}`)
    console.log(`  • Bandcamp:    ${giftData.bandcampWishlist.length}`)
    console.log("")
    console.log("✅ Production database seeded successfully!")
    console.log("")

    // Close connection
    await client.end()
    process.exit(0)
  } catch (error) {
    console.error("")
    console.error("❌ Error seeding production database:")
    console.error(error)
    console.error("")
    log("Transaction rolled back - no changes were made")
    
    if (client) {
      await client.end()
    }
    process.exit(1)
  }
}

// Run the seeding script
seedProductionDatabase()
