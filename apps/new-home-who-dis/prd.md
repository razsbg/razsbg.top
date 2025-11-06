# new-home-who-dis™️ Product Requirements Document

**Version:** 1.0
**Date:** November 5, 2025
**Event Date:** November 8, 2025
**Location:** Iași, Romania
**Author:** Răzvan Sbîngu

---

## Executive Summary

**new-home-who-dis™️** is a satirical gift registry web application that transforms the typical housewarming gift experience into an entertaining performance art piece. The app serves as a functional gift registry while deliberately incorporating and mocking the dark patterns and frustrating UX elements commonly found in modern e-commerce.

### Project Vision

Create a self-aware, ironic shopping experience that generates genuine laughter while successfully facilitating real gift commitments for a housewarming party. The app gamifies gift-giving through an anonymous leaderboard system with real-world party perks.

### Core Value Proposition

- **Entertainment Value:** Satirical UX that creates shared laughter and conversation
- **Functional Utility:** Actually works despite comedic chaos - all gifts are successfully tracked
- **Social Experiment:** Demonstrates how users navigate intentionally poor UX when motivated
- **Gamification:** Competitive leaderboard with real party privileges based on spending tiers

---

## Project Context

### Event Details

- **Date:** November 8, 2025 (3 days from PRD creation)
- **Type:** Housewarming party in Iași, Romania
- **Audience:** Tech-savvy millennial/Gen-Z guests familiar with online shopping frustrations
- **Access Method:** QR codes distributed at party venue

### Business Objectives

1. **Primary:** Facilitate successful gift commitments for housewarming
2. **Secondary:** Create memorable, shareable experience that sparks conversation
3. **Tertiary:** Demonstrate UX principles through contrast (good vs. intentionally bad)

---

## Target Audience & User Personas

### Primary Persona: "The Amused Guest"

- **Demographics:** 25-35 years old, tech-savvy, familiar with memes and internet culture
- **Motivation:** Wants to bring appropriate housewarming gift while being entertained
- **Pain Points:** Tired of actual bad UX in real shopping experiences
- **Goals:**
  - Quickly identify and commit to suitable gift
  - Enjoy the comedic experience
  - Potentially climb leaderboard for party perks
- **Tech Comfort:** High - owns smartphone, shops online regularly

### Secondary Persona: "The Competitive Friend"

- **Demographics:** Close friend/family, competitive personality
- **Motivation:** Wants to "win" the leaderboard game while contributing meaningfully
- **Goals:**
  - Achieve highest tier (Ultra) for premium party perks
  - Multiple gift commitments to maximize score
  - Social bragging rights

### Tertiary Persona: "The Party Observer"

- **Demographics:** Other party guests not actively shopping
- **Interaction:** Views leaderboard on TV display throughout party
- **Goals:** Entertainment, following the "competition," understanding inside jokes

---

## User Stories & Core Flows

### Epic 1: Gift Discovery & Commitment

**As a party guest, I want to:**

- Browse available gifts in an intuitive catalog
- See real-time availability (not already claimed)
- Commit to one or multiple gifts
- Modify my commitments if needed
- Track my spending and leaderboard position

### Epic 2: Anonymous Identity & Gamification

**As a user, I want to:**

- Receive a fun, anonymous identity upon arrival
- Change my pseudonym if I don't like it
- See my position on a live leaderboard
- Understand what perks I earn at each tier
- Maintain my identity across multiple visits/sessions

### Epic 3: Satirical Entertainment

**As someone familiar with bad UX, I want to:**

- Experience familiar dark patterns in a humorous context
- Laugh at intentionally frustrating but non-blocking elements
- Share the experience with other guests
- Successfully complete my task despite the chaos

---

## Feature Specifications

### 1. Gift Catalog & Commitment System

#### 1.1 Three-Wishlist Strategy

