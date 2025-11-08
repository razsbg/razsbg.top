import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { gifts, commitments } from "../src/db/schema.js"
import { sql, eq } from "drizzle-orm"

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
  receiptId?: string
  alreadyPurchased?: boolean
  reimbursementMethod?: string
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
}

function log(message: string) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${message}`)
}

async function updateProductionGifts() {
  console.log("")
  console.log("🔄 PRODUCTION GIFTS UPDATE")
  console.log("==========================")
  console.log("")

  // Check for confirmation
  log("Checking PRODUCTION_UPDATE_CONFIRM...")
  if (process.env.PRODUCTION_UPDATE_CONFIRM !== "YES") {
    console.error("❌ ERROR: PRODUCTION_UPDATE_CONFIRM is not set to 'YES'")
    console.error("")
    console.error("To run this script, you must set:")
    console.error("  export PRODUCTION_UPDATE_CONFIRM=YES")
    console.error("")
    process.exit(1)
  }
  log("✓ PRODUCTION_UPDATE_CONFIRM verified")
  console.log("")

  // Check for DATABASE_URL
  log("Checking DATABASE_URL...")
  if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL environment variable is not set")
    process.exit(1)
  }
  log("✓ DATABASE_URL is set")
  
  const dbHost = process.env.DATABASE_URL.match(/@([^:/]+)/)?.[1] || "unknown"
  const maskedHost = dbHost.length > 8 
    ? `${dbHost.slice(0, 4)}****${dbHost.slice(-4)}`
    : "****"
  log(`Database host: ${maskedHost}`)
  console.log("")

  console.log("⚠️  Production Gifts Update Strategy")
  console.log("====================================")
  console.log("This script will:")
  console.log("  • Fetch existing committed gift IDs")
  console.log("  • Delete ONLY uncommitted gifts")
  console.log("  • Update existing committed gifts (preserve commitment data)")
  console.log("  • Insert new gifts from JSON")
  console.log("  • PRESERVE all users and commitments")
  console.log("")
  log("Starting update process...")
  console.log("")

  let client: ReturnType<typeof postgres> | null = null
  
  try {
    // Connect to database
    log("Connecting to production database...")
    client = postgres(process.env.DATABASE_URL)
    const db = drizzle(client, { schema: { gifts, commitments } })
    log("✓ Connected to database")
    console.log("")

    // Read gift data
    log("Reading gift data from JSON file...")
    const giftDataPath = join(__dirname, "../data/gift-data-structure.json")
    const giftDataRaw = readFileSync(giftDataPath, "utf-8")
    const giftData: GiftDataStructure = JSON.parse(giftDataRaw)

    log(`Found ${giftData.traditionalWishlist.length} traditional gifts`)
    log(`Found ${giftData.receiptWishlist.length} receipt gifts`)
    log(`Found ${giftData.bandcampWishlist.length} bandcamp gifts`)
    console.log("")

    // Prepare all gifts from JSON
    const allGifts = [
      ...giftData.traditionalWishlist.map(gift => ({
        id: gift.id,
        name: gift.name,
        description: gift.description || null,
        estimatedPrice: gift.estimatedPrice,
        category: gift.category,
        priority: gift.priority,
        wishlistType: "traditional" as const,
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

    await db.transaction(async (tx) => {
      // Get IDs of committed gifts
      log("Fetching committed gift IDs...")
      const committedGifts = await tx
        .select({ giftId: commitments.giftId })
        .from(commitments)
        .where(sql`${commitments.status} = 'active'`)
      
      const committedGiftIds = new Set(committedGifts.map(c => c.giftId))
      log(`✓ Found ${committedGiftIds.size} committed gifts (will preserve)`)
      console.log("")

      // Get existing gifts to know which are committed
      log("Fetching existing gift states...")
      const existingGifts = await tx.select().from(gifts)
      const existingGiftMap = new Map(existingGifts.map(g => [g.id, g]))
      log(`✓ Found ${existingGifts.length} existing gifts`)
      console.log("")

      // Delete only uncommitted gifts
      log("Deleting uncommitted gifts...")
      const uncommittedGiftIds = existingGifts
        .filter(g => !g.isCommitted)
        .map(g => g.id)
      
      if (uncommittedGiftIds.length > 0) {
        await tx.delete(gifts).where(
          sql`${gifts.id} IN (${sql.join(uncommittedGiftIds.map(id => sql`${id}`), sql`, `)})`
        )
        log(`✓ Deleted ${uncommittedGiftIds.length} uncommitted gifts`)
      } else {
        log("✓ No uncommitted gifts to delete")
      }
      console.log("")

      // Process each gift
      log("Processing gifts...")
      let updatedCount = 0
      let insertedCount = 0

      for (const gift of allGifts) {
        const existing = existingGiftMap.get(gift.id)
        
        if (existing && existing.isCommitted) {
          // Update existing committed gift (preserve commitment data)
          await tx.update(gifts)
            .set({
              name: gift.name,
              description: gift.description,
              estimatedPrice: gift.estimatedPrice,
              category: gift.category,
              priority: gift.priority,
              imageUrl: gift.imageUrl,
              notes: gift.notes,
              // Preserve commitment data
              isCommitted: existing.isCommitted,
              committedBy: existing.committedBy,
              committedAt: existing.committedAt,
            })
            .where(eq(gifts.id, gift.id))
          updatedCount++
        } else {
          // Insert new or uncommitted gift
          await tx.insert(gifts)
            .values({
              ...gift,
              isCommitted: false,
              committedBy: null,
              committedAt: null,
            })
            .onConflictDoNothing()
          insertedCount++
        }
      }

      log(`✓ Updated ${updatedCount} committed gifts`)
      log(`✓ Inserted ${insertedCount} new/uncommitted gifts`)
      console.log("")
      log("Transaction complete")
    })

    console.log("")
    console.log("📊 Update Summary")
    console.log("=================")
    console.log(`Total Gifts Processed: ${allGifts.length}`)
    console.log("✓ All users preserved")
    console.log("✓ All commitments preserved")
    console.log("✓ Committed gifts updated")
    console.log("✓ New gifts added")
    console.log("")
    console.log("✅ Production gifts updated successfully!")
    console.log("")

    await client.end()
    process.exit(0)
  } catch (error) {
    console.error("")
    console.error("❌ Error updating production gifts:")
    console.error(error)
    console.error("")
    
    if (client) {
      await client.end()
    }
    process.exit(1)
  }
}

updateProductionGifts()
