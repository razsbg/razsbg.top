CREATE TABLE IF NOT EXISTS "commitments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"gift_id" varchar(50) NOT NULL,
	"amount" integer NOT NULL,
	"committed_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "config" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gifts" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
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
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "smoking_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"duration" integer,
	"status" varchar(20) DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pseudonym" varchar(100) NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_active" timestamp DEFAULT now() NOT NULL,
	"ip_hash" varchar(64),
	CONSTRAINT "users_pseudonym_unique" UNIQUE("pseudonym"),
	CONSTRAINT "users_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commitments" ADD CONSTRAINT "commitments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commitments" ADD CONSTRAINT "commitments_gift_id_gifts_id_fk" FOREIGN KEY ("gift_id") REFERENCES "public"."gifts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "smoking_sessions" ADD CONSTRAINT "smoking_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_commitments_user_id" ON "commitments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_commitments_gift_id" ON "commitments" USING btree ("gift_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_commitments_status" ON "commitments" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_commitments_gift_unique" ON "commitments" USING btree ("gift_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_gifts_category" ON "gifts" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_gifts_priority" ON "gifts" USING btree ("priority");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_gifts_wishlist_type" ON "gifts" USING btree ("wishlist_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_gifts_committed" ON "gifts" USING btree ("is_committed");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_smoking_sessions_user_id" ON "smoking_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_smoking_sessions_status" ON "smoking_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_smoking_sessions_start_time" ON "smoking_sessions" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_pseudonym" ON "users" USING btree ("pseudonym");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_session_id" ON "users" USING btree ("session_id");