**Traditional Wishlist** - Curated housewarming essentials and nice-to-haves from Google Spreadsheet
**Lazy Receipt Option** - Items already purchased by host, guests can reimburse via Revolut/RoPay
**Bandcamp Digital Wishlist** - Music albums/tracks from host's Bandcamp wishlist for digital gifting

#### 1.2 Gift Database

- **Data Structure:**
  ```typescript
  interface Gift {
    id: string
    name: string
    description: string
    estimatedPrice: number
    category: string
    priority: "essential" | "nice-to-have" | "luxury" | "digital"
    wishlistType: "traditional" | "receipt" | "bandcamp"
    isCommitted: boolean
    committedBy?: string // pseudonym
    committedAt?: Date
    imageUrl?: string
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
  ```

#### 1.3 Browse Experience

- **Filter Options:** Wishlist type, category, price range, priority level
- **Search:** Text search across name/description/artist
- **Sorting:** Price (low to high, high to low), priority, alphabetical, release date (Bandcamp)
- **Visual Design:** Product cards with satirical elements (fake urgency badges, etc.)
- **Wishlist Tabs:** Easy switching between Traditional, Receipt, and Bandcamp catalogs

#### 1.4 Bandcamp Integration Strategy

- **Data Source:** Import from host's actual Bandcamp wishlist (46 items)
- **Payment Flow:** Bandcamp's native "Buy as Gift" feature integration
- **Verification:** Bandcamp gift confirmation system
- **User Experience:** Clean, functional interface for legitimate music purchases
- **Gift Delivery:** Digital downloads sent directly to host via Bandcamp

#### 1.3 Commitment Flow

- **Single Commitment:** One-click commit with confirmation
- **Multi-Commitment:** Shopping cart-style for multiple items
- **Modification:** Ability to remove commitments (with satirical "are you sure?" loops)
- **Validation:** Prevent double-commitments, handle race conditions

#### 1.4 Real-time Updates

- **Live Inventory:** Items immediately marked as committed
- **Availability Notifications:** "Someone just claimed this!" alerts
- **Dynamic Pricing Display:** Leaderboard impact preview

### 2. Anonymous Identity System

#### 2.1 Pseudonym Generation

- **Algorithm:** Adjective + Animal pattern
- **Examples:** "Skeptical Platypus", "Caffeinated Capybara", "Philosophical Penguin"
- **Word Lists:**
  - Adjectives: 200+ carefully curated terms (avoiding offensive/problematic words)
  - Animals: 150+ animals (mix of common and quirky)
- **Uniqueness:** ~30,000 possible combinations to prevent collisions

#### 2.2 Identity Management

- **Auto-Assignment:** Generated on first app access
- **Regeneration:** "Don't like your name?" button with satirical warnings
- **Collision Handling:** Automatic retry with exponential backoff
- **Session Persistence:** Stored in localStorage with fallback to sessionStorage
- **Cross-Device:** Option to "transfer" identity via simple code

#### 2.3 Identity Display

- **Visual Representation:** Consistent avatar/icon generation based on pseudonym
- **Branding:** Pseudonyms integrated into all UI elements
- **Recognition:** Easy identification in leaderboard and commitment lists

#### 2.4 Tier Card Feature

- **Purpose:** Anonymous verification for perk usage at party
- **Display:** Full-screen tier card showing current tier status and pseudonym
- **Visual Design:** Tier-specific colors and styling (Ultra = purple gradient, Gold = gold shimmer, etc.)
- **Content:**
  - Large tier badge (Ultra/Gold/Silver/Bronze)
  - Pseudonym prominently displayed
  - Current score and next tier progress
  - List of available perks for current tier
- **Usage:** User shows phone screen to claim perks (bathroom priority, balcony access, etc.)
- **Security:** QR code or unique visual pattern to prevent spoofing
- **Accessibility:** High contrast design readable in party lighting conditions

### 3. Live Leaderboard System

#### 3.1 Scoring Mechanism

