# new-home-who-dis™️ Development Roadmap

## 🚀 Implementation Checklist (3 Days)

### Phase 0: Pre-Launch Countdown (November 5-7)

- [ ] **Countdown Timer Implementation**
  - [ ] Create countdown component to party date (November 8, 3 PM)
  - [ ] Landing page with countdown and teaser content
  - [ ] "Coming Soon" satirical messaging
  - [ ] Mobile-responsive countdown display

### Day 1: Foundation & Core Features (November 5)

#### Morning (4-6 hours)

- [ ] **Project Initialization**

  - [ ] `pnpm install` - Install dependencies
  - [ ] Set up Railway PostgreSQL database
  - [ ] Run `pnpm db:generate && pnpm db:migrate`
  - [ ] Configure environment variables

- [ ] **Core Architecture**

  - [ ] Database connection utilities (`src/db/index.ts`)
  - [ ] Gift data seeding script with all three wishlists
  - [ ] Basic API route structure

- [ ] **Anonymous Identity System**
  - [ ] Pseudonym generator with adjective + animal logic
  - [ ] Session management utilities
  - [ ] User creation API endpoint (`/api/users/session`)

#### Afternoon (4-6 hours)

- [ ] **Gift Catalog System**

  - [ ] Gift API endpoints (`/api/gifts`)
  - [ ] Gift commitment flow (`/api/gifts/[id]/commit`)
  - [ ] Basic gift display components

- [ ] **Basic UI Components**
  - [ ] Layout with navigation
  - [ ] Gift card component with wishlist type indicators
  - [ ] Responsive grid for gift catalog

### Day 2: Real-time Features & Satirical Elements (November 6)

#### Morning (4-6 hours)

- [ ] **Leaderboard System**

  - [ ] Tier calculation logic (Bronze 250 → Ultra 1000 Lei)
  - [ ] Leaderboard API endpoint (`/api/leaderboard`)
  - [ ] Real-time leaderboard component

- [ ] **Server-Sent Events**
  - [ ] SSE endpoint (`/api/events`)
  - [ ] Event broadcasting on gift commitments
  - [ ] Client-side SSE connection management

#### Afternoon (4-6 hours)

- [ ] **Dark Pattern Implementation**

  - [ ] Popup sequence system (newsletter, cookies, etc.)
  - [ ] Satirical chatbot with typing delays
  - [ ] Fake urgency timers and scarcity alerts
  - [ ] Exit-intent popups

- [ ] **Payment Integration**
  - [ ] Revolut link generation (`https://revolut.me/razsbg/{amount}`)
  - [ ] Bandcamp "Buy as Gift" integration
  - [ ] Payment verification workflow

### Day 3: Polish, Testing & Deployment (November 7)

#### Morning (3-4 hours)

- [ ] **Advanced Features**

  - [ ] Tier card full-screen component
  - [ ] Balcony smoking session tracking
  - [ ] TV display mode with auto-rotation

- [ ] **Testing & Bug Fixes**
  - [ ] Cross-device testing (mobile, tablet, desktop)
  - [ ] Samsung TV compatibility testing
  - [ ] Performance optimization

#### Afternoon (2-3 hours)

- [ ] **Production Deployment**
  - [ ] Railway deployment configuration
  - [ ] Environment variables setup
  - [ ] Domain configuration (razsbg.top subdomain)
  - [ ] QR code generation for party access

#### Evening (1-2 hours)

- [ ] **Final Preparation**
  - [ ] Load testing with multiple concurrent users
  - [ ] Party day monitoring setup
  - [ ] Final smoke tests and backup plans

## 🎯 Priority Features by Criticality

### Must-Have (Core Functionality)

1. **Gift catalog with three wishlists** - Essential for basic functionality
2. **Anonymous identity system** - Required for tracking commitments
3. **Gift commitment flow** - Core business logic
   a. color contrast
   b. commit to purchase - save in db
   c. user committed gifts list
   d. cancel/undo commit
4. **Basic leaderboard** - Primary gamification element
5. **Payment links** - Revenue/reimbursement mechanism

