# Application-Level Validation

## Overview

Since Drizzle ORM doesn't generate CHECK constraints from the schema, we implement application-level validation to enforce data integrity constraints.

## Why Application-Level Validation?

**Problem:** Drizzle-generated migrations don't include CHECK constraints, allowing invalid data like:
- `wishlist_type = 'invalid'` (should only be 'traditional', 'receipt', 'bandcamp')
- `priority = 'super-high'` (should only be 'essential', 'nice-to-have', 'luxury', 'digital')
- `status = 'pending'` (should only be 'active', 'cancelled')

**Solution:** Runtime validation using TypeScript type guards and validation functions.

---

## Validation Utilities (`src/lib/validation.ts`)

### Exported Types

```typescript
type WishlistType = 'traditional' | 'receipt' | 'bandcamp'
type Priority = 'essential' | 'nice-to-have' | 'luxury' | 'digital'
type CommitmentStatus = 'active' | 'cancelled'
type SmokingSessionStatus = 'active' | 'completed' | 'kicked'
type ReleaseType = 'album' | 'track' | 'ep'
```

### Type Guards (Boolean Checks)

```typescript
// Returns true/false without throwing
isValidWishlistType(value: unknown): boolean
isValidPriority(value: unknown): boolean
isValidCommitmentStatus(value: unknown): boolean
isValidSmokingSessionStatus(value: unknown): boolean
isValidReleaseType(value: unknown): boolean
```

**Usage Example:**
```typescript
const type = request.query.type
if (isValidWishlistType(type)) {
  // type is now typed as WishlistType
  query = query.where(eq(gifts.wishlistType, type))
}
```

### Validation Functions (Throws on Invalid)

```typescript
// Throws ValidationError if invalid, returns value if valid
validateWishlistType(value: unknown): WishlistType
validatePriority(value: unknown): Priority
validateCommitmentStatus(value: unknown): CommitmentStatus
validateSmokingSessionStatus(value: unknown): SmokingSessionStatus
validateReleaseType(value: unknown): ReleaseType
validatePrice(value: unknown): number
```

**Usage Example:**
```typescript
try {
  const validType = validateWishlistType(userInput)
  // Use validType safely
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
    return { error: error.toJSON() }
  }
}
```

### Composite Validation

```typescript
validateGiftData(data: {
  wishlistType: unknown
  priority: unknown
  estimatedPrice: unknown
  releaseType?: unknown
}): void
```

Validates multiple fields at once. Throws an array of ValidationErrors if any field is invalid.

**Usage Example:**
```typescript
try {
  validateGiftData({
    wishlistType: 'traditional',
    priority: 'essential',
    estimatedPrice: 10000,
  })
  // All fields are valid
} catch (errors) {
  // errors is ValidationError[]
  errors.forEach(err => console.error(err.toJSON()))
}
```

---

## ValidationError Class

Custom error class with rich error information:

```typescript
class ValidationError extends Error {
  field: string          // Field that failed validation
  invalidValue: unknown  // The invalid value that was provided
  validValues?: string[] // Array of valid values (if applicable)
  
  toJSON() {
    return {
      error: 'ValidationError',
      message: this.message,
      field: this.field,
      invalidValue: this.invalidValue,
      validValues: this.validValues,
    }
  }
}
```

**Example Error Response:**
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Invalid wishlist type: \"invalid\". Must be one of: traditional, receipt, bandcamp",
  "field": "type",
  "invalidValue": "invalid",
  "validValues": ["traditional", "receipt", "bandcamp"]
}
```

---

## API Endpoint Integration

### Example: `/api/gifts` Endpoint

```typescript
import { isValidWishlistType, ValidationError } from "../../lib/validation"

export const GET: APIRoute = async ({ url }) => {
  try {
    const wishlistType = url.searchParams.get("type")
    
    if (wishlistType) {
      // Validate before using
      if (!isValidWishlistType(wishlistType)) {
        throw new ValidationError(
          `Invalid wishlist type: "${wishlistType}"`,
          "type",
          wishlistType,
          ["traditional", "receipt", "bandcamp"]
        )
      }
      // Now safe to use
      query = query.where(eq(gifts.wishlistType, wishlistType))
    }
    
    // ... rest of endpoint logic
  } catch (error) {
    // Handle ValidationError with 400 status
    if (error instanceof ValidationError) {
      return new Response(
        JSON.stringify({ success: false, ...error.toJSON() }),
        { status: 400 }
      )
    }
    // Other errors with 500 status
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    )
  }
}
```

---

## Testing

### Run Validation Tests

```bash
pnpm test:validation
```

**Test Coverage:**
- ✅ Type guard functions (isValid*)
- ✅ Validation functions (validate*)
- ✅ ValidationError serialization
- ✅ Composite validation (validateGiftData)
- ✅ Edge cases (negative prices, decimals, wrong types)

**Test Results:**
```
✅ Passed: 35
❌ Failed: 0
```

### Manual API Testing

**Test invalid wishlist type:**
```bash
curl "http://localhost:4321/api/gifts?type=invalid"
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Invalid wishlist type: \"invalid\". Must be one of: traditional, receipt, bandcamp",
  "field": "type",
  "invalidValue": "invalid",
  "validValues": ["traditional", "receipt", "bandcamp"]
}
```

**Test valid wishlist type:**
```bash
curl "http://localhost:4321/api/gifts?type=traditional"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 49,
  "gifts": [...]
}
```

---

## Validation Rules Reference

### Wishlist Type
**Valid Values:** `'traditional' | 'receipt' | 'bandcamp'`
- `traditional`: Physical gifts (spirits, kitchen, decor)
- `receipt`: Already purchased, needs reimbursement
- `bandcamp`: Digital music purchases

### Priority
**Valid Values:** `'essential' | 'nice-to-have' | 'luxury' | 'digital'`
- `essential`: Must-have items
- `nice-to-have`: Desired but not critical
- `luxury`: High-value aspirational items
- `digital`: Digital/intangible items (usually bandcamp)

### Commitment Status
**Valid Values:** `'active' | 'cancelled'`
- `active`: Gift commitment is current
- `cancelled`: Gift commitment was cancelled

### Smoking Session Status
**Valid Values:** `'active' | 'completed' | 'kicked'`
- `active`: Currently smoking on balcony
- `completed`: Session ended normally
- `kicked`: Removed due to timeout/tier priority

### Release Type (Bandcamp)
**Valid Values:** `'album' | 'track' | 'ep'`
- `album`: Full album release
- `track`: Single track
- `ep`: Extended play (mini-album)

### Price (Estimated Price)
**Rules:**
- Must be an integer (no decimals)
- Must be >= 0
- Stored in **bani** (Lei × 100)
  - Example: 121.83 Lei = 12183 bani

---

## Best Practices

### 1. Always Validate User Input

```typescript
// ❌ BAD: Direct use without validation
const type = request.query.type
query = query.where(eq(gifts.wishlistType, type)) // Could be anything!

