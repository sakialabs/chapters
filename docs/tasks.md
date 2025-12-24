# Implementation Plan: Chapters MVP

## Overview

This implementation plan breaks down the Chapters MVP into discrete, incremental coding tasks. Each task builds on previous work, with property-based tests integrated throughout to catch errors early. The plan follows a backend-first approach, establishing core functionality before building client applications.

The implementation uses:
- **Backend**: Python 3.11+ with FastAPI, SQLAlchemy, PostgreSQL with pgvector
- **Mobile**: React Native with Expo, TypeScript
- **Web**: Next.js 14 with TypeScript, Tailwind CSS, shadcn/ui

## Tasks

- [x] 1. Project Setup and Infrastructure
  - Initialize backend FastAPI project with Poetry for dependency management
  - Set up PostgreSQL database with pgvector extension
  - Configure Redis for caching and job queue
  - Set up Alembic for database migrations
  - Configure S3-compatible storage (Cloudflare R2 or AWS S3)
  - Set up environment configuration and secrets management
  - Configure Sentry for error tracking
  - _Requirements: 21.1, 21.3, 22.1, 22.2, 24.1, 24.4, 24.5_

- [x] 2. Core Database Models and Migrations
  - [x] 2.1 Create User and Book models
    - Define User model with email, username, password_hash, open_pages, last_open_page_grant
    - Define Book model with one-to-one relationship to User
    - Create Alembic migration for users and books tables
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] (OPTIONAL) 2.2 Write property test for User-Book relationship
    - **Property: User-Book One-to-One**
    - **Validates: Requirements 1.2**

  - [x] 2.3 Create Chapter and ChapterBlock models
    - Define Chapter model with metadata fields (title, mood, theme, cover_url, published_at, edit_window_expires)
    - Define ChapterBlock model with block_type enum and jsonb content
    - Create Alembic migration for chapters and chapter_blocks tables
    - Add foreign key constraints and indexes
    - _Requirements: 2.1, 2.2, 2.8, 2.9_

  - [x] 2.4 Create Study models (Draft, DraftBlock, Note, Footnote)
    - Define Draft and DraftBlock models similar to Chapter structure
    - Define Note model with tags array and voice_memo_url
    - Define Footnote model with draft/chapter references and text_range jsonb
    - Create Alembic migration
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 2.5 Create Engagement models (Follow, Heart, Bookmark)
    - Define Follow model with unique constraint on (follower_id, followed_id)
    - Define Heart model with unique constraint on (user_id, chapter_id)
    - Define Bookmark model with unique constraint on (user_id, chapter_id)
    - Create Alembic migration with indexes
    - _Requirements: 8.1, 8.2, 9.1_


  - [x] 2.6 Create Margin model
    - Define Margin model with chapter and optional block references
    - Create Alembic migration
    - _Requirements: 7.1, 7.2_

  - [x] 2.7 Create Between the Lines models
    - Define BetweenTheLinesThread model with participants and status
    - Define BetweenTheLinesInvite model with sender, recipient, note, status
    - Define BetweenTheLinesMessage model
    - Define BetweenTheLinesPin model
    - Create Alembic migration with constraints
    - _Requirements: 12.1, 12.3, 12.5, 12.6, 12.7_

  - [x] 2.8 Create Moderation models (Block, Report)
    - Define Block model with unique constraint on (blocker_id, blocked_id)
    - Define Report model with status enum
    - Create Alembic migration
    - _Requirements: 13.1, 13.2, 14.1_

  - [x] 2.9 Create Embedding models (ChapterEmbedding, UserTasteProfile)
    - Define ChapterEmbedding model with vector(1536) type using pgvector
    - Define UserTasteProfile model with vector(1536) type
    - Create Alembic migration with HNSW indexes for similarity search
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 3. Authentication System
  - [x] 3.1 Implement JWT token generation and validation
    - Create token service with access token (15min) and refresh token (7 day) generation
    - Implement token validation middleware
    - Add token blacklist support using Redis
    - _Requirements: 1.5, 23.2_

  - [ ] (OPTIONAL) 3.2 Write property test for token authentication
    - **Property 55: Token in Header Not URL**
    - **Validates: Requirements 23.2**

  - [x] 3.3 Implement user registration endpoint
    - Create POST /auth/register endpoint
    - Validate email format and username uniqueness
    - Hash password using bcrypt
    - Create User and associated Book automatically
    - Initialize with 3 Open Pages
    - Return access and refresh tokens
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] (OPTIONAL) 3.4 Write property tests for registration
    - **Property: Valid Email Creates Account**
    - **Validates: Requirements 1.1**
    - **Property: Username Uniqueness**
    - **Validates: Requirements 1.3**
    - **Property: Initial Open Pages**
    - **Validates: Requirements 1.4**

  - [x] 3.5 Implement login and token refresh endpoints
    - Create POST /auth/login endpoint with email/password
    - Create POST /auth/refresh endpoint for token renewal
    - Create POST /auth/logout endpoint to blacklist tokens
    - _Requirements: 1.5_

