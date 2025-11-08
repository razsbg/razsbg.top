# Manual Test Plan: Anonymous Identity System

**Feature Branch:** `feature/anonymous-identity`  
**Date:** November 8, 2025  
**Tester:** _____________

---

## Prerequisites

### 1. Start Local Development Environment

```bash
cd /Users/razsbg/Work/razsbg.top/apps/new-home-who-dis

# Ensure PostgreSQL is running
docker compose up -d

# Start dev server
pnpm dev
```

**Expected:** Server starts on http://localhost:4321

---

## Test Suite 1: API Endpoint Testing

### Test 1.1: Create New User Session (POST)

**Purpose:** Verify new anonymous users can be created

**Steps:**
```bash
curl -i -X POST http://localhost:4321/api/users/session
```

**Expected Response:**
- ✅ Status: `201 Created`
- ✅ Contains `Set-Cookie` header with `gift_session_id`
- ✅ Response body:
  ```json
  {
    "success": true,
    "user": {
      "id": "...",
      "pseudonym": "Adjective-Animal-XXX",
      "sessionId": "session-...",
      "createdAt": "..."
    }
  }
  ```
- ✅ Pseudonym matches format: `[A-Z][a-z]+-[A-Z][a-z]+-\d{3}`
- ✅ Examples: `Skeptical-Platypus-742`, `Brave-Otter-123`

**Verify in Database:**
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis -c "SELECT id, pseudonym, session_id, created_at FROM users ORDER BY created_at DESC LIMIT 1;"
```

**Expected:** New user record exists with matching pseudonym

---

### Test 1.2: Get Existing Session (GET)

**Purpose:** Verify session retrieval works with cookies

**Steps:**
```bash
# Copy the Set-Cookie value from Test 1.1
# Example: gift_session_id=session-1731045600000-abc123def456

curl -i http://localhost:4321/api/users/session \
  -H "Cookie: gift_session_id=YOUR_SESSION_ID_HERE"
```

**Expected Response:**
- ✅ Status: `200 OK`
- ✅ Response body:
  ```json
  {
    "success": true,
    "user": {
      "id": "...",
      "pseudonym": "Same-As-Test-1.1",
      "sessionId": "...",
      "createdAt": "...",
      "lastActive": "..." // Updated to current time
    }
  }
  ```

**Verify Database Update:**
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis -c "SELECT pseudonym, last_active FROM users WHERE session_id = 'YOUR_SESSION_ID_HERE';"
```

**Expected:** `last_active` timestamp is recent

---

### Test 1.3: Get Session Without Cookie (GET)

**Purpose:** Verify graceful handling of missing session

**Steps:**
```bash
curl -i http://localhost:4321/api/users/session
```

**Expected Response:**
- ✅ Status: `200 OK`
- ✅ Response body:
  ```json
  {
    "success": true,
    "user": null
  }
  ```

---

### Test 1.4: Regenerate Pseudonym (PUT)

**Purpose:** Verify users can change their identity

**Steps:**
```bash
# Use the session cookie from Test 1.1
curl -i -X PUT http://localhost:4321/api/users/session \
  -H "Cookie: gift_session_id=YOUR_SESSION_ID_HERE"
```

**Expected Response:**
- ✅ Status: `200 OK`
- ✅ Response body:
  ```json
  {
    "success": true,
    "user": {
      "id": "SAME_ID_AS_BEFORE",
      "pseudonym": "DIFFERENT-Pseudonym-456", // Changed!
      "sessionId": "SAME_SESSION_ID",
      "createdAt": "SAME_AS_BEFORE",
      "lastActive": "..."
    }
  }
  ```
- ✅ Pseudonym is **different** from Test 1.1
- ✅ `id` and `sessionId` remain **the same**

