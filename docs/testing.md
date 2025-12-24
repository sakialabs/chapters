# Testing Guide

## Prerequisites

### 1. Database Setup
Ensure PostgreSQL is running with the chapters database:

```bash
# Using Docker (recommended)
docker-compose up -d postgres

# Or install PostgreSQL locally and create database
createdb chapters
```

### 2. Redis Setup
Ensure Redis is running:

```bash
# Using Docker (recommended)
docker-compose up -d redis

# Or install Redis locally
redis-server
```

### 3. Environment Variables
The `.env` file is already configured. Update these values if needed:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `SECRET_KEY`: JWT secret (current dev key is fine for testing)
- `OPENAI_API_KEY`: Optional for AI features (tests will skip if not set)
- `S3_*`: Optional for media upload (tests will skip if not set)

## Running Tests

### Run All Tests
```bash
# From project root
python backend/tests/test_all_features.py
```

### Run Individual Test Suites
```bash
# Authentication tests
python backend/tests/test_auth.py

# Model tests
python backend/tests/test_models.py

# Chapter tests
python backend/tests/test_chapters.py

# Study system tests
python backend/tests/test_study.py

# Engagement tests
python backend/tests/test_engagement.py

# Library tests
python backend/tests/test_library.py

# Between the Lines tests
python backend/tests/test_btl.py

# Moderation tests
python backend/tests/test_moderation.py
```

## Test Coverage

### Core Features (No External Dependencies)
✅ Authentication (8 tests)
✅ Database Models (5 tests)
✅ Chapters (9 tests)
✅ Study System (12 tests)
✅ Engagement (10 tests)
✅ Library (4 tests)
✅ Between the Lines (8 tests)
✅ Moderation (6 tests)

**Total: 62 tests** that work with just PostgreSQL and Redis.

### AI Features (Require OpenAI API Key)
⚠️ Muse prompts, titles, rewriting
⚠️ Embeddings generation
⚠️ Quiet Picks

**Note**: These features will be skipped in tests if `OPENAI_API_KEY` is not set.

### Media Features (Require S3/R2 Setup)
⚠️ Media upload
⚠️ Presigned URL generation

**Note**: These features will be skipped in tests if S3 credentials are not set.

## Database Migrations

### Run Migrations
```bash
cd backend
alembic upgrade head
```

### Check Migration Status
```bash
alembic current
alembic history
```

### Create New Migration (if needed)
```bash
alembic revision --autogenerate -m "description"
```

## Common Issues

### Issue: Database connection error
**Solution**: Ensure PostgreSQL is running and DATABASE_URL is correct
```bash
docker-compose up -d postgres
# or
pg_isready
```

### Issue: Redis connection error
**Solution**: Ensure Redis is running
```bash
docker-compose up -d redis
# or
redis-cli ping
```

### Issue: Import errors
**Solution**: Ensure you're in the backend directory or Python path is set
```bash
cd backend
python tests/test_auth.py
```

### Issue: Migration errors
**Solution**: Reset database and run migrations
```bash
# Drop and recreate database
dropdb chapters
createdb chapters

# Run migrations
cd backend
alembic upgrade head
```

## Running with Docker

### Start All Services
```bash
docker-compose --profile full up
```

### Run Tests in Docker
```bash
docker-compose exec backend python tests/test_all_features.py
```

### View Logs
```bash
docker-compose logs -f backend
```

## Continuous Integration

For CI/CD pipelines, use this test command:
```bash
# Set up test database
export DATABASE_URL=postgresql://test:test@localhost:5432/chapters_test
export REDIS_URL=redis://localhost:6379/1

# Run migrations
cd backend
alembic upgrade head

# Run tests
python tests/test_all_features.py
```

## Next Steps After Testing

1. ✅ Verify all core tests pass
2. ✅ Set up OpenAI API key for AI features
3. ✅ Set up S3/R2 for media uploads
4. ✅ Deploy to staging environment
5. ✅ Run integration tests
6. ✅ Begin mobile app development

---

## Mobile App Testing

### Prerequisites
- Backend API running (local or deployed)
- Expo CLI installed: `npm install -g expo-cli`
- Mobile dependencies installed: `cd mobile && npm install`
- Environment configured: `mobile/.env` with `API_URL`

### Quick Start
```bash
cd mobile
npm start
# Press 'i' for iOS simulator or 'a' for Android emulator
```

### TypeScript Verification
```bash
cd mobile
npm run type-check
```

### Critical Test Paths

**1. Authentication Flow**
- Register → Login → Logout
- Token persistence across restarts

**2. Reading Flow**
- Library → Bookshelf → Chapter → Margins → Engagement

**3. Writing Flow**
- Study → Draft → Compose → Publish (with Open Pages)

**4. Social Flow**
- Follow → BTL Invite → Conversation → Close

**5. Profile Flow**
- View Profile → Edit → Settings → Blocked Users → Logout

### Feature Checklist

**Core Features** (18+ screens)
- ✅ Authentication (login, register)
- ✅ Library (bookshelf, feed, Quiet Picks)
- ✅ Chapter Reader (5 block types, margins, engagement)
- ✅ Study (drafts, notes, promotion)
- ✅ Composer (Muse AI integration)
- ✅ Between the Lines (invites, threads, chat)
- ✅ Profile (stats, chapters, edit)
- ✅ Settings (privacy, blocked users, logout)

**Design System**
- ✅ Colors match visuals.md (Ink Black, Paper White, Warm Gray, etc.)
- ✅ Typography consistent (xs to xxl scale)
- ✅ Spacing consistent (xs to xxl tokens)
- ✅ No hardcoded colors or spacing values

**Technical**
- ✅ TypeScript: Zero errors
- ✅ React Query: Proper invalidation
- ✅ Reanimated 3: Smooth animations
- ✅ Error handling: Graceful degradation

### Known Limitations
- Muse features require backend with OpenAI API key
- Media uploads require backend with S3/R2 configured
- Real-time features (BTL messages) use polling, not WebSockets

### Troubleshooting

**Issue: "Network request failed"**
- Check `mobile/.env` has correct `API_URL`
- Ensure backend is running and accessible
- For iOS simulator: use `http://localhost:8000`
- For Android emulator: use `http://10.0.2.2:8000`

**Issue: TypeScript errors**
- Run `npm run type-check` to see all errors
- Ensure all dependencies installed: `npm install`

**Issue: App crashes on start**
- Clear Metro cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

---

## Production Deployment

### Backend (Render)
See `docs/deployment.md` for detailed instructions.

### Mobile (Expo EAS)
```bash
cd mobile
eas build --platform ios
eas build --platform android
```

### Web (Netlify)
```bash
cd frontend
npm run build
# Deploy via Netlify dashboard
```
