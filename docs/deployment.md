# Deployment Guide

## Overview

This guide covers deploying the Chapters MVP backend to production.

## Prerequisites

- Docker and Docker Compose
- PostgreSQL 15+ with pgvector extension
- Redis 7+
- OpenAI API key
- S3-compatible storage (AWS S3 or Cloudflare R2)
- Domain name (optional but recommended)

## Environment Setup

### 1. Production Environment Variables

Create a `.env.production` file:

```bash
# Database (use managed PostgreSQL service)
DATABASE_URL=postgresql://user:password@host:5432/chapters

# Redis (use managed Redis service)
REDIS_URL=redis://host:6379/0

# JWT (generate secure key)
SECRET_KEY=<generate-with-openssl-rand-hex-32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# OpenAI
OPENAI_API_KEY=sk-your-production-key

# S3 Storage (Cloudflare R2 recommended)
S3_BUCKET=chapters-production
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_ENDPOINT_URL=https://account-id.r2.cloudflarestorage.com
S3_REGION=auto

# Sentry (recommended for production)
SENTRY_DSN=https://your-sentry-dsn

# App
DEBUG=false
```

### 2. Generate Secure Keys

```bash
# Generate SECRET_KEY
openssl rand -hex 32

# Generate S3 credentials (from your provider)
# AWS: IAM Console
# Cloudflare R2: Dashboard > R2 > Manage R2 API Tokens
```

## Deployment Options

### Option 1: Docker Compose (Simple)

Best for: Small-scale deployments, staging environments

```bash
# 1. Clone repository
git clone <your-repo>
cd chapters

# 2. Set up environment
cp .env.production backend/.env

# 3. Start services
docker-compose --profile full up -d

# 4. Run migrations
docker-compose exec backend alembic upgrade head

# 5. Check logs
docker-compose logs -f backend
```

**Pros**: Simple, all-in-one
**Cons**: Single server, limited scaling

### Option 2: Managed Services (Recommended)

Best for: Production deployments, scalability

#### Backend Hosting Options:
- **Railway**: Easy deployment, auto-scaling
- **Render**: Free tier available, good for MVP
- **Fly.io**: Global edge deployment
- **AWS ECS/Fargate**: Enterprise-grade
- **Google Cloud Run**: Serverless containers

#### Database Options:
- **Supabase**: PostgreSQL with pgvector support
- **Neon**: Serverless PostgreSQL
- **AWS RDS**: Managed PostgreSQL
- **DigitalOcean Managed Database**

#### Redis Options:
- **Upstash**: Serverless Redis
- **Redis Cloud**: Managed Redis
- **AWS ElastiCache**: Enterprise Redis

#### Storage Options:
- **Cloudflare R2**: S3-compatible, no egress fees (recommended)
- **AWS S3**: Industry standard
- **DigitalOcean Spaces**: Simple S3-compatible

### Option 3: Kubernetes (Advanced)

Best for: Large-scale, multi-region deployments

See `k8s/` directory for Kubernetes manifests (to be created).

## Step-by-Step: Railway Deployment

Railway is recommended for quick MVP deployment.

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### 2. Create New Project
```bash
railway init
```

### 3. Add Services

```bash
# Add PostgreSQL
railway add --database postgres

# Add Redis
railway add --database redis

# Deploy backend
railway up
```

### 4. Set Environment Variables

In Railway dashboard:
- Go to your backend service
- Add all environment variables from `.env.production`
- Railway will auto-populate DATABASE_URL and REDIS_URL

### 5. Run Migrations

```bash
railway run alembic upgrade head
```

### 6. Deploy

```bash
git push railway main
```

## Step-by-Step: Render Deployment

### 1. Create New Web Service

- Go to Render dashboard
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select `backend` as root directory

### 2. Configure Service

```yaml
Name: chapters-api
Environment: Docker
Docker Command: (leave default)
```

### 3. Add PostgreSQL

- Click "New +" → "PostgreSQL"
- Copy connection string

### 4. Add Redis

- Click "New +" → "Redis"
- Copy connection string

### 5. Set Environment Variables

Add all variables from `.env.production`

### 6. Deploy

Render will auto-deploy on git push.

## Database Setup

### 1. Enable pgvector Extension

```sql
-- Connect to your database
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Run Migrations

```bash
# Local
cd backend
alembic upgrade head

# Docker
docker-compose exec backend alembic upgrade head

# Railway
railway run alembic upgrade head

# Render (via shell)
alembic upgrade head
```

### 3. Verify Tables

```sql
-- Check tables
\dt