// ✅ GOOD: Validate first
const type = request.query.type
if (isValidWishlistType(type)) {
  query = query.where(eq(gifts.wishlistType, type))
}
```

### 2. Use Type Guards for Optional Filters

```typescript
// When user input is optional
if (wishlistType && isValidWishlistType(wishlistType)) {
  // Only filter if provided and valid
  query = query.where(eq(gifts.wishlistType, wishlistType))
}
```

### 3. Use Validation Functions for Required Fields

```typescript
// When field is required (like POST body)
try {
  const validPriority = validatePriority(body.priority)
  const validPrice = validatePrice(body.estimatedPrice)
  // Use validated values
} catch (error) {
  return validationErrorResponse(error)
}
```

### 4. Return Proper HTTP Status Codes

```typescript
if (error instanceof ValidationError) {
  return new Response(JSON.stringify(error.toJSON()), { 
    status: 400 // Bad Request for validation errors
  })
}
// Other errors use 500
```

### 5. Test Validation in All Endpoints

Every endpoint that accepts user input should:
1. Validate input values
2. Return 400 for validation errors
3. Include helpful error messages
4. List valid values when applicable

---

## Adding New Validation Rules

### Step 1: Add Type Definition

```typescript
// In src/lib/validation.ts
export const NEW_VALUES = ['value1', 'value2', 'value3'] as const
export type NewType = typeof NEW_VALUES[number]
```

### Step 2: Add Type Guard

```typescript
export function isValidNewType(value: unknown): value is NewType {
  return typeof value === 'string' && NEW_VALUES.includes(value as NewType)
}
```

### Step 3: Add Validation Function

```typescript
export function validateNewType(value: unknown, field: string = 'new_field'): NewType {
  if (!isValidNewType(value)) {
    throw new ValidationError(
      `Invalid new field: "${value}". Must be one of: ${NEW_VALUES.join(', ')}`,
      field,
      value,
      NEW_VALUES
    )
  }
  return value
}
```

### Step 4: Add Tests

```typescript
// In scripts/test-validation.ts
test('isValidNewType: accepts "value1"', () => {
  assert(isValidNewType('value1'), 'Should return true')
})

test('isValidNewType: rejects "invalid"', () => {
  assert(!isValidNewType('invalid'), 'Should return false')
})

test('validateNewType: throws on invalid value', () => {
  assertThrows(() => validateNewType('invalid'), ValidationError)
})
```

### Step 5: Use in API Endpoints

```typescript
import { isValidNewType, ValidationError } from "../../lib/validation"

// Use in endpoint
if (newField && !isValidNewType(newField)) {
  throw new ValidationError(...)
}
```

---

## Migration Path for Future CHECK Constraints

If you later want to add actual database CHECK constraints:

### Option 1: Manual SQL Migration

Create `drizzle/YYYYMMDDHHMMSS_add_check_constraints.sql`:

```sql
ALTER TABLE gifts
ADD CONSTRAINT chk_gifts_wishlist_type 
CHECK (wishlist_type IN ('traditional', 'receipt', 'bandcamp'));

ALTER TABLE gifts
ADD CONSTRAINT chk_gifts_priority
CHECK (priority IN ('essential', 'nice-to-have', 'luxury', 'digital'));

ALTER TABLE commitments
ADD CONSTRAINT chk_commitments_status
CHECK (status IN ('active', 'cancelled'));
```

### Option 2: Use Different ORM

Consider migrating to an ORM that supports CHECK constraints if this becomes critical.

### Option 3: Database-Level Enforcement

Use database triggers or custom types (PostgreSQL ENUMs).

**Note:** Application-level validation is sufficient for this project's scope and provides better error messages to users.

---

## Summary

✅ **Validation is working correctly**
- All 35 validation tests passing
- API endpoints properly validated
- Helpful error messages for invalid input
- Type-safe with TypeScript

✅ **Coverage Complete**
- Wishlist types
- Priority values
- Commitment statuses
- Smoking session statuses
- Release types
- Price validation

✅ **Testing Available**
- Automated test suite: `pnpm test:validation`
- Manual API testing documented
- Integration tests pass

**Status:** ✅ Non-critical finding resolved with application-level validation
