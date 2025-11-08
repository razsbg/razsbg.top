# 🚀 Start Here: Testing the Identity System

## Quick Overview

You now have a complete **Anonymous Identity System** implemented on branch `feature/anonymous-identity`.

**What it does:**
- Assigns each visitor a unique pseudonym (e.g., `Skeptical-Platypus-742`)
- Persists identity across page refreshes (cookies + localStorage)
- Allows users to change their pseudonym
- No login required - completely anonymous!

---

## Option 1: Quick Visual Test (2 minutes)

### Step 1: Start Dev Server

```bash
cd /Users/razsbg/Work/razsbg.top/apps/new-home-who-dis

# Make sure PostgreSQL is running
docker compose up -d

# Start dev server
pnpm dev
```

### Step 2: Test Home Page Button

Visit: **http://localhost:4321/**

✅ Verify you see:
- Countdown timer
- **"Start Beta Testing" button** (gradient colors, emojis: 🧪 🚀)
- Button text pulses

Click the button → should navigate to `/identity` page

### Step 3: Test Identity Page

You should now be on: **http://localhost:4321/identity**

### Step 4: Verify Page Structure

✅ Page should have:
1. **Header**: Logo, title "🎭 Your Party Identity"
2. **Identity Card**: Purple gradient card with your pseudonym (e.g., `Brave-Wolf-456`)
3. **How It Works**: 3 step cards explaining the system
4. **Fun Facts**: Box with 4 bullet points
5. **Technical Details**: Collapsible section (click to expand)
6. **Navigation**: "Back to Home" link

✅ Try this:
- Click "🔄 Change Identity" → Confirm → Pseudonym changes
- Refresh page → Same pseudonym appears (persists!)
- Click logo → Returns to home page
- Click "Technical Details" → Section expands/collapses
- Open DevTools → Check cookie `gift_session_id` exists

**If it works:** Success! Feature is ready.  
**If it doesn't:** Check the detailed test plan below.

---

## Option 2: Full Test Suite (30 minutes)

Follow the comprehensive test plan:

```bash
open apps/new-home-who-dis/TEST_PLAN_IDENTITY.md
```

This includes:
- API endpoint testing (curl commands)
- Database validation (SQL queries)
- Browser compatibility checks
- Edge case testing
- Performance checks

---

## Option 3: API-Only Test (5 minutes)

If you just want to test the backend:

```bash
# Start server (if not already running)
pnpm dev

# Create a new user
curl -i -X POST http://localhost:4321/api/users/session

# You should see:
# HTTP/1.1 201 Created
# Set-Cookie: gift_session_id=...
# {
#   "success": true,
#   "user": {
#     "pseudonym": "Some-Animal-123",
#     ...
#   }
# }

# Copy the session ID from Set-Cookie header, then:
curl -i http://localhost:4321/api/users/session \
  -H "Cookie: gift_session_id=YOUR_SESSION_ID"

# Should return the same pseudonym
```

---

## What's Implemented

### Files Created (10 new files)

```
src/lib/
  ├── pseudonym.ts       - Pseudonym generator (Adjective-Animal-XXX)
  └── session.ts         - Cookie & session management

src/pages/api/users/
  └── session.ts         - API endpoints (POST/GET/PUT)

src/stores/
  └── identity.ts        - Client-side state (nanostores)

src/components/
  ├── IdentityCard.tsx   - Solid.js component
  └── IdentityCard.css   - Styles (purple gradient card)

Documentation/
  ├── START_HERE.md              - This file
  ├── QUICK_TEST_IDENTITY.md     - 5-minute smoke test
  ├── TEST_PLAN_IDENTITY.md      - Full 30-minute test plan
  └── FEATURE_SUMMARY_IDENTITY.md - Complete implementation details
```

### Dependencies Added

- `@nanostores/solid` - Solid.js integration
- `@nanostores/persistent` - LocalStorage persistence

---

## Architecture at a Glance

