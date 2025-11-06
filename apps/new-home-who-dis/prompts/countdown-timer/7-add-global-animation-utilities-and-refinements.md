### Prompt 7: Add Global Animation Utilities & Refinements

```
Extend existing Tailwind configuration and global styles to support new micro-interactions.

ADD TO TAILWIND.CONFIG.JS animations:

```

animation: {
'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
'fade-in-up': 'fade-in-up 0.5s ease-out',
'scale-in': 'scale-in 0.3s ease-out',
'digit-flip': 'digit-flip 0.4s ease-out',
},
keyframes: {
'pulse-glow': {
'0%, 100%': { borderColor: 'rgba(255, 61, 113, 0.2)' },
'50%': { borderColor: 'rgba(255, 61, 113, 0.6)' },
},
'gradient-shift': {
'0%, 100%': { backgroundPosition: '0% 50%' },
'50%': { backgroundPosition: '100% 50%' },
},
'fade-in-up': {
'0%': { opacity: '0', transform: 'translateY(20px)' },
'100%': { opacity: '1', transform: 'translateY(0)' },
},
'scale-in': {
'0%': { opacity: '0', transform: 'scale(0.95)' },
'100%': { opacity: '1', transform: 'scale(1)' },
},
'digit-flip': {
'0%': { transform: 'rotateX(0deg)', opacity: '1' },
'50%': { transform: 'rotateX(90deg)', opacity: '0' },
'100%': { transform: 'rotateX(0deg)', opacity: '1' },
},
}

```

ADD GLOBAL CSS UTILITIES (to global.css or component):

```

.text-glow {
text-shadow: 0 0 20px rgba(255, 61, 113, 0.6);
}

.card-hover {
@apply transition-all duration-300 ease-out;
}

.card-hover:hover {
@apply -translate-y-1 shadow-2xl;
}

.spring-bounce {
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

```

UPDATE EXISTING COLORS:
- Ensure bg-bg-dark: #1A1A1A is added
- Ensure bg-bg-card: #232323 is added
- Ensure text-text-primary: #F5F5F0 is added
- Ensure text-text-secondary: #9CA3AF is added

APPLY UTILITIES TO COMPONENTS:
- All cards: Add card-hover class
- Countdown digits: Add digit-flip class on value change trigger
- Logo segments: Add fade-in-up with staggered delays
- Borders where specified: Add pulse-glow animation

Keep all existing Tailwind config values. Only extend with new utilities.
```
