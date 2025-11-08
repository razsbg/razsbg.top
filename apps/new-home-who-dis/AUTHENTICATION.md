# Authentication for Protected Routes

## Overview

The `/test-db` route is now protected with HTTP Basic Authentication to prevent guests from seeing database internals and test information.

---

## How It Works

### HTTP Basic Auth
When you visit `/test-db`, your browser will prompt for credentials:
- **Username:** Can be anything (e.g., "admin", "test", etc.)
- **Password:** `super-secret-password1`

The password is stored in the `TEST_PASSWORD` environment variable for security.

---

## Accessing Protected Routes

### Browser Access

1. Visit: `https://party.razsbg.top/test-db`
2. Browser shows login prompt
3. Enter any username (e.g., "admin")
4. Enter password: `super-secret-password1`
5. Browser saves credentials for the session

### Command Line (curl)

```bash
# With basic auth
curl -u "admin:super-secret-password1" https://party.razsbg.top/test-db

# Or with encoded header
curl -H "Authorization: Basic YWRtaW46c3VwZXItc2VjcmV0LXBhc3N3b3JkMQ==" https://party.razsbg.top/test-db
```

### Programmatic Access (JavaScript)

```javascript
// Using fetch with basic auth
const response = await fetch('https://party.razsbg.top/test-db', {
  headers: {
    'Authorization': 'Basic ' + btoa('admin:super-secret-password1')
  }
})
```

---

## Protected Routes

Currently protected:
- ✅ `/test-db` - Database connection test page

Not protected (public):
- `/` - Homepage
- `/api/gifts` - Public API endpoint (needed for guests)
- `/api/gifts?type=traditional` - Public filtered API

---

## Implementation Details

### Authentication Utility (`src/lib/auth.ts`)

```typescript
// Check HTTP Basic Auth
checkBasicAuth(request: Request): boolean

// Create 401 Unauthorized response
createUnauthorizedResponse(realm: string): Response

// Alternative: Check query parameter (not currently used)
checkQueryAuth(url: URL): boolean
```

### Usage in Pages

```astro
---
import { checkBasicAuth, createUnauthorizedResponse } from "../lib/auth"

// Check authentication first
if (!checkBasicAuth(Astro.request)) {
  return createUnauthorizedResponse('Protected Area')
}

// Rest of page logic...
---
```

---

## Environment Variables

### Local Development (.env)
```bash
TEST_PASSWORD=super-secret-password1
```

### Production (Railway)
```bash
railway variables --set "TEST_PASSWORD=super-secret-password1"
```

**Current Railway variables:**
- ✅ `TEST_PASSWORD` → super-secret-password1
- ✅ `NODE_ENV` → production
- ✅ `PARTY_DATE` → 2025-11-08T16:00:00+02:00
- ✅ `REVOLUT_USERNAME` → razsbg
- ✅ `DATABASE_URL` → (reference to Postgres)

---

## Security Considerations

### What's Protected
✅ Database test information  
✅ Gift counts and statistics  
✅ Internal API endpoint links  
✅ Next steps and deployment info  

### What Users See
When accessing `/test-db` without credentials:
- Browser login prompt
- "Unauthorized" message
- No information leaked

### Password Security
- ✅ Stored in environment variables (not in code)
- ✅ Never committed to git (.env is gitignored)
- ✅ Different from any user-facing passwords
- ✅ Only needed for admin/test access

### Limitations
⚠️ HTTP Basic Auth considerations:
- Password is base64 encoded (not encrypted) in transit
- Only secure over HTTPS (we use HTTPS via Railway)
- Browser caches credentials for the session
- Not suitable for user authentication (only admin access)

---

## Testing

### Test Without Credentials (Should Fail)
```bash
curl http://localhost:4321/test-db
# Expected: "Unauthorized"
```

### Test With Correct Credentials (Should Work)
```bash
curl -u "admin:super-secret-password1" http://localhost:4321/test-db
# Expected: Full HTML page with database stats
```

### Test With Wrong Credentials (Should Fail)
```bash
curl -u "admin:wrong-password" http://localhost:4321/test-db
# Expected: "Unauthorized"
```

### Browser Test
1. Open: http://localhost:4321/test-db
2. Enter username: `admin`
3. Enter password: `super-secret-password1`
4. See database stats page

---

## Adding Protection to Other Routes

To protect additional routes, use the same pattern:

```astro
---
import { checkBasicAuth, createUnauthorizedResponse } from "../lib/auth"

if (!checkBasicAuth(Astro.request)) {
  return createUnauthorizedResponse('Admin Area')
}

// Your protected route logic
---
```

Example routes you might want to protect later:
- `/admin` - Admin dashboard
- `/debug` - Debug information
- `/logs` - Application logs
- `/stats` - Usage statistics

---

## Changing the Password

### Local Development
1. Update `.env`:
   ```bash
   TEST_PASSWORD=new-password-here
   ```
2. Restart dev server

### Production (Railway)
```bash
railway variables --set "TEST_PASSWORD=new-password-here"
```

Railway will automatically redeploy with the new password.

---

## Alternative: Query Parameter Auth

The utility also supports query parameter authentication (currently not used):

```typescript
// In src/lib/auth.ts
checkQueryAuth(url: URL): boolean
```

**Usage example:**
```
https://party.razsbg.top/test-db?password=super-secret-password1
```

**Not recommended because:**
- ❌ Password visible in URL
- ❌ Logged in browser history
- ❌ Appears in server logs
- ❌ Can be accidentally shared

HTTP Basic Auth is more secure and provides better UX.

---

## Troubleshooting

### "Unauthorized" even with correct password

**Check:**
1. Password matches environment variable
   ```bash
   echo $TEST_PASSWORD  # Local
   railway variables | grep TEST_PASSWORD  # Production
   ```

2. Environment variable is loaded
   ```bash
   # In auth.ts, add debug log:
   console.log('Expected password:', import.meta.env.TEST_PASSWORD)
   ```

3. Browser hasn't cached wrong credentials
   - Clear browser auth cache
   - Use incognito/private window
   - Try different browser

### Browser doesn't show login prompt

**Check:**
1. Response has `WWW-Authenticate` header
2. Status code is 401 (not 403)
3. Check browser console for errors

### Password not working in production

**Verify Railway variable is set:**
```bash
railway variables | grep TEST_PASSWORD
```

**Set it if missing:**
```bash
railway variables --set "TEST_PASSWORD=super-secret-password1"
```

---

## Summary

✅ **Protected:** `/test-db` route requires password  
✅ **Password:** `super-secret-password1`  
✅ **Method:** HTTP Basic Authentication  
✅ **Security:** Stored in environment variables  
✅ **Production:** Railway variable set  
✅ **Testing:** All tests passing  

Guests can't access test information, but you can easily access it with the password when needed for debugging or verification.