- **Base Score:** Sum of committed gift values (estimated prices)
- **Bonus Points:**
  - Early commitment bonus (first 10 commitments get +10% multiplier)
  - Multi-gift bonus (2+ gifts get +5% per additional gift)
  - Category diversity bonus (+3% per unique category)

#### 3.2 Tier System

```typescript
interface TierThresholds {
  Ultra: 200 // Lei threshold for Ultra tier
  Gold: 150
  Silver: 100
  Bronze: 50
}

interface TierPerks {
  Ultra: [
    "Balcony smoking priority",
    "First serving at dinner",
    "Premium seating",
    "Bonus party favor",
  ]
  Gold: ["Priority bathroom access", "Second serving at dinner", "Good seating"]
  Silver: ["Decent seating", "Regular party favor"]
  Bronze: ["Participation recognition"]
}
```

#### 3.3 Multi-Context Display

**Mobile View (Guest Interaction):**

- Compact leaderboard showing top 10
- User's current position highlighted
- Next tier threshold and progress bar
- Quick action buttons

**Desktop/Tablet View:**

- Full leaderboard with all participants
- Detailed tier information and perks
- Gift commitment history
- Advanced filtering/sorting

**TV/Large Screen Display:**

- Ambient display mode for party atmosphere
- Auto-rotating views (leaderboard → recent activity → tier perks)
- Large, readable fonts for distance viewing
- Minimal interaction required
- Auto-refresh every 30 seconds

#### 3.4 Real-time Synchronization

- **Technology:** WebSocket connection for live updates
- **Fallback:** Server-sent events (SSE) for broader compatibility
- **Offline Handling:** Graceful degradation with sync on reconnection
- **Conflict Resolution:** Last-write-wins with timestamp comparison

### 4. Dark Pattern Implementations (Satirical)

#### 4.1 Fake Urgency

- **Countdown Timers:** "Only 47 minutes left to claim this gift!" (timer resets)
- **Scarcity Alerts:** "3 other people are viewing this!" (randomly generated)
- **Limited Time Offers:** "Flash sale: 0% off for the next 23 minutes!"
- **Bandcamp Urgency:** "This album might become hipster-popular soon! Act fast!"
- **Digital Scarcity:** "Only ∞ digital copies left!" (technically true but meaningless)

#### 4.2 Intrusive Popups

