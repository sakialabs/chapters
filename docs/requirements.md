# Requirements Document: Chapters MVP

## Introduction

Chapters is a calm, expressive, AI-assisted social platform built for depth, not dopamine. The system enables users to create and share rich, multimedia "chapters" in a book-like reading experience that prioritizes intentionality, reflection, and meaningful connection over endless scrolling and viral pressure.

The platform serves poets, writers, visual artists, musicians, filmmakers, and people with creative aspirations who seek a more thoughtful alternative to existing social platforms.

## Glossary

- **Book**: A user's profile and collection of published chapters
- **Chapter**: A rich, multimedia post composed of ordered blocks (text, images, audio, video)
- **Open_Page**: A daily allowance token that enables publishing; users receive 1 per day, up to 3 stored
- **Study**: The private workspace where users create drafts, notes, and footnotes
- **Draft**: An unpublished chapter in progress
- **Note_Nook**: The collection of private notes, fragments, and voice memos within Study
- **Margin**: A comment on a chapter, hidden by default and revealed through user gesture
- **Library**: The home view displaying Books as a bookshelf interface
- **Bookshelf**: The visual representation of followed Books with unread indicators
- **Muse**: The AI companion that assists with prompts, titles, tone adjustments, and cover generation
- **Between_The_Lines**: A consent-based private connection space for two users
- **Quiet_Picks**: Up to 5 daily chapter recommendations based on taste, not virality
- **Bookmark**: A saved chapter for later reading
- **Heart**: A like/appreciation gesture on a chapter
- **Block_Content**: Individual content units within a chapter (text, image, audio, video, quoted excerpt)
- **Resonance**: The alignment between users based on reading patterns and taste
- **Spine**: The visual representation of a Book on the bookshelf

## Requirements

### Requirement 1: User Authentication and Book Creation

**User Story:** As a new user, I want to create an account and establish my Book, so that I can begin creating and sharing chapters.

#### Acceptance Criteria

1. WHEN a user provides valid email credentials, THE Authentication_System SHALL create a new user account
2. WHEN a user account is created, THE System SHALL automatically create exactly one Book associated with that user
3. WHEN a user sets their username, THE System SHALL validate uniqueness across all Books
4. WHEN a user completes onboarding, THE System SHALL initialize their account with 3 Open_Pages
5. THE Authentication_System SHALL support token-based authentication with secure session management

### Requirement 2: Chapter Creation and Publishing

**User Story:** As a user, I want to create rich, multimedia chapters with intentional publishing controls, so that I can express myself thoughtfully without pressure.

#### Acceptance Criteria

1. WHEN a user creates a chapter, THE System SHALL support up to 12 Block_Content items per chapter
2. WHEN a user adds media blocks, THE System SHALL enforce a maximum of 2 media blocks per chapter
3. WHEN a user adds audio content, THE System SHALL enforce a maximum duration of 5 minutes
4. WHEN a user adds video content, THE System SHALL enforce a maximum duration of 3 minutes
5. WHEN a user publishes a chapter, THE System SHALL consume exactly 1 Open_Page from their allowance
6. WHEN a user attempts to publish without available Open_Pages, THE System SHALL prevent publication and display their current allowance
7. WHEN a chapter is published, THE System SHALL generate an AI cover based on chapter content and metadata
8. THE System SHALL support Block_Content types: text, image, audio, video, and quoted excerpt
9. WHEN a chapter is created, THE System SHALL allow optional metadata: mood, theme, and time period
10. WHEN a chapter is published, THE System SHALL allow edits for 30 minutes after publication

### Requirement 3: Open Pages System

**User Story:** As a user, I want a daily publishing allowance that encourages intentional posting, so that I can share meaningfully without pressure or streaks.

#### Acceptance Criteria

1. WHEN each day begins, THE System SHALL grant 1 Open_Page to each user account
2. WHEN a user has fewer than 3 Open_Pages, THE System SHALL allow Open_Pages to accumulate
3. WHEN a user has 3 Open_Pages, THE System SHALL not grant additional Open_Pages until one is consumed
4. WHEN a user publishes a chapter, THE System SHALL decrement their Open_Page count by 1
5. THE System SHALL persist Open_Page counts across sessions and device changes

### Requirement 4: Study and Draft Management

**User Story:** As a user, I want a private workspace for drafting and note-taking, so that I can develop ideas before publishing and maintain creative fragments.

#### Acceptance Criteria

