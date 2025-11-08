import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema.js"

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://postgres:devpass@localhost:5432/new_home_who_dis"

const client = postgres(connectionString)
export const db = drizzle(client, { schema })
