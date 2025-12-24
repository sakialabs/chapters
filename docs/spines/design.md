# Design Document: Spines (People Discovery)

## Overview

Spines is the people discovery surface in Chapters—a calm, optional layer where users encounter Books (profiles) through their writing, not through social graphs or popularity metrics. The name "Spines" evokes browsing a bookshelf: noticing a title, color, or presence, then choosing to pull one out and open it.

Spines is not a directory, leaderboard, or "people you may know" feature. It's a contextual discovery layer that only shows Books users have already encountered through reading, Shelf curation, or Quiet Picks.

## Architecture

### System Components

Spines is implemented as a query/view layer, not a new data model. It leverages existing relationships:

1. **Reading History**: Chapters the user has read
2. **Shelf Relationships**: Books the user has added to their Shelf
3. **Quiet Picks**: Books that have appeared in recommendations
4. **Resonance Scores**: Taste alignment between users

### Integration Points

- **Library View**: Spines appears as a secondary tab
- **Book Pages**: Tapping a Spine navigates to Book page
- **Shelf System**: "Add to My Shelf" button available from Spines
- **Muse**: Occasional gentle nudges to browse Spines
- **Resonance Calculation**: Uses taste embeddings for ordering

## Components and Interfaces

### Backend Components

#### 1. Spines Query Service (`backend/app/library/service.py`)

```python
class SpinesService:
    async def get_spines_for_user(
        self,
        user_id: UUID,
        limit: int = 50,
        offset: int = 0
    ) -> List[SpineBook]:
        """
        Get Books eligible for Spines view for a user.
        
        Eligibility criteria:
        - User has read at least one Chapter from the Book
        - Book is on user's Shelf
        - Book has appeared in user's Quiet Picks
        - Book has high resonance score with user
        
        Ordering:
        - Primary: Resonance score (descending)
        - Secondary: Recent interaction (descending)
        - Diversity: Max 1 Book per author in top 20
        """
        pass
    
    async def calculate_spine_eligibility(
        self,
        user_id: UUID,
        book_id: UUID
    ) -> tuple[bool, str]:
        """Check if a Book is eligible for user's Spines"""
        pass
    
    async def get_spine_metadata(
        self,
        book_id: UUID
    ) -> SpineMetadata:
        """Get visual metadata for Spine display"""
        pass
```

#### 2. Spines Router (`backend/app/library/router.py`)

```python
@router.get("/library/spines", response_model=List[SpineBookResponse])
async def get_spines(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get Books for Spines discovery view.
    
    Returns Books the user has encountered through:
    - Reading Chapters
    - Adding to Shelf
    - Quiet Picks
    - High resonance scores
    
    Ordered by resonance and recency.
    """
    pass
```

#### 3. Spines Schemas (`backend/app/library/schemas.py`)

```python
class SpineMetadata(BaseModel):
    """Visual metadata for Spine display"""
    color: str  # Hex color based on Book theme/mood
    texture: str  # Subtle texture identifier
    symbol: Optional[str]  # Optional emoji or symbol
    
    class Config:
        from_attributes = True


class SpineBookResponse(BaseModel):
    """Book information for Spines view"""
    id: int
    user_id: int
    username: str
    display_name: Optional[str]
    book_title: str  # display_name or username
    bio: Optional[str]
    cover_image_url: Optional[str]
    
    # Spine-specific metadata
    spine_metadata: SpineMetadata
    resonance_score: float
    last_interaction_at: datetime
    interaction_type: str  # "read", "shelf", "quiet_pick"
    
    class Config:
        from_attributes = True
```

### Frontend Components

#### 1. Spines Service (`frontend/src/services/spines.ts`)

```typescript
export interface SpineBook {
  id: number
  user_id: number
  username: string
  display_name: string | null
  book_title: string
  bio: string | null
  cover_image_url: string | null
  spine_metadata: {
    color: string
    texture: string
    symbol: string | null
  }
  resonance_score: number
  last_interaction_at: string
  interaction_type: 'read' | 'shelf' | 'quiet_pick'
}

export const spinesService = {
  async getSpines(limit = 50, offset = 0): Promise<SpineBook[]>
  async getSpineMetadata(bookId: number): Promise<SpineMetadata>
}
```

#### 2. Spines Hooks (`frontend/src/hooks/useSpines.ts`)

