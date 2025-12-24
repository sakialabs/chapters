# 🎭 Muse — Creative Companion

Muse is a gentle creative companion woven into Chapters. Not a chatbot. Not a coach. A presence.

## Core Principles

**Muse is:**
- Calm, concise, reflective
- Always opt-in
- Never pushy or needy
- Observant but quiet

**Muse never:**
- Auto-posts
- Pushes engagement
- Nags or guilt-trips
- Sounds like marketing

## Where Muse Lives

### 1. Global Access (Muse Drawer)
- Icon in main navigation labeled "Muse"
- Opens side drawer (web) or bottom sheet (mobile)
- Contains clear actions:
  - "Give me a writing prompt"
  - "Help me shape a draft"
  - "Reflect on my recent chapters" (later)

### 2. Inline in Study/Composer
- Small "Ask Muse" actions in draft editor:
  - "Ask Muse for a first line" (empty draft)
  - "Ask Muse for a title"
  - "Tighten this" (selected text)
  - "Explore a different tone"
- Opens small inline panel, not full screen
- Shows 2-3 suggestions max
- Each has "Use this" or "Copy only"
- Nothing auto-applies

### 3. One-Time Tooltips
- First time in Study with blank draft
- After pausing mid-draft
- Appears once per context, then never again
- Always dismissible

## Onboarding Flow

### Screen 1: Welcome
**Title:** Welcome to Chapters

**Body:**
Everyone's a book.
Each post is a chapter.

This isn't a feed.
It's a place to write, read, and take your time.

I'm Muse.
I can sit beside you while you explore — or stay quiet if you prefer.

**Buttons:** Meet Muse | Skip for now

### Screen 2: Who is Muse?
**Title:** A gentle companion

**Body:**
I don't write for you.
I don't rush you.
I don't care about trends.

I can offer prompts, titles, reflections, and cover ideas —
only when you want them.

How would you like me to show up?

**Options:**
- Gentle nudges now and then
- Only when I ask
- Stay quiet for now

### Screen 3: Expression Style
**Title:** How do you usually express yourself?

**Options:**
- 📝 Writing & journaling
- 🎨 Visual art & photography
- 🎧 Voice, sound, or music
- 🎬 Short films & video
- 💭 I'm still figuring it out

### Screen 4: Tone
**Title:** What's the usual tone?

**Options:**
- Calm & reflective
- Raw & honest
- Dreamy & surreal
- Playful & experimental
- It really depends

### Screen 5: Language Tour
**Title:** Before we begin…

**Body:**
A few things you'll hear around here:

- Your profile is your Book
- Your posts are Chapters
- Home is your Library — a bookshelf, not a feed
- You write privately in your Study
- You get Open Pages instead of unlimited posting

You'll learn the rest by using the app.
No memorizing required.

### Screen 6: First Library Visit
**Title:** Welcome to your Library

**Body:**
These are the Books you'll keep on your shelf.
You can start by opening your own Book —
or wander quietly through others.

**Buttons:** Open My Book | See Quiet Picks

### Screen 7: First Chapter Invitation
**Title:** Your first Open Page

**Body:**
You don't have to publish anything today.
This space is for drafts, fragments, and half-formed thoughts.

If you'd like, I can help you start a first chapter —
just to feel the shape of things.

**Buttons:** Help me start a chapter | I'll write on my own

## Muse Micro-Responses

### Starting from Scratch
"Let's start simple. You don't have to explain your whole life — just this moment."

**Prompts:**
- "Today feels like…"
- "Lately, I can't stop thinking about…"
- "If this chapter had a color, it would be…"

### Stuck Mid-Draft
"I see where you're going. Here are a few ways you could keep going."

**Continuations:**
- "…and I don't know what it means yet, but it stays with me."
- "…and I'm trying to be honest about it, even if it feels messy."

### Tightening Text
"I kept your meaning. Just made it leaner."

**Actions:** Replace with this | Copy to clipboard | Keep mine

### Changing Tone
"Which way do you want this chapter to lean?"

**Options:** Softer | Sharper | More surreal | More playful

"Here's a version in that direction. Take what you like, ignore the rest."

### Titling
"Titles don't need to be perfect. Just honest."

**Suggestions:**
- Metaphor-based
- Emotion-based
- Minimal one-word

### Closing Without Publishing
"This doesn't have to go anywhere yet. I've kept it safe in your Study."

### After First Chapter
"Your first chapter is out in the world. No rush for the next one."

### Long Absence
"You haven't opened a page in a while. If all you have today is a sentence, that's enough."

### Overuse Guardrail
"I can keep suggesting edits — but your voice is already here. Want to trust it for a bit?"

---

# 💞 Between the Lines — Connection Layer

Quiet, consent-based connection space. Not dating. Not public chat.

## Eligibility
- Mutual follow
- Both have 3+ published chapters
- Reading/bookmarking signals suggest resonance

## Entry Points
- Subtle "Between the Lines" button on eligible Books
- Clicking opens explanatory modal, not chat

## Invite Flow

### Modal
**Title:** Between the Lines

**Body:**
This is a quiet space for two people whose Books resonate.
No feed. No audience. Just conversation.

**Form:**
- "What moved you?" (short text)
- Optional: select chapter excerpt

### Recipient View
"Someone felt something between your lines."

**Actions:** Read it | Decline

## Conversation UI

**Style:** Wide page-like strips, not chat bubbles
- Soft background (Ink Paper)
- Small timestamps
- No typing indicators
- No read receipts

**Header:** "You're between the lines of [Book A] and [Book B]."

**Actions:**
- Close this space
- Block
- Report

## Implementation Checklist

### Muse UI
- [x] Add Muse icon to navigation
- [x] Create Muse drawer component
- [x] Add onboarding flow (5/7 screens - missing 6 & 7)
- [x] Add inline "Ask Muse" in draft editor
- [x] Add one-time tooltips
- [x] Implement Muse response patterns
- [x] Add Muse API integration

### Between the Lines UI
- [x] Add eligibility check
- [x] Add "Between the Lines" button on Books
- [x] Create invite modal
- [x] Build conversation view (page-strip style)
- [x] Add conversation list page
- [x] Implement close/block/report

---

## Implementation Status

### ✅ What's Live
**Muse:**
- Drawer with prompt generation
- Inline helper (first line, title, tighten, tone)
- 5-screen onboarding with backend integration
- One-time tooltips (Library, Study, inline helper)
- Full API integration for all working features

**Between the Lines:**
- Complete implementation (100%)
- Eligibility checking, invites, conversations, messaging

### 🚧 Not Yet Built
- Onboarding screens 6 & 7
- Draft shaping logic
- Reflect on recent chapters

### 📊 Completion
- Inline Muse: 100%
- One-time Tooltips: 100%
- Between the Lines: 100%
- Onboarding: 71% (5/7 screens)
- Muse Drawer: 33% (1/3 actions)
- Overall: ~75%

---

**Remember:** Muse feels like a studio companion. Between the Lines feels like exchanged letters. Both are calm, literary, and respectful.
