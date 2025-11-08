/**
 * Pseudonym generation for anonymous user identity
 * Format: Adjective-Animal-XXX (e.g., "Skeptical-Platypus-742")
 */

const adjectives = [
  "Skeptical",
  "Enthusiastic",
  "Mysterious",
  "Chaotic",
  "Serene",
  "Impulsive",
  "Methodical",
  "Whimsical",
  "Pragmatic",
  "Ambitious",
  "Curious",
  "Bold",
  "Cautious",
  "Fierce",
  "Gentle",
  "Swift",
  "Clever",
  "Brave",
  "Wise",
  "Jolly",
  "Sarcastic",
  "Optimistic",
  "Cynical",
  "Dramatic",
  "Stoic",
]

const animals = [
  "Platypus",
  "Narwhal",
  "Axolotl",
  "Pangolin",
  "Capybara",
  "Quokka",
  "Otter",
  "Meerkat",
  "Lemur",
  "Sloth",
  "Panda",
  "Eagle",
  "Dolphin",
  "Tiger",
  "Owl",
  "Fox",
  "Bear",
  "Wolf",
  "Hawk",
  "Lynx",
  "Falcon",
  "Raven",
  "Badger",
  "Moose",
  "Raccoon",
]

/**
 * Generate a random pseudonym
 * Format: Adjective-Animal-XXX
 */
export function generatePseudonym(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  const number = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${adjective}-${animal}-${number}`
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Generate a simple hash for IP address (for tracking without storing actual IP)
 */
export function hashIpAddress(ipAddress: string): string {
  // Simple hash - in production you might want to use a proper crypto hash
  let hash = 0
  for (let i = 0; i < ipAddress.length; i++) {
    const char = ipAddress.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}

/**
 * Validate pseudonym format
 */
export function isValidPseudonymFormat(pseudonym: string): boolean {
  // Format: Adjective-Animal-XXX where XXX is 3 digits
  const pattern = /^[A-Z][a-z]+-[A-Z][a-z]+-\d{3}$/
  return pattern.test(pseudonym)
}

/**
 * Check if pseudonym is available in list
 */
export function isPseudonymUnique(pseudonym: string, existingPseudonyms: string[]): boolean {
  return !existingPseudonyms.includes(pseudonym)
}

/**
 * Generate unique pseudonym by checking against existing ones
 * Retries up to maxAttempts times
 */
export function generateUniquePseudonym(
  existingPseudonyms: string[],
  maxAttempts: number = 10
): string {
  for (let i = 0; i < maxAttempts; i++) {
    const pseudonym = generatePseudonym()
    if (isPseudonymUnique(pseudonym, existingPseudonyms)) {
      return pseudonym
    }
  }
  
  // If we couldn't generate unique after maxAttempts, append timestamp
  const basePseudonym = generatePseudonym()
  return `${basePseudonym.split('-').slice(0, 2).join('-')}-${Date.now().toString().slice(-3)}`
}
