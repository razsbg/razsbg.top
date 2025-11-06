# new-home-who-dis™️ Technical Implementation Specification

## Project Overview

A satirical gift registry web application for a housewarming party on November 8, 2025 in Iași, Romania. The app combines aggressive UX dark patterns with legitimate functionality, creating an entertaining yet functional gift commitment system.

## Architecture

### Tech Stack

- **Framework**: Astro 5 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres with Drizzle ORM
- **Real-time**: Server-Sent Events (SSE)
- **State Management**: Nanostores with persistence
- **Deployment**: Vercel
- **Domain**: razsbg.top subdomain

### Key Features

#### 1. Three-Wishlist System

- **Traditional**: Curated items from Google Spreadsheet (spirits, kitchen tools, etc.)
- **Receipt**: Already-purchased items with Revolut reimbursement
- **Bandcamp**: Digital music albums/tracks with native "Buy as Gift" integration

#### 2. Anonymous Identity System

- Auto-generated pseudonyms: Adjective + Animal (e.g., "Skeptical Platypus")
- Session-persistent with regeneration option
- Collision detection and handling

#### 3. Tier-Based Leaderboard

- **Scoring**: Sum of committed gift values (in Lei)
- **Tiers**: Bronze (250 Lei) → Silver (500 Lei) → Gold (750 Lei) → Ultra (1000 Lei)
- **Real-time updates** via SSE
- **TV Display mode** for party ambiance

#### 4. Tier Card Feature

- Full-screen mobile display showing user's tier status
- Used for anonymous perk verification at party
- QR code or visual pattern for security

#### 5. Real-World Party Perks

- **Ultra**: Deluxe chair, big bathroom exclusive, smoking priority, DJ access (3x), Spotify skip (3x)
- **Gold**: Regular chair, big bathroom shared, smoking queue priority, DJ access (2x), Spotify skip (2x)
- **Silver**: Small bathroom priority, balcony notifications, DJ access (1x), Spotify add (3x)
- **Bronze**: Basic experience, Spotify add (1x), participation recognition

#### 6. Balcony Smoking Management

- Real-time tracking of smoking area capacity
- Queue system with tier-based priority
- "I'm smoking" button with countdown timer
- Auto-notifications to clear space

#### 7. Aggressive Dark Patterns (Satirical)

- Fake urgency timers and scarcity alerts
- Complex cookie banners and popup sequences
- Unhelpful chatbot with typing delays
- Exit-intent popups and loading shenanigans
- All satirical but non-blocking

### Payment Integration

#### Revolut Integration

- Username: `razsbg`
- Payment links: `https://revolut.me/razsbg/{amount}`
- Manual verification workflow

#### Bandcamp Integration

- Native "Buy as Gift" functionality
- Direct links to Bandcamp purchase pages
- Digital delivery to host account

### Database Schema

#### Core Tables

- **users**: Anonymous user management with pseudonyms
- **gifts**: Three-wishlist gift catalog with type-specific fields
- **commitments**: Gift commitment tracking with status
- **smoking_sessions**: Balcony usage tracking
- **config**: System configuration storage

#### Price Storage Format

- **Database Storage**: All prices stored in **bani** (Lei × 100) as integers
- **UI Display**: Convert bani to Lei for display (divide by 100, show as "123.45 Lei")
- **Example**: 45747 bani → 457.47 Lei in UI
- **Calculations**: All tier thresholds and scoring done in bani for precision

### Real-time Architecture

#### Server-Sent Events (SSE)

- **Endpoint**: `/api/events`
- **Events**: leaderboard updates, gift commitments, system messages
- **Fallback**: 10-second polling for compatibility

#### State Management

- **Nanostores**: Cross-component reactive state
- **Persistence**: localStorage with sessionStorage fallback
- **Sync**: SSE-driven updates

### UI/UX Implementation

#### Responsive Design

- **Mobile-first**: Primary interaction device
- **Tablet**: Enhanced layouts with more information
- **Desktop**: Full feature set with multi-column layouts
- **TV (1440px+)**: Ambient display mode with auto-rotation

#### Design System

