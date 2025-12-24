# Implementation Plan: Spines (People Discovery)

## Overview

This implementation plan breaks down the Spines feature into discrete, manageable coding tasks. Spines is a query/view layer that leverages existing data models, so no new database tables are required. The implementation focuses on backend query logic, API endpoints, frontend components, and integration with the Library view.

## Tasks

- [ ] 1. Backend - Spines eligibility query
  - Create SpinesService class in `backend/app/library/service.py`
  - Implement get_spines_for_user() method with eligibility logic
  - Query Books user has read Chapters from (via hearts/bookmarks)
  - Query Books on user's Shelf
  - Query Books that appeared in Quiet Picks
  - Query Books with high resonance scores (< 0.3 similarity threshold)
  - Exclude user's own Book
  - Order by resonance score DESC, then last_interaction_at DESC
  - Implement diversity filter (max 1 Book per author in top 20)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2_

- [ ]* 1.1 (OPTIONAL) Write property test for Spines eligibility
  - **Property 1: Spines only show encountered Books**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

- [ ]* 1.2 (OPTIONAL) Write property test for own Book exclusion
  - **Property 2: Spines exclude own Book**
  - **Validates: Requirements 2.6**

- [ ] 2. Backend - Spine metadata generation
  - Create generate_spine_metadata() function in SpinesService
  - Extract dominant mood from recent Chapters (last 5)
  - Map mood to warm, muted color palette
  - Generate subtle texture identifier (default: "paper")
  - Extract optional emoji/symbol from Book bio
  - Return SpineMetadata with color, texture, symbol
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 3. Backend - Spines schemas
  - Create SpineMetadata schema in `backend/app/library/schemas.py`
  - Create SpineBookResponse schema with Book info + spine_metadata
  - Include resonance_score, last_interaction_at, interaction_type fields
  - _Requirements: 1.2, 5.1, 5.2, 5.3_

- [ ] 4. Backend - Spines API endpoint
  - Create GET /library/spines endpoint in `backend/app/library/router.py`
  - Accept limit (default 50, max 100) and offset parameters
  - Call SpinesService.get_spines_for_user()
  - Generate spine_metadata for each Book
  - Return List[SpineBookResponse]
  - _Requirements: 1.1, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2_

- [ ]* 4.1 (OPTIONAL) Write property test for Spines ordering
  - **Property 3: Spines ordered by resonance**
  - **Validates: Requirements 3.1**

- [ ]* 4.2 (OPTIONAL) Write property test for diversity
  - **Property 4: Spines ensure diversity**
  - **Validates: Requirements 3.2**

- [ ] 5. Backend - Spines caching
  - Implement Redis caching for get_spines_for_user() (TTL: 1 hour)
  - Implement Redis caching for get_spine_metadata() (TTL: 24 hours)
  - Add cache invalidation on chapter read, shelf add, book update
  - _Requirements: Performance optimization_

- [ ] 6. Checkpoint - Backend Spines complete
  - Ensure all backend tests pass
  - Verify Spines query returns correct Books
  - Verify spine metadata generation works
  - Verify caching works correctly
  - Test API endpoint with curl or Postman
  - Ensure all tests pass, ask the user if questions arise

- [ ] 7. Frontend - Spines service
  - Create `frontend/src/services/spines.ts`
  - Define SpineBook interface
  - Implement getSpines(limit, offset) function
  - Implement getSpineMetadata(bookId) function
  - Use apiClient from lib/api-client
  - _Requirements: 1.1_

- [ ] 8. Frontend - Spines hooks
  - Create `frontend/src/hooks/useSpines.ts`
  - Implement useSpines(limit, offset) hook with React Query
  - Implement useSpineMetadata(bookId) hook
  - Configure query caching and refetching
  - _Requirements: 1.1_

- [ ] 9. Frontend - SpineCard component
  - Create `frontend/src/components/SpineCard.tsx`
  - Display Book title vertically (spine-like)
  - Apply color from spine_metadata.color
  - Apply subtle texture from spine_metadata.texture
  - Show optional symbol/emoji from spine_metadata.symbol
  - Hide author username by default
  - Reveal author username on hover/tap
  - Use semantic colors, no profile pictures
  - No follower counts or metrics
  - Make card clickable, navigate to /books/{user_id}
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ]* 9.1 (OPTIONAL) Write property test for no popularity metrics
  - **Property 5: Spines exclude popularity metrics**
  - **Validates: Requirements 1.4, 1.5, 1.6, 3.3, 3.4**

- [ ]* 9.2 (OPTIONAL) Write unit tests for SpineCard
  - Test card displays Book title
  - Test card applies correct color
  - Test author username hidden by default
  - Test author username revealed on hover
  - Test card navigation on click
  - _Requirements: 1.2, 1.3, 5.4_

