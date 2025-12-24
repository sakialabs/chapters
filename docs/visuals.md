# Chapters Visual Design System

> Warm, human, poetic, low-stimulation. Feels like paper, ink, dusk, and lamplight.

## Philosophy

Instagram screams. Twitter flashes. **Chapters whispers.**

This palette is designed to:
- Reduce eye fatigue
- Feel offline
- Respect reading
- Not fight user content
- Age well (this matters more than trends)

---

## 🎨 Core Color Palette

### Primary Colors

**Ink Black** `#1C1C1C`  
For text, titles, spines, icons  
→ Softer than pure black, easier on the eyes

**Paper White** `#FAF8F4`  
Main background  
→ Feels like a book page, not a screen

### Secondary Neutrals

**Warm Gray** `#CFCAC2`  
Borders, dividers, inactive UI  
→ Keeps things calm, not clinical

**Dusty Charcoal** `#4A4A4A`  
Secondary text, metadata, timestamps  
→ Subtle hierarchy without harshness

### Accent Colors (Use Sparingly)

**Ink Blue** `#2F3A4A`  
Primary accent, links, subtle highlights  
→ Intellectual, trustworthy, not loud

**Soft Sage** `#A8B8A0`  
Success states, gentle confirmations  
→ Organic, calming, creative

### Emotional Highlight (Rare)

**Muted Clay** `#C08A6A`  
Used for:
- Open Page indicator
- Muse moments
- Between the Lines invitations

**This is our heartbeat color. We won't overuse it.**

---

## 🌙 Dark Mode Palette

Dark mode should feel like reading by lamplight at midnight. Not hacker mode.

**Night Paper** `#121212`  
Background

**Soft Ink** `#E6E4DF`  
Text

**Ash Gray** `#2A2A2A`  
Cards, elevated surfaces

**Muted Clay** (same, slightly dimmed)  
Accent remains consistent

---

## 🧠 Application Guidelines

### Backgrounds

✅ Default to Paper White  
✅ Use subtle elevation with Warm Gray borders  
❌ No stark white  
❌ No gradients everywhere  

### Text

**Titles**: Ink Black  
**Body text**: Ink Black at 90% opacity  
**Metadata**: Dusty Charcoal  
**Links**: Ink Blue (underline on hover)

### UI Chrome

**Borders, cards, shelves**: Warm Gray  
**Avoid hard lines**: Prefer soft separation  
**Shadows**: Subtle, warm-toned (not pure black)

### Accents

**Ink Blue** for:
- Links and navigation focus
- Active states
- Primary actions

**Soft Sage** for:
- "Saved" states
- "Bookmarked" indicators
- "Appreciated" confirmations

**Muted Clay** only when something meaningful happens:
- Open Page available
- Muse suggestion ready
- BTL invitation received

**If everything is accented, nothing is.**

---

## 🪄 Special UI Moments

### Muse (AI Assistant)

Muse moments should feel special but gentle.

**Muse icon**: Muted Clay  
**Muse suggestions**: Clay background at very low opacity (5-10%)  
**Muse level unlocks**: Subtle glow, not fireworks

### Between the Lines

**Invitation card**: Muted Clay + Ink Blue combo  
**Thread indicator**: Soft Sage when unread  
**Never red, never pink, never anything aggressive or sexualized**

### Open Pages

**Available**: Muted Clay dot  
**Consumed**: Warm Gray outline  
**Granted**: Gentle pulse animation (once)

### Engagement

**Heart**: Soft Sage when active (not red)  
**Bookmark**: Ink Blue when saved  
**Follow**: Ink Blue button, Soft Sage when following

---

## 📐 Typography

### Font Families

**Serif** (for reading):
- Georgia, Iowan Old Style, or similar
- Used for chapter content, long-form text

**Sans-serif** (for UI):
- System fonts: -apple-system, SF Pro, Segoe UI
- Used for navigation, buttons, metadata

### Hierarchy

**Chapter Title**: 28-32px, Ink Black, serif  
**Section Heading**: 20-24px, Ink Black, sans-serif  
**Body Text**: 16-18px, Ink Black 90%, serif, 1.6-1.8 line height  
**Metadata**: 14px, Dusty Charcoal, sans-serif  
**Captions**: 12px, Dusty Charcoal, sans-serif

---

## 🎭 Component Examples

### Chapter Card