### Should-Have (Enhanced Experience)

1. **Real-time updates** - Live leaderboard changes
2. **Tier card verification** - Anonymous perk system
3. **Dark pattern satirical elements** - Entertainment value
4. **TV display mode** - Party ambiance
5. **Mobile-responsive design** - Primary access method

### Could-Have (Nice Additions)

1. **Balcony smoking management** - Advanced party management
2. **Advanced dark patterns** - Enhanced satirical experience
3. **Performance optimizations** - Better user experience
4. **Detailed analytics** - Post-party insights

## 🔧 Factory.ai CLI Integration Strategy

### Phase 1: Data Layer (Use CLI for)

```bash
# Generate database utilities and seed data
"Create Drizzle database connection utilities for Railway PostgreSQL"
"Generate gift data seeding script from JSON structure"
"Build API endpoints for gift CRUD operations with TypeScript"
```

### Phase 2: Core Components (Use CLI for)

```bash
# Generate Astro components
"Create responsive gift card component with Tailwind CSS"
"Build anonymous identity management with pseudonym generation"
"Generate leaderboard component with tier visualization"
```

### Phase 3: Advanced Features (Use CLI for)

```bash
# Complex functionality
"Implement Server-Sent Events for real-time leaderboard updates"
"Create satirical dark pattern popup sequence system"
"Build Samsung TV-optimized display page with auto-rotation"
```

### Phase 4: Integration & Polish (Manual + CLI)

- Review generated code in Zed
- Refine styling and animations
- Add satirical content and humor
- Performance optimization
- Cross-device testing

## 📱 Device Testing Checklist

### Mobile Devices

- [ ] iOS Safari (iPhone 12+)
- [ ] Chrome Android (Pixel/Samsung)
- [ ] Mobile responsive breakpoints (320px-768px)
- [ ] Touch interactions and gestures
- [ ] Tier card full-screen display

### Tablet/Desktop

- [ ] iPad Safari
- [ ] Chrome/Firefox desktop
- [ ] Responsive layouts (768px-1440px)
- [ ] Multi-column gift grid
- [ ] Enhanced leaderboard view

### Samsung TV (UE50RU7102KXXH)

- [ ] Samsung Internet browser compatibility
- [ ] Large screen layout (1440px+)
- [ ] Auto-refresh functionality
- [ ] Remote-friendly navigation
- [ ] High contrast visibility

## 🚨 Deployment Configuration

### Environment Variables

```bash
# Production
DATABASE_URL=railway_postgres_connection_string
NODE_ENV=production
REVOLUT_USERNAME=razsbg
PARTY_DATE=2025-11-08

# Development
DATABASE_URL=postgresql://localhost:5432/new_home_who_dis
NODE_ENV=development
```

### Railway Project Settings

- [ ] Connect to razsbg.top domain
- [ ] Configure subdomain routing
- [ ] Set up PostgreSQL database (via `railway add`)
- [ ] Configure environment variables
- [ ] Enable service monitoring

## 💡 Factory.ai CLI Tips for This Project

### Effective Prompting Strategies

1. **Be specific about Astro**: "Generate Astro component with TypeScript"
2. **Include design system**: "Use Tailwind CSS with tier colors (purple, gold, silver, bronze)"
3. **Mention satirical context**: "Add humorous but functional dark patterns"
4. **Specify responsive needs**: "Mobile-first design with Samsung TV compatibility"

### Code Review Focus Areas

1. **TypeScript types**: Ensure proper typing for all interfaces
2. **Astro best practices**: Check for proper island hydration
3. **Performance**: Review for unnecessary re-renders or heavy operations
4. **Accessibility**: Maintain WCAG compliance despite satirical elements

### Integration Points

1. **Database queries**: Review for efficiency and proper error handling
2. **SSE implementation**: Test connection stability and error recovery
3. **State management**: Ensure proper sync between components
4. **API endpoints**: Validate request/response schemas

This roadmap provides a structured approach for hands-on development while leveraging factory.ai CLI for complex code generation and maintaining oversight through Zed editor review.
