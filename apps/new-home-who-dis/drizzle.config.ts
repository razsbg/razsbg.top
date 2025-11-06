import type { Config } from "drizzle-kit"

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString:
      process.env.POSTGRES_URL ||
      "postgresql://localhost:5432/new_home_who_dis",
  },
} satisfies Config
