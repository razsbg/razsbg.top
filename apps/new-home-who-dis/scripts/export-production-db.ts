/**
 * One-time export of the production (Railway) database before the project
 * is destroyed. Writes all rows to data/production-export.json.
 *
 * The repo is public, so identifying/secret fields are sanitized here at
 * export time: users.session_id is replaced with a placeholder (kept
 * unique to satisfy the schema constraint) and users.ip_hash is dropped.
 *
 * Run with: EXPORT_DATABASE_URL=<public url> tsx scripts/export-production-db.ts
 */
import { writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import postgres from "postgres"

const __dirname = dirname(fileURLToPath(import.meta.url))

const url = process.env.EXPORT_DATABASE_URL
if (!url) {
  console.error("EXPORT_DATABASE_URL is not set")
  process.exit(1)
}

// Railway's public proxy requires TLS but presents a self-signed cert
const sql = postgres(url, { max: 1, ssl: { rejectUnauthorized: false } })

const users = await sql`SELECT * FROM users ORDER BY created_at`
const gifts = await sql`SELECT * FROM gifts ORDER BY created_at, id`
const commitments = await sql`SELECT * FROM commitments ORDER BY committed_at`
const smokingSessions =
  await sql`SELECT * FROM smoking_sessions ORDER BY start_time`
const config = await sql`SELECT * FROM config ORDER BY key`

const sanitizedUsers = users.map((u, i) => ({
  ...u,
  session_id: `exported-session-${String(i + 1).padStart(3, "0")}`,
  ip_hash: null,
}))

const exportData = {
  meta: {
    exportedAt: new Date().toISOString(),
    source: "railway production (party.razsbg.top), pre-shutdown export",
    sanitized: ["users.session_id", "users.ip_hash"],
    counts: {
      users: users.length,
      gifts: gifts.length,
      commitments: commitments.length,
      smokingSessions: smokingSessions.length,
      config: config.length,
    },
  },
  users: sanitizedUsers,
  gifts,
  commitments,
  smokingSessions,
  config,
}

const outPath = join(__dirname, "../data/production-export.json")
writeFileSync(outPath, JSON.stringify(exportData, null, 2) + "\n")

console.log(`Exported to ${outPath}`)
console.table(exportData.meta.counts)

await sql.end()