-- Should see 21 tables:
-- users, books, chapters, chapter_blocks, drafts, draft_blocks,
-- notes, footnotes, hearts, follows, bookmarks, margins,
-- between_the_lines_threads, between_the_lines_invites,
-- between_the_lines_messages, between_the_lines_pins,
-- blocks, reports, chapter_embeddings, user_taste_profiles
```

## Health Checks

### API Health Check
```bash
curl https://your-domain.com/health
# Expected: {"status": "healthy"}
```

### Database Check
```bash
curl https://your-domain.com/
# Expected: Welcome message
```

## Monitoring

### 1. Sentry Setup

```bash
# Already integrated, just add SENTRY_DSN to environment
SENTRY_DSN=https://your-sentry-dsn
```

### 2. Logging

Logs are automatically structured and sent to stdout.

View logs:
```bash
# Docker
docker-compose logs -f backend

# Railway
railway logs

# Render
View in dashboard
```

### 3. Metrics to Monitor

- API response times
- Error rates
- Database connection pool
- Redis connection status
- OpenAI API usage
- S3 upload success rate

## Security Checklist

- [ ] Change SECRET_KEY from default
- [ ] Set DEBUG=false in production
- [ ] Use HTTPS (SSL/TLS)
- [ ] Enable CORS only for your domains
- [ ] Use managed database with backups
- [ ] Enable database SSL connections
- [ ] Rotate API keys regularly
- [ ] Set up rate limiting (already implemented)
- [ ] Enable Sentry for error tracking
- [ ] Use environment variables (never commit secrets)

## Backup Strategy

### Database Backups

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

**Recommended**: Use managed database with automatic backups
- Railway: Automatic daily backups
- Render: Automatic backups on paid plans
- AWS RDS: Automated backups with point-in-time recovery

### Media Backups

S3/R2 data is already redundant. Consider:
- Enable versioning
- Set up lifecycle policies
- Cross-region replication (for critical data)

## Scaling Considerations

### Horizontal Scaling

The backend is stateless and can scale horizontally:

```bash
# Docker Compose
docker-compose up --scale backend=3

# Kubernetes
kubectl scale deployment backend --replicas=3
```

### Database Scaling

- Use connection pooling (already configured)
- Add read replicas for read-heavy workloads
- Consider pgBouncer for connection management

### Redis Scaling

- Use Redis Cluster for high availability
- Consider Redis Sentinel for automatic failover

### CDN for Media

- Use Cloudflare CDN in front of R2
- Or AWS CloudFront in front of S3

## Troubleshooting

### Issue: Migration fails
```bash
# Check current version
alembic current

# Rollback one version
alembic downgrade -1

# Try again
alembic upgrade head
```

### Issue: OpenAI rate limits
- Upgrade OpenAI plan
- Implement request queuing
- Add user-facing rate limit messages

### Issue: High database load
- Add database indexes (already optimized)
- Enable query caching
- Add read replicas

### Issue: Memory issues
- Increase container memory limits
- Optimize database queries
- Add pagination to large result sets

## Post-Deployment

1. ✅ Verify all endpoints work
2. ✅ Test authentication flow
3. ✅ Create test user and chapter
4. ✅ Test AI features (Muse)
5. ✅ Test media upload
6. ✅ Monitor error rates in Sentry
7. ✅ Set up alerts for critical errors
8. ✅ Document API for mobile team
9. ✅ Begin mobile app development

## API Documentation

Once deployed, API docs are available at:
- Swagger UI: `https://your-domain.com/docs`
- ReDoc: `https://your-domain.com/redoc`

## Frontend Deployment (Netlify)

### Quick Deploy

1. **Connect Repository**
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select repository

2. **Configure Build**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/.next
   ```

3. **Environment Variables**
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   ```

4. **Deploy**
   - Netlify auto-deploys on git push to main
   - Custom domain: Site settings → Domain management

### netlify.toml

Already configured in project root:
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = ".next"
```

## Mobile Deployment (Expo EAS)

### Prerequisites

```bash
npm install -g eas-cli
eas login
```

### 1. Configure Project

```bash
cd mobile
eas build:configure
```

### 2. Set Environment Variables

Create `eas.json`:
```json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://your-backend-api.com"
      }
    }
  }
}
```

### 3. Build

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

### 4. Submit to Stores

```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

### 5. Over-the-Air Updates

```bash
# Push updates without app store review
eas update --branch production
```

## Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Check service status pages
4. Contact platform support

