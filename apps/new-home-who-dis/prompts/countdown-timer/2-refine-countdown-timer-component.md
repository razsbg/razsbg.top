### Prompt 2: Refine Countdown Timer Component

```
Update the existing countdown timer component to improve visual design and add micro-interactions.

CONTAINER REFINEMENTS:
- Background: Update to bg-bg-card (#232323)
- Border: Change to border border-brand-primary/20 with animate-pulse-glow
- Rounded corners: Ensure rounded-2xl (16px)
- Padding: Update to p-8 md:p-12
- Shadow: Add shadow-2xl for depth

TYPOGRAPHY UPDATES:
- Title "The Party Starts In:":
  * Font: font-display
  * Size: text-2xl md:text-3xl
  * Color: text-text-primary
  * Weight: font-semibold
  * Spacing: mb-8
  * Alignment: text-center

DIGIT STYLING:
- Update digit display:
  * Font: font-mono (JetBrains Mono)
  * Size: text-5xl md:text-6xl lg:text-7xl
  * Color: text-brand-secondary (#4ECDC4)
  * Weight: font-bold
  * Letter spacing: tracking-tight

- Update label text (Days, Hours, etc):
  * Font: font-sans
  * Size: text-xs md:text-sm
  * Transform: uppercase
  * Spacing: tracking-wide
  * Color: text-text-secondary
  * Margin: mt-2

GRID LAYOUT:
- Adjust grid spacing: gap-4 md:gap-6 lg:gap-8
- Ensure 4-column layout on desktop: grid-cols-4
- Consider 2x2 grid on mobile if space is tight: grid-cols-2 sm:grid-cols-4

EMOJI ICON:
- Add <Emoji icon="⏰" className="w-6 h-6" /> positioned absolute top-4 right-4 of card

ANIMATIONS TO ADD:
- Digit flip transition when value changes:
  * Transition: transition-all duration-300 ease-out
  * Effect: Briefly scale(1.1) and reduce opacity(0.7) then return to normal
- Border glow: Use animate-pulse-slow (2s interval) on border

RESPONSIVE BEHAVIOR:
- Mobile (<640px): Smaller text, tighter spacing
- Tablet (640-1024px): Medium sizing
- Desktop (>1024px): Full sizing with generous spacing

Keep existing countdown logic and time calculation intact. Only update visual styling and add animations.
```
