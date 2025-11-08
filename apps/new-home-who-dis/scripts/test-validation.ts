/**
 * Test script for validation utilities
 * Run with: tsx scripts/test-validation.ts
 */

import {
  isValidWishlistType,
  isValidPriority,
  isValidCommitmentStatus,
  isValidSmokingSessionStatus,
  isValidReleaseType,
  validateWishlistType,
  validatePriority,
  validateCommitmentStatus,
  validatePrice,
  validateGiftData,
  ValidationError,
} from '../src/lib/validation'

let passed = 0
let failed = 0

function test(name: string, fn: () => void) {
  try {
    fn()
    console.log(`✅ ${name}`)
    passed++
  } catch (error) {
    console.error(`❌ ${name}`)
    console.error(`   ${error}`)
    failed++
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

function assertThrows(fn: () => void, expectedError: typeof ValidationError) {
  try {
    fn()
    throw new Error('Expected function to throw')
  } catch (error) {
    if (!(error instanceof expectedError)) {
      throw new Error(`Expected ${expectedError.name}, got ${error}`)
    }
  }
}

console.log('🧪 Running Validation Tests...\n')

// Wishlist Type Tests
test('isValidWishlistType: accepts "traditional"', () => {
  assert(isValidWishlistType('traditional'), 'Should return true')
})

test('isValidWishlistType: accepts "receipt"', () => {
  assert(isValidWishlistType('receipt'), 'Should return true')
})

test('isValidWishlistType: accepts "bandcamp"', () => {
  assert(isValidWishlistType('bandcamp'), 'Should return true')
})

test('isValidWishlistType: rejects "invalid"', () => {
  assert(!isValidWishlistType('invalid'), 'Should return false')
})

test('isValidWishlistType: rejects number', () => {
  assert(!isValidWishlistType(123), 'Should return false')
})

test('validateWishlistType: accepts valid type', () => {
  const result = validateWishlistType('traditional')
  assert(result === 'traditional', 'Should return the value')
})

test('validateWishlistType: throws on invalid type', () => {
  assertThrows(() => validateWishlistType('invalid'), ValidationError)
})

// Priority Tests
test('isValidPriority: accepts "essential"', () => {
  assert(isValidPriority('essential'), 'Should return true')
})

test('isValidPriority: accepts "nice-to-have"', () => {
  assert(isValidPriority('nice-to-have'), 'Should return true')
})

test('isValidPriority: accepts "luxury"', () => {
  assert(isValidPriority('luxury'), 'Should return true')
})

test('isValidPriority: accepts "digital"', () => {
  assert(isValidPriority('digital'), 'Should return true')
})

test('isValidPriority: rejects "super-high"', () => {
  assert(!isValidPriority('super-high'), 'Should return false')
})

test('validatePriority: throws on invalid priority', () => {
  assertThrows(() => validatePriority('super-high'), ValidationError)
})

// Commitment Status Tests
test('isValidCommitmentStatus: accepts "active"', () => {
  assert(isValidCommitmentStatus('active'), 'Should return true')
})

test('isValidCommitmentStatus: accepts "cancelled"', () => {
  assert(isValidCommitmentStatus('cancelled'), 'Should return true')
})

test('isValidCommitmentStatus: rejects "pending"', () => {
  assert(!isValidCommitmentStatus('pending'), 'Should return false')
})

test('validateCommitmentStatus: throws on invalid status', () => {
  assertThrows(() => validateCommitmentStatus('pending'), ValidationError)
})

// Smoking Session Status Tests
test('isValidSmokingSessionStatus: accepts "active"', () => {
  assert(isValidSmokingSessionStatus('active'), 'Should return true')
})

test('isValidSmokingSessionStatus: accepts "completed"', () => {
  assert(isValidSmokingSessionStatus('completed'), 'Should return true')
})

test('isValidSmokingSessionStatus: accepts "kicked"', () => {
  assert(isValidSmokingSessionStatus('kicked'), 'Should return true')
})

test('isValidSmokingSessionStatus: rejects "in-progress"', () => {
  assert(!isValidSmokingSessionStatus('in-progress'), 'Should return false')
})

// Release Type Tests
test('isValidReleaseType: accepts "album"', () => {
  assert(isValidReleaseType('album'), 'Should return true')
})

test('isValidReleaseType: accepts "track"', () => {
  assert(isValidReleaseType('track'), 'Should return true')
})

test('isValidReleaseType: accepts "ep"', () => {
  assert(isValidReleaseType('ep'), 'Should return true')
})

test('isValidReleaseType: rejects "single"', () => {
  assert(!isValidReleaseType('single'), 'Should return false')
})

// Price Validation Tests
test('validatePrice: accepts positive integer', () => {
  const result = validatePrice(10000)
  assert(result === 10000, 'Should return the value')
})

test('validatePrice: accepts zero', () => {
  const result = validatePrice(0)
  assert(result === 0, 'Should return zero')
})

test('validatePrice: throws on negative number', () => {
  assertThrows(() => validatePrice(-100), ValidationError)
})

test('validatePrice: throws on decimal', () => {
  assertThrows(() => validatePrice(123.45), ValidationError)
})

test('validatePrice: throws on string', () => {
  assertThrows(() => validatePrice('100'), ValidationError)
})

// Gift Data Validation Tests
test('validateGiftData: accepts valid traditional gift', () => {
  validateGiftData({
    wishlistType: 'traditional',
    priority: 'essential',
    estimatedPrice: 10000,
  })
})

test('validateGiftData: accepts valid bandcamp gift', () => {
  validateGiftData({
    wishlistType: 'bandcamp',
    priority: 'digital',
    estimatedPrice: 2500,
    releaseType: 'album',
  })
})

test('validateGiftData: throws on invalid wishlist type', () => {
  try {
    validateGiftData({
      wishlistType: 'invalid',
      priority: 'essential',
      estimatedPrice: 10000,
    })
    throw new Error('Should have thrown')
  } catch (error) {
    assert(Array.isArray(error), 'Should throw array of errors')
    assert(error.length > 0, 'Should have at least one error')
    assert(error[0] instanceof ValidationError, 'Should be ValidationError')
  }
})

test('validateGiftData: throws multiple errors for multiple invalid fields', () => {
  try {
    validateGiftData({
      wishlistType: 'invalid',
      priority: 'super-high',
      estimatedPrice: -100,
    })
    throw new Error('Should have thrown')
  } catch (error) {
    assert(Array.isArray(error), 'Should throw array of errors')
    assert(error.length === 3, 'Should have three errors')
  }
})

// ValidationError JSON serialization
test('ValidationError: toJSON includes all fields', () => {
  const error = new ValidationError(
    'Test error',
    'test_field',
    'invalid_value',
    ['valid1', 'valid2']
  )
  const json = error.toJSON()
  assert(json.error === 'ValidationError', 'Should have error type')
  assert(json.message === 'Test error', 'Should have message')
  assert(json.field === 'test_field', 'Should have field')
  assert(json.invalidValue === 'invalid_value', 'Should have invalid value')
  assert(Array.isArray(json.validValues), 'Should have valid values')
})

console.log('\n' + '='.repeat(50))
console.log(`✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log('='.repeat(50))

process.exit(failed > 0 ? 1 : 0)
