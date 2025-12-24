# Development Scripts

Helper scripts for Chapters development.

## Start Development Environment

Interactive script to start backend services.

**Windows:**
```bash
scripts\start-dev.bat
```

**Mac/Linux:**
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

**Options:**
1. **Full Docker** - Run everything in Docker (easiest)
2. **Local Backend** - Database in Docker, backend runs locally (for development)
3. **Stop Services** - Stop all Docker containers

## Seed Database

Seeds the database with demo data for testing.

**Windows:**
```bash
scripts\seed-docker.bat
```

**Mac/Linux:**
```bash
chmod +x scripts/seed-docker.sh
./scripts/seed-docker.sh
```

**What it creates:**
- 5 demo users (password: `password123`)
- 17 chapters with literary content
- Drafts, notes, follows, hearts, bookmarks, and margins

**Demo accounts:**
- maya_writes
- alex_creates
- sam_reflects
- jordan_dreams
- riley_wanders

## Quick Start

1. **Start backend:**
   ```bash
   scripts\start-dev.bat  # Windows
   ./scripts/start-dev.sh  # Mac/Linux
   ```
   Choose option 1 (Full Docker)

2. **Seed database:**
   ```bash
   scripts\seed-docker.bat  # Windows
   ./scripts/seed-docker.sh  # Mac/Linux
   ```

3. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Start mobile:**
   ```bash
   cd mobile
   npm start
   ```

## Ports

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Troubleshooting

**Stop all services:**
```bash
docker-compose down
```

**Reset database:**
```bash
docker-compose down -v
docker-compose --profile full up
```

For detailed setup, see [docs/setup.md](../docs/setup.md)
