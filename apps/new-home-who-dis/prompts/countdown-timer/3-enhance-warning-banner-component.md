### Prompt 3: Enhance Warning Banner Component

```
Update the existing warning banner to match new color scheme and add subtle animations.

CONTAINER UPDATES:
- Background: Change to bg-bg-card (#232323)
- Border: Update to border-2 border-brand-primary (#FF3D71)
- Corner radius: Ensure rounded-xl (12px)
- Padding: Update to p-6 md:p-8
- Width: max-w-3xl mx-auto
- Spacing: my-12

HEADER REFINEMENTS:
- Container: flex items-center justify-center gap-2 mb-4
- Warning text:
  * Color: text-brand-primary
  * Font: font-display
  * Size: text-2xl md:text-3xl
  * Weight: font-bold
- Emoji icons: <Emoji icon="⚠️" className="w-6 h-6" /> on both sides

BODY TEXT UPDATES:
- Text color: text-text-primary
- Font: font-sans
- Size: text-base md:text-lg
- Line height: leading-relaxed
- Alignment: text-center
- Highlight keywords in text-brand-primary/80: "dark patterns", "competitive anxiety", "uncontrollable laughter"

FOOTER TEXT (if exists):
- Update to: "Powered by questionable UX decisions and Romanian hospitality ™️"
- Style: italic text-sm text-text-secondary/80 mt-4

ANIMATIONS TO ADD:
- Border pulse: Animate border color brand-primary → brand-accent → brand-primary (3s infinite)
- Fade-in on mount: opacity-0 animate-fade-in-up
- Keyword hover: Slight text-shadow glow effect on highlighted words

Keep existing content structure. Only update colors, typography, and add animations.
```
