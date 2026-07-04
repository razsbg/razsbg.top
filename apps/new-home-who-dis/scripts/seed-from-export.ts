/**
 * Seed the local database from data/production-export.json — the final
 * export of the production (Railway) DB taken before that project was
 * destroyed. Restores the party exactly as it ended: pseudonyms, gift
 * catalog, commitments, and balcony sessions.
 *
 * Wipes existing rows first. Run against the local docker DB only:
 *   pnpm db:seed:from-export
 */
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { db } from "../src/db/index.js"
import {
  users,
  gifts,
  commitments,
  smokingSessions,
  config,
} from "../src/db/schema.js"
import { sql } from "drizzle-orm"

const __dirname = dirname(fileURLToPath(import.meta.url))

const exportPath = join(__dirname, "../data/production-export.json")
const data = JSON.parse(readFileSync(exportPath, "utf-8"))

console.log(`Seeding from export taken at ${data.meta.exportedAt}`)

const asDate = (v: string | null) => (v ? new Date(v) : null)

// Order matters: commitments and smoking_sessions reference users/gifts
await db.execute(
  sql`TRUNCATE TABLE commitments, smoking_sessions, users, gifts, config CASCADE`,
)

if (data.users.length > 0) {
  await db.insert(users).values(
    data.users.map((u: Record<string, string | null>) => ({
      id: u.id,
      pseudonym: u.pseudonym,
      sessionId: u.session_id,
      createdAt: asDate(u.created_at),
      lastActive: asDate(u.last_active),
      ipHash: u.ip_hash,
    })),
  )
}

if (data.gifts.length > 0) {
  await db.insert(gifts).values(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.gifts.map((g: Record<string, any>) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      estimatedPrice: g.estimated_price,
      category: g.category,
      priority: g.priority,
      wishlistType: g.wishlist_type,
      isCommitted: g.is_committed,
      committedBy: g.committed_by,
      committedAt: asDate(g.committed_at),
      imageUrl: g.image_url,
      notes: g.notes,
      receiptId: g.receipt_id,
      alreadyPurchased: g.already_purchased,
      reimbursementMethod: g.reimbursement_method,
      bandcampUrl: g.bandcamp_url,
      artist: g.artist,
      albumTitle: g.album_title,
      releaseType: g.release_type,
      digitalDelivery: g.digital_delivery,
      createdAt: asDate(g.created_at),
    })),
  )
}

if (data.commitments.length > 0) {
  await db.insert(commitments).values(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.commitments.map((c: Record<string, any>) => ({
      id: c.id,
      userId: c.user_id,
      giftId: c.gift_id,
      amount: c.amount,
      committedAt: asDate(c.committed_at),
      status: c.status,
    })),
  )
}

if (data.smokingSessions.length > 0) {
  await db.insert(smokingSessions).values(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.smokingSessions.map((s: Record<string, any>) => ({
      id: s.id,
      userId: s.user_id,
      startTime: asDate(s.start_time),
      endTime: asDate(s.end_time),
      duration: s.duration,
      status: s.status,
    })),
  )
}

if (data.config.length > 0) {
  await db.insert(config).values(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.config.map((c: Record<string, any>) => ({
      key: c.key,
      value: c.value,
      updatedAt: asDate(c.updated_at),
    })),
  )
}

console.log("Seeded:")
console.table(data.meta.counts)

process.exit(0)
