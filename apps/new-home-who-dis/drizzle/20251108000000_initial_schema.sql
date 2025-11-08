-- Initial schema migration for new-home-who-dis gift registry
-- Generated: 2025-11-08
-- Safe to run multiple times (idempotent)

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "pseudonym" varchar(100) NOT NULL UNIQUE,
  "session_id" varchar(255) NOT NULL UNIQUE,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "last_active" timestamp DEFAULT now() NOT NULL,
  "ip_hash" varchar(64)
);

-- Create gifts table
CREATE TABLE IF NOT EXISTS "gifts" (
  "id" varchar(50) PRIMARY KEY,
  "name" text NOT NULL,
  "description" text,
  "estimated_price" integer NOT NULL,
  "category" varchar(100) NOT NULL,
  "priority" varchar(20) NOT NULL,
  "wishlist_type" varchar(20) NOT NULL,
  "is_committed" boolean DEFAULT false NOT NULL,
  "committed_by" varchar(100),
  "committed_at" timestamp,
  "image_url" text,
  "notes" text,
  "receipt_id" varchar(50),
  "already_purchased" boolean DEFAULT false,
  "reimbursement_method" varchar(20),
  "bandcamp_url" text,
  "artist" varchar(255),
  "album_title" varchar(255),
  "release_type" varchar(20),
  "digital_delivery" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "chk_gifts_wishlist_type" CHECK ("wishlist_type" IN ('traditional', 'receipt', 'bandcamp')),
  CONSTRAINT "chk_gifts_priority" CHECK ("priority" IN ('essential', 'nice-to-have', 'luxury', 'digital'))
);

-- Create commitments table
CREATE TABLE IF NOT EXISTS "commitments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "gift_id" varchar(50) NOT NULL,
  "amount" integer NOT NULL,
  "committed_at" timestamp DEFAULT now() NOT NULL,
  "status" varchar(20) DEFAULT 'active' NOT NULL,
  CONSTRAINT "fk_commitments_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
  CONSTRAINT "fk_commitments_gift" FOREIGN KEY ("gift_id") REFERENCES "gifts"("id"),
  CONSTRAINT "chk_commitments_status" CHECK ("status" IN ('active', 'cancelled'))
);

-- Create smoking_sessions table
CREATE TABLE IF NOT EXISTS "smoking_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "start_time" timestamp DEFAULT now() NOT NULL,
  "end_time" timestamp,
  "duration" integer,
  "status" varchar(20) DEFAULT 'active' NOT NULL,
  CONSTRAINT "fk_smoking_sessions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Create config table
CREATE TABLE IF NOT EXISTS "config" (
  "key" varchar(100) PRIMARY KEY,
  "value" text NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS "idx_users_pseudonym" ON "users"("pseudonym");
CREATE INDEX IF NOT EXISTS "idx_users_session_id" ON "users"("session_id");

-- Create indexes for gifts table
CREATE INDEX IF NOT EXISTS "idx_gifts_category" ON "gifts"("category");
CREATE INDEX IF NOT EXISTS "idx_gifts_priority" ON "gifts"("priority");
CREATE INDEX IF NOT EXISTS "idx_gifts_wishlist_type" ON "gifts"("wishlist_type");
CREATE INDEX IF NOT EXISTS "idx_gifts_committed" ON "gifts"("is_committed");

-- Create indexes for commitments table
CREATE INDEX IF NOT EXISTS "idx_commitments_user_id" ON "commitments"("user_id");
CREATE INDEX IF NOT EXISTS "idx_commitments_gift_id" ON "commitments"("gift_id");
CREATE INDEX IF NOT EXISTS "idx_commitments_status" ON "commitments"("status");
CREATE INDEX IF NOT EXISTS "idx_commitments_gift_unique" ON "commitments"("gift_id");

-- Create indexes for smoking_sessions table
CREATE INDEX IF NOT EXISTS "idx_smoking_sessions_user_id" ON "smoking_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_smoking_sessions_status" ON "smoking_sessions"("status");
CREATE INDEX IF NOT EXISTS "idx_smoking_sessions_start_time" ON "smoking_sessions"("start_time");
