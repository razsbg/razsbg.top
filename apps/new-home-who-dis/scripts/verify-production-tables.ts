/**
 * Verify and create tables in production if needed
 */

import postgres from "postgres"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set")
  process.exit(1)
}

console.log("🔍 Checking production database tables...")

const sql = postgres(DATABASE_URL)

async function checkAndCreateTables() {
  try {
    // Check if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    console.log(`\nFound ${tables.length} tables:`)
    tables.forEach(t => console.log(`  - ${t.table_name}`))
    
    const expectedTables = ['users', 'gifts', 'commitments', 'smoking_sessions', 'config']
    const existingTableNames = tables.map(t => t.table_name)
    const missingTables = expectedTables.filter(t => !existingTableNames.includes(t))
    
    if (missingTables.length > 0) {
      console.log(`\n⚠️  Missing tables: ${missingTables.join(', ')}`)
      console.log("\n📝 Creating missing tables from migration SQL...")
      
      // Read and execute the migration SQL
      const migrationPath = join(__dirname, '../drizzle/0000_parched_shaman.sql')
      const migrationSQL = readFileSync(migrationPath, 'utf-8')
      
      // Split by statement breakpoint and execute each statement
      const statements = migrationSQL
        .split('--> statement-breakpoint')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))
      
      console.log(`Executing ${statements.length} SQL statements...`)
      
      for (const statement of statements) {
        try {
          await sql.unsafe(statement)
          console.log(`  ✓ Statement executed`)
        } catch (error) {
          // Ignore "already exists" errors
          const pgError = error as { code?: string; message?: string }
          if (pgError.code === '42P07') {
            console.log(`  ⚠️  Table/constraint already exists (skipping)`)
          } else {
            console.error(`  ❌ Error: ${pgError.message}`)
            throw error
          }
        }
      }
      
      console.log("\n✅ Tables created successfully")
    } else {
      console.log("\n✅ All expected tables exist")
    }
    
    // Verify final state
    console.log("\n📊 Final table check:")
    const finalTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    finalTables.forEach(t => console.log(`  ✓ ${t.table_name}`))
    
    // Check gift count
    const giftCount = await sql`SELECT COUNT(*) as count FROM gifts`
    console.log(`\n🎁 Gifts in database: ${giftCount[0]?.count ?? 0}`)
    
    await sql.end()
    process.exit(0)
  } catch (error) {
    console.error("\n❌ Error:", error)
    await sql.end()
    process.exit(1)
  }
}

checkAndCreateTables()