- **Newsletter Signup:** Appears after 10 seconds, difficult X button, multiple closure attempts required
- **Cookie Banner:** Overly complex with 47 different cookie categories
- **Location Permission:** "Allow location to find better gifts near you!" (doesn't actually use location)
- **Push Notifications:** "Get notified when gifts become available!" (ironic since gifts are physical)

#### 4.3 Chatbot Annoyances

- **Persistent Assistant:** "Hi! I'm Giftbot! Need help finding the perfect gift?"
- **Unhelpful Responses:** Answers unrelated to questions
- **Typing Indicators:** Long pauses before obvious responses
- **Escalation Loops:** "Let me transfer you to a human... just kidding!"

#### 4.4 Cart/Checkout Dark Patterns

- **Hidden Costs:** "Processing fee: €0.00 (we're generous!)"
- **Suggested Additions:** "People who committed to this also committed to..." (unrelated items)
- **Exit Intent:** Pop-up when trying to leave: "Wait! Are you sure you want to abandon your commitment?"

#### 4.5 Loading & Performance

- **Fake Loading Screens:** Unnecessarily long with humorous status messages
- **Progress Bars:** Non-linear progress that speeds up/slows down randomly
- **"Optimizing Experience":** Fake optimization with tech-sounding gibberish

### 5. Entry & Access System

#### 5.1 QR Code Implementation

- **Generation:** Dynamic QR codes linking to app with party-specific parameters
- **Content:** `https://razsbg.top/new-home-who-dis?party=iasi-nov-2025&ref=qr`
- **Physical Distribution:** Printed cards at party entrance, table tents, wall displays

#### 5.2 Mobile-First Design

- **Responsive Breakpoints:**
  - Mobile: 320px - 768px (primary focus)
  - Tablet: 768px - 1024px
  - Desktop: 1024px - 1440px
  - Large Screen/TV: 1440px+

#### 5.3 Progressive Enhancement

- **Core Functionality:** Works without JavaScript (basic gift list)
- **Enhanced Experience:** Full features with JavaScript enabled
- **Offline Capability:** Service worker for caching core assets

---

## Technical Requirements

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   API Services  │    │   Data Layer    │
│                 │    │                 │    │                 │
│ • Mobile Web    │◄──►│ • REST API      │◄──►│ • SQLite/       │
│ • Desktop Web   │    │ • WebSocket     │    │   PostgreSQL    │
│ • TV Display    │    │ • Real-time     │    │ • Redis Cache   │
│                 │    │   Sync          │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack Integration

**Frontend (Astro 5):**

- **Framework:** Astro 5 with TypeScript
- **Styling:** Tailwind CSS via @astrojs/tailwind
- **Interactivity:** Astro Islands for real-time components
- **State Management:** Nanostores for cross-component state
- **Real-time:** WebSocket client for live updates

**Backend Services:**

- **API:** Astro API routes for REST endpoints
- **Real-time:** Node.js WebSocket server (separate service or integrated)
- **Database:** SQLite for development, PostgreSQL for production
- **Caching:** Redis for session management and real-time state

**Infrastructure:**

- **Hosting:** Vercel for primary deployment
- **Domain:** razsbg.top subdomain
- **CDN:** Vercel Edge Network
- **Monitoring:** Built-in Vercel analytics

### Data Models

```typescript
// Core Entities
interface User {
  id: string
  pseudonym: string
  sessionId: string
  createdAt: Date
  lastActive: Date
  ipHash: string // For basic duplicate prevention
}

interface Commitment {
  id: string
  userId: string
  giftId: string
  amount: number
  committedAt: Date
  status: "active" | "cancelled"
}

interface LeaderboardEntry {
  userId: string
  pseudonym: string
  totalScore: number
  tier: "Ultra" | "Gold" | "Silver" | "Bronze"
  commitmentCount: number
  lastUpdated: Date
}

// Real-time Events
interface WebSocketEvent {
  type:
    | "commitment_added"
    | "commitment_removed"
    | "leaderboard_updated"
    | "gift_claimed"
  data: any
  timestamp: Date
}
```

### Performance Requirements

- **Page Load:** < 2 seconds on 3G connection
- **Real-time Updates:** < 500ms latency for leaderboard changes
- **Concurrent Users:** Support 50+ simultaneous users
- **Uptime:** 99.9% availability during party hours

### Security Considerations

- **Rate Limiting:** Prevent spam commitments
- **Input Validation:** Sanitize all user inputs
- **CORS:** Proper configuration for multi-origin access
- **No Personal Data:** Anonymous system reduces privacy concerns
- **DDoS Protection:** Vercel built-in protection

---

## UI/UX Guidelines

### Design System

#### Color Palette

```css
/* Primary Brand Colors */
--brand-primary: #ff6b6b; /* Satirical red */
--brand-secondary: #4ecdc4; /* Playful teal */
--brand-accent: #ffe66d; /* Warning yellow */

/* Tier Colors */
--ultra-tier: #9b59b6; /* Purple */
--gold-tier: #f1c40f; /* Gold */
--silver-tier: #95a5a6; /* Silver */
--bronze-tier: #e67e22; /* Bronze */

/* Dark Pattern Colors */
--annoying-popup: #ff3838; /* Bright red */
--fake-urgency: #ff9500; /* Orange */
--chatbot-bg: #00d4aa; /* Bright teal */
```

#### Typography

- **Primary Font:** Inter (clean, modern)
- **Satirical Elements:** Comic Sans MS (intentionally annoying)
- **Monospace:** JetBrains Mono (for fake "technical" elements)

#### Satirical Design Elements

- **Intentionally Poor Alignment:** Slightly off-center elements
- **Excessive Animations:** Bouncing buttons, spinning icons
- **Color Conflicts:** Clashing combinations for dark patterns
- **Inconsistent Spacing:** Irregular margins/padding
- **Mixed UI Paradigms:** iOS + Android + Web elements combined

### Responsive Design Strategy

#### Mobile-First Approach

1. **Core Layout:** Single column, thumb-friendly buttons
2. **Navigation:** Bottom tab bar with main actions
3. **Cards:** Full-width gift cards with essential info
4. **Leaderboard:** Condensed view with expand options

#### Progressive Enhancement by Screen Size

- **Mobile (320-768px):** Essential features only
- **Tablet (768-1024px):** Split layouts, more information density
- **Desktop (1024-1440px):** Full feature set, multi-column layouts
- **TV (1440px+):** Ambient display mode, auto-updating content

### Accessibility Considerations

#### WCAG 2.1 AA Compliance

- **Color Contrast:** 4.5:1 ratio for normal text
- **Keyboard Navigation:** Full app navigable without mouse
- **Screen Readers:** Proper ARIA labels and semantic HTML
- **Motion:** Reduced motion options for sensitive users

#### Satirical Accessibility

- **Fake Alt Text:** Humorous but actually descriptive
- **Overly Helpful ARIA:** Excessive but functional labels
- **Tab Order Chaos:** Unusual but logical tab sequence

---

## Success Metrics & KPIs

### Primary Success Metrics

#### Functional Success

- **Gift Commitment Rate:** >80% of unique visitors commit to at least one gift
- **Multi-Commitment Rate:** >30% of users commit to multiple gifts
- **Completion Rate:** >95% of initiated commitments are successfully processed
- **Zero Data Loss:** 100% of commitments accurately recorded

#### Entertainment Value

- **Session Duration:** Average >5 minutes (indicating engagement)
- **Return Visits:** >40% of users return to add more commitments
- **Tier Progression:** >60% of users achieve Silver tier or higher
- **Social Sharing:** Qualitative feedback indicates shareability

### Secondary Metrics

#### Technical Performance

- **Page Load Speed:** <2 seconds for initial load
- **Real-time Latency:** <500ms for leaderboard updates
- **Uptime:** 99.9% during party hours (Nov 8, 6 PM - 2 AM)
- **Error Rate:** <1% of user actions result in errors

#### User Experience

- **Pseudonym Regeneration Rate:** <20% (indicates satisfaction with names)
- **Dark Pattern Completion:** >90% complete actions despite satirical barriers
- **Help/Support Requests:** <5% of users need assistance
- **Mobile Performance:** >90% of interactions on mobile devices

### Real-time Monitoring

#### Live Dashboard Metrics

- **Active Users:** Current concurrent users
- **Recent Commitments:** Last 10 gift commitments with timestamps
- **Leaderboard Movement:** Tier changes and position shifts
- **System Health:** API response times, WebSocket connections

#### Party Day Analytics

- **Peak Concurrent Users:** Track maximum simultaneous usage
- **Commitment Timeline:** Graph of commitments over party duration
- **Device Breakdown:** Mobile vs. desktop vs. TV display usage
- **Feature Usage:** Which satirical elements get most interaction

---

## Timeline & Development Milestones

### Critical Path (3 Days Remaining)

#### Day 1 (November 5): Foundation & Core Features

**Morning (4-6 hours):**

- ✅ PRD completion and approval
- 🔄 Project setup in Astro 5 with TypeScript
- 🔄 Basic routing structure and page shells
- 🔄 Tailwind CSS configuration and design system

**Afternoon (4-6 hours):**

- 🔄 Gift catalog data structure and mock data
- 🔄 Anonymous identity system implementation
- 🔄 Basic gift browsing and commitment flow
- 🔄 SQLite database setup and models

#### Day 2 (November 6): Real-time Features & Satirical Elements

**Morning (4-6 hours):**

- 🔄 WebSocket server implementation
- 🔄 Live leaderboard functionality
- 🔄 Real-time commitment updates
- 🔄 Tier system and scoring logic

**Afternoon (4-6 hours):**

- 🔄 Dark pattern implementations (popups, chatbots, etc.)
- 🔄 TV display mode development
- 🔄 Mobile responsiveness optimization
- 🔄 QR code generation and entry flow

#### Day 3 (November 7): Polish, Testing & Deployment

**Morning (3-4 hours):**

- 🔄 Cross-device testing and bug fixes
- 🔄 Performance optimization
- 🔄 Content population (real gift data)
- 🔄 Satirical content writing and humor polishing

**Afternoon (2-3 hours):**

- 🔄 Production deployment to Vercel
- 🔄 QR code printing and physical materials
- 🔄 Final testing with multiple devices
- 🔄 Monitoring setup and health checks

**Evening (1-2 hours):**

- 🔄 Party setup preparation
- 🔄 TV display configuration
- 🔄 Final smoke tests

### Risk Mitigation Timeline

#### High-Risk Items (Must Complete)

1. **Real-time Synchronization:** Day 2 morning - critical for leaderboard
2. **Multi-device Testing:** Day 3 morning - ensures party day functionality
3. **Production Deployment:** Day 3 afternoon - no last-minute surprises

#### Medium-Risk Items (Important but Flexible)

1. **Satirical Polish:** Can be simplified if time runs short
2. **Advanced Dark Patterns:** Core functionality more important
3. **TV Display Perfection:** Basic version acceptable if needed

#### Fallback Plans

- **Simple Leaderboard:** Static refresh instead of real-time if WebSocket fails
- **Reduced Satire:** Focus on functional registry if satirical elements cause issues
- **Manual Backup:** Printable gift list as ultimate fallback

---

## Risk Assessment & Mitigation

### Technical Risks

#### High Probability, High Impact

**Risk:** Real-time synchronization failure during party

- **Impact:** Leaderboard shows stale data, user confusion
- **Mitigation:** Fallback to polling every 30 seconds
- **Testing:** Load testing with 50+ concurrent users

**Risk:** Mobile compatibility issues on various devices

- **Impact:** Guests can't access app effectively
- **Mitigation:** Progressive enhancement, extensive device testing
- **Testing:** Test on iOS 15+, Android 10+, various browsers

#### Medium Probability, High Impact

**Risk:** Database performance degradation under load

- **Impact:** Slow responses, failed commitments
- **Mitigation:** Connection pooling, query optimization
- **Testing:** Stress testing with concurrent writes

**Risk:** Vercel deployment issues or downtime

- **Impact:** App completely inaccessible
- **Mitigation:** Multiple deployment checks, backup hosting plan
- **Testing:** Deploy early and monitor

### User Experience Risks

#### Medium Probability, Medium Impact

**Risk:** Satirical elements become actually frustrating

- **Impact:** Users abandon app before committing
- **Mitigation:** Careful balance testing, easy escape hatches
- **Testing:** User testing with friends/family

**Risk:** Pseudonym collision or regeneration failures

- **Impact:** User identity confusion, duplicate names
- **Mitigation:** Large name pool, collision detection with retries
- **Testing:** Automated testing of name generation

### Business/Event Risks

#### Low Probability, High Impact

**Risk:** Party timing conflicts or early/late arrivals

- **Impact:** Miss peak usage window, empty leaderboard
- **Mitigation:** Flexible timing, app available before party
- **Testing:** Soft launch 24 hours before party

**Risk:** Guests don't engage with satirical concept

- **Impact:** App seen as genuinely bad rather than funny
- **Mitigation:** Clear framing, host explanation, self-aware messaging
- **Testing:** Pitch testing with target audience

### Mitigation Strategies

#### Technical Redundancy

- **Multiple Deployment Environments:** Staging and production
- **Graceful Degradation:** Core features work without advanced functionality
- **Monitoring:** Real-time alerts for system health
- **Quick Rollback:** Ability to revert to previous version

#### User Communication

- **Clear Instructions:** QR code cards with basic usage guide
- **Host Briefing:** Party host explains concept and encourages participation
- **In-App Guidance:** Satirical but helpful onboarding
- **Escape Hatches:** Always provide way to complete core actions quickly

---

## Post-Launch Considerations

### Party Day Operations

#### Monitoring Checklist

- [ ] App accessibility and load times
- [ ] Real-time updates functioning
- [ ] TV display showing correct data
- [ ] Mobile compatibility across devices
- [ ] Gift commitment accuracy
- [ ] Leaderboard tier calculations

#### Support Strategy

- **Host as Primary Support:** Party host handles most questions
- **Self-Service Help:** In-app tooltips and guidance
- **Remote Monitoring:** Developer monitoring but not actively supporting
- **Quick Fixes:** Ability to push critical updates if needed

### Data Collection & Analysis

#### Success Measurement

- **Quantitative:** Commitment rates, session durations, tier distribution
- **Qualitative:** Guest feedback, laughter moments, conversation topics
- **Technical:** Performance metrics, error rates, load characteristics
- **Social:** Photo/video content, sharing behavior

#### Post-Event Review

- **Within 24 Hours:** Initial data analysis and feedback collection
- **Within 1 Week:** Comprehensive post-mortem and lessons learned
- **Documentation:** Create case study for portfolio/sharing

### Future Iterations

#### Potential Enhancements (Post-Party)

- **Photo Integration:** Guests can upload photos of purchased gifts
- **Thank You System:** Host can send personalized thanks through app
- **Gift Delivery Tracking:** Satirical "shipping" updates for physical gifts
- **Analytics Dashboard:** Detailed breakdown for host review

#### Reusability Framework

- **Template System:** Adaptable for other events/hosts
- **Configuration Options:** Easy customization of gifts, tiers, branding
- **Multi-Event Support:** Handle multiple parties simultaneously
- **White-Label Option:** Remove personal branding for broader use

---

## Appendices

### A. Detailed Gift Categories & Examples

#### Traditional Wishlist Items

**Essential Items (Priority: Essential)**

- **Kitchen Basics:** Cutting boards, mixing bowls, measuring cups
- **Cleaning Supplies:** Vacuum cleaner, mop, cleaning products
- **Storage Solutions:** Containers, organizers, shelving
- **Price Range:** €20-80 / 100-400 Lei

**Nice-to-Have Items (Priority: Nice-to-Have)**

- **Comfort Items:** Throw pillows, blankets, plants
- **Kitchen Gadgets:** Coffee maker, blender, air fryer
- **Decor:** Artwork, mirrors, lighting fixtures
- **Price Range:** €30-120 / 150-600 Lei

**Luxury Items (Priority: Luxury)**

- **Premium Appliances:** Stand mixer, espresso machine
- **High-End Decor:** Statement furniture pieces, premium textiles
- **Tech Upgrades:** Smart home devices, premium electronics
- **Price Range:** €100-300+ / 500-1500+ Lei

#### Lazy Receipt Option

**Already Purchased Items (Priority: Receipt)**

- **Convenience:** Items host already bought, guests reimburse
- **Payment Method:** Revolut or RoPay integration
- **Verification:** Manual confirmation of payment receipt
- **Price Range:** Variable based on actual receipts

#### Bandcamp Digital Wishlist

**Digital Music Items (Priority: Digital)**

- **Albums:** Full album purchases (e.g., "Based On A True Story" by Fat Freddy's Drop)
- **EPs:** Extended play releases (e.g., "Find Your Way EP" by Pola & Bryson)
- **Tracks:** Individual song purchases (e.g., "Phoneline" by Pola & Bryson)
- **Artists Featured:** Fat Freddy's Drop, BRUTUS, Fred again.., Anderson .Paak, Evanescence, Kazi Ploae, Tommy Guerrero, Pola & Bryson, and more
- **Price Range:** €3-25 / 15-125 Lei per item
- **Delivery:** Digital download/streaming access
- **Total Items:** 46 items in wishlist catalog

### B. Pseudonym Word Lists (Sample)

#### Adjectives (Satirical & Fun)

- Caffeinated, Skeptical, Philosophical, Dramatic, Caffeinated
- Overthinking, Procrastinating, Sarcastic, Optimistic, Chaotic
- Minimalist, Maximalist, Vintage, Millennial, Boujee
- Stressed, Blessed, Obsessed, Caffeinated, Overwhelmed

#### Animals (Mix of Common & Quirky)

- Platypus, Capybara, Penguin, Llama, Quokka
- Pangolin, Axolotl, Sloth, Narwhal, Flamingo
- Hedgehog, Corgi, Ferret, Otter, Chinchilla
- Mantis, Gecko, Toucan, Lemur, Alpaca

### C. Dark Pattern Examples & Implementation

#### Popup Sequence (Satirical)

1. **10 seconds:** Newsletter signup with tiny X button
2. **15 seconds:** Cookie preferences with 47 categories
3. **30 seconds:** Location permission request
4. **45 seconds:** Push notification permission
5. **60 seconds:** "Are you still there?" engagement popup

#### Chatbot Conversation Flow

```
Bot: Hi! I'm Giftbot! 🤖 Need help finding the perfect gift?
User: [Any response]
Bot: Great! Let me think about that... 🤔
[3 second delay with typing indicator]
Bot: Have you tried turning it off and on again?
User: That doesn't make sense
Bot: You're absolutely right! Let me transfer you to a human...
[2 second delay]
Bot: Just kidding! I'm the only one here! 😄 But seriously, check out our kitchen section!
```

#### Fake Urgency Examples

- "🔥 FLASH SALE: 0% off everything for the next 23 minutes!"
- "⚠️ Only 47 people can commit to gifts today! (You're visitor #13,847)"
- "🚨 This gift is in 12 other people's carts right now!"
- "⏰ Hurry! Sale ends in: 23:59:59 (timer resets daily)"

### D. Technical Implementation Notes

#### WebSocket Event Types

```typescript
// Client → Server
interface ClientEvents {
  commit_gift: { giftId: string; userId: string }
  remove_commitment: { commitmentId: string; userId: string }
  regenerate_pseudonym: { userId: string }
  heartbeat: { userId: string; timestamp: number }
}

// Server → Client
interface ServerEvents {
  gift_committed: { gift: Gift; user: User; leaderboard: LeaderboardEntry[] }
  commitment_removed: { giftId: string; leaderboard: LeaderboardEntry[] }
  leaderboard_updated: { leaderboard: LeaderboardEntry[] }
  user_updated: { user: User }
  system_message: { message: string; type: "info" | "warning" | "error" }
}
```

#### Database Schema (SQLite/PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    pseudonym TEXT UNIQUE NOT NULL,
    session_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_hash TEXT
);

-- Gifts table
CREATE TABLE gifts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    estimated_price INTEGER NOT NULL, -- in cents
    category TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('essential', 'nice-to-have', 'luxury')),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Commitments table
CREATE TABLE commitments (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    gift_id TEXT REFERENCES gifts(id),
    amount INTEGER NOT NULL, -- in cents
    committed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK (status IN ('active', 'cancelled')) DEFAULT 'active',
    UNIQUE(gift_id) -- One commitment per gift
);

-- Indexes
CREATE INDEX idx_commitments_user_id ON commitments(user_id);
CREATE INDEX idx_commitments_gift_id ON commitments(gift_id);
CREATE INDEX idx_commitments_status ON commitments(status);
CREATE INDEX idx_users_pseudonym ON users(pseudonym);
CREATE INDEX idx_users_session_id ON users(session_id);
```

---

**Document Status:** ✅ Complete
**Next Steps:** Technical implementation begins immediately
**Key Dependencies:** Gift catalog data, satirical content creation, multi-device testing setup