**Verify in Database:**
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis -c "SELECT pseudonym FROM users WHERE session_id = 'YOUR_SESSION_ID_HERE';"
```

**Expected:** Pseudonym matches new value

---

### Test 1.5: Regenerate Without Session (PUT)

**Purpose:** Verify unauthorized access is blocked

**Steps:**
```bash
curl -i -X PUT http://localhost:4321/api/users/session
```

**Expected Response:**
- ✅ Status: `401 Unauthorized`
- ✅ Response body:
  ```json
  {
    "success": false,
    "error": "No active session found"
  }
  ```

---

## Test Suite 2: Component Integration Testing

### Test 2.1: Home Page Beta Button

**Purpose:** Verify beta testing button is visible and clickable

**Steps:**

1. Start dev server:
```bash
pnpm dev
```

2. Visit: http://localhost:4321/

**Expected:**
- ✅ After countdown timer, see prominent "Start Beta Testing" button
- ✅ Button has gradient colors (red → orange → teal)
- ✅ Button has emojis: 🧪 and 🚀
- ✅ Button text pulses
- ✅ Hover effect: button scales up and moves up slightly
- ✅ Below button: descriptive text about anonymous identity system

**Click the button:**
- ✅ Navigates to `/identity` page
- ✅ No console errors

---

### Test 2.2: Identity Page Structure

**Purpose:** Verify the dedicated identity page renders correctly

**Steps:**

1. Visit: http://localhost:4321/identity (or click beta button from home)

**Expected Page Structure:**

- ✅ **Header:**
  - Logo (clickable, links back to home)
  - Title: "🎭 Your Party Identity"
  - Subtitle explaining anonymous system

- ✅ **Identity Card Section:**
  - Purple gradient IdentityCard component
  - Shows pseudonym or loading state
  - "🔄 Change Identity" button

- ✅ **How It Works Section:**
  - 3 step cards in grid layout:
    1. "Get Assigned" (dice emoji)
    2. "Stay Anonymous" (save emoji)
    3. "Commit Gifts" (gift emoji)
  - "Fun Facts" box with 4 bullet points

- ✅ **Technical Details Section:**
  - Collapsible `<details>` element
  - Closed by default
  - Click to expand → shows API endpoints, storage details, privacy info

- ✅ **Navigation:**
  - "🏠 Back to Home" link

- ✅ **Footer:**
  - Credits and tech stack mention

---

### Test 2.3: Visual Inspection

**Purpose:** Verify UI renders correctly on identity page

**Checklist:**

- ✅ **Loading State** (appears briefly on first load):
  - Spinning hourglass emoji ⏳
  - Text: "Loading your identity..."
  - Purple gradient background

- ✅ **Identity Display** (after loading):
  - Purple gradient card with rounded corners
  - Label: "YOU ARE:" (uppercase, small)
  - Pseudonym in large text (format: `Adjective-Animal-XXX`)
  - Button: "🔄 Change Identity"
  - Button has hover effect (lighter background, moves up slightly)

- ✅ **Responsive Design**:
  - On mobile (<640px): Pseudonym text is smaller
  - On desktop (≥640px): Pseudonym text is larger

- ✅ **Error State** (if API fails - can simulate by stopping server):
  - Red-tinted error box above card
  - Warning icon ⚠️ with error message

---

### Test 2.4: Functional Testing

**Purpose:** Verify component behavior

#### Test 2.4.1: First Visit (No Session)

**Steps:**
1. Open http://localhost:4321/test-identity in **Incognito/Private window**
2. Open DevTools → Network tab
3. Refresh the page

**Expected:**
- ✅ See POST request to `/api/users/session` (Status: 201)
- ✅ Pseudonym appears after ~1 second
- ✅ Example: `Curious-Dolphin-891`

**DevTools Check:**
- ✅ **Application → Cookies**:
  - Cookie `gift_session_id` exists
  - Path: `/`
  - HttpOnly: ✓
  - SameSite: `Strict`
  - Expires: ~7 days from now

- ✅ **Application → Local Storage**:
  - Key: `gift_user`
  - Value: JSON object with `id`, `pseudonym`, `sessionId`, `createdAt`

---

#### Test 2.4.2: Page Refresh (Session Persistence)

**Steps:**
1. Note your current pseudonym
2. Refresh the page (F5 or Cmd+R)
3. Watch Network tab

**Expected:**
- ✅ See GET request to `/api/users/session` (Status: 200)
- ✅ **Same pseudonym appears** (no change)
- ✅ No POST request (session already exists)
- ✅ Load time is faster (~500ms vs 1s)

---

#### Test 2.4.3: Change Identity

**Steps:**
1. Note your current pseudonym (e.g., `Brave-Wolf-234`)
2. Click "🔄 Change Identity" button
3. Confirm the browser dialog

**Expected:**
- ✅ Browser confirmation dialog appears:
  - Message: "Generate a new pseudonym? Your current one will be lost."
  - Buttons: OK / Cancel
  
- ✅ After clicking OK:
  - See PUT request to `/api/users/session` in Network tab (Status: 200)
  - **Pseudonym changes** to a different value (e.g., `Jolly-Fox-789`)
  - Change happens smoothly (no page reload)
  
- ✅ LocalStorage updates:
  - Check `gift_user` key - pseudonym value should match new one

---

#### Test 2.4.4: Cancel Identity Change

**Steps:**
1. Note your current pseudonym
2. Click "🔄 Change Identity" button
3. Click **Cancel** in the confirmation dialog

**Expected:**
- ✅ No network request is made
- ✅ Pseudonym **does not change**
- ✅ No visual feedback (button returns to normal state)

---

#### Test 2.4.5: Multiple Identity Changes

**Steps:**
1. Click "🔄 Change Identity" → Confirm
2. Wait for new pseudonym to appear
3. Repeat 3-5 times

**Expected:**
- ✅ Each click generates a **different** pseudonym
- ✅ No duplicates (very unlikely with 25×25×1000 = 625,000 combinations)
- ✅ Each change updates localStorage
- ✅ Session ID remains the same (check DevTools)

---

### Test 2.5: Technical Details Interaction

**Purpose:** Verify collapsible section works

**Steps:**

1. Visit: http://localhost:4321/identity
2. Scroll down to "🔧 Technical Details (for the nerds)" section
3. Click on the section header

**Expected:**
- ✅ Section expands smoothly
- ✅ Arrow icon rotates 90 degrees
- ✅ Shows 4 subsections:
  1. Pseudonym Format (with code examples)
  2. Storage (cookie + localStorage details)
  3. Privacy (4 bullet points)
  4. API Endpoints (3 endpoints listed)
- ✅ Click again → section collapses

---

### Test 2.6: Navigation Flow

**Purpose:** Verify navigation between pages works

**Steps:**

1. Start at home: http://localhost:4321/
2. Click "Start Beta Testing" button
3. Arrives at `/identity` page
4. Click logo in header
5. Returns to home page
6. Go back to `/identity` 
7. Click "🏠 Back to Home" link at bottom
8. Returns to home page

**Expected:**
- ✅ All navigation links work
- ✅ No broken links
- ✅ Identity persists across navigations
- ✅ Browser back button works correctly

---

### Test 2.7: Cross-Tab Synchronization

**Purpose:** Verify behavior with multiple browser tabs

**Steps:**
1. Open http://localhost:4321/test-identity in Tab 1
2. Note the pseudonym (e.g., `Swift-Hawk-456`)
3. Open http://localhost:4321/test-identity in **new tab** (Tab 2)
4. Note the pseudonym in Tab 2

**Expected:**
- ✅ Tab 2 shows **same pseudonym** as Tab 1
- ✅ Both tabs share the same cookie
- ✅ Both tabs share the same localStorage value

**Test Synchronization:**
1. In Tab 2, click "🔄 Change Identity" → Confirm
2. New pseudonym appears in Tab 2 (e.g., `Bold-Eagle-789`)
3. Switch to Tab 1 and refresh

**Expected:**
- ✅ Tab 1 now shows the **new pseudonym** from Tab 2
- ✅ LocalStorage is shared across tabs

---

### Test 2.8: Session Expiry

**Purpose:** Verify behavior when cookie expires

**Steps:**
1. Open DevTools → Application → Cookies
2. Delete the `gift_session_id` cookie manually
3. Keep the page open (don't refresh yet)
4. Click "🔄 Change Identity" → Confirm

**Expected:**
- ✅ Error message appears: "No active session found" or similar
- ✅ API returns 401 Unauthorized
- ✅ Pseudonym remains visible (from localStorage)

**Steps (continued):**
5. Refresh the page

**Expected:**
- ✅ POST request creates a new session
- ✅ **New pseudonym** appears (different from before)
- ✅ New cookie is set

---

## Test Suite 3: Database Validation

### Test 3.1: User Creation

**Purpose:** Verify database records are correct

**Steps:**
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis -c "
SELECT 
  id,
  pseudonym,
  session_id,
  ip_hash,
  created_at,
  last_active
FROM users 
ORDER BY created_at DESC 
LIMIT 5;
"
```