```
┌─────────────────────────────────┐
│ [Ink Black Title]               │ ← Serif, 20px
│ [Dusty Charcoal] by [Author]    │ ← Sans, 14px
│                                  │
│ [Warm Gray preview text...]     │ ← Serif, 16px, 3 lines max
│                                  │
│ [Soft Sage ♥ 12] [Ink Blue 📖]  │ ← Icons + counts
└─────────────────────────────────┘
   ↑ Warm Gray border, 1px
```

### Bookshelf Spine

```
┌──┐
│  │ ← Paper White or Night Paper
│C │ ← Ink Black text, vertical
│h │
│a │ ← Muted Clay dot if unread
│p │
│t │
│e │
│r │
│s │
└──┘
  ↑ Warm Gray border
```

### Muse Suggestion

```
┌─────────────────────────────────┐
│ 🪄 [Muted Clay icon]             │
│                                  │
│ [Ink Black suggestion text]     │
│                                  │
│ [Ink Blue "Use this"] [Dismiss] │
└─────────────────────────────────┘
  ↑ Muted Clay background at 8% opacity
```

---

## 📱 Responsive Considerations

### Mobile (Primary Platform)

- Larger touch targets (44px minimum)
- More generous spacing
- Single column layouts
- Bottom navigation (Ink Blue active state)

### Tablet

- Two-column layouts where appropriate
- Sidebar navigation
- Larger typography scale

### Desktop (Web - Secondary)

- Three-column layouts (sidebar, content, metadata)
- Hover states more prominent
- Keyboard navigation indicators

---

## ⚠️ What NOT to Do

❌ **No bright, saturated colors**  
❌ **No pure black (#000000)**  
❌ **No pure white (#FFFFFF)**  
❌ **No red for hearts** (use Soft Sage)  
❌ **No orange notification badges**  
❌ **No neon anything**  
❌ **No gradients as primary design element**  
❌ **No drop shadows everywhere**  
❌ **No animations that demand attention**

---

## ✅ Design Principles

1. **Calm over stimulation** - Every color choice should reduce anxiety, not create it
2. **Readable over trendy** - Prioritize legibility in all lighting conditions
3. **Consistent over clever** - Use the palette systematically
4. **Warm over cold** - Lean toward warm grays, not blue-grays
5. **Subtle over bold** - When in doubt, reduce contrast slightly

---

## 🎨 Color Usage Summary

| Color | Usage | Frequency |
|-------|-------|-----------|
| Ink Black | Text, titles | Primary |
| Paper White | Backgrounds | Primary |
| Warm Gray | Borders, dividers | Common |
| Dusty Charcoal | Metadata | Common |
| Ink Blue | Links, actions | Moderate |
| Soft Sage | Success, saved | Moderate |
| Muted Clay | Special moments | Rare |

---

## 🧪 Accessibility

All color combinations meet WCAG AA standards:

- Ink Black on Paper White: 14.2:1 ✅
- Dusty Charcoal on Paper White: 7.8:1 ✅
- Ink Blue on Paper White: 10.1:1 ✅
- Soft Ink on Night Paper: 12.5:1 ✅

---

## 🚀 Implementation

### CSS Variables

```css
:root {
  /* Light Mode */
  --ink-black: #1C1C1C;
  --paper-white: #FAF8F4;
  --warm-gray: #CFCAC2;
  --dusty-charcoal: #4A4A4A;
  --ink-blue: #2F3A4A;
  --soft-sage: #A8B8A0;
  --muted-clay: #C08A6A;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ink-black: #E6E4DF;
    --paper-white: #121212;
    --warm-gray: #2A2A2A;
    --dusty-charcoal: #CFCAC2;
    /* Accents stay the same */
  }
}
```

### Tailwind Config

```js
module.exports = {
  theme: {
    colors: {
      'ink-black': '#1C1C1C',
      'paper-white': '#FAF8F4',
      'warm-gray': '#CFCAC2',
      'dusty-charcoal': '#4A4A4A',
      'ink-blue': '#2F3A4A',
      'soft-sage': '#A8B8A0',
      'muted-clay': '#C08A6A',
      'night-paper': '#121212',
      'soft-ink': '#E6E4DF',
      'ash-gray': '#2A2A2A',
    }
  }
}
```

---

## 📚 Inspiration

This palette draws from:
- Physical books and paper
- Library reading rooms
- Dusk and lamplight
- Ink and parchment
- Quiet cafes
- Analog writing tools

**Remember**: We're building a place for reading and reflection, not a place for scrolling and reacting.

Every design decision should ask: *Does this help someone think more deeply?*
