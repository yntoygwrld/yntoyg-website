# Resend Mobile Design Guide

Comprehensive design specifications extracted from resend.com for mobile (390px viewport).

Last Updated: December 2024

---

## SPACING & LAYOUT

### Container Padding (CRITICAL)
```css
/* Mobile horizontal padding - CONSISTENT across all sections */
padding-left: 24px;
padding-right: 24px;

/* Tailwind equivalent */
px-6 /* = 24px */
```

### Section Padding
```css
/* Vertical section spacing */
padding-top: 48px;
padding-bottom: 48px;

/* Tailwind equivalent */
py-12 /* = 48px */
```

### Content Max Width
```css
max-width: 768px; /* hero content */
max-width: 1024px; /* section paragraphs */
```

---

## TYPOGRAPHY

### Hero Headline (H1)
```css
font-family: domaine; /* serif font */
font-size: 64px;
font-weight: 400; /* NORMAL, not bold */
line-height: 64px; /* 1.0 ratio - tight */
color: rgb(240, 240, 240); /* #f0f0f0 - off-white */
text-align: center; /* on mobile */
```

### Section Headings (H2)
```css
font-family: domaine; /* serif font */
font-size: 48px;
font-weight: 400; /* NORMAL weight */
line-height: 57.6px; /* 1.2 ratio */
color: rgb(240, 240, 240);
margin-bottom: 8px;
text-align: center;
```

### Description/Body Text
```css
font-family: inter, ui-sans-serif, system-ui, sans-serif;
font-size: 16px;
font-weight: 400;
line-height: 28px; /* 1.75 ratio - generous */
color: rgb(161, 164, 165); /* #a1a4a5 - muted gray */
margin-bottom: 32px;
text-align: center; /* on mobile */
```

### Section Paragraph (below headings)
```css
font-size: 16px;
line-height: 24px; /* 1.5 ratio */
color: rgb(161, 164, 165);
margin-bottom: 48px;
text-align: center;
```

---

## COLORS

### Background
```css
background-color: rgb(0, 0, 0); /* pure black */
```

### Text Colors
```css
/* Primary text (headlines) */
color: rgb(240, 240, 240); /* #f0f0f0 - off-white */

/* Secondary/muted text (descriptions, links) */
color: rgb(161, 164, 165); /* #a1a4a5 - gray */

/* Accent/Gold (highlights) */
color: rgb(255, 202, 22); /* #ffca16 - bright gold */
```

### Color Opacity Notes
- Headlines: Near-white, not pure white
- Descriptions: Distinctly muted, ~60% opacity feel
- Accent used sparingly for emphasis words

---

## BUTTONS

### Primary Button (Get Started)
```css
font-size: 14px;
font-weight: 600; /* semi-bold */
height: 40px;
padding: 0 16px;
border-radius: 16px; /* very rounded */
color: rgb(255, 255, 255);

/* Glass gradient background */
background: linear-gradient(104deg, rgba(253, 253, 253, 0.05) 5%, rgba(240, 240, 228, 0.1) 100%);
border: 2px solid rgba(255, 255, 255, 0.05);
backdrop-filter: blur(25px);

/* On mobile - full width */
width: 100%;
```

### Secondary Button/Link (Documentation)
```css
font-size: 16px; /* larger than primary */
font-weight: 600;
color: rgb(161, 164, 165); /* muted gray */
/* No background, no border - just text */
text-align: center;
```

### Button Container
```css
display: flex;
flex-direction: column; /* stacked on mobile */
gap: 16px;
/* Tailwind: flex flex-col gap-4 */
```

---

## KEY DESIGN PRINCIPLES

### 1. Generous Horizontal Padding
- Always 24px (px-6) on mobile
- Creates breathing room, prevents edge-to-edge cramping
- Consistent across ALL sections

### 2. Muted Secondary Text
- Use #a1a4a5 for descriptions, not white
- Creates visual hierarchy without being too faint
- Makes gold accents pop more

### 3. Light Font Weights for Headlines
- font-weight: 400 (normal) for serif headlines
- Elegant, refined feel vs. heavy bold
- Let the size do the work, not the weight

### 4. Tight Line Heights for Headlines
- H1: line-height equals font-size (1.0)
- H2: line-height 1.2x font-size
- Body: line-height 1.5-1.75x for readability

### 5. Center Alignment on Mobile
- All text centered on mobile viewport
- Creates balanced, app-like feel
- Switch to left-align on desktop if desired

### 6. Glass Button Style
- Subtle gradient (5-10% opacity range)
- Backdrop blur for depth
- Very rounded corners (16px)
- Thin, nearly invisible border

### 7. Section Spacing
- 48px vertical padding between sections
- 8px gap between heading and description
- 32-48px gap between description and content

---

## TAILWIND CLASS EQUIVALENTS

### Container
```jsx
className="px-6" // 24px horizontal padding
```

### Hero H1
```jsx
className="text-[64px] font-normal leading-[1] text-[#f0f0f0] font-serif text-center"
```

### H2 Sections
```jsx
className="text-5xl font-normal leading-[1.2] text-[#f0f0f0] font-serif text-center mb-2"
```

### Description Text
```jsx
className="text-base leading-7 text-[#a1a4a5] text-center mb-8"
// or
className="text-base font-normal text-white/50" // using opacity
```

### Section Container
```jsx
className="py-12 px-6" // 48px vertical, 24px horizontal
```

### Primary Button
```jsx
className="w-full h-10 px-4 text-sm font-semibold rounded-2xl"
// Plus glass effect via custom CSS
```

### Button Gap
```jsx
className="flex flex-col gap-4" // 16px gap, stacked
```

---

## COMPARISON: YNTOYG vs RESEND

| Element | YNTOYG Current | Resend Target |
|---------|---------------|---------------|
| Mobile padding | px-4 (16px) | px-6 (24px) |
| H1 size | text-5xl (48px) | text-[64px] |
| H1 weight | font-normal | font-normal (good) |
| Desc color | white/50 | #a1a4a5 |
| Desc line-height | default | leading-7 (28px) |
| Button height | varies | h-10 (40px) |
| Button font | 14px | 14px (good) |
| Button radius | rounded-2xl | rounded-2xl (good) |
| Section padding | py-16 | py-12 |

---

## IMPLEMENTATION CHECKLIST

- [ ] Update px-4 to px-6 across all mobile sections
- [ ] Increase H1 to 64px on mobile
- [ ] Set description color to #a1a4a5 (not white/50)
- [ ] Add leading-7 (28px line-height) to descriptions
- [ ] Ensure buttons are 40px height
- [ ] Center-align all text on mobile
- [ ] Update section padding to py-12 (48px)
- [ ] Use font-weight 400 for headings

---

## SOURCES

- Resend.com homepage (December 2024)
- Mobile viewport: 390px (iPhone 14 Pro)
- CSS extracted via browser DevTools