**Expected:**
- ✅ At least 1 user record exists
- ✅ `pseudonym` matches format: `Adjective-Animal-XXX`
- ✅ `session_id` starts with `session-`
- ✅ `ip_hash` is a hexadecimal string
- ✅ `created_at` is a recent timestamp
- ✅ `last_active` is updated (≥ `created_at`)

---

### Test 3.2: Pseudonym Uniqueness

**Purpose:** Verify no duplicate pseudonyms exist

**Steps:**
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis -c "
SELECT pseudonym, COUNT(*) as count 
FROM users 
GROUP BY pseudonym 
HAVING COUNT(*) > 1;
"
```

**Expected:**
- ✅ Query returns **0 rows** (no duplicates)

---

### Test 3.3: Session ID Uniqueness

**Purpose:** Verify no duplicate session IDs exist

**Steps:**
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis -c "
SELECT session_id, COUNT(*) as count 
FROM users 
GROUP BY session_id 
HAVING COUNT(*) > 1;
"
```

**Expected:**
- ✅ Query returns **0 rows** (no duplicates)

---

## Test Suite 4: Identity Protection (Commitments)

### Test 4.1: Prevent Regeneration After Commitment

**Purpose:** Verify users cannot change identity after committing to gifts

**Steps:**

1. Create a test user with a commitment:
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis << 'EOF'
-- Create test user
INSERT INTO users (pseudonym, session_id, ip_hash)
VALUES ('Locked-User-999', 'session-test-locked-999', 'testhash999')
RETURNING id;

