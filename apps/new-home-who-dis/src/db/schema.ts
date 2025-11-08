import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core"

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pseudonym: varchar("pseudonym", { length: 100 }).notNull().unique(),
    sessionId: varchar("session_id", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    lastActive: timestamp("last_active").defaultNow().notNull(),
    ipHash: varchar("ip_hash", { length: 64 }),
  },
  table => [
    index("idx_users_pseudonym").on(table.pseudonym),
    index("idx_users_session_id").on(table.sessionId),
  ],
)

// Gifts table
export const gifts = pgTable(
  "gifts",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    estimatedPrice: integer("estimated_price").notNull(), // in bani (Lei * 100)
    category: varchar("category", { length: 100 }).notNull(),
    priority: varchar("priority", { length: 20 }).notNull(), // 'essential' | 'nice-to-have' | 'luxury' | 'digital'
    wishlistType: varchar("wishlist_type", { length: 20 }).notNull(), // 'traditional' | 'receipt' | 'bandcamp'
    isCommitted: boolean("is_committed").default(false).notNull(),
    committedBy: varchar("committed_by", { length: 100 }), // pseudonym
    committedAt: timestamp("committed_at"),
    imageUrl: text("image_url"),
    notes: text("notes"),

    // Receipt-specific fields
    receiptId: varchar("receipt_id", { length: 50 }),
    alreadyPurchased: boolean("already_purchased").default(false),
    reimbursementMethod: varchar("reimbursement_method", { length: 20 }), // 'revolut'

    // Bandcamp-specific fields
    bandcampUrl: text("bandcamp_url"),
    artist: varchar("artist", { length: 255 }),
    albumTitle: varchar("album_title", { length: 255 }),
    releaseType: varchar("release_type", { length: 20 }), // 'album' | 'track' | 'ep'
    digitalDelivery: boolean("digital_delivery").default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => [
    index("idx_gifts_category").on(table.category),
    index("idx_gifts_priority").on(table.priority),
    index("idx_gifts_wishlist_type").on(table.wishlistType),
    index("idx_gifts_committed").on(table.isCommitted),
  ],
)

// Commitments table
export const commitments = pgTable(
  "commitments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    giftId: varchar("gift_id", { length: 50 })
      .notNull()
      .references(() => gifts.id),
    amount: integer("amount").notNull(), // in bani
    committedAt: timestamp("committed_at").defaultNow().notNull(),
    status: varchar("status", { length: 20 }).default("active").notNull(), // 'active' | 'cancelled'
  },
  table => [
    index("idx_commitments_user_id").on(table.userId),
    index("idx_commitments_gift_id").on(table.giftId),
    index("idx_commitments_status").on(table.status),
    index("idx_commitments_gift_unique").on(table.giftId),
  ],
)

// Balcony tracking table
export const smokingSessions = pgTable(
  "smoking_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    startTime: timestamp("start_time").defaultNow().notNull(),
    endTime: timestamp("end_time"),
    duration: integer("duration"), // in minutes
    status: varchar("status", { length: 20 }).default("active").notNull(), // 'active' | 'completed' | 'kicked'
  },
  table => [
    index("idx_smoking_sessions_user_id").on(table.userId),
    index("idx_smoking_sessions_status").on(table.status),
    index("idx_smoking_sessions_start_time").on(table.startTime),
  ],
)

// System configuration table
export const config = pgTable("config", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
