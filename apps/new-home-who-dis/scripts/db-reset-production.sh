#!/bin/bash

# Production database reset script for new-home-who-dis
# WARNING: This script is DESTRUCTIVE and will delete ALL data in production

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
BACKUP_TIMESTAMP_FILE="./db-reset-production-$(date +%Y%m%d-%H%M%S).log"

# Parse arguments
for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown argument: $arg${NC}"
      echo "Usage: $0 [--dry-run]"
      exit 1
      ;;
  esac
done

# Logging function
log() {
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  echo -e "${BLUE}[${timestamp}]${NC} $1"
  echo "[${timestamp}] $1" >> "$BACKUP_TIMESTAMP_FILE"
}

# Print header
echo -e "${RED}========================================${NC}"
echo -e "${RED}   PRODUCTION DATABASE RESET${NC}"
echo -e "${RED}========================================${NC}"
echo ""
log "Starting production database reset script"

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}DRY RUN MODE - No changes will be made${NC}"
  echo ""
fi

# Step 1: Check environment variable requirement
log "Checking PRODUCTION_RESET_CONFIRM environment variable..."
if [ "$PRODUCTION_RESET_CONFIRM" != "YES_I_AM_SURE" ]; then
  echo -e "${RED}ERROR: PRODUCTION_RESET_CONFIRM is not set correctly${NC}"
  echo ""
  echo "To run this script, you must set:"
  echo -e "  ${YELLOW}export PRODUCTION_RESET_CONFIRM=YES_I_AM_SURE${NC}"
  echo ""
  echo "This is a safety measure to prevent accidental production resets."
  exit 1
fi
log "✓ PRODUCTION_RESET_CONFIRM verified"
echo ""

# Step 2: Verify DATABASE_URL is set
log "Checking DATABASE_URL environment variable..."
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}ERROR: DATABASE_URL environment variable is not set${NC}"
  echo ""
  echo "Set it using:"
  echo -e "  ${YELLOW}export DATABASE_URL=<your-railway-postgres-url>${NC}"
  exit 1
fi
log "✓ DATABASE_URL is set"

# Extract and mask host for verification
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:/]*\).*|\1|p')
MASKED_HOST=$(echo "$DB_HOST" | sed 's/\(.\{4\}\).*\(.\{4\}\)/\1****\2/')
log "Database host: $MASKED_HOST"
echo ""

# Step 3: Display warnings
echo -e "${RED}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║                                                    ║${NC}"
echo -e "${RED}║            ⚠️  CRITICAL WARNING ⚠️                 ║${NC}"
echo -e "${RED}║                                                    ║${NC}"
echo -e "${RED}║  This script will PERMANENTLY DELETE all data     ║${NC}"
echo -e "${RED}║  in your PRODUCTION database!                      ║${NC}"
echo -e "${RED}║                                                    ║${NC}"
echo -e "${RED}║  • All users will be deleted                       ║${NC}"
echo -e "${RED}║  • All gifts and commitments will be deleted       ║${NC}"
echo -e "${RED}║  • All smoking sessions will be deleted            ║${NC}"
echo -e "${RED}║  • All configuration will be deleted               ║${NC}"
echo -e "${RED}║                                                    ║${NC}"
echo -e "${RED}║  THIS CANNOT BE UNDONE!                            ║${NC}"
echo -e "${RED}║                                                    ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════╝${NC}"
echo ""
log "Warning displayed to user"

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}[DRY RUN] Would proceed with database reset${NC}"
  echo ""
  echo "Steps that would be executed:"
  echo "  1. Drop all tables in production database"
  echo "  2. Run Drizzle migrations"
  echo "  3. Verify schema"
  echo ""
  log "Dry run completed successfully"
  exit 0
fi

# Step 4: First confirmation
log "Awaiting first confirmation..."
echo -e "${YELLOW}Database host: ${MASKED_HOST}${NC}"
echo ""
read -p "Type 'DELETE ALL DATA' to continue: " -r
echo ""
if [ "$REPLY" != "DELETE ALL DATA" ]; then
  log "First confirmation failed. Operation cancelled."
  echo -e "${BLUE}Operation cancelled.${NC}"
  exit 0
fi
log "First confirmation received"

# Step 5: Second confirmation
log "Awaiting second confirmation..."
echo -e "${RED}This is your FINAL chance to abort!${NC}"
echo ""
read -p "Type the database host to confirm ($DB_HOST): " -r
echo ""
if [ "$REPLY" != "$DB_HOST" ]; then
  log "Second confirmation failed. Operation cancelled."
  echo -e "${BLUE}Operation cancelled.${NC}"
  exit 0
fi
log "Second confirmation received"
echo ""

# Step 6: Drop all tables
log "Dropping all tables in production database..."
psql "$DATABASE_URL" <<-EOSQL
  DO \$\$
  DECLARE
    r RECORD;
  BEGIN
    -- Drop all tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
      EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
  END \$\$;
EOSQL

if [ $? -ne 0 ]; then
  log "ERROR: Failed to drop tables"
  echo -e "${RED}ERROR: Failed to drop tables${NC}"
  exit 1
fi
log "✓ All tables dropped successfully"
echo ""

# Step 7: Run migrations
log "Running Drizzle migrations..."
if ! pnpm drizzle-kit migrate; then
  log "ERROR: Failed to run migrations"
  echo -e "${RED}ERROR: Failed to run migrations${NC}"
  exit 1
fi
log "✓ Migrations applied successfully"
echo ""

# Step 8: Verify schema
log "Verifying database schema..."
TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
TABLE_COUNT=$(echo $TABLE_COUNT | xargs)  # Trim whitespace

if [ "$TABLE_COUNT" -eq 0 ]; then
  log "WARNING: No tables found in database"
  echo -e "${RED}WARNING: No tables found in database${NC}"
else
  log "✓ Found ${TABLE_COUNT} table(s) in database"
  echo -e "${GREEN}✓ Found ${TABLE_COUNT} table(s) in database${NC}"
fi
echo ""

# Success message
log "Production database reset completed successfully"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   PRODUCTION RESET COMPLETE${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Database host: ${BLUE}${MASKED_HOST}${NC}"
echo -e "Timestamp log: ${BLUE}${BACKUP_TIMESTAMP_FILE}${NC}"
echo ""
echo -e "${MAGENTA}🔔 NOTIFICATION: Production database has been reset!${NC}"
echo ""
echo -e "Next steps:"
echo -e "  • Verify the schema with ${BLUE}pnpm db:studio${NC}"
echo -e "  • Seed production data using the seeding scripts"
echo -e "  • Monitor application for errors"
echo ""

exit 0
