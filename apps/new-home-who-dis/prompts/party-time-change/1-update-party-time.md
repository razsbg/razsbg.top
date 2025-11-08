Perfect! Here's the updated factory.ai CLI prompt:

---

## Factory.ai CLI Prompt

```
Update the countdown landing page (likely index.astro or home page) with the following changes:

1. TIME CHANGE ANNOUNCEMENT (NEW COMPONENT):
   Insert a prominent announcement component BETWEEN the page title and countdown timer:
   - Large, bold text: "⚠️ Time Changed: Party starts at 4 PM"
   - Style as an attention-grabbing banner (use brand satirical red #FF6B6B or bright warning color)
   - Larger font size than body text to ensure visibility
   - Add subtle animation or styling to draw attention

2. PARTY TIME UPDATE:
   - Change event time from 3 PM to 4 PM (November 8, 2025, 4:00 PM EET)
   - Update countdown timer component to reflect 4 PM start time
   - Ensure all time references display "4 PM" or "16:00"

3. NEW SECTIONS (INSERT IMMEDIATELY AFTER COUNTDOWN COMPONENT):
   Position order from top: Title → Announcement → Countdown → [NEW SECTIONS START HERE]

   Section A - Traditional Wishlist:
   - Header: "Traditional Wishlist"
   - Link button to traditional wishlist URL -https://docs.google.com/spreadsheets/d/1LtMperz7DUAZwo4feNjfS67cOcKdZb7IIks3tlA_EKs/edit?usp=sharing
   - Helper text: "Browse the Google Spreadsheet, pick something you'd like to gift, mark it as 'taken' in the sheet, then order and arrange delivery yourself. No payment details shared—just claim your gift and handle the rest!"

   Section B - Bandcamp Wishlist:
   - Header: "Bandcamp Digital Wishlist"
   - Link button to Bandcamp wishlist URL - https://bandcamp.com/razsbg/wishlist
   - Helper text: "Support music directly! Use Bandcamp's 'Buy as Gift' feature to send albums/tracks. Digital gifts delivered instantly to my account."

   Section C - Slippers Notice:
   - Prominent callout box with icon/emoji
   - Text: "⚠️ Bring your own slippers! I only have 2 pairs 👟"
   - Style with light background and border to stand out

   Section D - Drinks Menu:
   - Header: "What's Pouring"
   - List items with emojis:
     * 🍷 Medium-dry white wine
     * 🌸 Rosé
     * 🍸 Gin
     * 🥃 Rum
     * 🥃 Whiskey

   Section E - Food:
   - Header: "Food"
   - "🍕 Pizza"

4. LAYOUT & HIERARCHY:
   Clear page structure:
```

[Page Title]
[⚠️ TIME CHANGED ANNOUNCEMENT - NEW]
[Countdown Timer]
--- NEW SECTIONS START ---
[Traditional Wishlist]
[Bandcamp Wishlist]
[Slippers Notice]
[Drinks Menu]
[Food]

```

STYLE REQUIREMENTS:
- Framework: Astro 5 with TypeScript, Tailwind CSS
- Maintain "new-home-who-dis™️" satirical branding
- Brand colors: satirical red (#FF6B6B), playful teal (#4ECDC4)
- Mobile-first responsive design
- Time change announcement should be eye-catching and impossible to miss
- All new sections grouped in a cohesive content area below countdown
- Wishlist link buttons: target="_blank" rel="noopener noreferrer"
- Maintain accessibility (heading hierarchy, ARIA labels)

TECHNICAL NOTES:
- Update countdown timer target datetime to November 8, 2025, 16:00 EET
- Keep existing countdown logic intact, only change target time
- New sections should be clearly separated visually but maintain flow
```
