# Requirements Document: Spines (People Discovery)

## Introduction

Spines is the single, optional people discovery surface in Chapters. It allows users to encounter Books (user profiles) through their writing, not through profiles, popularity, or social graphs. Spines represents the calm, indirect way to discover people—like browsing book spines on a shelf and choosing to pull one out.

## Glossary

- **Spine**: The visual representation of a Book in the discovery interface
- **Book**: A user's profile and collection of Chapters
- **Chapter**: An individual post/piece of writing
- **Library**: The main view containing Bookshelf, New Chapters, Quiet Picks, and Spines
- **Shelf**: A user's curated collection of Books (separate from Spines)
- **Quiet_Picks**: Daily personalized Chapter recommendations
- **Resonance**: Alignment between users based on reading patterns and taste

## Requirements

### Requirement 1: Spines Discovery Surface

**User Story:** As a reader, I want to discover Books through a calm, browsable interface, so that I can find people whose work resonates with me.

#### Acceptance Criteria

1. WHEN a user navigates to Library → Spines, THE System SHALL display a grid of Book spines
2. WHEN displaying a Spine, THE System SHALL show Book title, subtle color/texture, and minimal metadata
3. WHEN a user taps a Spine, THE System SHALL navigate to that Book's page (starting at Inside Flap or first Chapter)
4. THE System SHALL NOT display faces-first layouts in Spines view
5. THE System SHALL NOT display follower counts in Spines view
6. THE System SHALL NOT display engagement metrics in Spines view

### Requirement 2: Spines Population Logic

**User Story:** As a reader, I want Spines to show Books I've already encountered through reading, so that discovery feels natural and contextual.

#### Acceptance Criteria

1. WHEN populating Spines, THE System SHALL include Books the user has read Chapters from
2. WHEN populating Spines, THE System SHALL include Books the user has added to their Shelf
3. WHEN populating Spines, THE System SHALL include Books that have appeared in Quiet Picks
4. WHEN populating Spines, THE System SHALL include Books with overlapping taste signals (reading/shelf affinity)
5. THE System SHALL NOT include Books the user has never encountered
6. THE System SHALL NOT include random or cold-exposure Books

### Requirement 3: Spines Ordering and Diversity

**User Story:** As a reader, I want Spines ordered by relevance and resonance, so that I discover Books that align with my taste.

#### Acceptance Criteria

1. WHEN ordering Spines, THE System SHALL prioritize Books with higher resonance scores
2. WHEN ordering Spines, THE System SHALL ensure diversity (max 1 Book per author in top 20)
3. THE System SHALL NOT order Spines by popularity or follower count
4. THE System SHALL NOT order Spines by trending or viral metrics
5. WHEN a user has limited reading history, THE System SHALL show Books from Quiet Picks authors

### Requirement 4: Spines UI Placement

**User Story:** As a reader, I want Spines to be optional and secondary, so that it doesn't compete with Chapter discovery.

#### Acceptance Criteria

1. WHEN viewing the Library, THE System SHALL place Spines as a secondary tab
2. THE System SHALL NOT make Spines the default or primary entry point
3. THE System SHALL NOT place Spines above New Chapters or Quiet Picks in hierarchy
4. WHEN a user has never used Spines, THE System SHALL show a subtle "Browse Spines" entry point
5. THE System SHALL allow Muse to occasionally suggest browsing Spines (max once per week)

### Requirement 5: Spines Visual Design

**User Story:** As a reader, I want Spines to feel like browsing a bookshelf, so that discovery feels calm and intentional.

#### Acceptance Criteria

1. WHEN displaying a Spine, THE System SHALL use a vertical or grid layout resembling book spines
2. WHEN displaying a Spine, THE System SHALL show Book title prominently
3. WHEN displaying a Spine, THE System SHALL use subtle color/texture based on Book theme or mood
4. WHEN a user hovers/taps a Spine, THE System SHALL reveal the author username quietly
5. THE System SHALL NOT use profile pictures as primary visual elements
6. THE System SHALL NOT use animated or attention-grabbing effects

### Requirement 6: Spines Anti-Patterns

**User Story:** As a system architect, I want Spines to avoid social network patterns, so that it remains calm and non-performative.

#### Acceptance Criteria

1. THE System SHALL NOT implement follower mechanics in Spines
2. THE System SHALL NOT implement popularity sorting in Spines
3. THE System SHALL NOT implement trending creators in Spines
4. THE System SHALL NOT implement profile optimization incentives
5. THE System SHALL NOT implement "people you may know" suggestions
6. THE System SHALL NOT implement swiping or matching mechanics

### Requirement 7: Spines Empty State

**User Story:** As a new user, I want a calm empty state that teaches me how Spines works, so that I understand the feature without pressure.

#### Acceptance Criteria

1. WHEN a user has no Spines to display, THE System SHALL show an empty state message
2. WHEN displaying the empty state, THE System SHALL explain that Spines appear after reading
3. THE System SHALL NOT pressure users to follow or discover people
4. THE System SHALL NOT display "Get Started" CTAs or onboarding flows
5. THE empty state message SHALL use calm, literary language

### Requirement 8: Spines and Shelf Integration

**User Story:** As a reader, I want Spines to work seamlessly with my Shelf, so that I can move from discovery to curation.

#### Acceptance Criteria

1. WHEN viewing a Book from Spines, THE System SHALL display the "Add to My Shelf" button
2. WHEN a user adds a Book to their Shelf from Spines, THE System SHALL keep that Book in Spines
3. THE System SHALL maintain separate data models for Spines (discovery) and Shelf (curation)
4. WHEN a user removes a Book from their Shelf, THE System SHALL keep that Book in Spines if eligible

## Notes

- Spines is a view/query, not a new data model
- Spines eligibility is calculated based on existing relationships (reads, Shelf, Quiet Picks, resonance)
- Spines should feel like a side room, not a lobby
- Discovery flows through Chapters first, then Books
- Spines is the bridge between reading and connection
