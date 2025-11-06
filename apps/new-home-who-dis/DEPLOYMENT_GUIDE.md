# Deployment Guide - Monorepo Subdomain Setup

## Overview

This app will be deployed as a separate Vercel project within your existing monorepo, accessible via subdomains of razsbg.top.

## Subdomain Architecture

### Main App: `party.razsbg.top`

- Primary gift registry interface
- Mobile-first responsive design
- Gift browsing, commitment flow, leaderboard
- Tier card display for perk verification

### TV Display: `tv.razsbg.top`

- Samsung TV-optimized interface (UE50RU7102KXXH)
- Auto-rotating views (leaderboard → recent activity → tier perks)
- Large fonts and high contrast for distance viewing
- Auto-refresh every 30 seconds

## Vercel Project Setup

### 1. Create New Vercel Project

```bash
# From your monorepo root
cd apps/new-home-who-dis
vercel --name new-home-who-dis
```

### 2. Configure Custom Domains

In Vercel dashboard for the new project:

- Add custom domain: `party.razsbg.top`
- Add custom domain: `tv.razsbg.top` (for TV display)

### 3. Environment Variables

Set in Vercel dashboard:

```bash
POSTGRES_URL=your_vercel_postgres_connection_string
NODE_ENV=production
REVOLUT_USERNAME=razsbg
PARTY_DATE=2025-11-08
```

### 4. Database Setup

```bash
# Create Vercel Postgres database
vercel postgres create new-home-who-dis-db

# Run migrations
pnpm db:generate
pnpm db:migrate
```

## Monorepo Integration

### Project Structure

```
your-monorepo/
├── apps/
│   ├── website/          # Existing razsbg.top
│   └── new-home-who-dis/ # New party app
├── packages/             # Shared utilities (if any)
├── turbo.json           # Turborepo configuration
└── package.json         # Root package.json
```

### Turborepo Configuration (Optional)

If using Turborepo, add to `turbo.json`:

```json
{
  "pipeline": {
    "new-home-who-dis#build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "new-home-who-dis#dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Package.json Scripts

Add to root `package.json`:

```json
{
  "scripts": {
    "dev:party": "cd apps/new-home-who-dis && pnpm dev",
    "build:party": "cd apps/new-home-who-dis && pnpm build",
    "deploy:party": "cd apps/new-home-who-dis && vercel --prod"
  }
}
```

## TV Display Route Configuration

The app automatically handles TV display routing:

### Route: `/tv-display`

- Optimized for Samsung Smart TV
- Auto-rotation between views
- Large fonts (minimum 24px)
- High contrast colors
- No interaction required

### TV Access

Navigate Samsung TV browser to: `https://tv.razsbg.top/tv-display`

## Development Workflow

### Local Development

```bash
# From monorepo root
cd apps/new-home-who-dis

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with local database URL

# Start development server
pnpm dev
# App available at http://localhost:4000
```

### Deployment

```bash
# Deploy to staging
pnpm vercel

# Deploy to production
pnpm vercel --prod
```

## DNS Configuration

### A/CNAME Records

Your DNS provider needs these records:

```
party.razsbg.top  →  CNAME  →  cname.vercel-dns.com
tv.razsbg.top     →  CNAME  →  cname.vercel-dns.com
```

### Verification

After DNS propagation (up to 24 hours):

- `https://party.razsbg.top` → Main app
- `https://tv.razsbg.top` → TV display
- `https://tv.razsbg.top/tv-display` → Direct TV route

## Monitoring & Analytics

### Vercel Analytics

Automatically enabled for both subdomains:

- Real-time visitor count
- Page performance metrics
- Error tracking

### Custom Monitoring

Built-in monitoring for:

- Active concurrent users
- Gift commitment rate
- Real-time leaderboard updates
- API response times

## Security Considerations

### CORS Configuration

Both subdomains share the same origin policy:

```javascript
// Astro middleware
const allowedOrigins = [
  "https://party.razsbg.top",
  "https://tv.razsbg.top",
  "http://localhost:4000", // Development
]
```

### Rate Limiting

API endpoints protected with rate limiting:

- Gift commitments: 10 per minute per IP
- Pseudonym generation: 5 per minute per IP
- SSE connections: 2 per user

## Troubleshooting

### Common Issues

**1. Subdomain not resolving**

- Check DNS propagation: `dig party.razsbg.top`
- Verify Vercel domain configuration
- Clear browser DNS cache

**2. TV display not loading**

- Samsung TV browser compatibility
- Check network connectivity
- Try direct URL: `tv.razsbg.top/tv-display`

**3. Real-time updates not working**

- Check SSE endpoint: `/api/events`
- Verify database connection
- Monitor Vercel function logs

### Debug Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Check domain configuration
vercel domains ls
```

## Post-Deployment Checklist

### Before Party Day (Nov 8)

- [ ] Both subdomains accessible
- [ ] Database migrations completed
- [ ] Gift data seeded
- [ ] TV display tested on Samsung TV
- [ ] QR codes generated for party entry
- [ ] Countdown timer active (if implementing)
- [ ] Load testing completed (50+ concurrent users)

### Party Day Monitoring

- [ ] Real-time updates functioning
- [ ] Mobile responsiveness working
- [ ] Payment links generating correctly
- [ ] Tier card display working
- [ ] TV auto-refresh active
- [ ] Error monitoring active

This setup ensures your new-home-who-dis app operates independently while leveraging your existing razsbg.top domain infrastructure.
