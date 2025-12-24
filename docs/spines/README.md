# Spines

> People discovery through work, not profiles

## What It Is

Optional surface to discover Books (users) you've encountered through reading. Like browsing book spines on a shelf—indirect, calm, work-first.

## Philosophy

**Feels like:** Noticing a book spine, pulling it out to read
**NOT like:** User directory, creator leaderboard, "people you may know"

## What Appears

Books you've:
- Read chapters from
- Added to your Shelf
- Seen in Quiet Picks
- Share taste signals with

**No cold exposure of strangers.**

## What It Shows

- Book title (display_name or username)
- Last chapter date
- Subtle presence indicator

**Hides:** Follower counts, engagement metrics, trending indicators

## Where It Lives

Library → Spines tab (secondary, after New Chapters and Quiet Picks)

## Implementation

**API:** `GET /library/spines`

**Query:** Read history + Shelf + Quiet Picks (deduplicated, exclude own Book)

**UI:** Vertical/grid of book spines (title, username, last chapter date)

**Empty state:**
```
No Spines yet.
Read a few chapters.
Books will appear here as you explore.
```

## Key Principles

- Work-first discovery
- No metrics or gamification
- Optional and secondary
- Identity emerges slowly

---

**See `requirements.md`, `design.md`, and `tasks.md` for complete specs**
