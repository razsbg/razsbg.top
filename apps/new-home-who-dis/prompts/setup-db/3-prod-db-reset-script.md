Create a bash script named scripts/db-reset-production.sh that:

1. Connects to Railway PostgreSQL using the DATABASE_URL environment variable
2. Drops all existing tables in the production database
3. Runs all Drizzle migrations using drizzle-kit
4. Includes strict error handling and multiple confirmation prompts
5. Requires a PRODUCTION_RESET_CONFIRM environment variable to be set to "YES_I_AM_SURE"
6. Logs all operations with timestamps

The script should:

- Display a prominent warning about data loss
- Verify the DATABASE_URL is set before proceeding
- Require TWO confirmations before dropping tables
- Support a --dry-run flag to show what would be executed
- Send a notification (echo statement) when reset is complete
- Be executable with proper shebang

Safety features:

- Fail immediately if any command fails (set -e)
- Display the database host (masked) for verification
- Create a backup timestamp file before reset
