# Design Document: Add to My Shelf

## Overview

The "Add to My Shelf" feature enables users to curate a personal collection of Books (user profiles) they find meaningful. This feature embodies Chapters' calm, intentional philosophy by providing a deliberate way to connect with other users' work without gamification, notifications, or viral mechanics.

The Shelf is distinct from Hearts (Chapter-level appreciation) and Bookmarks (Chapter-level saving). It represents a higher-commitment action focused on entire Books rather than individual Chapters, emphasizing curation over consumption.

## Architecture

### System Components

The feature consists of four main layers:

1. **Data Layer**: SQLAlchemy models for Shelf entries
2. **API Layer**: FastAPI endpoints for Shelf operations
3. **Service Layer**: React Query hooks for state management
4. **UI Layer**: React components for Shelf interactions

### Integration Points

- **Engagement System**: Shelf sits alongside Hearts, Follows, and Bookmarks but operates independently
- **Library View**: Shelf content appears in the Library → Bookshelf tab
- **Book Pages**: Shelf actions are initiated from Book profile views
- **User Model**: Shelf entries reference user_ids for both the curator and Book owner

## Components and Interfaces

### Backend Components

#### 1. Shelf Model (`backend/app/models/engagement.py`)

```python
class Shelf(Base):
    """Shelf - curated collection of Books (user profiles)"""
    __tablename__ = "shelves"
    __table_args__ = (
        UniqueConstraint("user_id", "book_owner_id", name="uq_shelf_user_book"),
        Index("ix_shelves_user_id", "user_id"),
        Index("ix_shelves_book_owner_id", "book_owner_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    book_owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="shelf_items")
    book_owner = relationship("User", foreign_keys=[book_owner_id])
```

#### 2. Shelf Schemas (`backend/app/engagement/schemas.py`)

```python
class ShelfResponse(BaseModel):
    id: int
    user_id: int
    book_owner_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ShelfBookResponse(BaseModel):
    """Book information for Shelf display"""
    id: int
    user_id: int
    username: str
    display_name: Optional[str]
    bio: Optional[str]
    cover_image_url: Optional[str]
    added_at: datetime  # When added to Shelf
    
    class Config:
        from_attributes = True
```

#### 3. Shelf Router (`backend/app/engagement/router.py`)

```python
@router.post("/books/{book_id}/shelf", response_model=ShelfResponse, status_code=status.HTTP_201_CREATED)
async def add_to_shelf(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a Book to user's Shelf"""
    # Implementation details in tasks


@router.delete("/books/{book_id}/shelf", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_shelf(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a Book from user's Shelf"""
    # Implementation details in tasks


@router.get("/shelf", response_model=List[ShelfBookResponse])
async def get_my_shelf(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's Shelf"""
    # Implementation details in tasks


@router.get("/books/{book_id}/shelf", response_model=List[ShelfBookResponse])
async def get_book_shelf(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific Book owner's Shelf (public)"""
    # Implementation details in tasks


@router.get("/books/{book_id}/shelf/status")
async def check_shelf_status(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if a Book is on current user's Shelf"""
    # Implementation details in tasks
```

### Frontend Components

#### 1. Shelf Service (`frontend/src/services/shelf.ts`)

```typescript
export interface ShelfBook {
  id: number
  user_id: number
  username: string
  display_name: string | null
  bio: string | null
  cover_image_url: string | null
  added_at: string
}

export const shelfService = {
  async addToShelf(bookId: number): Promise<void>
  async removeFromShelf(bookId: number): Promise<void>
  async getMyShelf(): Promise<ShelfBook[]>
  async getBookShelf(bookId: number): Promise<ShelfBook[]>
  async checkShelfStatus(bookId: number): Promise<{ on_shelf: boolean }>
}
```

#### 2. Shelf Hooks (`frontend/src/hooks/useShelf.ts`)

```typescript
export function useMyShelf()
export function useBookShelf(bookId: number)
export function useShelfStatus(bookId: number)
export function useAddToShelf()
export function useRemoveFromShelf()
```

#### 3. AddToShelfButton Component (`frontend/src/components/AddToShelfButton.tsx`)

```typescript
interface AddToShelfButtonProps {
  bookId: number
  isOwnBook: boolean
}

export function AddToShelfButton({ bookId, isOwnBook }: AddToShelfButtonProps)
```

