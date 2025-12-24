# 📖 Chapters

> **Everyone's a book. Each post is a chapter.**

A calm, expressive, AI-assisted social platform built for depth, not dopamine.

## 📑 Table of Contents

- [Current Status](#-current-status)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Tech Stack](#️-tech-stack)
- [Design Philosophy](#-design-philosophy)
- [Key Features](#-key-features)
- [Development](#-development)
- [Documentation](#-documentation)
- [Deployment](#-deployment)
- [What Makes Chapters Different](#-what-makes-chapters-different)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Quick Start

### Start Backend
```bash
# Windows
scripts\start-dev.bat

# Mac/Linux
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```
Choose option 1 (Full Docker) for the easiest setup.

### Seed Database (Optional)
```bash
# Windows
scripts\seed-docker.bat

# Mac/Linux
chmod +x scripts/seed-docker.sh
./scripts/seed-docker.sh
```

Creates 5 demo users (password: `password123`), chapters, and engagement data.

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Start Mobile (Optional)
```bash
cd mobile
npm install
npm start
```

**Access Points:**
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Web App: http://localhost:3000

For detailed setup, see [docs/setup.md](docs/setup.md)

## 🎯 Current Status

**Backend**: ✅ Complete (70+ tests passing)  
**Mobile App**: ✅ Complete (React Native + Expo)  
**Web App**: ✅ Complete (Next.js 14)  
**Deployment**: 🚧 Ready for production setup

All core features implemented and tested. Ready for deployment to Render (backend), Vercel (web), and Expo EAS (mobile).

---

## 📁 Project Structure

```
chapters/
├── backend/              # FastAPI backend (Python)
│   ├── app/              # Application code
│   │   ├── auth/         # Authentication
│   │   ├── books/        # User profiles
│   │   ├── chapters/     # Chapter posts
│   │   ├── study/        # Drafts & notes
│   │   ├── library/      # Feeds & discovery
│   │   ├── muse/         # AI companion
│   │   └── ...           # Other modules
│   ├── alembic/          # Database migrations
│   ├── tests/            # Test suite (70+ tests)
│   └── pyproject.toml    # Dependencies
│
├── frontend/             # Next.js web app (TypeScript)
│   ├── src/
│   │   ├── app/          # Pages (App Router)
│   │   ├── components/   # UI components
│   │   ├── hooks/        # React Query hooks
│   │   └── services/     # API clients
│   └── package.json
│
├── mobile/               # React Native app (TypeScript)
│   ├── app/              # Expo Router pages
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # React Query hooks
│   │   └── services/     # API clients
│   └── package.json
│
├── docs/                 # Documentation
│   ├── requirements.md   # Feature requirements
│   ├── design.md         # System architecture
│   ├── tasks.md          # Implementation plan
│   ├── visuals.md        # Design system
│   └── README.md         # Docs guide
│
└── docker-compose.yml    # Service orchestration
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15+ with pgvector
- **ORM**: SQLAlchemy + Alembic migrations
- **Cache & Queue**: Redis 7+
- **AI**: OpenAI API (GPT-4, DALL-E 3, embeddings)
- **Storage**: S3-compatible (Cloudflare R2 / AWS S3)
- **Testing**: pytest with property-based tests

### Mobile (Primary Client)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State**: React Query + Zustand
- **Animations**: Reanimated 3
- **Navigation**: Expo Router

### Web (Secondary Client)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Deployment**: Vercel-ready

## 🎨 Design Philosophy

Chapters is built with calm intentionality:

### Core Principles
- **Finite by Design** - No infinite scroll, all feeds are bounded
- **Intentional Publishing** - One Open Page per day (max 3 stored)
- **Privacy First** - Everything starts private in Study
- **AI as Companion** - Muse assists but never overrides
- **Calm Engagement** - No trending, no leaderboards, no streaks

### Visual Identity
- **Colors**: Warm, muted palette (Paper White, Ink Black, Soft Sage)
- **Typography**: Serif for reading, sans-serif for UI
- **Interactions**: Subtle, never demanding attention
- **Inspiration**: Books, libraries, lamplight, ink on paper

See [docs/visuals.md](docs/visuals.md) for complete design system.

## ✨ Key Features

### For Creatives

**Write with intention:**
- **Open Pages** - Daily publishing allowance (3 max, 1 per day)
- **Study** - Private workspace for drafts, notes, voice memos
- **Rich Blocks** - Text, images, audio, video, quotes (max 12 per chapter)
- **Edit Window** - 30 minutes to refine after publishing
- **Muse AI** - Writing prompts, title suggestions, tone shaping

**Share your work:**
- **Chapters** - Rich, multimedia posts with mood and theme
- **AI Covers** - DALL-E 3 generated chapter covers
- **Book Profile** - Your living anthology with Inside Flap (bio)
- **Privacy Controls** - Public or private Books

**Build your craft:**
- **Footnotes** - Private annotations on your own work
- **Draft Promotion** - Polish in private, publish when ready
- **No Pressure** - No streaks, no trending, no viral mechanics

### For Readers

**Discover with taste:**
- **Library** - Visual bookshelf of Books you follow
- **Quiet Picks** - 5 daily AI-curated recommendations (taste, not popularity)
- **Spines** - Discover Books through their work, not profiles
- **Page-Turn Reading** - Smooth, book-like experience on mobile

**Engage thoughtfully:**
- **Hearts** - Appreciate chapters that resonate (Soft Sage, not red)
- **Bookmarks** - Save chapters to return to
- **Shelf** - Curate Books you want to keep close
- **Margins** - Comments hidden by default, revealed on demand

### For Connection

**Connect through work:**
- **Between the Lines** - Intimate 1:1 conversations (requires mutual follows + 3 chapters)
- **Resonance** - AI-calculated compatibility between readers
- **Shelf** - Public curation of Books that matter to you
- **No Cold Outreach** - All connection requires established presence

## 🧪 Development

### Backend Testing
```bash
cd backend
poetry run pytest                    # Run all tests
poetry run pytest tests/properties/  # Property-based tests
poetry run pytest -v                 # Verbose output
```

### Database Migrations
```bash
cd backend
poetry run alembic revision --autogenerate -m "description"
poetry run alembic upgrade head
poetry run alembic downgrade -1
```

### Background Workers
```bash
cd backend
poetry run rq worker  # Start background job worker
```

### Frontend Development
```bash
# Web
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Lint check

# Mobile
cd mobile
npx expo start           # Start Expo dev server
npx expo start --ios     # iOS simulator
npx expo start --android # Android emulator
```

## 📖 Documentation

Comprehensive documentation in the `docs/` folder:

- **[vision.md](docs/vision.md)** - Product philosophy, manifesto, glossary, and copy guidelines
- **[requirements.md](docs/requirements.md)** - Complete feature requirements (200+ requirements)
- **[design.md](docs/design.md)** - System architecture and data models
- **[tasks.md](docs/tasks.md)** - Implementation plan (41 tasks, mostly complete)
- **[visuals.md](docs/visuals.md)** - Design system and color palette
- **[testing.md](docs/testing.md)** - Testing strategy and property tests
- **[deployment.md](docs/deployment.md)** - Deployment guide
- **[spines/](docs/spines/)** - People discovery feature
- **[add-to-shelf/](docs/add-to-shelf/)** - Shelf curation feature

### Feature Glossary

Quick reference for key terms (see [vision.md](docs/vision.md) for complete list):

**User Identity:**
- **Book** - Your profile (not "account")
- **Inside Flap** - Your bio (not "about")
- **Book Portrait** - Your profile picture
- **Bindings** - Account security (password)

**Content:**
- **Chapter** - A post (not "update")
- **Open Page** - Daily publishing allowance
- **Block** - Content element (text, image, audio, video, quote)
- **Study** - Private workspace for drafts and notes

**Discovery:**
- **Library** - Main view (not "feed")
- **Bookshelf** - Books you follow
- **Spines** - People discovery through work
- **Quiet Picks** - Daily AI recommendations
- **Shelf** - Curated collection of Books

**Engagement:**
- **Heart** - Appreciate a chapter (Soft Sage, not red)
- **Bookmark** - Save for later
- **Margins** - Comments (hidden by default)
- **Between the Lines** - Private 1:1 conversations

**AI:**
- **Muse** - Your creative companion (not "bot")
- **Taste Profile** - AI-learned preferences
- **Resonance** - Compatibility between readers

See [docs/README.md](docs/README.md) for a guide to all documentation.

## 🚀 Deployment

### Backend (Render)
```bash
# Set environment variables in Render dashboard
# Deploy from GitHub with auto-deploy enabled
# PostgreSQL and Redis managed services
```

### Web (Vercel)
```bash
cd frontend
vercel deploy --prod
```

### Mobile (Expo EAS)
```bash
cd mobile
eas build --platform all
eas submit --platform all
```

See [docs/deployment.md](docs/deployment.md) for detailed instructions.

## 🎯 What Makes Chapters Different

✅ **No infinite scrolling** - Bounded, page-based navigation  
✅ **No trending lists** - Calm discovery through taste profiles  
✅ **No streak pressure** - Create on your own schedule  
✅ **No red hearts** - Soft Sage for gentle engagement  
✅ **No viral mechanics** - Quality over virality  
✅ **No pure white/black** - Warm, paper-like colors  
✅ **No auto-publish AI** - Muse suggests, you decide  
✅ **No cold outreach** - Between the Lines requires mutual trust  

## 🤝 Contributing

This is a carefully crafted platform with a specific vision. Before contributing:

1. Read [docs/vision.md](docs/vision.md) to understand the philosophy
2. Review [docs/visuals.md](docs/visuals.md) for design guidelines
3. Check [docs/tasks.md](docs/tasks.md) for current status
4. Ensure all tests pass before submitting PRs

## 📄 License

See [LICENSE](LICENSE) file for details.

---

## 🌟 Philosophy in Practice

> **Chapters is slow by design. It rewards reflection, depth, and presence.**

**Welcome to Chapters. Take your time.**

---

**Built with**: FastAPI • React Native • Next.js • PostgreSQL • OpenAI  
**Designed for**: Depth • Reflection • Authentic Expression