1. WHEN a user creates content in Study, THE System SHALL keep all content private by default
2. THE System SHALL support creating multiple drafts simultaneously
3. THE System SHALL support creating notes with text and optional voice memo metadata
4. WHEN a user creates a footnote, THE System SHALL link it to a specific draft or chapter section
5. WHEN a user promotes a draft, THE System SHALL convert it to a publishable chapter
6. THE System SHALL preserve all drafts and notes until explicitly deleted by the user
7. WHEN a user highlights text in their draft, THE System SHALL allow attaching a private footnote

### Requirement 5: Library and Bookshelf Interface

**User Story:** As a user, I want to browse followed Books in a bookshelf interface with finite, intentional navigation, so that I can read without endless scrolling.

#### Acceptance Criteria

1. WHEN a user views their Library, THE System SHALL display followed Books as visual Spines on a bookshelf
2. WHEN a Book has new chapters, THE System SHALL display an unread indicator on its Spine
3. WHEN a user requests new chapters, THE System SHALL return a bounded, paginated list without infinite scroll
4. WHEN a user views a specific Book, THE System SHALL display chapters in page-based navigation
5. THE System SHALL support a maximum of 5 Quiet_Picks per day per user
6. WHEN generating Quiet_Picks, THE System SHALL base recommendations on user taste and reading patterns, not popularity metrics

### Requirement 6: Reading Experience

**User Story:** As a user, I want to read chapters with page-turn navigation and hidden comments, so that I can focus on content without distraction.

#### Acceptance Criteria

1. WHEN a user opens a chapter, THE System SHALL display content in a page-based format
2. WHEN a user navigates between chapters, THE System SHALL support page-turn gestures on mobile
3. WHEN a chapter contains Margins, THE System SHALL hide them by default during reading
4. WHEN a user requests Margins, THE System SHALL reveal them through a separate gesture or action
5. THE System SHALL fetch Margin data separately from chapter content to optimize reading performance

### Requirement 7: Margins (Comments)

**User Story:** As a user, I want to leave thoughtful comments on chapters without disrupting the reading experience, so that I can engage meaningfully.

#### Acceptance Criteria

1. WHEN a user creates a Margin, THE System SHALL link it to a specific chapter
2. WHEN a user creates a Margin, THE System SHALL optionally link it to a specific Block_Content within the chapter
3. WHEN displaying a chapter, THE System SHALL not display Margin counts prominently
4. THE System SHALL support fetching Margins independently from chapter content
5. WHEN a user views Margins, THE System SHALL display them in a non-intrusive format

### Requirement 8: Engagement Mechanics

**User Story:** As a user, I want to express appreciation and follow other Books, so that I can build connections without gamification pressure.

#### Acceptance Criteria

1. WHEN a user hearts a chapter, THE System SHALL record the heart and increment the chapter's heart count
2. WHEN a user follows a Book, THE System SHALL add that Book to their Library bookshelf
3. THE System SHALL display heart counts and follower counts on Books and chapters
4. THE System SHALL NOT display trending lists, leaderboards, or "most liked" rankings
5. THE System SHALL NOT implement streak tracking or posting pressure mechanics

### Requirement 9: Bookmarks

**User Story:** As a user, I want to save chapters for later reading, so that I can return to meaningful content.

#### Acceptance Criteria

1. WHEN a user bookmarks a chapter, THE System SHALL create a bookmark record linking the user to that chapter
2. WHEN a user views their bookmarks, THE System SHALL display all bookmarked chapters in chronological order
3. WHEN a user removes a bookmark, THE System SHALL delete the bookmark record
4. THE System SHALL allow bookmarking both followed and unfollowed Books' chapters

### Requirement 10: Muse AI Companion - Core Features

**User Story:** As a user, I want an AI companion that assists my creative process without overriding my voice, so that I can enhance my expression while maintaining authenticity.

#### Acceptance Criteria

1. WHEN a user requests prompts, THE Muse_Service SHALL generate writing prompts based on user context and notes
2. WHEN a user requests a title suggestion, THE Muse_Service SHALL generate title options based on chapter content
3. WHEN a user requests tone adjustment, THE Muse_Service SHALL rewrite text according to specified style constraints while preserving the user's voice
4. WHEN a user publishes a chapter, THE Muse_Service SHALL generate an AI cover image based on chapter metadata and content
5. THE Muse_Service SHALL NOT auto-post or publish content without explicit user action
6. THE Muse_Service SHALL NOT interrupt the reading experience with unsolicited suggestions
7. WHEN a user completes onboarding, THE Muse_Service SHALL conduct a taste and preference conversation

### Requirement 11: Muse AI Companion - Embeddings and Taste