Features:
- Shows "Add to My Shelf 📚" when not on Shelf
- Shows "On My Shelf ✓" when on Shelf
- Hidden when viewing own Book
- Toggles between add/remove on click
- Uses semantic colors, no animations

#### 4. ShelfView Component (`frontend/src/components/ShelfView.tsx`)

```typescript
interface ShelfViewProps {
  books: ShelfBook[]
  isLoading: boolean
  emptyMessage: string
}

export function ShelfView({ books, isLoading, emptyMessage }: ShelfViewProps)
```

Features:
- Grid layout of Book cards
- Shows portrait, title, username, bio preview
- Ordered by most recently added
- Calm empty state
- Clickable cards navigate to Book pages

## Data Models

### Shelf Table Schema

```sql
CREATE TABLE shelves (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT uq_shelf_user_book UNIQUE (user_id, book_owner_id),
    CONSTRAINT chk_no_self_shelf CHECK (user_id != book_owner_id)
);

CREATE INDEX ix_shelves_user_id ON shelves(user_id);
CREATE INDEX ix_shelves_book_owner_id ON shelves(book_owner_id);
CREATE INDEX ix_shelves_created_at ON shelves(created_at DESC);
```

### Key Constraints

1. **Unique Constraint**: A user can only add a specific Book once
2. **Self-Shelf Prevention**: Users cannot add their own Book (CHECK constraint)
3. **Cascade Deletion**: When a user is deleted, all Shelf entries are removed
4. **Indexed Queries**: Fast lookups by user_id, book_owner_id, and timestamp

### Relationships

- `user_id` → `users.id`: The curator (person building the Shelf)
- `book_owner_id` → `users.id`: The Book being added (profile owner)
- Separate from `hearts` (user_id → chapter_id)
- Separate from `bookmarks` (user_id → chapter_id)
- Separate from `follows` (follower_id → followed_id)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Add to Shelf creates entry

*For any* user and any Book (not their own), when the user adds the Book to their Shelf, a Shelf entry should be created with the correct user_id, book_owner_id, and timestamp.

**Validates: Requirements 1.2, 5.1**

### Property 2: Button state reflects Shelf status

*For any* Book page viewed by a user, if the Book is on the user's Shelf, the button should display "On My Shelf ✓", otherwise it should display "Add to My Shelf 📚".

**Validates: Requirements 1.3, 1.5**

### Property 3: Remove from Shelf deletes entry

*For any* Book on a user's Shelf, when the user removes it, the Shelf entry should be deleted and the button should revert to "Add to My Shelf 📚".

**Validates: Requirements 2.1, 2.2, 5.2**

### Property 4: Shelf removal preserves Hearts and Bookmarks

*For any* user with Hearts or Bookmarks on a Book's Chapters, removing that Book from the Shelf should not delete any Hearts or Bookmarks.

**Validates: Requirements 2.3**

### Property 5: Shelf view shows all added Books

*For any* user's Shelf, the Shelf view should display all Books the user has added, with no duplicates or missing entries.

**Validates: Requirements 3.1, 5.3**

### Property 6: Shelf Books contain required metadata

*For any* Book displayed in a Shelf view, the rendered output should include the Book portrait, Book title, author username, and Inside Flap preview.

**Validates: Requirements 3.2, 4.2**

### Property 7: Shelf Books are ordered by recency

*For any* Shelf with multiple Books, the Books should be ordered by created_at timestamp in descending order (most recent first).

**Validates: Requirements 3.5**

### Property 8: Shelf navigation works correctly