```
┌──────────────────────┐
│   Browser            │
│  ┌────────────────┐  │
│  │ IdentityCard   │  │  Shows pseudonym
│  │ (Solid.js)     │  │  + Change button
│  └────────┬───────┘  │
│           │          │
│  ┌────────▼───────┐  │
│  │ identity.ts    │  │  State management
│  │ (nanostores)   │  │  + localStorage
│  └────────┬───────┘  │
└───────────┼──────────┘
            │ HTTPS
            │ + Cookies
┌───────────▼──────────┐
│   Server             │
│  ┌────────────────┐  │
│  │ /api/users/    │  │  POST: Create user
│  │ session.ts     │  │  GET:  Get session
│  └────────┬───────┘  │  PUT:  Change pseudonym
│           │          │
│  ┌────────▼───────┐  │
│  │ pseudonym.ts   │  │  Generate unique names
│  │ session.ts     │  │  Cookie management
│  └────────┬───────┘  │
└───────────┼──────────┘
            │ SQL
┌───────────▼──────────┐
│   PostgreSQL         │
│  ┌────────────────┐  │
│  │ users table    │  │  id, pseudonym,
│  │                │  │  session_id, ip_hash
│  └────────────────┘  │
└──────────────────────┘
```

---

## Common Issues & Fixes

### Issue: Component doesn't render

**Fix:**
```bash
# Check for build errors
pnpm build

# If build fails, check console for errors
```

### Issue: "Cannot connect to database"

**Fix:**
```bash
# Restart PostgreSQL
docker compose restart postgres

# Verify it's running
docker ps | grep postgres
```

### Issue: API returns 500 error

**Fix:**
```bash
# Check server logs
# Look for database connection errors or TypeScript errors

# Verify database connection
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis -c "\dt"
```

### Issue: Pseudonym doesn't persist

**Check:**
1. Open DevTools → Application → Cookies
2. Verify `gift_session_id` cookie exists
3. Open DevTools → Application → Local Storage
4. Verify `gift_user` key exists with JSON value

---

## Next Steps After Testing

### If Tests Pass ✅

1. **Review implementation:**
   ```bash
   open apps/new-home-who-dis/FEATURE_SUMMARY_IDENTITY.md
   ```

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: implement anonymous identity system
   
   - Add pseudonym generator (Adjective-Animal-XXX format)
   - Add session management with cookies
   - Add POST/GET/PUT API endpoints
   - Add Solid.js identity card component
   - Add nanostores for state management
   - Add localStorage persistence
   
   Closes #[issue-number]"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin feature/anonymous-identity
   ```

4. **Create Pull Request:**
   - Compare: `feature/anonymous-identity` → `master`
   - Title: "Feature: Anonymous Identity System"
   - Description: Link to `FEATURE_SUMMARY_IDENTITY.md`

### If Tests Fail ❌

1. **Document the issue:**
   - Note which test failed
   - Copy error messages
   - Screenshot if visual issue

2. **Ask for help:**
   - Share the test that failed
   - Share the error message
   - Share any relevant logs

---

## Key Features to Test

✅ **Must Work:**
- [ ] Purple card renders
- [ ] Pseudonym shows in format: `Adjective-Animal-XXX`
- [ ] Page refresh preserves identity
- [ ] "Change Identity" button works
- [ ] Cookie `gift_session_id` is set
- [ ] LocalStorage `gift_user` is set

🔄 **Should Work:**
- [ ] Multiple tabs share same identity
- [ ] API returns 201 on POST
- [ ] API returns 200 on GET
- [ ] API returns 200 on PUT
- [ ] Database has user records

⚠️ **Edge Cases:**
- [ ] Works without cookie (creates new user)
- [ ] Works without localStorage (fetches from API)
- [ ] Shows error if server is down

---

## Ready to Test?

Pick your testing style:

```bash
# Quick visual test (2 min)
open http://localhost:4321/test-identity  # After creating the test page

# API test (5 min)
open apps/new-home-who-dis/QUICK_TEST_IDENTITY.md

# Full test suite (30 min)
open apps/new-home-who-dis/TEST_PLAN_IDENTITY.md
```

**Let's see how it looks!** 🎉

---

## Questions?

Check these docs:
- `FEATURE_SUMMARY_IDENTITY.md` - Full implementation details
- `TEST_PLAN_IDENTITY.md` - Comprehensive test guide
- `QUICK_TEST_IDENTITY.md` - 5-minute smoke test

Or check the code:
- `src/lib/pseudonym.ts` - How pseudonyms are generated
- `src/pages/api/users/session.ts` - API endpoint logic
- `src/components/IdentityCard.tsx` - UI component