**User Story:** As a user, I want Muse to understand my taste and reading patterns, so that I receive personalized recommendations and insights.

#### Acceptance Criteria

1. WHEN a chapter is published, THE Muse_Service SHALL generate an embedding vector for that chapter
2. WHEN a user reads, bookmarks, or hearts chapters, THE Muse_Service SHALL update their taste profile embedding
3. THE System SHALL store embedding vectors using pgvector extension in PostgreSQL
4. WHEN generating Quiet_Picks, THE Muse_Service SHALL use embedding similarity to match user taste
5. THE Muse_Service SHALL use embeddings to calculate resonance scores between users for Between_The_Lines eligibility

### Requirement 12: Between the Lines - Connection Space

**User Story:** As a user, I want to connect deeply with others who resonate with my work through a consent-based private space, so that I can build meaningful relationships.

#### Acceptance Criteria

1. WHEN two users mutually follow each other, THE System SHALL mark them as eligible for Between_The_Lines
2. WHEN a user has published fewer than 3 chapters, THE System SHALL prevent them from sending Between_The_Lines invites
3. WHEN a user sends a Between_The_Lines invite, THE System SHALL require a short note or quoted line
4. WHEN a user receives an invite, THE System SHALL allow them to accept or decline
5. WHEN an invite is accepted, THE System SHALL create a private Between_The_Lines thread for the two users
6. THE System SHALL support text messages within Between_The_Lines threads
7. THE System SHALL support pinning chapter excerpts within Between_The_Lines threads
8. WHEN either user closes a Between_The_Lines thread, THE System SHALL mark it as closed and prevent further messages

### Requirement 13: Between the Lines - Safety and Moderation

**User Story:** As a user, I want robust safety controls in Between_The_Lines spaces, so that I can connect safely and exit uncomfortable situations.

#### Acceptance Criteria

1. WHEN a user blocks another user, THE System SHALL prevent all Between_The_Lines invites between them
2. WHEN a user reports another user, THE System SHALL record the report with reason and details
3. THE System SHALL enforce rate limits on Between_The_Lines invite sending
4. WHEN a user closes a Between_The_Lines thread, THE System SHALL immediately prevent new messages
5. THE System SHALL allow users to block, report, or mute at any time within Between_The_Lines

### Requirement 14: Content Moderation and Blocking

**User Story:** As a user, I want to control my experience by blocking users and reporting inappropriate content, so that I can maintain a safe and comfortable environment.

#### Acceptance Criteria

1. WHEN a user blocks another user, THE System SHALL prevent the blocked user from viewing their Book or chapters
2. WHEN a user blocks another user, THE System SHALL prevent the blocked user from creating Margins on their chapters
3. WHEN a user blocks another user, THE System SHALL remove any existing follow relationships
4. WHEN a user reports content, THE System SHALL record the reported chapter or user with reason and details
5. THE System SHALL provide moderation tools for reviewing reports and taking action

### Requirement 15: Book Privacy and Visibility

**User Story:** As a user, I want to control who can view my Book and chapters, so that I can share selectively.

#### Acceptance Criteria

1. WHEN a user sets their Book to private, THE System SHALL restrict viewing to approved followers only
2. WHEN a user sets their Book to public, THE System SHALL allow any authenticated user to view their chapters
3. THE System SHALL support per-chapter visibility settings independent of Book-level settings
4. WHEN a user changes privacy settings, THE System SHALL apply changes immediately to all access requests

### Requirement 16: Media Storage and Handling

**User Story:** As a user, I want to upload and store media content securely, so that my chapters can include rich multimedia elements.

#### Acceptance Criteria

1. WHEN a user uploads media for a published chapter, THE System SHALL store it in S3-compatible storage with public access
2. WHEN a user uploads media for a draft, THE System SHALL store it with private or signed URL access
3. THE System SHALL support image formats: JPEG, PNG, GIF, WebP
4. THE System SHALL support audio formats: MP3, AAC, WAV
5. THE System SHALL support video formats: MP4, WebM
6. WHEN media upload fails, THE System SHALL provide clear error messages and allow retry

### Requirement 17: Background Job Processing

**User Story:** As a system administrator, I want long-running tasks processed asynchronously, so that the API remains responsive.

#### Acceptance Criteria

1. WHEN a user requests AI cover generation, THE System SHALL queue the task for background processing
2. WHEN a user requests heavy text remixing, THE System SHALL queue the task for background processing
3. WHEN a chapter is published, THE System SHALL queue embedding generation for background processing
4. THE System SHALL use Redis and RQ for job queue management
5. WHEN a background job fails, THE System SHALL retry according to configured retry policies