-- Note the returned ID, then create a commitment
-- Replace 'USER_ID_HERE' with the actual UUID
INSERT INTO commitments (user_id, gift_id, status)
VALUES ('USER_ID_HERE', 'trad-001', 'committed');
EOF
```

2. Get the session cookie:
```bash
# The session_id is: session-test-locked-999
```

3. Try to regenerate pseudonym:
```bash
curl -i -X PUT http://localhost:4321/api/users/session \
  -H "Cookie: gift_session_id=session-test-locked-999"
```

**Expected Response:**
- ✅ Status: `403 Forbidden`
- ✅ Response body:
  ```json
  {
    "success": false,
    "error": "Cannot change identity after committing to gifts",
    "reason": "commitment_exists"
  }
  ```

**Verify in Database:**
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis \
  -c "SELECT pseudonym FROM users WHERE session_id = 'session-test-locked-999';"
```

**Expected:**
- ✅ Pseudonym is still `Locked-User-999` (unchanged)

---

### Test 4.2: UI Shows Error for Locked Identity

**Purpose:** Verify UI handles the locked identity error gracefully

**Setup:**
Using the same test user from Test 4.1

**Steps:**

1. Open browser and manually add the cookie:
   - Open DevTools → Application → Cookies
   - Add cookie: `gift_session_id` = `session-test-locked-999`
   - Refresh the page

2. Visit: http://localhost:4321/identity

3. Click "🔄 Change Identity" → Confirm

**Expected:**
- ✅ Red error box appears below identity card
- ✅ Message: "⚠️ 🔒 You cannot change your identity after committing to gifts. Your pseudonym is now permanent!"
- ✅ Pseudonym remains unchanged in display
- ✅ Button re-enables after error

---

### Test 4.3: Warning Message Visible

**Purpose:** Verify users are warned about permanence

**Steps:**

1. Visit: http://localhost:4321/identity
2. Scroll to "Fun Facts" section

**Expected:**
- ✅ Fifth bullet point visible
- ✅ Text: "🔒 Important: Once you commit to a gift, your pseudonym becomes permanent!"
- ✅ Text highlighted in brand color
- ✅ Lock emoji 🔒 used as bullet

---

### Test 4.4: Fresh User Can Still Change

**Purpose:** Verify new users without commitments can still change identity

**Steps:**

1. Open http://localhost:4321/identity in **Incognito window**
2. Note the assigned pseudonym (e.g., "Fresh-User-123")
3. Click "🔄 Change Identity" → Confirm
4. Note the new pseudonym (e.g., "New-User-456")

**Expected:**
- ✅ Change succeeds (HTTP 200)
- ✅ Pseudonym updates in display
- ✅ No error message shown

**Verify no commitment:**
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis -c "
SELECT u.pseudonym, COUNT(c.id) as commitment_count
FROM users u
LEFT JOIN commitments c ON u.id = c.user_id
WHERE u.pseudonym LIKE 'New-User-%'
GROUP BY u.pseudonym;
"
```

**Expected:**
- ✅ `commitment_count` = 0

---

## Test Suite 5: Edge Cases & Error Handling

### Test 5.1: Network Failure Simulation

**Purpose:** Verify graceful degradation

**Steps:**
1. Open http://localhost:4321/test-identity
2. Wait for pseudonym to load
3. Stop the dev server: `Ctrl+C` in terminal
4. Click "🔄 Change Identity" → Confirm
5. Wait 10 seconds

**Expected:**
- ✅ Error message appears in the card
- ✅ Text: "Failed to regenerate pseudonym" or network error
- ✅ Pseudonym remains visible (old value from localStorage)
- ✅ Button becomes clickable again after error

**Recovery:**
1. Start dev server: `pnpm dev`
2. Refresh the page

**Expected:**
- ✅ Page loads successfully
- ✅ Session is restored from cookie
- ✅ Pseudonym displays correctly

---

### Test 5.2: Concurrent Requests

**Purpose:** Verify race conditions are handled

**Steps:**
```bash
# Create 10 users simultaneously
for i in {1..10}; do
  curl -s -X POST http://localhost:4321/api/users/session &