```typescript
export function useSpines(limit = 50, offset = 0)
export function useSpineMetadata(bookId: number)
```

#### 3. SpineCard Component (`frontend/src/components/SpineCard.tsx`)

```typescript
interface SpineCardProps {
  book: SpineBook
  onTap: (bookId: number) => void
}

export function SpineCard({ book, onTap }: SpineCardProps)
```

Features:
- Vertical spine design with Book title
- Subtle color/texture from spine_metadata
- Optional symbol/emoji
- Hover/tap reveals author username
- No profile picture by default
- No follower counts or metrics
- Calm, minimal aesthetic

#### 4. SpinesView Component (`frontend/src/components/SpinesView.tsx`)

```typescript
interface SpinesViewProps {
  books: SpineBook[]
  isLoading: boolean
  onBookTap: (bookId: number) => void
}

export function SpinesView({ books, isLoading, onBookTap }: SpinesViewProps)
```

Features:
- Grid layout (3-4 columns on desktop, 2-3 on mobile)
- Resembles bookshelf with spines
- Empty state with calm message
- No infinite scroll (paginated)
- Subtle hover effects

## Data Models

### No New Tables

Spines does not require new database tables. It's a query/view that leverages existing data:

**Existing Tables Used:**
- `users` - User accounts
- `books` - User profiles
- `chapters` - Published content
- `follows` - Follow relationships
- `shelves` - Shelf curation (from add-to-shelf feature)
- `hearts` - Chapter appreciation
- `bookmarks` - Saved Chapters
- `user_taste_profiles` - Taste embeddings
- `chapter_embeddings` - Chapter embeddings

### Spines Eligibility Query

```sql
-- Get Books eligible for user's Spines
WITH user_reads AS (
    -- Books user has read Chapters from
    SELECT DISTINCT c.book_id, MAX(c.published_at) as last_read
    FROM chapters c
    JOIN hearts h ON c.id = h.chapter_id
    WHERE h.user_id = :user_id
    GROUP BY c.book_id
),
user_shelf AS (
    -- Books on user's Shelf
    SELECT book_owner_id as book_id, created_at as added_at
    FROM shelves
    WHERE user_id = :user_id
),
quiet_picks_books AS (
    -- Books that appeared in Quiet Picks
    SELECT DISTINCT c.book_id, MAX(c.published_at) as last_picked
    FROM chapters c
    -- Logic to identify Quiet Picks chapters
    GROUP BY c.book_id
),
resonance_books AS (
    -- Books with high resonance scores
    SELECT b.id as book_id, 
           (utp1.embedding <=> utp2.embedding) as resonance_score
    FROM books b
    JOIN user_taste_profiles utp1 ON b.user_id = utp1.user_id
    CROSS JOIN user_taste_profiles utp2
    WHERE utp2.user_id = :user_id
      AND (utp1.embedding <=> utp2.embedding) < 0.3  -- High similarity threshold
)
SELECT DISTINCT b.*, 
       COALESCE(r.resonance_score, 0) as resonance_score,
       GREATEST(
           ur.last_read,
           us.added_at,
           qp.last_picked
       ) as last_interaction_at
FROM books b
LEFT JOIN user_reads ur ON b.id = ur.book_id
LEFT JOIN user_shelf us ON b.id = us.book_id
LEFT JOIN quiet_picks_books qp ON b.id = qp.book_id
LEFT JOIN resonance_books r ON b.id = r.book_id
WHERE (ur.book_id IS NOT NULL 
    OR us.book_id IS NOT NULL 
    OR qp.book_id IS NOT NULL 
    OR r.book_id IS NOT NULL)
  AND b.user_id != :user_id  -- Exclude own Book
ORDER BY resonance_score DESC, last_interaction_at DESC
LIMIT :limit OFFSET :offset;
```

### Spine Metadata Generation

