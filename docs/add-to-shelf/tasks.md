# Implementation Plan: Add to My Shelf

## Overview

This implementation plan breaks down the "Add to My Shelf" feature into discrete coding tasks. Each task builds on previous steps and includes references to specific requirements. The plan follows a bottom-up approach: database → backend API → frontend services → UI components → integration.

## Tasks

- [ ] 1. Create database model and migration
  - Create Shelf model in `backend/app/models/engagement.py`
  - Add unique constraint on (user_id, book_owner_id)
  - Add CHECK constraint to prevent self-shelf (user_id != book_owner_id)
  - Add indexes on user_id, book_owner_id, and created_at
  - Add cascade deletion on user deletion
  - Update User model to include shelf_items relationship
  - Create Alembic migration script
  - _Requirements: 5.1, 5.2, 5.4, 8.1_

- [ ]* 1.1 (OPTIONAL) Write property test for Shelf model
  - **Property 1: Add to Shelf creates entry**
  - **Validates: Requirements 1.2, 5.1**

- [ ]* 1.2 (OPTIONAL) Write property test for cascade deletion
  - **Property 15: Cascade deletion removes Shelf entries**
  - **Validates: Requirements 5.4**

- [ ] 2. Create backend schemas
  - Create ShelfResponse schema in `backend/app/engagement/schemas.py`
  - Create ShelfBookResponse schema with Book metadata
  - Add validation for book_id
  - _Requirements: 3.2, 4.2_

- [ ] 3. Implement Shelf API endpoints
  - [ ] 3.1 Implement POST /engagement/books/{book_id}/shelf
    - Validate Book exists
    - Prevent self-shelf (return 400 if user_id == book_owner_id)
    - Check if already on Shelf (idempotent - return existing entry)
    - Create Shelf entry with user_id, book_owner_id, timestamp
    - Return ShelfResponse
    - _Requirements: 1.2, 5.1_

  - [ ]* 3.2 (OPTIONAL) Write property test for add to Shelf endpoint
    - **Property 1: Add to Shelf creates entry**
    - **Validates: Requirements 1.2, 5.1**

  - [ ] 3.3 Implement DELETE /engagement/books/{book_id}/shelf
    - Validate Book exists
    - Find Shelf entry for current user and book_owner_id
    - Return 404 if not on Shelf
    - Delete Shelf entry
    - Return 204 No Content
    - _Requirements: 2.1, 5.2_

  - [ ]* 3.4 (OPTIONAL) Write property test for remove from Shelf endpoint
    - **Property 3: Remove from Shelf deletes entry**
    - **Validates: Requirements 2.1, 2.2, 5.2**

  - [ ]* 3.5 (OPTIONAL) Write property test for Hearts/Bookmarks preservation
    - **Property 4: Shelf removal preserves Hearts and Bookmarks**
    - **Validates: Requirements 2.3**

  - [ ] 3.6 Implement GET /engagement/shelf
    - Query all Shelf entries for current user
    - Join with User and Book tables to get metadata
    - Order by created_at DESC (most recent first)
    - Return List[ShelfBookResponse]
    - _Requirements: 3.1, 3.5, 5.3_

  - [ ]* 3.7 (OPTIONAL) Write property test for Shelf retrieval
    - **Property 5: Shelf view shows all added Books**
    - **Validates: Requirements 3.1, 5.3**

  - [ ]* 3.8 (OPTIONAL) Write property test for Shelf ordering
    - **Property 7: Shelf Books are ordered by recency**
    - **Validates: Requirements 3.5**

  - [ ] 3.9 Implement GET /engagement/books/{book_id}/shelf
    - Validate Book exists
    - Query Shelf entries where book_owner_id = Book.user_id
    - Join with User and Book tables to get metadata
    - Order by created_at DESC
    - Return List[ShelfBookResponse] (public, no auth required for viewing)
    - _Requirements: 4.1, 6.1_

  - [ ] 3.10 Implement GET /engagement/books/{book_id}/shelf/status
    - Validate Book exists
    - Check if Shelf entry exists for current user and book_owner_id
    - Return {"on_shelf": boolean}
    - _Requirements: 1.5_

  - [ ]* 3.11 (OPTIONAL) Write property test for Shelf count accuracy
    - **Property 10: Shelf count is accurate**
    - **Validates: Requirements 6.2**

  - [ ]* 3.12 (OPTIONAL) Write property test for no notifications
    - **Property 11: No notifications on Shelf actions**
    - **Validates: Requirements 6.3**

  - [ ]* 3.13 (OPTIONAL) Write property test for Shelf data model constraints
    - **Property 13: Shelf only stores Book references**
    - **Validates: Requirements 8.1**

  - [ ]* 3.14 (OPTIONAL) Write property test for no automatic Hearts/Bookmarks
    - **Property 14: Shelf actions don't create Hearts or Bookmarks**
    - **Validates: Requirements 8.3**