### Requirement 18: Rate Limiting and Abuse Prevention

**User Story:** As a system administrator, I want rate limits on sensitive actions, so that abuse and spam are prevented.

#### Acceptance Criteria

1. WHEN a user creates Margins, THE System SHALL enforce rate limits to prevent spam
2. WHEN a user sends Between_The_Lines invites, THE System SHALL enforce rate limits to prevent harassment
3. WHEN a user makes AI requests to Muse, THE System SHALL enforce rate limits to prevent API abuse
4. THE System SHALL use Redis for rate limit tracking and enforcement
5. WHEN rate limits are exceeded, THE System SHALL return clear error messages with retry timing

### Requirement 19: Mobile Application Experience

**User Story:** As a mobile user, I want a native app experience with page-turn navigation and offline draft support, so that I can read and create on the go.

#### Acceptance Criteria

1. THE Mobile_App SHALL implement page-turn gestures for chapter navigation
2. THE Mobile_App SHALL display the Library as a bookshelf with visual Spines
3. THE Mobile_App SHALL cache recently viewed chapters for offline reading
4. THE Mobile_App SHALL support creating and editing drafts with local storage before sync
5. THE Mobile_App SHALL use React Native and Expo for cross-platform development
6. THE Mobile_App SHALL support push notifications for new chapters from followed Books

### Requirement 20: Web Application Experience

**User Story:** As a web user, I want to access Chapters through a browser for reading and limited interaction, so that I can engage without installing an app.

#### Acceptance Criteria

1. THE Web_App SHALL display a marketing site with product information and manifesto
2. THE Web_App SHALL support user authentication and account creation
3. THE Web_App SHALL provide a read-only or limited reading experience for chapters
4. THE Web_App SHALL use Next.js, Tailwind CSS, and shadcn/ui for implementation
5. THE Web_App SHALL use Framer Motion for subtle transitions and animations
6. THE Web_App SHALL NOT require feature parity with the mobile application in MVP

### Requirement 21: API Architecture and Performance

**User Story:** As a developer, I want a well-structured API with clear endpoints and good performance, so that clients can interact efficiently with the platform.

#### Acceptance Criteria

1. THE API SHALL use FastAPI framework with Python
2. THE API SHALL expose JSON REST endpoints for all core features
3. THE API SHALL use SQLAlchemy ORM with Alembic for database migrations
4. THE API SHALL implement request logging and structured error responses
5. THE API SHALL use Redis for caching frequently accessed data
6. WHEN API endpoints are called, THE System SHALL return responses within 200ms for cached data
7. THE API SHALL implement proper HTTP status codes and error handling

### Requirement 22: Data Persistence and Integrity

**User Story:** As a system administrator, I want reliable data storage with proper relationships and constraints, so that user data is protected and consistent.

#### Acceptance Criteria

1. THE System SHALL use PostgreSQL as the primary database
2. THE System SHALL use pgvector extension for embedding storage and similarity search
3. THE System SHALL enforce foreign key constraints between related entities
4. THE System SHALL implement database transactions for multi-step operations
5. WHEN data conflicts occur, THE System SHALL handle them gracefully with appropriate error messages
6. THE System SHALL perform regular automated backups of all user data

### Requirement 23: Security and Privacy

**User Story:** As a user, I want my data protected and my privacy respected, so that I can trust the platform with my creative work.

#### Acceptance Criteria

1. THE System SHALL use TLS encryption for all data transmission
2. THE System SHALL use token-based authentication without plain session IDs in URLs
3. THE System SHALL enforce access controls on private Books and Between_The_Lines rooms
4. THE System SHALL implement data minimization principles, storing only necessary information
5. THE System SHALL NOT implement location-based features in MVP
6. WHEN a user deletes content, THE System SHALL remove it permanently from active storage

### Requirement 24: Deployment and Infrastructure

**User Story:** As a system administrator, I want reliable hosting and deployment infrastructure, so that the platform remains available and performant.

#### Acceptance Criteria

1. THE Backend SHALL be deployed on Render with managed PostgreSQL and Redis instances
2. THE Web_App SHALL be deployed on Netlify
3. THE Mobile_App SHALL use Expo EAS for build and deployment
4. THE System SHALL use Cloudflare R2 or AWS S3 for media storage
5. THE System SHALL implement crash reporting using Sentry or similar service
6. THE System SHALL collect basic metrics: request counts, latency, and error rates