```python
def generate_spine_metadata(book: Book) -> SpineMetadata:
    """
    Generate visual metadata for Spine display.
    
    Color: Based on Book theme or most common Chapter mood
    Texture: Subtle pattern based on writing style
    Symbol: Optional emoji based on Book bio or themes
    """
    # Extract dominant mood from recent Chapters
    recent_chapters = get_recent_chapters(book.id, limit=5)
    moods = [c.mood for c in recent_chapters if c.mood]
    
    # Map mood to color palette
    color = map_mood_to_color(most_common(moods)) if moods else "#8B7355"
    
    # Generate texture based on writing style
    texture = "paper"  # Default, can be enhanced with ML
    
    # Extract symbol from bio or themes
    symbol = extract_emoji_from_bio(book.bio) if book.bio else None
    
    return SpineMetadata(
        color=color,
        texture=texture,
        symbol=symbol
    )


def map_mood_to_color(mood: str) -> str:
    """Map mood to warm, muted color palette"""
    mood_colors = {
        "melancholic": "#6B5B95",
        "hopeful": "#88B04B",
        "reflective": "#8B7355",
        "joyful": "#F7CAC9",
        "contemplative": "#92A8D1",
        "nostalgic": "#955251",
        "peaceful": "#B565A7",
        "intense": "#C94C4C",
    }
    return mood_colors.get(mood.lower(), "#8B7355")
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Spines only show encountered Books

*For any* user, all Books in their Spines view should be Books they have encountered through reading, Shelf, Quiet Picks, or high resonance.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

### Property 2: Spines exclude own Book

*For any* user, their own Book should never appear in their Spines view.

**Validates: Requirements 2.6**

### Property 3: Spines ordered by resonance

*For any* user's Spines view, Books should be ordered by resonance score descending, with ties broken by last_interaction_at.

**Validates: Requirements 3.1**

### Property 4: Spines ensure diversity

*For any* user's Spines view, the top 20 results should contain at most 1 Book per author.

**Validates: Requirements 3.2**

### Property 5: Spines exclude popularity metrics

*For any* Spine displayed, the rendered output should not contain follower counts, trending indicators, or engagement metrics.

**Validates: Requirements 1.4, 1.5, 1.6, 3.3, 3.4**

### Property 6: Spines navigation goes to Book page

*For any* Spine tapped, the navigation should go to that Book's page (not a profile summary or preview).

**Validates: Requirements 1.3**

### Property 7: Spines empty state is calm

*For any* user with no eligible Spines, the empty state should display a calm message without CTAs or pressure.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 8: Spines and Shelf are independent

*For any* Book, adding it to Shelf or removing it from Shelf should not affect its eligibility for Spines (if it meets other criteria).

**Validates: Requirements 8.3, 8.4**

## Error Handling

### Backend Error Cases

1. **No Eligible Spines** (200)
   - Return empty array with success status
   - Frontend shows calm empty state

2. **Invalid Pagination** (400)
   - When limit > 100 or offset < 0
   - Return: `{"detail": "Invalid pagination parameters"}`

3. **Unauthorized** (401)
   - When user is not authenticated
   - Return: `{"detail": "Not authenticated"}`

### Frontend Error Handling

1. **Network Errors**
   - Show toast: "Unable to load Spines. Please try again."
   - Retry button available

2. **Empty State**
   - Show calm message: "Spines appear after you read. Take your time."
   - No "Get Started" CTAs

3. **Loading States**
   - Show subtle skeleton spines
   - No aggressive spinners

## Testing Strategy

### Unit Tests

- Empty Spines displays correct message
- Spine metadata generation produces valid colors
- Eligibility query excludes own Book
- Diversity filter works correctly

### Property-Based Tests

**Backend Tests** (using pytest-hypothesis):

1. **Property 1**: Spines only show encountered Books
   - Generate random user with reading history
   - Query Spines
   - Verify all returned Books meet eligibility criteria
   - **Feature: spines, Property 1: Spines only show encountered Books**

2. **Property 2**: Spines exclude own Book
   - Generate random users
   - Query Spines for each user
   - Verify own Book never appears
   - **Feature: spines, Property 2: Spines exclude own Book**

3. **Property 3**: Spines ordered by resonance
   - Generate random Spines results
   - Verify ordering is correct (resonance DESC, then last_interaction DESC)
   - **Feature: spines, Property 3: Spines ordered by resonance**

4. **Property 4**: Spines ensure diversity
   - Generate Spines with multiple Books from same authors
   - Verify top 20 has max 1 per author
   - **Feature: spines, Property 4: Spines ensure diversity**

**Frontend Tests** (using fast-check):

1. **Property 5**: Spines exclude popularity metrics
   - Generate random Spine components
   - Render and verify no follower counts, trending indicators
   - **Feature: spines, Property 5: Spines exclude popularity metrics**

2. **Property 7**: Spines empty state is calm
   - Render empty Spines view
   - Verify message is calm, no CTAs
   - **Feature: spines, Property 7: Spines empty state is calm**

### Integration Tests

- Full flow: Read Chapter → View Spines → Tap Spine → View Book
- Spines updates when user reads new Chapters
- Spines integrates with Shelf (Add to My Shelf button works)
- Muse nudge appears correctly (max once per week)

### Testing Configuration

- **Backend**: pytest with pytest-hypothesis
- **Frontend**: Vitest with fast-check
- **Minimum iterations**: 100 per property test

## Implementation Notes

### Spines Eligibility Caching

Since Spines eligibility is expensive to calculate, cache results:

```python
# Cache Spines for 1 hour
@cache(ttl=3600, key="spines:{user_id}")
async def get_spines_for_user(user_id: UUID) -> List[SpineBook]:
    # Expensive query
    pass

