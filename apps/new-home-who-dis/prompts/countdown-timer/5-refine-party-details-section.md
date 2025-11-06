### Prompt 5: Refine Party Details Section

```
Update the existing party details section to improve readability and visual hierarchy.

TITLE UPDATES:
- Add emoji icons: <Emoji icon="🎉" className="w-6 h-6 inline" /> before and after "Party Details"
- Font: font-display text-3xl font-bold text-text-primary text-center
- Spacing: mb-8 md:mb-12

CONTAINER UPDATES:
- Background: bg-bg-card (#232323)
- Border: border border-brand-secondary/20
- Rounded: rounded-2xl (16px)
- Padding: p-8 md:p-10
- Width: max-w-2xl mx-auto
- Shadow: shadow-xl

LIST ITEM STRUCTURE:
- Layout: space-y-6 for vertical spacing between items

Each detail item:
- Container: flex items-start gap-4
- Icon: <Emoji icon="[respective emoji]" className="w-6 h-6 flex-shrink-0 mt-1" />
- Content wrapper: flex-1

CONTENT STYLING:
- Label (Date, Time, Location, etc.):
  * Font: font-display
  * Size: text-lg
  * Weight: font-semibold
  * Color: text-text-primary
  * Spacing: mb-1

- Value text:
  * Font: font-sans
  * Size: text-base
  * Color: text-text-secondary
  * Line height: leading-relaxed

SPECIAL FORMATTING:
- "sharp" in Time: text-brand-accent font-semibold
- Wishlist pills (Traditional, Receipt, Bandcamp):
  * Style: bg-bg-dark px-3 py-1 rounded-full text-sm inline-block mr-2
- Features list: Comma-separated inline text

ANIMATIONS TO ADD:
- Items: Staggered slide-in from left (delay: 0ms, 100ms, 200ms, etc.)
- Icons: scale(1.1) on item hover
- Pills: hover:bg-brand-primary/20 transition-colors

Keep existing content and emoji assignments. Only update styling and add animations.
```
