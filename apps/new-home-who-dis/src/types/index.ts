// Core data types for new-home-who-dis™️

export interface Gift {
  id: string
  name: string
  description: string
  estimatedPrice: number // in bani (Lei * 100)
  category: string
  priority: "essential" | "nice-to-have" | "luxury" | "digital"
  wishlistType: "traditional" | "receipt" | "bandcamp"
  isCommitted: boolean
  committedBy?: string // pseudonym
  committedAt?: Date
  imageUrl?: string
  notes?: string

  // Receipt-specific fields
  receiptId?: string
  alreadyPurchased?: boolean
  reimbursementMethod?: "revolut" | "ropay"

  // Bandcamp-specific fields
  bandcampUrl?: string
  artist?: string
  albumTitle?: string
  releaseType?: "album" | "track" | "ep"
  digitalDelivery?: boolean
}

export interface User {
  id: string
  pseudonym: string
  sessionId: string
  createdAt: Date
  lastActive: Date
  ipHash: string
}

export interface Commitment {
  id: string
  userId: string
  giftId: string
  amount: number // in bani
  committedAt: Date
  status: "active" | "cancelled"
}

export interface LeaderboardEntry {
  userId: string
  pseudonym: string
  totalScore: number // in bani
  tier: TierType
  commitmentCount: number
  lastUpdated: Date
}

export type TierType = "Ultra" | "Gold" | "Silver" | "Bronze"

export interface TierThresholds {
  Ultra: number
  Gold: number
  Silver: number
  Bronze: number
}

export interface TierPerks {
  Ultra: string[]
  Gold: string[]
  Silver: string[]
  Bronze: string[]
}

// Real-time WebSocket events
export interface WebSocketEvent {
  type:
    | "commitment_added"
    | "commitment_removed"
    | "leaderboard_updated"
    | "gift_claimed"
    | "user_updated"
  data: any
  timestamp: Date
}

// Client → Server events
export interface ClientEvents {
  commit_gift: { giftId: string; userId: string }
  remove_commitment: { commitmentId: string; userId: string }
  regenerate_pseudonym: { userId: string }
  heartbeat: { userId: string; timestamp: number }
}

// Server → Client events
export interface ServerEvents {
  gift_committed: { gift: Gift; user: User; leaderboard: LeaderboardEntry[] }
  commitment_removed: { giftId: string; leaderboard: LeaderboardEntry[] }
  leaderboard_updated: { leaderboard: LeaderboardEntry[] }
  user_updated: { user: User }
  system_message: { message: string; type: "info" | "warning" | "error" }
}

// UI/UX Types
export interface PseudonymConfig {
  adjectives: string[]
  animals: string[]
}

export interface DarkPatternConfig {
  popupSequence: PopupStep[]
  chatbotResponses: ChatbotResponse[]
  fakeUrgencyMessages: string[]
}

export interface PopupStep {
  delay: number // milliseconds
  type: "newsletter" | "cookies" | "location" | "notifications" | "exit-intent"
  content: string
  difficulty: "easy" | "medium" | "hard" // how hard to close
}

export interface ChatbotResponse {
  trigger: string
  responses: string[]
  delay?: number
}

// Payment integration
export interface PaymentLink {
  type: "revolut" | "bandcamp"
  url: string
  amount: number
  description: string
  giftId: string
}

// Balcony tracking feature
export interface BalconyStatus {
  currentSmokers: string[] // pseudonyms
  capacity: number
  waitingQueue: string[]
  sessionDuration: number // minutes
}

export interface SmokingSession {
  userId: string
  startTime: Date
  duration: number
  canKick: boolean // based on tier
}

// TV Display specific types
export interface TVDisplayState {
  mode: "leaderboard" | "recent-activity" | "tier-perks" | "balcony-status"
  autoRotate: boolean
  refreshInterval: number // seconds
}

// Tier card for mobile verification
export interface TierCard {
  userId: string
  pseudonym: string
  tier: TierType
  score: number
  perks: string[]
  qrCode: string // for verification
  generatedAt: Date
}
