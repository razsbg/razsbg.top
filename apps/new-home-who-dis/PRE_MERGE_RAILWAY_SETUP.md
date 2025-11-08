# Pre-Merge Railway Setup Checklist

Complete these steps **BEFORE** merging the `setup-db` branch to `main`.

---

## Step 1: Verify Railway PostgreSQL Database Exists ✓

You mentioned you already created this in the Railway UI. Confirm:

```bash
railway link  # Link to your Railway project
railway status  # Verify project is linked
```

---

## Step 2: Get Database Connection String

```bash
# Get the DATABASE_URL from Railway
railway variables get DATABASE_URL
```

**Example output:**
```
postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway
```

Copy this URL - you'll need it for the next steps.

---

## Step 3: Run Migrations on Production Database

```bash
# Set the DATABASE_URL from Step 2
export DATABASE_URL="postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway"

# Run migrations to create tables
pnpm db:migrate
```

**Expected output:**
```
✓ migrations applied successfully!
```

**What this does:**
- Creates all 5 tables (users, gifts, commitments, smoking_sessions, config)
- Creates all indexes
- Sets up foreign key relationships

---

## Step 4: Seed Production Database

```bash
# Set confirmation flag
export PRODUCTION_SEED_CONFIRM=YES

# Seed with real gift data (no test users)
pnpm db:seed:production
```

**Expected output:**
```
🚀 PRODUCTION DATABASE SEEDING
================================
✓ PRODUCTION_SEED_CONFIRM verified
✓ DATABASE_URL is set
✓ Connected to database
✓ Inserted 49 traditional gifts
✓ Inserted 10 receipt gifts
✓ Inserted 10 bandcamp gifts

📊 Seeding Summary
==================
Total Gifts:  69
✅ Production database seeded successfully!
```

---

## Step 5: Verify Database with Railway CLI

```bash
# Open Railway's PostgreSQL shell
railway run psql $DATABASE_URL

# In psql, run:
SELECT COUNT(*) FROM gifts;
# Should show: 69

SELECT wishlist_type, COUNT(*) FROM gifts GROUP BY wishlist_type;
# Should show: traditional=49, receipt=10, bandcamp=10

\q  # Exit psql
```

---

## Step 6: Configure Railway Environment Variables

### Option A: Using Railway Dashboard (Recommended)

1. Go to https://railway.app
2. Select your project
3. Click on your web service
4. Go to "Variables" tab
5. Add these variables:

```
NODE_ENV=production
REVOLUT_USERNAME=razsbg
PARTY_DATE=2025-11-08T15:00:00+02:00
```

**Note:** `DATABASE_URL` is automatically set by Railway when you add PostgreSQL service.

### Option B: Using Railway CLI

```bash
railway variables set NODE_ENV=production
railway variables set REVOLUT_USERNAME=razsbg
railway variables set PARTY_DATE="2025-11-08T15:00:00+02:00"
```

---

## Step 7: Connect Railway to GitHub (If Not Already Done)

1. In Railway dashboard, go to your project
2. Click "Settings"
3. Under "Source", connect your GitHub repository
4. Select branch: `main`
5. Railway will now auto-deploy on push to `main`

**Build settings:**
- Build command: `pnpm install && pnpm build`
- Start command: `pnpm start`
- Root directory: `apps/new-home-who-dis` (if monorepo)

---

## Step 8: Test Database Connection (Before Merge)

Create a test deployment or use Railway's shell:

```bash
# Test that the app can connect to database
railway run node -e "
  const postgres = require('postgres');
  const sql = postgres(process.env.DATABASE_URL);
  sql\`SELECT COUNT(*) FROM gifts\`
    .then(res => console.log('✅ Database connected:', res))
    .catch(err => console.error('❌ Error:', err))
    .finally(() => process.exit());
"
```

---

## ✅ Pre-Merge Verification Checklist

Before merging `setup-db` → `main`, verify:

- [ ] Railway PostgreSQL database is running
- [ ] `railway variables get DATABASE_URL` returns valid connection string
- [ ] Migrations ran successfully (`pnpm db:migrate`)
- [ ] Database has 69 gifts (`railway run psql` and check)
- [ ] Environment variables are set in Railway:
  - [ ] `DATABASE_URL` (auto-set by Railway)
  - [ ] `NODE_ENV=production`
  - [ ] `REVOLUT_USERNAME=razsbg`
  - [ ] `PARTY_DATE=2025-11-08T15:00:00+02:00`
- [ ] Railway is connected to GitHub repository
- [ ] Railway build/start commands are configured
- [ ] Test database connection successful

---

## After Merge

Once you merge and Railway auto-deploys:

1. **Monitor Deployment**
   ```bash
   railway logs
   ```

2. **Verify Deployment**
   Visit your Railway URL (e.g., `https://new-home-who-dis-production.up.railway.app`)
   
   Test endpoints:
   - `/test-db` - Should show 69 gifts
   - `/api/gifts` - Should return all gifts
   - `/api/gifts?type=traditional` - Should return 49 gifts

3. **Check for Errors**
   ```bash
   railway logs --tail
   ```

4. **If Issues Arise**
   - Check Railway logs for errors
   - Verify environment variables are set
   - Confirm DATABASE_URL is accessible
   - Re-run migrations if needed: `railway run pnpm db:migrate`

---

## Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is set: `railway variables get DATABASE_URL`
- Verify PostgreSQL service is running in Railway dashboard
- Try: `railway run pnpm db:migrate` to test connection

### "No tables found"
- Migrations didn't run: `railway run pnpm db:migrate`
- Check Railway logs for migration errors

### "No gifts in database"
- Re-seed production: `PRODUCTION_SEED_CONFIRM=YES railway run pnpm db:seed:production`

### "Deployment failed"
- Check Railway logs: `railway logs`
- Verify build command is correct
- Check all environment variables are set

---

## Summary: Railway Setup Order

✅ **CORRECT ORDER:**
1. Setup Railway PostgreSQL database ← You did this
2. Get DATABASE_URL
3. Run migrations (`pnpm db:migrate`)
4. Seed production database (`pnpm db:seed:production`)
5. Configure environment variables
6. Connect Railway to GitHub
7. **THEN** merge `setup-db` → `main`
8. Railway auto-deploys with everything ready

❌ **WRONG ORDER:**
1. Merge first ← Deployment fails
2. Then setup Railway ← Too late
3. Have to re-deploy or fix issues

---

## Quick Command Reference

```bash
# Link to Railway project
railway link

# Get database URL
railway variables get DATABASE_URL

# Run migrations
export DATABASE_URL="..." && pnpm db:migrate

# Seed production
export PRODUCTION_SEED_CONFIRM=YES && pnpm db:seed:production

# Set environment variables
railway variables set NODE_ENV=production
railway variables set REVOLUT_USERNAME=razsbg
railway variables set PARTY_DATE="2025-11-08T15:00:00+02:00"

# View logs after deployment
railway logs --tail
```

---

## Ready to Merge?

Once all checkboxes above are complete, you're ready to:

```bash
git checkout setup-db
git push origin setup-db  # Ensure latest changes are pushed

# Create/merge PR
gh pr create --title "Setup database utilities and seeding" --body "Adds database migration, seeding, and validation"
# OR
gh pr merge  # If PR already exists
```

Railway will automatically deploy once merged to `main`.
