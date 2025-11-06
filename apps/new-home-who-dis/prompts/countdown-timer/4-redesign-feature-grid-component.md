### Prompt 4: Redesign Feature Grid Component

```
Update the existing "What to Expect" feature grid to improve card design and interactions.

TITLE UPDATES:
- Add emoji icons: <Emoji icon="✨" className="w-6 h-6 inline" /> before and after "What to Expect"
- Font: font-display text-3xl font-bold text-text-primary
- Alignment: text-center
- Spacing: mb-8 md:mb-12

GRID STRUCTURE:
- Layout: grid grid-cols-1 md:grid-cols-2 gap-6
- Container: max-w-4xl mx-auto px-6

CARD REFINEMENTS:
- Background: bg-bg-card (#232323)
- Border: border border-white/5
- Rounded: rounded-xl (12px)
- Padding: p-6
- Shadow: shadow-lg
- Hover state: Add hover:translate-y-[-4px] hover:shadow-2xl transition-all duration-300

CARD CONTENT UPDATES:
Each card (Aggressive UX, Competitive Gifting, Mobile-First, TV Display Mode):

- Icon: <Emoji icon="[respective emoji]" className="w-6 h-6 mb-3" />
- Title:
  * Font: font-display
  * Size: text-xl
  * Weight: font-semibold
  * Color: Use tier-specific colors (brand-primary, gold-tier, brand-secondary, ultra-tier)
  * Spacing: mb-2
- Description:
  * Font: font-sans
  * Size: text-sm md:text-base
  * Color: text-text-secondary
  * Line height: leading-relaxed

ANIMATIONS TO ADD:
- Cards: Staggered fade-in on scroll (delay: 0ms, 50ms, 100ms, 150ms)
- Hover: scale(1.02) with shadow growth
- Icon: Gentle bounce on card hover (transform translateY(-2px))

Keep existing card content and emoji choices. Only update styling and add interactions.
```
