import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { db } from "../src/db/index"
import { users, gifts, commitments } from "../src/db/schema"

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
}

// Adjectives and animals for pseudonym generation
const adjectives = [
  "Swift",
  "Clever",
  "Brave",
  "Mysterious",
  "Jolly",
  "Wise",
  "Fierce",
  "Gentle",
  "Bold",
  "Curious",
]

const animals = [
  "Panda",
  "Eagle",
  "Dolphin",
  "Tiger",
  "Owl",
  "Fox",
  "Bear",
  "Wolf",
  "Hawk",
  "Lynx",
]

function generatePseudonym(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  const number = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${adjective}-${animal}-${number}`
}

function generateUniqueSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

async function seedLocalDatabase() {
  console.log("🌱 Starting local database seeding...")
  console.log("")

  try {
    // Read the gift data
    console.log("📖 Reading gift data from JSON file...")
    const giftDataPath = join(__dirname, "../data/gift-data-structure.json")
    const giftDataRaw = readFileSync(giftDataPath, "utf-8")
    const giftData: GiftDataStructure = JSON.parse(giftDataRaw)

    console.log(
      `   Found ${giftData.traditionalWishlist.length} traditional gifts`,
    )
    console.log(`   Found ${giftData.receiptWishlist.length} receipt gifts`)
    console.log(`   Found ${giftData.bandcampWishlist.length} bandcamp gifts`)
    console.log("")

    // Clear existing data
    console.log("🗑️  Clearing existing data...")
    await db.delete(commitments)
    await db.delete(gifts)
    await db.delete(users)
    console.log("   ✓ All tables cleared")
    console.log("")

    // Create test users
    console.log("👥 Creating test users...")
    const testUsers = []
    for (let i = 0; i < 5; i++) {
      const pseudonym = generatePseudonym()
      const sessionId = generateUniqueSessionId()
      testUsers.push({
        pseudonym,
        sessionId,
      })
    }

    const insertedUsers = await db.insert(users).values(testUsers).returning()
    console.log(`   ✓ Created ${insertedUsers.length} test users`)
    insertedUsers.forEach(user => {
      console.log(`      - ${user.pseudonym}`)
    })
    console.log("")

    // Prepare all gifts for insertion
    console.log("🎁 Preparing gifts for insertion...")
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

    // Insert all gifts
    console.log("💾 Inserting gifts into database...")
    await db.insert(gifts).values(allGifts)
    console.log(`   ✓ Inserted ${giftData.traditionalWishlist.length} traditional gifts`)
    console.log(`   ✓ Inserted ${giftData.receiptWishlist.length} receipt gifts`)
    console.log(`   ✓ Inserted ${giftData.bandcampWishlist.length} bandcamp gifts`)
    console.log("")

    // Summary
    console.log("📊 Seeding Summary")
    console.log("==================")
    console.log(`Total Users:  ${insertedUsers.length}`)
    console.log(`Total Gifts:  ${allGifts.length}`)
    console.log(`  • Traditional: ${giftData.traditionalWishlist.length}`)
    console.log(`  • Receipt:     ${giftData.receiptWishlist.length}`)
    console.log(`  • Bandcamp:    ${giftData.bandcampWishlist.length}`)
    console.log("")
    console.log("✅ Local database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:")
    console.error(error)
    process.exit(1)
  }
}

// Run the seeding script
seedLocalDatabase()
