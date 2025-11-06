### Prompt 1: Update Landing Page Container & Brand Lockup

```
Update the existing countdown landing page to enhance visual hierarchy and brand identity.

CHANGES TO BRAND LOCKUP:
- Modify logo text spans to apply differentiated colors:
  * "new-" → text-brand-primary (#FF3D71)
  * "home-" → text-primary (#F5F5F0)
  * "who-" → text-text-secondary (#9CA3AF)
  * "dis" → Apply gradient: bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent
  * "™️" → text-brand-accent (#FFE66D) with animate-wiggle class

- Update typography:
  * Font: Change to font-display (Space Grotesk if not already)
  * Size: text-4xl md:text-5xl lg:text-6xl
  * Weight: font-bold with tracking-tight

- Enhance tagline styling:
  * Font: font-display italic
  * Size: text-lg md:text-xl
  * Color: text-text-secondary
  * Spacing: mt-2 mb-12

BACKGROUND & SPACING UPDATES:
- Set body/main background to bg-bg-dark (#1A1A1A)
- Update container max-width to max-w-4xl mx-auto
- Increase top padding to pt-12 md:pt-16
- Add px-6 for horizontal padding

ANIMATIONS TO ADD:
- Logo segments: Staggered fade-in-up animation (delay: 0ms, 100ms, 200ms, 300ms, 400ms per word)
- ™️: Apply continuous wiggle animation from tailwind.config
- Gradient on "dis": Add animate-gradient-shift for subtle movement

Keep all existing functionality and component structure. Only update styling and animations.
```