# Invalidate cache on relevant actions
async def on_chapter_read(user_id: UUID, chapter_id: UUID):
    invalidate_cache(f"spines:{user_id}")

async def on_shelf_add(user_id: UUID, book_id: UUID):
    invalidate_cache(f"spines:{user_id}")
```

### Spine Metadata Caching

Cache Spine metadata per Book:

```python
# Cache Spine metadata for 24 hours
@cache(ttl=86400, key="spine_metadata:{book_id}")
async def get_spine_metadata(book_id: UUID) -> SpineMetadata:
    # Generate metadata
    pass

# Invalidate when Book is updated
async def on_book_update(book_id: UUID):
    invalidate_cache(f"spine_metadata:{book_id}")
```

### Library Page Updates

Update Library page to include Spines tab:

```typescript
// frontend/src/app/library/page.tsx
const [activeTab, setActiveTab] = useState<'bookshelf' | 'new' | 'picks' | 'spines'>('bookshelf')

// Add Spines tab
<button
  onClick={() => setActiveTab('spines')}
  className={`py-4 border-b-2 transition-colors ${
    activeTab === 'spines'
      ? 'border-primary text-foreground font-medium'
      : 'border-transparent text-muted-foreground hover:text-foreground'
  }`}
>
  Spines
</button>

// Render Spines view
{activeTab === 'spines' && (
  <SpinesView books={spines} isLoading={spinesLoading} />
)}
```

### Muse Nudge Integration

Add occasional Muse nudge to browse Spines:

```python
# backend/app/muse/service.py
async def should_suggest_spines(user_id: UUID) -> bool:
    """
    Suggest browsing Spines if:
    - User hasn't visited Spines in 7+ days
    - User has 10+ eligible Spines
    - Last nudge was 7+ days ago
    """
    last_visit = await get_last_spines_visit(user_id)
    last_nudge = await get_last_spines_nudge(user_id)
    spine_count = await count_eligible_spines(user_id)
    
    if (days_since(last_visit) >= 7 and 
        days_since(last_nudge) >= 7 and 
        spine_count >= 10):
        return True
    return False

# Nudge message
"You might enjoy browsing a few Spines tonight."
```

### Empty State Copy

```typescript
// Empty Spines state
<div className="text-center py-20">
  <div className="text-6xl mb-6">📚</div>
  <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
    Spines appear after you read
  </h2>
  <p className="text-lg text-muted-foreground">
    Take your time. Books you encounter will show up here.
  </p>
</div>
```

## Future Considerations

### Out of Scope (Intentionally)

- Spines recommendations based on others' Spines (violates contextual discovery)
- "People you may know" suggestions (violates anti-social-network principle)
- Spines activity feed (violates calm principle)
- Spines leaderboards or trending (violates anti-gamification)
- Spines matching or swiping (violates intentionality)

### Potential Future Enhancements

- Spine collections (organize Spines into themes)
- Spine notes (personal annotations on why a Book caught your eye)
- Spine history (view previously browsed Spines)
- Enhanced Spine visuals (more sophisticated color/texture generation)
- Spine filters (by mood, theme, or interaction type)

These enhancements would only be considered if they maintain the calm, contextual nature of Spines.
