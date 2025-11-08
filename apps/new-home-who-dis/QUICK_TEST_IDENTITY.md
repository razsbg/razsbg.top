# Quick Test Guide: Anonymous Identity System

**5-Minute Smoke Test**

---

## Setup (30 seconds)

```bash
cd /Users/razsbg/Work/razsbg.top/apps/new-home-who-dis
docker compose up -d
pnpm dev
```

---

## Test 1: Home Page Button (30 seconds)

1. **Visit:** http://localhost:4321/

2. **Verify:**
   - ✅ See "Start Beta Testing" button after countdown
   - ✅ Button has gradient colors and emojis (🧪 and 🚀)
   - ✅ Button animates (text pulses)

3. **Click button:**
   - ✅ Navigates to `/identity` page

---

## Test 2: Identity Page Check (2 minutes)

1. **Visit:** http://localhost:4321/identity

2. **Verify Page Structure:**
   - ✅ Header with logo, title "🎭 Your Party Identity"
   - ✅ Purple gradient IdentityCard component
   - ✅ Pseudonym shows: `Adjective-Animal-XXX` (e.g., `Skeptical-Platypus-742`)
   - ✅ "How It Works" section with 3 step cards
   - ✅ "Fun Facts" box
   - ✅ Collapsible "Technical Details" section
   - ✅ "Back to Home" link at bottom

3. **Test Functionality:**
   - ✅ Refresh page → same pseudonym appears (persistence)
   - ✅ Click "🔄 Change Identity" → confirmation dialog → pseudonym changes
   - ✅ Click logo → returns to home page
   - ✅ Click "Technical Details" → section expands/collapses

4. **Open DevTools → Application:**
   - ✅ Cookie: `gift_session_id` exists
   - ✅ LocalStorage: `gift_user` has JSON data

---

## Test 3: API Quick Check (1 minute)

```bash
# Create user
curl -X POST http://localhost:4321/api/users/session

# Should return:
# {
#   "success": true,
#   "user": {
#     "pseudonym": "Some-Animal-123",
#     ...
#   }
# }
```

---

## Test 4: Database Check (30 seconds)

```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis \
  -c "SELECT pseudonym FROM users ORDER BY created_at DESC LIMIT 5;"
```

**Expected:** See list of unique pseudonyms

---

## ✅ Success Criteria

All these work:
- [ ] Home page has "Start Beta Testing" button
- [ ] Button navigates to `/identity` page
- [ ] Identity page renders completely (header, card, sections, footer)
- [ ] Component renders with purple gradient
- [ ] Pseudonym format: `Adjective-Animal-XXX`
- [ ] Refresh persists identity
- [ ] Change identity button works
- [ ] Navigation links work (logo, back to home)
- [ ] Technical details expand/collapse
- [ ] Cookie & localStorage set correctly
- [ ] API returns 201 on POST
- [ ] Database has user records

---

## 🐛 Quick Fixes

### Component doesn't appear
```bash
# Check for build errors
pnpm build
```

### No pseudonym shows
```bash
# Check API endpoint
curl http://localhost:4321/api/users/session
```

### Database connection error
```bash
# Restart PostgreSQL
docker compose restart postgres
```

---

## Next Steps

If smoke test passes:
1. ✅ Run full test plan: `TEST_PLAN_IDENTITY.md`
2. ✅ Commit changes to feature branch
3. ✅ Create PR for review