done
wait
```

**Expected:**
- ✅ All 10 requests succeed (Status: 201)
- ✅ All pseudonyms are unique

**Verify in Database:**
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis -c "
SELECT COUNT(*) as total_users, COUNT(DISTINCT pseudonym) as unique_pseudonyms 
FROM users;
"
```

**Expected:**
- ✅ `total_users` = `unique_pseudonyms` (no duplicates)

---

### Test 5.3: Invalid Session ID

**Purpose:** Verify invalid sessions are rejected

**Steps:**
```bash
curl -i http://localhost:4321/api/users/session \
  -H "Cookie: gift_session_id=invalid-session-12345"
```

**Expected:**
- ✅ Status: `200 OK`
- ✅ Response:
  ```json
  {
    "success": true,
    "user": null
  }
  ```

---

### Test 5.4: SQL Injection Attempt

**Purpose:** Verify input is sanitized

**Steps:**
```bash
curl -i http://localhost:4321/api/users/session \
  -H "Cookie: gift_session_id=session-'; DROP TABLE users; --"
```

**Expected:**
- ✅ No SQL injection occurs
- ✅ Database remains intact
- ✅ Response: `user: null`

**Verify Database:**
```bash
docker exec -it new-home-who-dis-postgres-1 psql -U postgres -d new_home_who_dis -c "\dt"
```

**Expected:**
- ✅ All tables still exist (users, gifts, commitments, etc.)

---

## Test Suite 6: Browser Compatibility

### Test 6.1: Desktop Browsers

**Test in each browser:**
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on macOS)

**For each browser:**
1. Visit http://localhost:4321/test-identity
2. Verify component renders correctly
3. Create identity → works
4. Change identity → works
5. Refresh → persists
6. Check DevTools → cookie & localStorage present

---

### Test 6.2: Mobile Browsers (Optional)

**Test on actual device or emulator:**
- ✅ iOS Safari
- ✅ Android Chrome

**Checklist:**
- Component fits screen (responsive)
- Button is tappable (large enough)
- Confirmation dialog works
- Session persists

---

## Test Suite 7: Performance & UX

### Test 7.1: Load Time

**Purpose:** Verify acceptable performance

**Steps:**
1. Open DevTools → Network tab (throttle to "Fast 3G")
2. Visit http://localhost:4321/test-identity
3. Measure time to interactive

**Expected:**
- ✅ Loading state appears within **500ms**
- ✅ Pseudonym appears within **2 seconds** (on throttled network)
- ✅ No console errors

---

### Test 7.2: Button Disabled State

**Purpose:** Verify button prevents double-clicks

**Steps:**
1. Open component
2. Click "🔄 Change Identity" → Confirm
3. **Immediately** try to click the button again (before response)

**Expected:**
- ✅ Button becomes **disabled** during API request
- ✅ Button shows reduced opacity (50%)
- ✅ Cursor changes to `not-allowed`
- ✅ Second click does nothing
- ✅ Button re-enables after response

---

## Summary Checklist

### API Endpoints
- ✅ POST /api/users/session creates new users
- ✅ GET /api/users/session retrieves existing sessions
- ✅ PUT /api/users/session regenerates pseudonyms (if no commitments)
- ✅ PUT returns 403 when user has commitments
- ✅ Error handling works (401, 403, 404, 500)
- ✅ Cookies are set correctly (HttpOnly, SameSite, 7-day expiry)

### Component
- ✅ Renders correctly (loading, identity, error states)
- ✅ Creates identity on first visit (SSR)
- ✅ Persists identity across refreshes
- ✅ Allows identity regeneration with confirmation (if no commitments)
- ✅ Shows friendly error when identity is locked
- ✅ Warning message visible about permanence
- ✅ Responsive design works

### Database
- ✅ Users created with unique pseudonyms
- ✅ Session IDs are unique
- ✅ Timestamps update correctly
- ✅ No duplicates or data corruption

### Edge Cases
- ✅ Network failures handled gracefully
- ✅ Invalid sessions rejected
- ✅ SQL injection prevented
- ✅ Concurrent requests don't cause duplicates
- ✅ Identity locked after commitments
- ✅ Fresh users can still change identity

### Browser Compatibility
- ✅ Works in Chrome/Firefox/Safari
- ✅ Mobile browsers supported
- ✅ Cross-tab synchronization works

---

## Sign-Off

**Tester Name:** _____________  
**Date:** _____________  
**Result:** ✅ PASS / ❌ FAIL  
**Notes:**

_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

**Bugs Found:** (list any issues discovered)

_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