- [ ] 10. Frontend - SpinesView component
  - Create `frontend/src/components/SpinesView.tsx`
  - Display Spines in grid layout (3-4 cols desktop, 2-3 cols mobile)
  - Resemble bookshelf with vertical spines
  - Show loading state with skeleton spines
  - Show empty state with calm message
  - No infinite scroll (paginated)
  - Subtle hover effects on cards
  - _Requirements: 1.1, 5.1, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 10.1 (OPTIONAL) Write property test for empty state
  - **Property 7: Spines empty state is calm**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

- [ ]* 10.2 (OPTIONAL) Write unit tests for SpinesView
  - Test empty state displays correct message
  - Test loading state shows skeleton spines
  - Test Spines are rendered in grid
  - Test clicking Spine navigates to Book page
  - _Requirements: 7.1, 7.5_

- [ ] 11. Frontend - Update Library page
  - Open `frontend/src/app/library/page.tsx`
  - Add 'spines' to activeTab state type
  - Add Spines tab button to tab navigation
  - Import useSpines hook and SpinesView component
  - Render SpinesView when activeTab === 'spines'
  - Place Spines tab after Quiet Picks (secondary position)
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 12. Frontend - Spines empty state copy
  - Update SpinesView empty state to use exact copy from docs/empty-states.md
  - "Spines appear after you read."
  - "Take your time. Books you encounter will show up here."
  - Use 📚 emoji, centered
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 13. Frontend - Integrate with Shelf
  - Verify "Add to My Shelf" button appears on Book pages accessed from Spines
  - Verify adding/removing from Shelf doesn't affect Spines eligibility
  - Test navigation flow: Spines → Book page → Add to Shelf → Return to Spines
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ]* 13.1 (OPTIONAL) Write property test for Shelf independence
  - **Property 8: Spines and Shelf are independent**
  - **Validates: Requirements 8.3, 8.4**

- [ ] 14. Backend - Muse Spines nudge
  - Create should_suggest_spines() function in `backend/app/muse/service.py`
  - Check if user hasn't visited Spines in 7+ days
  - Check if user has 10+ eligible Spines
  - Check if last nudge was 7+ days ago
  - Return boolean for whether to show nudge
  - Add nudge message: "You might enjoy browsing a few Spines tonight."
  - _Requirements: 4.5_

- [ ] 15. Frontend - Muse Spines nudge UI
  - Add Muse nudge to Library page (subtle banner or tooltip)
  - Show nudge only when should_suggest_spines() returns true
  - Make nudge dismissible
  - Track nudge dismissal to prevent re-showing
  - Link nudge to Spines tab
  - _Requirements: 4.5_

- [ ] 16. Checkpoint - Frontend Spines complete
  - Ensure all frontend tests pass
  - Verify SpineCard displays correctly
  - Verify SpinesView grid layout works
  - Verify Library page Spines tab works
  - Verify empty state displays correctly
  - Verify Muse nudge appears correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 17. Integration testing and polish
  - [ ] 17.1 Test full flow: Read Chapter → View Spines → Tap Spine → View Book
    - Verify Spines appear after reading
    - Verify tapping Spine navigates to Book page
    - Verify Book page shows correct content
    - _Requirements: 1.3, 2.1_

  - [ ] 17.2 Test Spines eligibility updates
    - Read new Chapter, verify Spines updates
    - Add Book to Shelf, verify it appears in Spines
    - Verify Quiet Picks Books appear in Spines
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 17.3 Test Spines ordering and diversity
    - Verify Spines ordered by resonance
    - Verify diversity filter works (max 1 per author in top 20)
    - _Requirements: 3.1, 3.2_

  - [ ] 17.4 Test Spines empty state
    - Create new user with no reading history
    - Verify empty state displays correctly
    - Verify no CTAs or pressure
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 17.5 Test Spines visual design
    - Verify spine colors are warm and muted
    - Verify textures are subtle
    - Verify symbols/emojis display correctly
    - Verify no profile pictures by default
    - Verify author username revealed on hover
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 17.6 Test Spines anti-patterns
    - Verify no follower counts displayed
    - Verify no trending indicators
    - Verify no popularity sorting
    - Verify no "people you may know" suggestions
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ] 17.7 Polish UI and styling
    - Verify semantic colors in light and dark modes
    - Verify spacing and layout are calm and intentional
    - Verify hover states are subtle
    - Verify grid layout is responsive
    - _Requirements: 5.1, 5.6_

- [ ] 18. Final checkpoint - Complete feature verification
  - Run full test suite (backend + frontend)
  - Test in development environment
  - Verify all requirements are met
  - Verify all correctness properties hold
  - Document any known issues or limitations
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests verify end-to-end flows
- Spines is a query/view layer, not a new data model
- Spines leverages existing relationships (reads, Shelf, Quiet Picks, resonance)
- Spines should feel like a side room, not a lobby
- Discovery flows through Chapters first, then Books