- **Brand Colors**: Satirical red (#FF6B6B), playful teal (#4ECDC4)
- **Tier Colors**: Ultra purple, Gold gold, Silver silver, Bronze orange
- **Typography**: Inter (clean) + Comic Sans (satirical) + JetBrains Mono (tech)
- **Satirical Elements**: Poor alignment, excessive animations, color conflicts

#### Accessibility

- **WCAG 2.1 AA compliance** for core functionality
- **Satirical accessibility**: Humorous but functional ARIA labels
- **High contrast** tier card design for party lighting

### Samsung TV Compatibility

- **Model**: UE50RU7102KXXH (2019)
- **Browser**: Samsung Internet (Chromium-based)
- **URL**: `/tv-display` route
- **Features**: Auto-refresh, large fonts, remote-friendly navigation

### Development Workflow

#### Project Structure

```
src/
├── components/          # Astro and framework components
│   ├── GiftCard.astro
│   ├── Leaderboard.astro
│   ├── TierCard.astro
│   └── DarkPatterns/
├── pages/              # Route pages
│   ├── index.astro
│   ├── gifts.astro
│   ├── leaderboard.astro
│   ├── tier-card.astro
│   └── tv-display.astro
├── layouts/            # Page layouts
├── db/                 # Database schema and utilities
├── lib/                # Core business logic
├── types/              # TypeScript definitions
└── styles/             # Global styles
```

#### API Routes

```
src/pages/api/
├── gifts/
│   ├── index.ts        # GET /api/gifts
│   └── [id]/
│       └── commit.ts   # POST /api/gifts/[id]/commit
├── users/
│   ├── session.ts      # POST /api/users/session
│   └── regenerate.ts   # POST /api/users/regenerate
├── leaderboard.ts      # GET /api/leaderboard
├── events.ts           # GET /api/events (SSE)
└── balcony/
    ├── status.ts       # GET /api/balcony/status
    └── smoke.ts        # POST /api/balcony/smoke
```

### Performance Requirements

- **Page Load**: <2 seconds on 3G
- **SSE Latency**: <500ms for updates
- **Concurrent Users**: 50+ simultaneous
- **Uptime**: 99.9% during party hours

### Security Considerations

- **Rate limiting** on API endpoints
- **Input validation** and sanitization
- **No personal data** collection (anonymous system)
- **CORS** configuration for multi-origin access

### Deployment Configuration

#### Environment Variables

```bash
POSTGRES_URL=          # Vercel Postgres connection
NODE_ENV=production
REVOLUT_USERNAME=razsbg
PARTY_DATE=2025-11-08
```

#### Vercel Configuration

```json
{
  "functions": {
    "src/pages/api/events.ts": {
      "maxDuration": 300
    }
  },
  "rewrites": [
    {
      "source": "/new-home-who-dis/(.*)",
      "destination": "/$1"
    }
  ]
}
```

### Testing Strategy

- **Unit tests**: Core business logic functions
- **Integration tests**: API endpoint functionality
- **E2E tests**: Critical user flows (commit gift, view leaderboard)
- **Load testing**: 50+ concurrent users simulation
- **Device testing**: iOS/Android/Samsung TV compatibility

### Development Priorities

#### Phase 0: Pre-Launch (Nov 5-7)

1. **Countdown Timer**: Landing page with countdown to November 8, 3 PM
2. **Teaser Content**: "Coming Soon" satirical messaging and party hype
3. **Mobile Optimization**: Responsive countdown display for phone sharing

#### Day 1 (Nov 5)

1. **Core Setup**: Astro project, database schema, basic routing
2. **Gift System**: Catalog display, commitment flow, data seeding
3. **Identity System**: Pseudonym generation, session management
4. **Basic Leaderboard**: Scoring calculation, tier assignment

#### Day 2 (Nov 6)

1. **Real-time Features**: SSE implementation, live updates
2. **Dark Patterns**: Popup sequences, chatbot, fake urgency
3. **Payment Integration**: Revolut links, Bandcamp integration
4. **TV Display**: Large screen optimization, auto-rotation

#### Day 3 (Nov 7)

1. **Polish & Testing**: Cross-device testing, performance optimization
2. **Balcony Features**: Smoking session tracking, queue management
3. **Tier Cards**: Mobile verification interface
4. **Deployment**: Production setup, monitoring, final testing

### Factory.ai CLI Integration Notes

#### Recommended Approach

1. **Start with core data layer**: Use CLI to generate database utilities and API endpoints
2. **Component generation**: Generate Astro components for gift cards, leaderboard entries
3. **Feature implementation**: Use CLI for complex features like SSE, dark patterns
4. **Iterative refinement**: Review generated code in Zed, refine with CLI assistance

#### Key CLI Prompts

- "Generate Astro API endpoint for gift commitment with SSE broadcasting"
- "Create responsive gift card component with satirical dark patterns"
- "Implement tier-based leaderboard with real-time updates"
- "Build Samsung TV-optimized display page with auto-rotation"

This specification provides the foundation for hands-on development with factory.ai CLI while maintaining the satirical vision and technical requirements.
