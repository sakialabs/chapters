# Chapters Web App

> Next.js 14 web application for Chapters.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + Zustand
- **Animations**: Framer Motion
- **HTTP Client**: Fetch API with cookies

## Design System

The web app follows the Chapters design system from `docs/visuals.md`:

### Colors
- **Ink Black** (#1C1C1C) - Primary text
- **Paper White** (#FAF8F4) - Background
- **Warm Gray** (#CFCAC2) - Borders, dividers
- **Dusty Charcoal** (#4A4A4A) - Secondary text
- **Ink Blue** (#2F3A4A) - Primary actions
- **Soft Sage** (#A8B8A0) - Success states
- **Muted Clay** (#C08A6A) - Muse, BTL, Open Pages

### Typography
- **Serif**: Georgia, Iowan Old Style (for reading content)
- **Sans**: System fonts (for UI)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (see `../backend/README.md`)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your backend URL
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Type Checking

```bash
# Run TypeScript compiler
npm run type-check
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css        # Global styles
│   │   ├── auth/              # Auth pages
│   │   ├── library/           # Library pages
│   │   └── ...
│   │
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── providers.tsx     # React Query provider
│   │   └── ...
│   │
│   ├── lib/                   # Utilities
│   │   ├── api-client.ts     # API client
│   │   └── utils.ts          # Helper functions
│   │
│   └── services/              # API services
│       ├── auth.ts
│       ├── library.ts
│       └── ...
│
├── public/                    # Static assets
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.js            # Next.js configuration
```

## API Client

The API client (`src/lib/api-client.ts`) provides:

- Cookie-based authentication
- Automatic token injection
- Error handling
- TypeScript support

### Usage

```typescript
import { apiClient } from '@/lib/api-client'

// GET request
const data = await apiClient.get('/endpoint')

// POST request
const result = await apiClient.post('/endpoint', { data })

// With query params
const items = await apiClient.get('/items', {
  params: { page: 1, limit: 10 }
})
```

### Authentication

```typescript
import { auth } from '@/lib/api-client'

// Set token (after login)
auth.setToken(token)

// Check if authenticated
if (auth.isAuthenticated()) {
  // User is logged in
}

// Remove token (logout)
auth.removeToken()
```

## Styling

### Tailwind Classes

The design system is integrated into Tailwind:

```tsx
// Colors
<div className="bg-paperWhite text-inkBlack border-warmGray">

// Typography
<h1 className="font-serif text-2xl">
<p className="font-sans text-base text-dustyCharcoal">

// Spacing
<div className="p-lg m-md">

// Custom utilities
<div className="paper-texture focus-calm">
```

### Custom Components

Base UI components follow shadcn/ui patterns:

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="accent">Accent</Button>
```

## Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional
NEXT_PUBLIC_ENV=development
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build
docker build -t chapters-web .

# Run
docker run -p 3000:3000 chapters-web
```

## Contributing

Follow the Chapters design principles:

1. **Finite by Design**: No infinite scrolling
2. **Intentional**: Thoughtful interactions
3. **Calm**: Low-stimulation, warm aesthetics
4. **Privacy First**: Respect user data
5. **AI as Companion**: Assist, don't override

## License

See LICENSE file in project root.
