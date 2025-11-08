/**
 * Validation utilities for database constraints
 * Provides runtime validation that mimics CHECK constraints
 */

// Valid values for wishlist_type
export const WISHLIST_TYPES = ['traditional', 'receipt', 'bandcamp'] as const
export type WishlistType = typeof WISHLIST_TYPES[number]

// Valid values for priority
export const PRIORITY_VALUES = ['essential', 'nice-to-have', 'luxury', 'digital'] as const
export type Priority = typeof PRIORITY_VALUES[number]

// Valid values for commitment status
export const COMMITMENT_STATUSES = ['active', 'cancelled'] as const
export type CommitmentStatus = typeof COMMITMENT_STATUSES[number]

// Valid values for smoking session status
export const SMOKING_SESSION_STATUSES = ['active', 'completed', 'kicked'] as const
export type SmokingSessionStatus = typeof SMOKING_SESSION_STATUSES[number]

// Valid values for release type
export const RELEASE_TYPES = ['album', 'track', 'ep'] as const
export type ReleaseType = typeof RELEASE_TYPES[number]

/**
 * Type guard for wishlist type
 */
export function isValidWishlistType(value: unknown): value is WishlistType {
  return typeof value === 'string' && WISHLIST_TYPES.includes(value as WishlistType)
}

/**
 * Type guard for priority
 */
export function isValidPriority(value: unknown): value is Priority {
  return typeof value === 'string' && PRIORITY_VALUES.includes(value as Priority)
}

/**
 * Type guard for commitment status
 */
export function isValidCommitmentStatus(value: unknown): value is CommitmentStatus {
  return typeof value === 'string' && COMMITMENT_STATUSES.includes(value as CommitmentStatus)
}

/**
 * Type guard for smoking session status
 */
export function isValidSmokingSessionStatus(value: unknown): value is SmokingSessionStatus {
  return typeof value === 'string' && SMOKING_SESSION_STATUSES.includes(value as SmokingSessionStatus)
}

/**
 * Type guard for release type
 */
export function isValidReleaseType(value: unknown): value is ReleaseType {
  return typeof value === 'string' && RELEASE_TYPES.includes(value as ReleaseType)
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public invalidValue: unknown,
    public validValues?: readonly string[]
  ) {
    super(message)
    this.name = 'ValidationError'
  }

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

/**
 * Validate wishlist type and throw if invalid
 */
export function validateWishlistType(value: unknown, field: string = 'wishlist_type'): WishlistType {
  if (!isValidWishlistType(value)) {
    throw new ValidationError(
      `Invalid wishlist type: "${value}". Must be one of: ${WISHLIST_TYPES.join(', ')}`,
      field,
      value,
      WISHLIST_TYPES
    )
  }
  return value
}

/**
 * Validate priority and throw if invalid
 */
export function validatePriority(value: unknown, field: string = 'priority'): Priority {
  if (!isValidPriority(value)) {
    throw new ValidationError(
      `Invalid priority: "${value}". Must be one of: ${PRIORITY_VALUES.join(', ')}`,
      field,
      value,
      PRIORITY_VALUES
    )
  }
  return value
}

/**
 * Validate commitment status and throw if invalid
 */
export function validateCommitmentStatus(value: unknown, field: string = 'status'): CommitmentStatus {
  if (!isValidCommitmentStatus(value)) {
    throw new ValidationError(
      `Invalid commitment status: "${value}". Must be one of: ${COMMITMENT_STATUSES.join(', ')}`,
      field,
      value,
      COMMITMENT_STATUSES
    )
  }
  return value
}

/**
 * Validate smoking session status and throw if invalid
 */
export function validateSmokingSessionStatus(value: unknown, field: string = 'status'): SmokingSessionStatus {
  if (!isValidSmokingSessionStatus(value)) {
    throw new ValidationError(
      `Invalid smoking session status: "${value}". Must be one of: ${SMOKING_SESSION_STATUSES.join(', ')}`,
      field,
      value,
      SMOKING_SESSION_STATUSES
    )
  }
  return value
}

/**
 * Validate release type and throw if invalid
 */
export function validateReleaseType(value: unknown, field: string = 'release_type'): ReleaseType {
  if (!isValidReleaseType(value)) {
    throw new ValidationError(
      `Invalid release type: "${value}". Must be one of: ${RELEASE_TYPES.join(', ')}`,
      field,
      value,
      RELEASE_TYPES
    )
  }
  return value
}

/**
 * Validate price (must be positive integer in bani)
 */
export function validatePrice(value: unknown, field: string = 'estimated_price'): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new ValidationError(
      `Invalid price: "${value}". Must be a positive integer (in bani).`,
      field,
      value
    )
  }
  return value
}

/**
 * Validate gift data before insertion/update
 */
export interface GiftValidationData {
  wishlistType: unknown
  priority: unknown
  estimatedPrice: unknown
  releaseType?: unknown
}

export function validateGiftData(data: GiftValidationData) {
  const errors: ValidationError[] = []

  try {
    validateWishlistType(data.wishlistType)
  } catch (e) {
    if (e instanceof ValidationError) errors.push(e)
  }

  try {
    validatePriority(data.priority)
  } catch (e) {
    if (e instanceof ValidationError) errors.push(e)
  }

  try {
    validatePrice(data.estimatedPrice)
  } catch (e) {
    if (e instanceof ValidationError) errors.push(e)
  }

  // Optional: validate release type if it's a bandcamp gift
  if (data.wishlistType === 'bandcamp' && data.releaseType) {
    try {
      validateReleaseType(data.releaseType)
    } catch (e) {
      if (e instanceof ValidationError) errors.push(e)
    }
  }

  if (errors.length > 0) {
    throw errors
  }
}
