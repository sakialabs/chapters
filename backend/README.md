# Chapters Backend API

> FastAPI backend for Chapters.

## Features

### Technical Implementation

**Core Platform:**
- JWT authentication with bcrypt hashing
- One Book per user (one-to-one relationship)
- Rich content blocks with validation (max 12 blocks, max 2 media)
- Open Pages system (3 initial, 1 per day, 1 per publish)

**Content & AI:**
- Block-based editor with JSONB storage
- 30-minute edit window after publishing
- GPT-4 integration for Muse (prompts, titles, rewrites)
- DALL-E 3 cover generation (background jobs)
- text-embedding-3-small (1536-dim vectors)

**Social & Discovery:**
- Paginated feeds (max 100 chapters)
- Taste-based recommendations (cosine similarity)
- Rate-limited engagement (margins 20/hr, BTL invites 3/day)
- Cross-follow bookmark support

**Privacy & Safety:**
- Public/private Book toggle with immediate effect
- User blocking with auto follow removal
- Content reporting system
- Follower-only access for private Books

**Infrastructure:**
- S3/R2 integration with presigned URLs
- Redis-based rate limiting (sliding window)
- Background job processing (RQ)
- Async embedding generation
- Global exception handlers
- Structured logging
- Sentry integration
- Health checks

**Data & Performance:**
- PostgreSQL 15+ with pgvector extension
- HNSW indexes for similarity search
- Weighted taste profile updates (read 0.3, heart 0.6, bookmark 1.0)
- Graceful degradation without OpenAI API key

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL 15+ with pgvector extension
- **ORM**: SQLAlchemy 2.0 + Alembic migrations
- **Cache**: Redis 7+
- **AI**: OpenAI API (GPT-4, text-embedding-3-small)
- **Storage**: S3-compatible (Cloudflare R2 / AWS S3)
- **Monitoring**: Sentry

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app + middleware
│   ├── config.py            # Settings management
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models (21 tables)
│   ├── auth/                # JWT authentication
│   ├── chapters/            # Chapter CRUD + validation
│   ├── study/               # Drafts, notes, footnotes
│   ├── engagement/          # Hearts, follows, bookmarks
│   ├── margins/             # Comments system
│   ├── library/             # Feed, bookshelf, quiet picks
│   ├── muse/                # AI writing assistant
│   ├── btl/                 # Between the Lines messaging
│   ├── moderation/          # Blocking, reporting
│   ├── privacy/             # Privacy controls
│   ├── media/               # S3 media uploads
│   ├── services/            # Shared business logic
│   ├── error_handlers.py    # Global error handling
│   ├── middleware.py        # Request logging, rate limits
│   └── logging_config.py    # Structured logging
├── alembic/                 # Database migrations
│   └── versions/            # Migration files
├── tests/                   # Test suite (70+ tests)
│   ├── test_auth.py
│   ├── test_chapters.py
│   ├── test_study.py
│   ├── test_engagement.py
│   ├── test_library.py
│   ├── test_btl.py
│   └── test_moderation.py
├── .env.example             # Environment template
├── alembic.ini              # Alembic configuration
├── docker-entrypoint.sh     # Docker startup script
├── Dockerfile               # Container definition
└── pyproject.toml           # Dependencies
```

## Quick Start

### 1. Install Dependencies
```bash
poetry install
```

### 2. Start Services
```bash
docker-compose up -d postgres redis
```

### 3. Configure Environment
Copy `.env.example` to `.env` and update:
```bash
DATABASE_URL=postgresql://chapters:chapters@localhost:5432/chapters
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=sk-your-key  # Optional for AI features
S3_BUCKET=your-bucket        # Optional for media uploads
S3_ACCESS_KEY=your-key
S3_SECRET_KEY=your-secret
```

### 4. Run Migrations
```bash
alembic upgrade head
```

### 5. Start Server
```bash
uvicorn app.main:app --reload
```

API available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health

## Database Schema

21 tables with proper relationships and constraints:

**Core**: users, books, chapters, chapter_blocks  
**Study**: drafts, draft_blocks, notes, footnotes  
**Engagement**: follows, hearts, bookmarks, margins  
**BTL**: between_the_lines_threads, between_the_lines_invites, between_the_lines_messages, between_the_lines_pins  
**Moderation**: blocks, reports  
**AI**: chapter_embeddings, user_taste_profiles

## Testing

Run all tests:
```bash
python -m pytest tests/ -v
```

Run specific test suite:
```bash
python -m pytest tests/test_auth.py -v
```

**Test Coverage**: 70+ tests across 9 suites, all passing

## Deployment

See `docs/DEPLOYMENT.md` for detailed instructions.

**Recommended Platforms**:
- **Railway** - Easiest, auto-scaling
- **Render** - Free tier available
- **Fly.io** - Global edge deployment

**Required Services**:
- PostgreSQL 15+ with pgvector
- Redis 7+

**Optional Services**:
- OpenAI API (for Muse features)
- S3/R2 (for media uploads)
- Sentry (for monitoring)

## API Documentation

Interactive API docs available at `/docs` when server is running.

**Key Endpoints**:
- `POST /auth/register` - Create account
- `POST /auth/login` - Get JWT tokens
- `POST /chapters` - Publish chapter
- `GET /library/spines` - Get bookshelf
- `GET /library/quiet-picks` - Get recommendations
- `POST /muse/prompts` - Get writing prompts
- `POST /between-the-lines/invites` - Send BTL invite

## License

See LICENSE file in project root.
