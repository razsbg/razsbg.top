#!/bin/bash

# Local database reset script for new-home-who-dis
# This script drops and recreates the local PostgreSQL database

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="new_home_who_dis"
DB_USER="postgres"
DB_PASSWORD="devpass"
DB_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}"
FORCE_MODE=false

# Parse arguments
for arg in "$@"; do
  case $arg in
    --force)
      FORCE_MODE=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown argument: $arg${NC}"
      echo "Usage: $0 [--force]"
      exit 1
      ;;
  esac
done

# Print header
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Local Database Reset${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if PostgreSQL is running
echo -e "${YELLOW}[1/4] Checking PostgreSQL connection...${NC}"
if ! PGPASSWORD="${DB_PASSWORD}" psql -h localhost -p 5432 -U "${DB_USER}" -c '\q' 2>/dev/null; then
  echo -e "${RED}ERROR: Cannot connect to PostgreSQL at localhost:5432${NC}"
  echo -e "${YELLOW}Hint: Start the database with: pnpm start-db:local${NC}"
  exit 1
fi
echo -e "${GREEN}✓ PostgreSQL is running${NC}"
echo ""

# Confirmation prompt (unless --force)
if [ "$FORCE_MODE" = false ]; then
  echo -e "${YELLOW}WARNING: This will completely drop and recreate the '${DB_NAME}' database.${NC}"
  echo -e "${YELLOW}All existing data will be lost!${NC}"
  echo ""
  read -p "Are you sure you want to continue? (yes/no): " -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${BLUE}Operation cancelled.${NC}"
    exit 0
  fi
fi

# Drop and recreate database
echo -e "${YELLOW}[2/4] Dropping and recreating database '${DB_NAME}'...${NC}"
PGPASSWORD="${DB_PASSWORD}" psql -h localhost -p 5432 -U "${DB_USER}" -d postgres <<-EOSQL
  DROP DATABASE IF EXISTS ${DB_NAME};
  CREATE DATABASE ${DB_NAME};
EOSQL

if [ $? -ne 0 ]; then
  echo -e "${RED}ERROR: Failed to drop/create database${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Database recreated successfully${NC}"
echo ""

# Run migrations
echo -e "${YELLOW}[3/4] Running Drizzle migrations...${NC}"
export POSTGRES_URL="${DB_URL}"
if ! pnpm drizzle-kit migrate; then
  echo -e "${RED}ERROR: Failed to run migrations${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Migrations applied successfully${NC}"
echo ""

# Verify tables
echo -e "${YELLOW}[4/4] Verifying database schema...${NC}"
TABLE_COUNT=$(PGPASSWORD="${DB_PASSWORD}" psql -h localhost -p 5432 -U "${DB_USER}" -d "${DB_NAME}" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
TABLE_COUNT=$(echo $TABLE_COUNT | xargs)  # Trim whitespace

if [ "$TABLE_COUNT" -eq 0 ]; then
  echo -e "${RED}WARNING: No tables found in database${NC}"
else
  echo -e "${GREEN}✓ Found ${TABLE_COUNT} table(s) in database${NC}"
fi
echo ""

# Success message
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Database reset complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "Database: ${BLUE}${DB_NAME}${NC}"
echo -e "URL: ${BLUE}${DB_URL}${NC}"
echo ""
echo -e "Next steps:"
echo -e "  • Run ${BLUE}pnpm db:studio${NC} to open Drizzle Studio"
echo -e "  • Seed data with the seeding scripts (coming soon)"
echo ""

exit 0
