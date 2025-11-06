### Prompt 8: Content updates & footer section

```
Update existing content across the countdown page and add a minimalist footer section.

CONTENT UPDATES:
1. Warning Banner Footer Text:
   - FIND: "Brought to you by questionable design decisions and genuine hospitality"
   - REPLACE: "Powered by questionable UX decisions and Romanian hospitality ™️"
   - Style: Keep existing italic text-sm text-text-secondary/80 mt-4

2. Warning Banner Fine Print:
   - FIND: "No actual data will be harvested for evil purposes. Probably."
   - REPLACE: "No actual data will be harvested. Promises not legally binding. 🤞"
   - Style: Keep existing styling (if separate element) or include as additional line

ADD NEW FOOTER SECTION:

Position: At bottom of page, after Coming Soon section

STRUCTURE:
- Container: bg-bg-dark border-t border-white/10 py-8 mt-auto
- Inner wrapper: max-w-4xl mx-auto px-6

LAYOUT (three-column grid):
- Grid: grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center

Column 1 (Left) - Branding:
- Mini logo: "new-home-who-dis™️" in text-sm font-display font-semibold
  * Color gradient: Same as header (new-=brand-primary, home-=text-primary, who-=text-secondary, dis=gradient, ™️=brand-accent)
- Tagline below: "Experience-driven housewarming" in text-xs text-text-secondary mt-1

Column 2 (Center) - Essential Links:
- Flex row: flex items-center justify-center gap-4 flex-wrap
- Links (if applicable, otherwise skip):
  * "About" text-sm text-text-secondary hover:text-text-primary transition-colors
  * Separator: "•" in text-text-secondary/50
  * "Contact" (same styling)
- If no links needed, use: text-center text-xs text-text-secondary "Iași, Romania • November 8, 2025"

Column 3 (Right) - Meta:
- Text alignment: text-left md:text-right
- Copyright: "© 2025 new-home-who-dis™️" in text-xs text-text-secondary
- Build info below: "Built with love and dark patterns 💀" in text-xs text-text-secondary/60 mt-1 italic

RESPONSIVE:
- Mobile: Stack columns vertically (grid-cols-1), center all text
- Desktop: Three-column layout with left/center/right alignment

STYLING:
- All links: transition-colors duration-200
- Hover states: text-text-secondary → text-text-primary
- Minimal spacing: Keep footer compact (py-8 total)

ACCESSIBILITY:
- Footer semantic tag: <footer> with role="contentinfo"
- Links: Proper contrast ratio (4.5:1 minimum)
- Touch targets: At least 44×44px on mobile

Update only content text and add footer section. Keep all existing component functionality and styling intact.
```
