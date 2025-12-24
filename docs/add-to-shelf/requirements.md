# Requirements Document

## Introduction

The "Add to My Shelf" feature allows users to curate a personal collection of Books (user profiles) they want to keep close. This feature embodies the calm, intentional nature of Chapters by providing a deliberate, meaningful way to connect with other users' work without gamification or virality mechanics.

## Glossary

- **Book**: A user's profile on Chapters, representing their complete collection of Chapters
- **Chapter**: An individual post/piece of writing by a user
- **Shelf**: A user's curated collection of other users' Books
- **Library**: The main view where users discover Chapters and access their Shelf
- **Book_Page**: The profile view showing a user's Book details, Chapters, and Inside Flap
- **Inside_Flap**: A user's bio/description on their Book page
- **Heart**: A private action to appreciate an individual Chapter
- **Bookmark**: A private action to save an individual Chapter for later
- **Shelf_Entry**: A record of a Book being added to a user's Shelf

## Requirements

### Requirement 1: Add Book to Shelf

**User Story:** As a reader, I want to add another user's Book to my Shelf, so that I can curate a collection of Books that matter to me.

#### Acceptance Criteria

1. WHEN a user views another user's Book page, THE System SHALL display an "Add to My Shelf" button with a 📚 icon
2. WHEN a user clicks "Add to My Shelf", THE System SHALL add that Book to the user's Shelf immediately
3. WHEN a Book is successfully added, THE System SHALL change the button state to "On My Shelf ✓"
4. WHEN a user attempts to add their own Book to their Shelf, THE System SHALL not display the "Add to My Shelf" button
5. WHEN a Book is already on the user's Shelf, THE System SHALL display "On My Shelf ✓" instead of "Add to My Shelf"

### Requirement 2: Remove Book from Shelf

**User Story:** As a reader, I want to remove a Book from my Shelf, so that I can maintain a curated collection that reflects my current interests.

#### Acceptance Criteria

1. WHEN a user clicks "On My Shelf ✓" on a Book page, THE System SHALL remove that Book from the user's Shelf
2. WHEN a Book is successfully removed, THE System SHALL change the button state back to "Add to My Shelf"
3. WHEN a Book is removed from the Shelf, THE System SHALL preserve any Hearts or Bookmarks the user has on that Book's Chapters

### Requirement 3: View My Shelf

**User Story:** As a reader, I want to view all Books on my Shelf, so that I can easily access the Books I've chosen to keep close.

#### Acceptance Criteria

1. WHEN a user navigates to Library → Bookshelf tab, THE System SHALL display all Books on the user's Shelf
2. WHEN displaying Shelf Books, THE System SHALL show the Book portrait, Book title, author username, and Inside Flap preview
3. WHEN a user clicks on a Book in their Shelf, THE System SHALL navigate to that Book's page
4. WHEN a user's Shelf is empty, THE System SHALL display a calm, invitational empty state message
5. WHEN displaying the Shelf, THE System SHALL order Books by most recently added first

### Requirement 4: View Another User's Shelf

**User Story:** As a reader, I want to view another user's Shelf, so that I can discover Books they find meaningful.

#### Acceptance Criteria

1. WHEN a user views another user's Book page, THE System SHALL display a "Bookshelf" section showing Books on that user's Shelf
2. WHEN displaying another user's Shelf, THE System SHALL show Book portraits and titles
3. WHEN a user clicks on a Book in another user's Shelf, THE System SHALL navigate to that Book's page
4. WHEN another user's Shelf is empty, THE System SHALL display a simple message indicating the Shelf is empty

### Requirement 5: Shelf Data Persistence

**User Story:** As a system administrator, I want Shelf data to be reliably stored and retrieved, so that users' curated collections are preserved.

#### Acceptance Criteria

1. WHEN a user adds a Book to their Shelf, THE System SHALL store the Shelf entry with user_id, book_owner_id, and timestamp
2. WHEN a user removes a Book from their Shelf, THE System SHALL delete the corresponding Shelf entry
3. WHEN retrieving a user's Shelf, THE System SHALL return all Books the user has added with their current metadata
4. WHEN a Book owner deletes their account, THE System SHALL remove that Book from all users' Shelves

### Requirement 6: Shelf Privacy and Visibility

**User Story:** As a reader, I want my Shelf to be publicly visible, so that others can discover Books through my curation.

#### Acceptance Criteria

1. WHEN any user views a Book page, THE System SHALL display that user's public Shelf
2. WHEN displaying Shelf counts, THE System SHALL show the number of Books on a user's Shelf
3. THE System SHALL NOT send notifications when a user adds a Book to their Shelf
4. THE System SHALL NOT display who has added a specific Book to their Shelf (no "added by X users" counter)

### Requirement 7: Shelf UI Placement and Design

**User Story:** As a reader, I want the Shelf action to be easily accessible but not intrusive, so that I can add Books thoughtfully.

#### Acceptance Criteria

1. WHEN viewing a Book page, THE System SHALL display the "Add to My Shelf" button near the Book title and Inside Flap
2. WHEN displaying the Shelf button, THE System SHALL use calm, semantic colors that match the app's theme
3. WHEN a user hovers over the Shelf button, THE System SHALL provide subtle visual feedback without animation
4. THE System SHALL NOT display counters, badges, or gamified elements related to Shelf actions

### Requirement 8: Shelf Scope and Boundaries

**User Story:** As a system architect, I want clear boundaries for what Shelf manages, so that the feature remains focused and intentional.

#### Acceptance Criteria

1. THE Shelf SHALL only store references to Books (user profiles), not individual Chapters
2. THE System SHALL maintain separate data models for Shelf (Books), Hearts (Chapters), and Bookmarks (Chapters)
3. WHEN a user adds a Book to their Shelf, THE System SHALL NOT automatically heart or bookmark any Chapters
4. THE System SHALL NOT support reposting, sharing, or viral mechanics related to Shelf

## Notes

- Shelf is intentionally higher-commitment than Hearts or Bookmarks
- The feature emphasizes curation over consumption
- No notifications preserve the calm, non-intrusive nature of the platform
- Public Shelves enable discovery through taste and curation, not popularity metrics
