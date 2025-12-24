# Implementation: Spines & Shelf

## Spines - People Discovery

**What:** Discover Books through their work, not profiles

**Where:** Library → Spines tab (secondary)

**Shows:** Books you've read from, added to Shelf, or seen in Quiet Picks

**Implementation:**
- API: `GET /library/spines` 
- Query: Read history + Shelf + Quiet Picks (deduplicated)
- UI: Vertical/grid view (title, username, last chapter date)
- Empty: "No Spines yet. Read a few chapters. Books will appear here as you explore."

**Key:** No metrics, no trending, work-first discovery

---

## Shelf - Curated Collection

**What:** Curate Books you want to keep close (higher commitment than follow)

**Where:** 
- Add button on Book pages
- View in Library → Bookshelf tab

**Implementation:**

**Database:**
```sql
CREATE TABLE shelves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, book_owner_id),
    CHECK(user_id != book_owner_id)
);
```

**API:**
- `POST /engagement/books/{id}/shelf` - Add to Shelf
- `DELETE /engagement/books/{id}/shelf` - Remove from Shelf
- `GET /engagement/shelf` - Get my Shelf
- `GET /engagement/books/{id}/shelf/status` - Check if on Shelf

**UI:**
- AddToShelfButton: "Add to My Shelf 📚" → "On My Shelf ✓"
- ShelfView: Grid of Book cards (portrait, title, username, bio preview)
- Empty: "Your Shelf is waiting. Add Books that feel like home."

**Key:** Public by default, no notifications, Books only (not Chapters)

---

**See `requirements.md`, `design.md`, and `tasks.md` for complete specs**