*For any* Book displayed in a Shelf view (own or another user's), clicking on it should navigate to that Book's page.

**Validates: Requirements 3.3, 4.3**

### Property 9: Another user's Shelf is publicly visible

*For any* Book page, the Book owner's Shelf should be displayed to all authenticated users.

**Validates: Requirements 4.1, 6.1**

### Property 10: Shelf count is accurate

*For any* user's Shelf, the displayed count should equal the number of Shelf entries in the database for that user.

**Validates: Requirements 6.2**

### Property 11: No notifications on Shelf actions

*For any* Shelf add or remove action, no notification records should be created in the database.

**Validates: Requirements 6.3**

### Property 12: No gamified UI elements

*For any* Shelf-related UI component, the rendered output should not contain counters showing "X users have this on their Shelf", badges, or animated feedback.

**Validates: Requirements 6.4, 7.4**

### Property 13: Shelf only stores Book references

*For any* Shelf entry in the database, it should reference a user_id (Book owner), not a chapter_id.

**Validates: Requirements 8.1**

### Property 14: Shelf actions don't create Hearts or Bookmarks

*For any* Book added to a Shelf, no new Heart or Bookmark entries should be created for that Book's Chapters.

**Validates: Requirements 8.3**

### Property 15: Cascade deletion removes Shelf entries

*For any* user who is deleted, all Shelf entries where that user is the book_owner_id should be removed from all other users' Shelves.

**Validates: Requirements 5.4**

## Error Handling

### Backend Error Cases

1. **Book Not Found** (404)
   - When book_id doesn't exist
   - Return: `{"detail": "Book not found"}`

2. **Self-Shelf Attempt** (400)
   - When user tries to add their own Book
   - Return: `{"detail": "Cannot add your own Book to your Shelf"}`

3. **Already on Shelf** (200)
   - When adding a Book already on Shelf
   - Return: Existing Shelf entry (idempotent)

4. **Not on Shelf** (404)
   - When removing a Book not on Shelf
   - Return: `{"detail": "Book not on your Shelf"}`

5. **Unauthorized** (401)
   - When user is not authenticated
   - Return: `{"detail": "Not authenticated"}`

### Frontend Error Handling

1. **Network Errors**
   - Show toast: "Unable to update Shelf. Please try again."
   - Revert button state

2. **Optimistic Updates**
   - Update UI immediately on click
   - Revert if API call fails
   - Use React Query's optimistic update pattern

3. **Loading States**
   - Disable button during API call
   - Show subtle loading indicator (no spinners)

## Testing Strategy

### Unit Tests

Unit tests verify specific examples, edge cases, and error conditions:

- Empty Shelf displays correct message
- Self-Shelf button is hidden
- API error handling reverts UI state
- Shelf entry creation with valid data
- Cascade deletion on user removal

### Property-Based Tests

Property-based tests verify universal properties across all inputs using a PBT library (pytest-hypothesis for Python, fast-check for TypeScript). Each test should run a minimum of 100 iterations.

**Backend Tests** (using pytest-hypothesis):

1. **Property 1**: Add to Shelf creates entry
   - Generate random users and Books
   - Add Book to Shelf
   - Verify entry exists with correct fields
   - **Feature: add-to-shelf, Property 1: Add to Shelf creates entry**

2. **Property 3**: Remove from Shelf deletes entry
   - Generate random Shelf entries
   - Remove from Shelf
   - Verify entry is deleted
   - **Feature: add-to-shelf, Property 3: Remove from Shelf deletes entry**

3. **Property 4**: Shelf removal preserves Hearts and Bookmarks
   - Generate user with Hearts/Bookmarks on a Book's Chapters
   - Remove Book from Shelf
   - Verify Hearts/Bookmarks still exist
   - **Feature: add-to-shelf, Property 4: Shelf removal preserves Hearts and Bookmarks**

4. **Property 5**: Shelf view shows all added Books
   - Generate random set of Books added to Shelf
   - Retrieve Shelf
   - Verify all Books are returned
   - **Feature: add-to-shelf, Property 5: Shelf view shows all added Books**

5. **Property 7**: Shelf Books are ordered by recency
   - Generate Shelf with multiple Books added at different times
   - Retrieve Shelf
   - Verify order is descending by created_at
   - **Feature: add-to-shelf, Property 7: Shelf Books are ordered by recency**

6. **Property 10**: Shelf count is accurate
   - Generate random Shelf with N Books
   - Count Shelf entries
   - Verify count equals N
   - **Feature: add-to-shelf, Property 10: Shelf count is accurate**

7. **Property 11**: No notifications on Shelf actions
   - Generate random Shelf add/remove actions
   - Verify no notification records created
   - **Feature: add-to-shelf, Property 11: No notifications on Shelf actions**

8. **Property 13**: Shelf only stores Book references
   - Generate random Shelf entries
   - Verify all entries have book_owner_id, none have chapter_id
   - **Feature: add-to-shelf, Property 13: Shelf only stores Book references**

9. **Property 14**: Shelf actions don't create Hearts or Bookmarks
   - Generate random Book additions to Shelf
   - Verify no new Hearts/Bookmarks created
   - **Feature: add-to-shelf, Property 14: Shelf actions don't create Hearts or Bookmarks**

10. **Property 15**: Cascade deletion removes Shelf entries
    - Generate user with Books on other users' Shelves
    - Delete user
    - Verify all Shelf entries with that book_owner_id are removed
    - **Feature: add-to-shelf, Property 15: Cascade deletion removes Shelf entries**

**Frontend Tests** (using fast-check):

1. **Property 2**: Button state reflects Shelf status
   - Generate random Book and Shelf status
   - Render button
   - Verify button text matches status
   - **Feature: add-to-shelf, Property 2: Button state reflects Shelf status**

2. **Property 6**: Shelf Books contain required metadata
   - Generate random ShelfBook objects
   - Render Shelf view
   - Verify all required fields are present in output
   - **Feature: add-to-shelf, Property 6: Shelf Books contain required metadata**

3. **Property 12**: No gamified UI elements
   - Generate random Shelf views
   - Render components
   - Verify no counters, badges, or animations in output
   - **Feature: add-to-shelf, Property 12: No gamified UI elements**

### Integration Tests

- Full flow: Add to Shelf → View in Library → Remove from Shelf
- Book page displays correct Shelf status
- Another user's Shelf is visible on their Book page
- Shelf updates reflect immediately in UI

### Testing Configuration

- **Backend**: pytest with pytest-hypothesis
- **Frontend**: Vitest with fast-check
- **Minimum iterations**: 100 per property test
- **Test data**: Use factories/generators for realistic data
- **Database**: Use test database with rollback after each test

## Implementation Notes

### Database Migration

Create Alembic migration to add `shelves` table:

```python
def upgrade():
    op.create_table(
        'shelves',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('book_owner_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['book_owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'book_owner_id', name='uq_shelf_user_book'),
        sa.CheckConstraint('user_id != book_owner_id', name='chk_no_self_shelf')
    )
    op.create_index('ix_shelves_user_id', 'shelves', ['user_id'])
    op.create_index('ix_shelves_book_owner_id', 'shelves', ['book_owner_id'])
    op.create_index('ix_shelves_created_at', 'shelves', ['created_at'], postgresql_ops={'created_at': 'DESC'})
```

### User Model Updates

Add Shelf relationship to User model:

```python
# In backend/app/models/user.py
shelf_items = relationship("Shelf", foreign_keys="Shelf.user_id", back_populates="user", cascade="all, delete-orphan")
```

### Library Page Updates

Update Library page to include Shelf view in Bookshelf tab:
- Replace current "following" logic with Shelf query
- Use ShelfView component for display
- Maintain existing tab structure

### Book Page Updates

Add AddToShelfButton component to Book pages:
- Place near Book title and Inside Flap
- Check if viewing own Book (hide button)
- Query Shelf status on mount
- Display Book owner's Shelf below Book details

### API Client Updates

Add Shelf endpoints to API client configuration:
- POST `/engagement/books/{book_id}/shelf`
- DELETE `/engagement/books/{book_id}/shelf`
- GET `/engagement/shelf`
- GET `/engagement/books/{book_id}/shelf`
- GET `/engagement/books/{book_id}/shelf/status`

### Styling Guidelines

- Use semantic CSS variables (`text-foreground`, `bg-card`, etc.)
- Button: `variant="outline"` for default state
- Button: `variant="default"` for "On My Shelf" state
- Icon: 📚 emoji (no custom SVG needed)
- Checkmark: ✓ character (no custom SVG needed)
- No hover animations, only subtle color transitions
- Empty state: Large emoji (📚), calm message, no CTAs

## Future Considerations

### Out of Scope (Intentionally)

- Shelf notifications (violates calm principle)
- "X users have this on their Shelf" counters (violates anti-gamification)
- Shelf activity feed (violates anti-virality)
- Shelf recommendations based on others' Shelves (violates intentionality)
- Reposting or sharing Shelf contents (violates calm principle)

### Potential Future Enhancements

- Private Shelf option (currently public by default)
- Shelf notes (personal annotations on why a Book was added)
- Shelf collections (organize Shelf into sub-collections)
- Export Shelf as reading list
- Shelf history (view removed Books)

These enhancements would only be considered if they maintain the calm, intentional nature of the feature.