- [ ] 4. Checkpoint - Ensure all backend tests pass
  - Run all Shelf-related tests
  - Verify database constraints work correctly
  - Test API endpoints with curl or Postman
  - Ensure all tests pass, ask the user if questions arise

- [ ] 5. Create frontend Shelf service
  - Create `frontend/src/services/shelf.ts`
  - Define ShelfBook interface
  - Implement addToShelf(bookId: number)
  - Implement removeFromShelf(bookId: number)
  - Implement getMyShelf()
  - Implement getBookShelf(bookId: number)
  - Implement checkShelfStatus(bookId: number)
  - Use apiClient from lib/api-client
  - _Requirements: 1.2, 2.1, 3.1, 4.1_

- [ ] 6. Create frontend Shelf hooks
  - Create `frontend/src/hooks/useShelf.ts`
  - Implement useMyShelf() hook with React Query
  - Implement useBookShelf(bookId) hook
  - Implement useShelfStatus(bookId) hook
  - Implement useAddToShelf() mutation with optimistic updates
  - Implement useRemoveFromShelf() mutation with optimistic updates
  - Configure query invalidation on mutations
  - _Requirements: 1.2, 2.1, 3.1, 4.1_

- [ ] 7. Create AddToShelfButton component
  - Create `frontend/src/components/AddToShelfButton.tsx`
  - Accept bookId and isOwnBook props
  - Hide button if isOwnBook is true
  - Use useShelfStatus hook to get initial state
  - Use useAddToShelf and useRemoveFromShelf mutations
  - Display "Add to My Shelf 📚" when not on Shelf
  - Display "On My Shelf ✓" when on Shelf
  - Toggle between add/remove on click
  - Use semantic colors (variant="outline" for add, variant="default" for added)
  - Disable button during API call
  - Show error toast on failure
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2_

- [ ]* 7.1 (OPTIONAL) Write property test for button state
  - **Property 2: Button state reflects Shelf status**
  - **Validates: Requirements 1.3, 1.5**

- [ ]* 7.2 (OPTIONAL) Write unit tests for AddToShelfButton
  - Test button is hidden when isOwnBook is true
  - Test button shows correct text based on Shelf status
  - Test button click triggers correct mutation
  - Test error handling reverts UI state
  - _Requirements: 1.4_

- [ ] 8. Create ShelfView component
  - Create `frontend/src/components/ShelfView.tsx`
  - Accept books, isLoading, and emptyMessage props
  - Display loading state with LoadingState component
  - Display empty state with calm message and 📚 emoji
  - Display Books in grid layout (2-4 columns responsive)
  - Show Book portrait (cover_image_url or default avatar)
  - Show Book title (display_name or username)
  - Show author username
  - Show Inside Flap preview (first 150 chars of bio)
  - Make cards clickable, navigate to /books/{user_id}
  - Use semantic colors and hover effects
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4_