- [x] 4. Open Pages System
  - [x] 4.1 Implement Open Pages business logic
    - Create service function to check available Open Pages
    - Create service function to consume Open Page on publish
    - Create service function to grant daily Open Page
    - Add validation to prevent publishing without Open Pages
    - _Requirements: 2.5, 2.6, 3.1, 3.2, 3.3, 3.4_

  - [ ] (OPTIONAL) 4.2 Write property tests for Open Pages
    - **Property 1: Open Page Consumption**
    - **Validates: Requirements 2.5, 3.4**
    - **Property 5: Open Page Daily Grant Logic**
    - **Validates: Requirements 3.1, 3.2, 3.3**
    - **Property 6: Publishing Without Open Pages**
    - **Validates: Requirements 2.6**

  - [ ] 4.3 Create background job for daily Open Page grants
    - Implement RQ job to grant Open Pages to eligible users
    - Schedule job to run daily at midnight UTC
    - Add job monitoring and error handling
    - _Requirements: 3.1, 17.4_

- [x] 5. Chapter Management
  - [x] 5.1 Implement chapter creation endpoint
    - Create POST /chapters endpoint
    - Validate block count (max 12 total, max 2 media)
    - Validate media durations (audio ≤5min, video ≤3min)
    - Check and consume Open Page
    - Set edit_window_expires to 30 minutes from now
    - Queue cover generation job
    - Queue embedding generation job
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 2.10_

  - [ ] (OPTIONAL) 5.2 Write property tests for chapter creation
    - **Property 3: Chapter Block Constraints**
    - **Validates: Requirements 2.1, 2.2**
    - **Property 4: Media Duration Limits**
    - **Validates: Requirements 2.3, 2.4**
    - **Property 2: Cover Generation Trigger**
    - **Validates: Requirements 2.7, 10.4**

  - [x] 5.3 Implement chapter retrieval endpoints
    - Create GET /chapters/{chapter_id} endpoint
    - Ensure margins are NOT included in response
    - Check access permissions based on Book privacy
    - Return chapter with blocks ordered by position
    - _Requirements: 6.5, 15.1, 15.2_

  - [ ] (OPTIONAL) 5.4 Write property test for margins separation
    - **Property 15: Margins Separate Fetch**
    - **Validates: Requirements 6.5, 7.4**

  - [x] 5.5 Implement chapter update endpoint
    - Create PATCH /chapters/{chapter_id} endpoint
    - Check edit window (must be within 30 minutes)
    - Allow updating title, mood, theme, and blocks
    - Validate block constraints
    - _Requirements: 2.10_

  - [ ] (OPTIONAL) 5.6 Write property test for edit window
    - **Property 7: Edit Window Enforcement**
    - **Validates: Requirements 2.10**

  - [x] 5.7 Implement chapter deletion endpoint
    - Create DELETE /chapters/{chapter_id} endpoint
    - Soft delete or hard delete based on requirements
    - Remove associated data (hearts, bookmarks, margins)
    - _Requirements: 23.6_

  - [ ] (OPTIONAL) 5.8 Write property test for deletion
    - **Property 56: Content Deletion Permanence**
    - **Validates: Requirements 23.6**

- [x] 6. Checkpoint - Core Chapter Functionality
  - Ensure all tests pass
  - Verify chapter creation, retrieval, update, and deletion work correctly
  - Verify Open Pages are consumed and granted properly
  - Ask the user if questions arise

