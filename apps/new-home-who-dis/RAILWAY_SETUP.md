# Railway Database Setup Guide

## Step 1: Get Railway Database URL

```bash
cd /Users/razsbg/Work/razsbg.top/apps/new-home-who-dis

# Link to your Railway project (if not already linked)
railway link

# Get the DATABASE_URL
railway variables get DATABASE_URL
```

**Output will look like:**
```
postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway
```

Copy this URL for the next steps.

---

## Step 2: Run Migrations on Production Database

```bash
# Set the DATABASE_URL (replace with your actual Railway URL)
export DATABASE_URL="postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:5432/railway"

# Run migrations to create tables
pnpm db:migrate
```

**Expected output:**
```
✓ migrations applied successfully!
```

---

## Step 3: Seed Production Database

```bash
# Set confirmation flag
export PRODUCTION_SEED_CONFIRM=YES

# Run production seeding script
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
  • Traditional: 49
  • Receipt:     10
  • Bandcamp:    10

✅ Production database seeded successfully!
```

---

## Step 4: Test Database Connection Locally

```bash
# Start local dev server (will use Railway DB if DATABASE_URL is set)
pnpm dev
```

Then open in your browser:
- **Database test page:** http://localhost:4321/test-db
- **API endpoint:** http://localhost:4321/api/gifts

**What to verify:**
- ✅ Database shows 69 total gifts
- ✅ Traditional: 49, Receipt: 10, Bandcamp: 10
- ✅ API endpoint returns JSON with gifts

---

## Step 5: Deploy to Railway

### Option A: Using Railway CLI

```bash
# Deploy from local
railway up
```

### Option B: Using GitHub Integration (Recommended)

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Add database connection and test endpoints"
   git push
   ```

2. Railway will automatically deploy if connected to GitHub

---

## Step 6: Set Environment Variables in Railway Dashboard

1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add these variables:
   - `NODE_ENV=production`
   - `REVOLUT_USERNAME=razsbg`
   - `PARTY_DATE=2025-11-08T15:00:00+02:00`
   
   (DATABASE_URL is already set by the PostgreSQL service)

---

## Step 7: Verify Production Deployment

Once deployed, visit:
- **Your domain:** https://your-app.railway.app/test-db
- **API endpoint:** https://your-app.railway.app/api/gifts

---

## Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is set: `echo $DATABASE_URL`
- Verify Railway database is running in dashboard
- Try `railway run pnpm db:migrate` to use Railway's environment

### "Password authentication failed"
- Make sure you copied the full DATABASE_URL with credentials
- Check if Railway database password has special characters (may need URL encoding)

### "Relation does not exist"
- Migrations haven't run: `export DATABASE_URL=... && pnpm db:migrate`

### Want to reset production database?
```bash
export DATABASE_URL="your-railway-url"
export PRODUCTION_RESET_CONFIRM="YES_I_AM_SURE"
pnpm db:reset:production
```
**⚠️ WARNING: This will delete ALL data!**

---

## Quick Reference Commands

```bash
# Get Railway DB URL
railway variables get DATABASE_URL

# Run migrations
export DATABASE_URL="..." && pnpm db:migrate

# Seed production
export PRODUCTION_SEED_CONFIRM=YES && pnpm db:seed:production

# Test locally with Railway DB
export DATABASE_URL="..." && pnpm dev

# Deploy to Railway
railway up
```