- [ ]* 8.1 (OPTIONAL) Write property test for Shelf metadata display
  - **Property 6: Shelf Books contain required metadata**
  - **Validates: Requirements 3.2, 4.2**

- [ ]* 8.2 (OPTIONAL) Write property test for no gamified elements
  - **Property 12: No gamified UI elements**
  - **Validates: Requirements 6.4, 7.4**

- [ ]* 8.3 (OPTIONAL) Write unit tests for ShelfView
  - Test empty state displays correct message
  - Test loading state shows LoadingState component
  - Test Books are rendered in grid
  - Test clicking Book navigates to correct page
  - _Requirements: 3.4, 4.4_

- [ ] 9. Update Library page Bookshelf tab
  - Open `frontend/src/app/library/page.tsx`
  - Import useMyShelf hook and ShelfView component
  - Replace current bookshelf logic with useMyShelf()
  - Pass Shelf data to ShelfView component
  - Use emptyMessage: "Your Shelf is empty. Add Books you want to keep close."
  - Maintain existing tab structure and styling
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 10. Create Book page (if not exists) or update existing
  - Create or update `frontend/src/app/books/[id]/page.tsx`
  - Fetch Book data (user profile, display_name, bio, cover_image)
  - Display Book portrait, title, Inside Flap
  - Add AddToShelfButton component near Book title
  - Pass bookId and isOwnBook (compare with current user)
  - Display Book owner's Shelf using ShelfView component
  - Use useBookShelf(bookId) hook
  - Use emptyMessage: "This Shelf is empty."
  - _Requirements: 1.1, 1.4, 4.1, 4.2, 4.3, 4.4_

- [ ] 11. Add Shelf count to Book page header
  - Query Shelf count for Book owner
  - Display "X Books on Shelf" near Book title
  - Use semantic colors, no badges or gamification
  - _Requirements: 6.2_

- [ ] 12. Update API client configuration
  - Open `frontend/src/lib/api-client.ts` (or equivalent)
  - Ensure Shelf endpoints are accessible
  - Verify authentication headers are included
  - Test API client with Shelf service
  - _Requirements: All API requirements_

- [ ] 13. Checkpoint - Ensure all frontend tests pass
  - Run all Shelf-related frontend tests
  - Test AddToShelfButton in isolation
  - Test ShelfView with mock data
  - Test Library page Bookshelf tab
  - Test Book page integration
  - Ensure all tests pass, ask the user if questions arise

- [ ] 14. Integration testing and polish
  - [ ] 14.1 Test full flow: Add to Shelf → View in Library → Remove from Shelf
    - Verify button state changes correctly
    - Verify Shelf updates immediately in Library
    - Verify removal works correctly
    - _Requirements: 1.2, 1.3, 2.1, 2.2, 3.1_

  - [ ] 14.2 Test Book page Shelf display
    - Verify AddToShelfButton shows correct state
    - Verify Book owner's Shelf is visible
    - Verify clicking Shelf Books navigates correctly
    - _Requirements: 1.1, 1.5, 4.1, 4.3_

  - [ ] 14.3 Test edge cases
    - Verify self-shelf button is hidden
    - Verify empty Shelf states display correctly
    - Verify error handling works (network errors, 404s)
    - _Requirements: 1.4, 3.4, 4.4_

  - [ ] 14.4 Test cascade deletion
    - Create test user with Books on other users' Shelves
    - Delete test user
    - Verify Books are removed from all Shelves
    - _Requirements: 5.4_

  - [ ] 14.5 Polish UI and styling
    - Verify semantic colors in light and dark modes
    - Verify no animations or gamified elements
    - Verify hover states are subtle
    - Verify spacing and layout are calm and intentional
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 15. Final checkpoint - Complete feature verification
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
- The implementation follows a bottom-up approach: database → API → services → UI → integration
- Optimistic updates provide immediate feedback while maintaining data consistency
- Error handling ensures graceful degradation and user feedback
- All UI components use semantic CSS variables for theme consistency