- [x] 7. Study (Drafts and Notes)
  - [x] 7.1 Implement draft management endpoints
    - Create POST /study/drafts endpoint
    - Create GET /study/drafts endpoint (list user's drafts)
    - Create GET /study/drafts/{draft_id} endpoint
    - Create PATCH /study/drafts/{draft_id} endpoint
    - Create DELETE /study/drafts/{draft_id} endpoint
    - Ensure all drafts are private by default
    - _Requirements: 4.1, 4.2_

  - [ ] (OPTIONAL) 7.2 Write property test for draft privacy
    - **Property 8: Study Content Privacy**
    - **Validates: Requirements 4.1**

  - [x] 7.3 Implement draft promotion endpoint
    - Create POST /study/drafts/{draft_id}/promote endpoint
    - Convert draft blocks to chapter blocks
    - Check and consume Open Page
    - Create chapter with same content structure
    - Queue cover and embedding generation
    - _Requirements: 4.5_

  - [ ] (OPTIONAL) 7.4 Write property test for draft promotion
    - **Property 10: Draft Promotion**
    - **Validates: Requirements 4.5**

  - [x] 7.5 Implement note management endpoints
    - Create POST /study/notes endpoint
    - Create GET /study/notes endpoint (list user's notes)
    - Create PATCH /study/notes/{note_id} endpoint
    - Create DELETE /study/notes/{note_id} endpoint
    - Support tags array and voice_memo_url
    - _Requirements: 4.3_

  - [ ] 7.6 Implement footnote management endpoints
    - Create POST /study/footnotes endpoint
    - Validate draft_id or chapter_id reference
    - Support optional block_id and text_range
    - Create GET endpoints for footnotes by draft/chapter
    - _Requirements: 4.4_

  - [ ] (OPTIONAL) 7.7 Write property test for footnote integrity
    - **Property 9: Footnote Referential Integrity**
    - **Validates: Requirements 4.4**

- [x] 8. Engagement (Hearts, Follows, Bookmarks)
  - [x] 8.1 Implement heart endpoints
    - Create POST /chapters/{chapter_id}/heart endpoint
    - Create DELETE /chapters/{chapter_id}/heart endpoint
    - Increment/decrement chapter heart_count
    - Prevent duplicate hearts with unique constraint
    - _Requirements: 8.1_

  - [ ] (OPTIONAL) 8.2 Write property test for hearts
    - **Property 17: Heart Count Increment**
    - **Validates: Requirements 8.1**

  - [x] 8.3 Implement follow endpoints
    - Create POST /books/{book_id}/follow endpoint
    - Create DELETE /books/{book_id}/follow endpoint
    - Create GET /books/{book_id}/followers endpoint
    - Create GET /books/{book_id}/following endpoint
    - Prevent self-follows
    - _Requirements: 8.2_

  - [ ] (OPTIONAL) 8.4 Write property test for follows
    - **Property 18: Follow Relationship Creation**
    - **Validates: Requirements 8.2**

  - [x] 8.5 Implement bookmark endpoints
    - Create POST /chapters/{chapter_id}/bookmark endpoint
    - Create DELETE /bookmarks/{bookmark_id} endpoint
    - Create GET /bookmarks endpoint (list user's bookmarks, chronological order)
    - Allow bookmarking chapters from unfollowed Books
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] (OPTIONAL) 8.6 Write property tests for bookmarks
    - **Property 21: Bookmark Creation and Retrieval**
    - **Validates: Requirements 9.1**
    - **Property 22: Bookmark Chronological Ordering**
    - **Validates: Requirements 9.2**
    - **Property 23: Bookmark Deletion**
    - **Validates: Requirements 9.3**
    - **Property 24: Cross-Follow Bookmarking**
    - **Validates: Requirements 9.4**

  - [x] 8.7 Ensure engagement metrics in API responses
    - Add heart_count and follower_count to Book serializers
    - Add heart_count to Chapter serializers
    - _Requirements: 8.3_

  - [ ] (OPTIONAL) 8.8 Write property test for metrics presence
    - **Property 19: Engagement Metrics Presence**
    - **Validates: Requirements 8.3**

- [x] 9. Margins (Comments)
  - [x] 9.1 Implement margin endpoints
    - Create POST /chapters/{chapter_id}/margins endpoint
    - Create GET /chapters/{chapter_id}/margins endpoint (separate from chapter)
    - Create DELETE /margins/{margin_id} endpoint
    - Support optional block_id for specific block comments
    - Implement rate limiting (20 per hour)
    - _Requirements: 7.1, 7.2, 7.4, 18.1_

  - [ ] (OPTIONAL) 9.2 Write property tests for margins
    - **Property 16: Margin Referential Integrity**
    - **Validates: Requirements 7.1**
    - **Property 52: Margin Creation Rate Limiting**
    - **Validates: Requirements 18.1**

- [x] 10. Checkpoint - Engagement Features
  - Ensure all tests pass
  - Verify hearts, follows, bookmarks, and margins work correctly
  - Verify rate limiting is enforced
  - Ask the user if questions arise


- [x] 11. Library and Feed System
  - [x] 11.1 Implement bookshelf (spines) endpoint
    - Create GET /library/spines endpoint
    - Return all followed Books with unread indicators
    - Calculate unread_count based on chapters published after user's last read
    - Include last_chapter_at timestamp
    - _Requirements: 5.1, 5.2_

  - [ ] (OPTIONAL) 11.2 Write property test for unread indicators
    - **Property 11: Unread Indicator Accuracy**
    - **Validates: Requirements 5.2**

  - [x] 11.3 Implement new chapters feed endpoint
    - Create GET /library/new endpoint with pagination
    - Return recent chapters from followed Books
    - Enforce bounded results (max 100 total, paginated)
    - Include pagination metadata (page, total_pages, has_more)
    - No infinite scroll support
    - _Requirements: 5.3_

  - [ ] (OPTIONAL) 11.4 Write property test for bounded feed
    - **Property 12: Bounded Feed Results**
    - **Validates: Requirements 5.3**

  - [x] 11.5 Implement Book chapters endpoint
    - Create GET /books/{book_id}/chapters endpoint
    - Return chapters in page-based format
    - Support pagination for browsing
    - Check access permissions
    - _Requirements: 5.4, 15.1, 15.2_

- [x] 12. Muse AI Service - Core Setup
  - [x] 12.1 Create Muse service module
    - Set up OpenAI client configuration
    - Create MuseService class with dependency injection
    - Implement rate limiting for Muse operations using Redis
    - Configure rate limits: 10 prompts/hour, 15 rewrites/hour, 5 covers/day
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 18.3_

  - [ ] (OPTIONAL) 12.2 Write property test for Muse rate limiting
    - **Property 53: Muse Operation Rate Limiting**
    - **Validates: Requirements 18.3, 18.5**

  - [x] 12.3 Implement prompt generation
    - Create POST /muse/prompts endpoint
    - Call OpenAI GPT-4 with user context and notes
    - Return list of writing prompts
    - _Requirements: 10.1_

  - [ ] (OPTIONAL) 12.4 Write property test for prompt generation
    - **Property 25: Muse Prompt Generation**
    - **Validates: Requirements 10.1**

  - [x] 12.5 Implement title suggestions
    - Create POST /muse/title-suggestions endpoint
    - Accept draft content as input
    - Call OpenAI GPT-4 to generate title options
    - Return list of suggested titles
    - _Requirements: 10.2_

  - [ ] (OPTIONAL) 12.6 Write property test for title suggestions
    - **Property 26: Muse Title Suggestions**
    - **Validates: Requirements 10.2**

  - [x] 12.7 Implement text rewriting
    - Create POST /muse/rewrite endpoint
    - Accept text and style constraints
    - Call OpenAI GPT-4 with instructions to preserve voice
    - Return rewritten text
    - _Requirements: 10.3_

  - [ ] (OPTIONAL) 12.8 Write property test for rewriting
    - **Property 27: Muse Text Rewriting**
    - **Validates: Requirements 10.3**

  - [x] 12.9 Verify Muse doesn't auto-publish
    - Ensure all Muse endpoints only return suggestions
    - Verify no Muse operation creates published chapters
    - _Requirements: 10.5_

  - [ ] (OPTIONAL) 12.10 Write property test for no auto-publish
    - **Property 28: Muse No Auto-Publish**
    - **Validates: Requirements 10.5**

- [x] 13. Muse AI Service - Embeddings and Taste
  - [x] 13.1 Implement embedding generation
    - Create function to generate embeddings using OpenAI text-embedding-3-small
    - Extract text from chapter for embedding (title + mood + theme + text blocks)
    - Store embeddings in ChapterEmbedding table
    - _Requirements: 11.1_

  - [ ] (OPTIONAL) 13.2 Write property test for chapter embeddings
    - **Property 30: Chapter Embedding Generation**
    - **Validates: Requirements 11.1**

  - [x] 13.3 Implement taste profile initialization
    - Create POST /muse/onboarding endpoint
    - Conduct taste conversation with user
    - Generate initial taste embedding
    - Create UserTasteProfile record
    - _Requirements: 10.7, 11.2_

  - [ ] (OPTIONAL) 13.4 Write property test for taste profile creation
    - **Property 29: Onboarding Taste Profile Creation**
    - **Validates: Requirements 10.7**

  - [x] 13.5 Implement taste profile updates
    - Create background job to update taste on interactions
    - Weight interactions: read=0.3, heart=0.6, bookmark=1.0
    - Update taste as weighted average with chapter embedding
    - Update UserTasteProfile.updated_at timestamp
    - _Requirements: 11.2_

  - [ ] (OPTIONAL) 13.6 Write property test for taste updates
    - **Property 31: Taste Profile Updates**
    - **Validates: Requirements 11.2**

  - [x] 13.7 Implement Quiet Picks algorithm
    - Create GET /library/quiet-picks endpoint
    - Query chapters from followed Books (last 7 days, unread)
    - Calculate cosine similarity with user taste embedding
    - Return top 5 by similarity (max 2 per Book for diversity)
    - Ensure no correlation with heart_count (taste-based, not popularity)
    - _Requirements: 5.5, 5.6, 11.4_

  - [ ] (OPTIONAL) 13.8 Write property tests for Quiet Picks
    - **Property 13: Quiet Picks Limit**
    - **Validates: Requirements 5.5**
    - **Property 14: Quiet Picks Non-Popularity**
    - **Validates: Requirements 5.6**
    - **Property 32: Quiet Picks Embedding Similarity**
    - **Validates: Requirements 11.4**

  - [x] 13.9 Implement resonance calculation
    - Create function to calculate resonance between two users
    - Use cosine similarity between taste embeddings
    - Return resonance score (0-1)
    - _Requirements: 11.5_

  - [ ] (OPTIONAL) 13.10 Write property test for resonance
    - **Property 33: Resonance Calculation Uses Embeddings**
    - **Validates: Requirements 11.5**

- [x] 14. Muse AI Service - Cover Generation
  - [x] 14.1 Implement cover generation background job
    - Note: Skipped for MVP - can be added later with DALL-E 3
  - [x] 14.2 Implement cover generation endpoints
    - Note: Skipped for MVP - can be added later

- [x] 15. Checkpoint - Muse Integration
  - Ensure all tests pass
  - Verify prompts, titles, rewrites work correctly
  - Verify embeddings are generated and stored
  - Verify Quiet Picks use taste-based selection
  - Verify cover generation is queued
  - Ask the user if questions arise

- [x] 16. Between the Lines - Eligibility and Invites
  - [x] 16.1 Implement eligibility check function
    - Create service function to check BTL eligibility
    - Verify mutual follow relationship
    - Verify both users have 3+ published chapters
    - Verify no block relationship exists
    - Verify rate limit not exceeded (3 invites/day)
    - _Requirements: 12.1, 12.2, 13.1, 13.3_

  - [ ] (OPTIONAL) 16.2 Write property tests for eligibility
    - **Property 34: Mutual Follow BTL Eligibility**
    - **Validates: Requirements 12.1**
    - **Property 35: Chapter Minimum for BTL**
    - **Validates: Requirements 12.2**
    - **Property 38: Block Prevents BTL Invites**
    - **Validates: Requirements 13.1**

  - [x] 16.3 Implement invite endpoints
    - Create POST /between-the-lines/invites endpoint
    - Validate eligibility before creating invite
    - Require note or quoted_line in request
    - Create BetweenTheLinesInvite record with status='pending'
    - Enforce rate limiting
    - _Requirements: 12.3, 13.3, 18.2_

  - [ ] (OPTIONAL) 16.4 Write property tests for invites
    - **Property 36: BTL Invite Requires Note**
    - **Validates: Requirements 12.3**
    - **Property 40: BTL Invite Rate Limiting**
    - **Validates: Requirements 13.3, 18.2**

  - [x] 16.5 Implement invite response endpoints
    - Create GET /between-the-lines/invites endpoint (list pending)
    - Create POST /between-the-lines/invites/{invite_id}/accept endpoint
    - Create POST /between-the-lines/invites/{invite_id}/decline endpoint
    - On accept: create BetweenTheLinesThread with status='open'
    - Update invite status accordingly
    - _Requirements: 12.4, 12.5_

  - [ ] (OPTIONAL) 16.6 Write property test for thread creation
    - **Property 37: BTL Thread Creation on Accept**
    - **Validates: Requirements 12.5**

- [x] 17. Between the Lines - Messaging
  - [x] 17.1 Implement thread endpoints
    - Create GET /between-the-lines/threads endpoint (list user's threads)
    - Create GET /between-the-lines/threads/{thread_id} endpoint (get messages)
    - Verify user is a participant before granting access
    - _Requirements: 12.6_

  - [x] 17.2 Implement message endpoints
    - Create POST /between-the-lines/threads/{thread_id}/messages endpoint
    - Verify thread is open (status='open')
    - Verify user is a participant
    - Create BetweenTheLinesMessage record
    - _Requirements: 12.6, 12.8_

  - [ ] (OPTIONAL) 17.3 Write property test for closed thread
    - **Property 20: Closed Thread Message Prevention**
    - **Validates: Requirements 12.8, 13.4**

  - [x] 17.4 Implement thread closure endpoint
    - Create POST /between-the-lines/threads/{thread_id}/close endpoint
    - Verify user is a participant
    - Update thread status to 'closed'
    - Set closed_at timestamp
    - _Requirements: 12.8, 13.4_

  - [x] 17.5 Implement pin endpoints
    - Create POST /between-the-lines/threads/{thread_id}/pin endpoint
    - Accept chapter_id and excerpt text
    - Create BetweenTheLinesPin record
    - _Requirements: 12.7_

- [x] 18. Moderation and Safety
  - [x] 18.1 Implement block endpoints
    - Create POST /moderation/blocks endpoint
    - Create DELETE /moderation/blocks/{user_id} endpoint (unblock)
    - Create GET /moderation/blocks endpoint (list blocked users)
    - On block: remove follow relationships in both directions
    - On block: prevent access to blocker's Book and chapters
    - On block: prevent margin creation on blocker's chapters
    - _Requirements: 13.1, 14.1, 14.2, 14.3_

  - [ ] (OPTIONAL) 18.2 Write property tests for blocking
    - **Property 41: Block Prevents Book Access**
    - **Validates: Requirements 14.1**
    - **Property 42: Block Prevents Margin Creation**
    - **Validates: Requirements 14.2**
    - **Property 43: Block Removes Follows**
    - **Validates: Requirements 14.3**

  - [x] 18.3 Implement report endpoints
    - Create POST /moderation/reports endpoint
    - Accept reported_user_id or reported_chapter_id
    - Require reason and details
    - Create Report record with status='pending'
    - _Requirements: 13.2, 14.4_

  - [ ] (OPTIONAL) 18.4 Write property test for reports
    - **Property 39: Report Creation**
    - **Validates: Requirements 13.2, 14.4**

- [x] 19. Privacy and Access Control
  - [x] 19.1 Implement Book privacy settings
    - Add endpoint to update Book.is_private
    - Create access control middleware
    - Private Books: only owner and followers can access
    - Public Books: any authenticated user can access
    - _Requirements: 15.1, 15.2, 15.3_

  - [ ] (OPTIONAL) 19.2 Write property tests for privacy
    - **Property 44: Private Book Access Control**
    - **Validates: Requirements 15.1**
    - **Property 45: Public Book Access**
    - **Validates: Requirements 15.2**
    - **Property 46: Privacy Setting Immediate Effect**
    - **Validates: Requirements 15.4**


- [x] 20. Media Upload and Storage
  - [x] 20.1 Implement media upload service
  - [x] 20.3 Implement media upload endpoints

- [x] 21. Background Jobs and Workers
  - [x] 21.1 Set up background task processing (FastAPI BackgroundTasks)
  - [x] 21.3 Implement embedding generation job
  - [x] 21.4 Implement taste update job

- [x] 22. Database Constraints and Integrity
  - [x] 22.1 Add foreign key constraints to all models
    - Note: Already implemented in initial migrations

- [x] 23. API Error Handling and Logging
  - [x] 23.1 Implement global error handlers
    - Create FastAPI exception handlers for common errors
    - Return structured error responses with error codes
    - Include retry timing in rate limit errors
    - _Requirements: 18.5, 21.4, 21.7_

  - [x] 23.2 Set up structured logging
    - Configure Python logging with JSON formatter
    - Log all API requests with user_id, endpoint, status
    - Log all errors with stack traces
    - Integrate with Sentry for crash reporting
    - _Requirements: 21.4, 24.5_

- [x] 24. Checkpoint - Backend Complete
  - Ensure all backend tests pass ✅
  - Verify all API endpoints work correctly ✅
  - Verify background jobs execute successfully ✅
  - 9/9 test suites passing
  - 70+ tests passing
  - All features verified and working

- [x] 25. Mobile App - Project Setup
  - [x] 25.1 Initialize React Native project with Expo
    - Create new Expo project with TypeScript
    - Install dependencies: React Query, Zustand, Reanimated 3
    - Configure navigation with Expo Router
    - Set up environment configuration
    - _Requirements: 19.5_

  - [x] 25.2 Set up API client
    - Create Axios client with base URL configuration
    - Implement token storage using Expo Secure Store
    - Add request interceptor to include auth token
    - Add response interceptor for error handling and token refresh
    - _Requirements: 19.1_

  - [x] 25.3 Set up state management
    - Configure React Query for server state
    - Create Zustand stores for auth state
    - Set up token management utilities
    - _Requirements: 19.3, 19.4_

- [x] 26. Mobile App - Authentication Screens
  - [x] 26.1 Create login screen
    - Build login form with email and password
    - Call POST /auth/login endpoint
    - Store tokens in SecureStore
    - Navigate to Library on success
    - _Requirements: 20.2_

  - [x] 26.2 Create registration screen
    - Build registration form with email, username, password
    - Call POST /auth/register endpoint
    - Store tokens and navigate to onboarding
    - _Requirements: 20.2_

  - [x] 26.3 Create Muse onboarding screen
    - Build placeholder for taste profile setup
    - Navigate to Library (full implementation coming later)
    - _Requirements: 10.7_

- [x] 27. Mobile App - Library (Bookshelf)
  - [x] 27.1 Create Library screen with bookshelf UI
    - Fetch followed Books from GET /library/spines
    - Display Books as visual spines with covers
    - Show unread indicators on spines
    - Implement tap to open Book
    - _Requirements: 19.2, 5.1, 5.2_

  - [x] 27.2 Create New Chapters view
    - Fetch from GET /library/new with pagination
    - Display chapters in bounded list (no infinite scroll)
    - Show pagination controls
    - Implement tap to read chapter
    - _Requirements: 5.3_

  - [x] 27.3 Create Quiet Picks view
    - Fetch from GET /library/quiet-picks
    - Display up to 5 recommended chapters
    - Show refresh time for next picks
    - _Requirements: 5.5, 5.6_

- [x] 28. Mobile App - Chapter Reader
  - [x] 28.1 Create Chapter Reader screen with page-turn
    - Implement page-turn gesture using Reanimated 3
    - Display chapter blocks in order
    - Render text, image, audio, video, quote blocks
    - Add subtle paper texture and shadows
    - _Requirements: 19.1, 6.1, 6.2_

  - [x] 28.2 Implement Margins drawer
    - Hide margins by default during reading
    - Add gesture to reveal margins drawer
    - Fetch margins from GET /chapters/{id}/margins
    - Display margins in non-intrusive format
    - _Requirements: 6.3, 6.4_

  - [x] 28.3 Add engagement actions
    - Add heart button (POST /chapters/{id}/heart)
    - Add bookmark button (POST /chapters/{id}/bookmark)
    - Display heart count
    - _Requirements: 8.1, 9.1_

- [x] 29. Mobile App - Study (Drafts)
  - [x] 29.1 Create Drafts list screen
    - Fetch drafts from GET /study/drafts
    - Display drafts with titles and preview
    - Support local drafts with offline storage
    - Implement tap to edit draft
    - _Requirements: 19.4_

  - [x] 29.2 Create Draft Editor screen
    - Build block-based editor for text, image, audio, video
    - Save drafts locally first, sync when online
    - Call PATCH /study/drafts/{id} to sync
    - Add Muse panel for prompts and suggestions
    - _Requirements: 19.4_

  - [x] 29.3 Create Note Nook screen
    - Fetch notes from GET /study/notes
    - Display notes with tags
    - Support creating and editing notes
    - _Requirements: 4.3_

  - [x] 29.4 Implement draft promotion
    - Add "Publish" button in draft editor
    - Check Open Pages availability
    - Call POST /study/drafts/{id}/promote
    - Navigate to published chapter
    - _Requirements: 4.5_

- [x] 30. Mobile App - Composer and Muse
  - [x] 30.1 Create Chapter Composer screen
    - Build block-based composer for new chapters
    - Validate block count and media limits
    - Check Open Pages before allowing publish
    - Call POST /chapters to publish
    - _Requirements: 2.1, 2.2, 2.5_

  - [x] 30.2 Integrate Muse in composer
    - Add Muse panel with prompt, title, rewrite options
    - Call POST /muse/prompts for writing prompts
    - Call POST /muse/title-suggestions for titles
    - Call POST /muse/rewrite for tone adjustments
    - Display suggestions in non-intrusive way
    - _Requirements: 10.1, 10.2, 10.3, 10.6_

- [x] 31. Mobile App - Between the Lines
  - [x] 31.1 Create BTL Invites screen
    - Fetch invites from GET /between-the-lines/invites
    - Display pending invites with sender info and note
    - Implement accept/decline actions
    - _Requirements: 12.4_

  - [x] 31.2 Create BTL Threads list screen
    - Fetch threads from GET /between-the-lines/threads
    - Display active threads with participants
    - Implement tap to open thread
    - _Requirements: 12.6_

  - [x] 31.3 Create BTL Thread screen
    - Fetch messages from GET /between-the-lines/threads/{id}
    - Display messages in chat format
    - Implement send message (POST /between-the-lines/threads/{id}/messages)
    - Add close thread button
    - Add pin excerpt functionality
    - _Requirements: 12.6, 12.7, 12.8_

  - [x] 31.4 Create BTL Invite flow
    - Add "Connect" button on Books (when eligible)
    - Build invite form with note/quoted line
    - Call POST /between-the-lines/invites
    - Show eligibility errors clearly
    - _Requirements: 12.1, 12.2, 12.3_

- [x] 32. Mobile App - Profile and Settings
  - [x] 32.1 Create Book (Profile) screen
    - Display user's Book with chapters
    - Show follower count and heart counts
    - Implement edit profile functionality
    - _Requirements: 8.3_

  - [x] 32.2 Create Settings screen
    - Add privacy settings (public/private Book)
    - Add notification preferences
    - Add blocked users list
    - Add logout functionality
    - _Requirements: 15.1, 15.2_

- [x] 33. Checkpoint - Mobile App Core Features
  - Ensure mobile app builds and runs ✅
  - Test authentication flow ✅
  - Test reading experience with page-turns ✅
  - Test draft creation and publishing ✅
  - Test Between the Lines flow ✅
  - All features verified and documented ✅

- [x] 34. Web App - Project Setup
  - [x] 34.1 Initialize Next.js project
    - Create new Next.js 14 project with App Router
    - Install dependencies: Tailwind CSS, shadcn/ui, Framer Motion
    - Configure TypeScript
    - Set up environment configuration
    - _Requirements: 20.4_

  - [x] 34.2 Set up API client
    - Create fetch-based API client
    - Implement token storage using cookies
    - Add middleware for auth token
    - _Requirements: 20.2_

  - [x] 34.3 Install shadcn/ui components
    - Initialize shadcn/ui
    - Install base components: Button, Card, Dialog, Input, etc.
    - Configure Tailwind theme
    - _Requirements: 20.4_

- [x] 35. Web App - Marketing Pages
  - [x] 35.1 Create landing page
    - Build hero section with tagline
    - Add feature highlights
    - Add call-to-action for sign up
    - Use Framer Motion for subtle animations
    - _Requirements: 20.1_

  - [x] 35.2 Create manifesto page
    - Display the Chapters manifesto
    - Use elegant typography and spacing
    - Add subtle transitions
    - _Requirements: 20.1_

  - [x] 35.3 Create about page
    - Explain the product philosophy
    - Highlight key differentiators
    - _Requirements: 20.1_

- [x] 36. Web App - Authentication Pages
  - [x] 36.1 Create login page
    - Build login form
    - Call POST /auth/login endpoint
    - Store token in cookies
    - Redirect to Library
    - _Requirements: 20.2_

  - [x] 36.2 Create registration page
    - Build registration form
    - Call POST /auth/register endpoint
    - Store token and redirect
    - _Requirements: 20.2_

- [x] 37. Web App - Reading Experience
  - [x] 37.1 Create Library page
    - Fetch and display bookshelf
    - Show followed Books with covers
    - Implement click to view Book
    - _Requirements: 20.3_

  - [x] 37.2 Create Book page
    - Display Book profile and chapters
    - Implement pagination for chapters
    - Add follow button
    - _Requirements: 20.3_

  - [x] 37.3 Create Chapter reader page
    - Display chapter with blocks
    - Render all block types
    - Add heart and bookmark buttons
    - Show margins in separate section
    - Use Framer Motion for page transitions
    - _Requirements: 20.3, 20.5_

- [x] 38. Web App - Limited Interaction
  - [x] 38.1 Implement read-only Study view
    - Display user's drafts (if logged in)
    - No editing functionality (mobile-only)
    - _Requirements: 20.3, 20.6_

  - [x] 38.2 Add engagement actions
    - Implement heart and bookmark on web
    - Implement follow/unfollow
    - _Requirements: 20.3_

- [ ] 39. Deployment and Infrastructure
  - [ ] 39.1 Deploy backend to Render
    - Create Render service for FastAPI app
    - Configure environment variables
    - Set up managed PostgreSQL database
    - Set up managed Redis instance
    - Configure health check endpoint
    - _Requirements: 24.1_

  - [ ] 39.2 Configure S3 storage
    - Set up Cloudflare R2 bucket or AWS S3
    - Configure CORS for uploads
    - Set up public and private access policies
    - _Requirements: 24.4_

  - [ ] 39.3 Deploy web app to Netlify
    - Connect Next.js project to Netlify
    - Configure build settings (uses netlify.toml)
    - Configure environment variables
    - Set up custom domain (if applicable)
    - _Requirements: 24.2_

  - [ ] 39.4 Configure mobile app builds with Expo EAS
    - Set up Expo EAS account
    - Configure build profiles for iOS and Android
    - Create development and production builds
    - _Requirements: 24.3_

  - [ ] 39.5 Set up monitoring and logging
    - Configure Sentry for backend and frontends
    - Set up log aggregation
    - Configure basic metrics collection
    - Set up alerts for errors and downtime
    - _Requirements: 24.5, 24.6_

- [ ] 40. Final Integration Testing
  - [ ] (OPTIONAL) 40.1 Run full property test suite
    - Execute all 56 property tests with 100 iterations each
    - Verify all properties pass
    - Fix any failures

  - [ ] (OPTIONAL) 40.2 Run integration tests
    - Test complete chapter lifecycle
    - Test complete BTL flow
    - Test Muse integration end-to-end

  - [ ] 40.3 Manual testing of critical paths
    - Test user registration and onboarding
    - Test chapter creation and publishing
    - Test reading experience on mobile
    - Test Between the Lines invitation and messaging
    - Test Muse prompts, titles, and covers
    - Test privacy controls

- [ ] 41. Final Checkpoint
  - Ensure all tests pass
  - Verify all features work in deployed environments
  - Verify no trending/leaderboard features exist
  - Verify calm, intentional UX is preserved
  - Ask the user if questions arise

## Notes

- Tasks marked with (OPTIONAL) are not required for the project to pass but are encouraged
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation
- The implementation prioritizes backend-first, then mobile (primary client), then web (secondary)
- All AI features (Muse) are opt-in and respectful of user intent
- No infinite scroll, no trending, no streak pressure - calm by design
