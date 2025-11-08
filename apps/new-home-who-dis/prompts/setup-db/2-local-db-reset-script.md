Create a bash script named scripts/db-reset-local.sh that:

1. Drops and recreates the local PostgreSQL database named "new_home_who_dis"
2. Runs all Drizzle migrations from the drizzle/ directory using drizzle-kit
3. Includes proper error handling and confirmation prompts
4. Uses the local database URL: postgresql://localhost:5432/new_home_who_dis
5. Prints clear status messages for each step
6. Exits with appropriate error codes if any step fails

The script should:

- Ask for confirmation before dropping the database
- Support a --force flag to skip confirmation
- Display a success message when complete
- Be executable (include proper shebang)

Environment assumptions:

- pnpm is the package manager
- drizzle-kit is installed as a dev dependency
- PostgreSQL is running locally on default port 5432
