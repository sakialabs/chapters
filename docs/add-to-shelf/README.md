# Add to My Shelf

> Curate Books you want to keep close

## What It Is

Your personal collection of Books (user profiles) that matter to you. Higher commitment than following—about identity and taste, not engagement.

## Philosophy

**Shelf is:** Curated, intentional, public by default
**NOT:** A follow list, popularity contest, or collection game

## How It Works

**Add:** Button on Book pages: "Add to My Shelf 📚"
**Added:** Button changes to: "On My Shelf ✓"
**View:** Library → Bookshelf tab

## Key Points

- Applies to Books (entire profiles), NOT individual Chapters
- Public by default, no notifications
- No counters showing "X users have this on their Shelf"
- Separate from Hearts (Chapter-level) and Bookmarks (Chapter-level)

## Implementation

**Database:**
```sql
CREATE TABLE shelves (
    user_id → book_owner_id
    UNIQUE, no self-shelf, cascade delete
);
```

**API:**
- `POST /engagement/books/{id}/shelf` - Add
- `DELETE /engagement/books/{id}/shelf` - Remove
- `GET /engagement/shelf` - Get my Shelf
- `GET /engagement/books/{id}/shelf/status` - Check status

**UI:**
- AddToShelfButton component (toggles between states)
- ShelfView component (grid of Book cards)

**Empty state:**
```
Your Shelf is waiting.
Add Books that feel like home.
```

## Relationship to Other Features

| Feature | Scope | Visibility |
|---------|-------|------------|
| **Shelf** | Books (profiles) | Public |
| **Hearts** | Chapters | Private |
| **Bookmarks** | Chapters | Private |
| **Follow** | Books | Public |

Shelf is higher commitment than Follow—it's about curation and taste.

---

**See `requirements.md`, `design.md`, and `tasks.md` for complete specs**
