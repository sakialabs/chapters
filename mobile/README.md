# Chapters Mobile App

> React native app for Chapters.

## Features

- **Authentication** with **JWT** tokens
- **Server State Management** with **React Query**
- **Client State Management** with **Zustand**
- **API Calls** with **Axios**
- **Token Storage** with **Expo Secure Store**
- **Animations** with **React Native Reanimated**

## Tech Stack

- **React Native** with **Expo** (~52.0.0)
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **React Query** (@tanstack/react-query) for server state
- **Zustand** for client state management
- **Axios** for API calls
- **Expo Secure Store** for token storage
- **React Native Reanimated** for animations

## Project Structure

```
mobile/
├── app/                   # Expo Router pages
│   ├── (auth)/            # Authentication flow
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/            # Main app tabs
│   │   ├── library.tsx
│   │   ├── study.tsx
│   │   ├── btl.tsx
│   │   └── profile.tsx
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Entry point
├── src/
│   ├── config/            # Configuration
│   ├── services/          # API services
│   │   └── api/
│   │       ├── client.ts  # Axios client with auth
│   │       ├── types.ts   # TypeScript types
│   │       └── auth.ts    # Auth endpoints
│   └── store/             # Zustand stores
│       └── authStore.ts
├── assets/                # Images, fonts, etc.
├── .env                   # Environment variables
└── package.json
```

## Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment

Update `.env` with your backend URL:

```env
API_URL=http://localhost:8000
```

For iOS Simulator, use `http://localhost:8000`
For Android Emulator, use `http://10.0.2.2:8000`
For physical device, use your computer's IP address

### 3. Start Development Server

```bash
npm start
```

This will open Expo Dev Tools. You can then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## Features Implemented

### ✅ Task 25.1: Project Setup
- Expo project with TypeScript
- React Query, Zustand, Reanimated 3
- Expo Router navigation
- Environment configuration

### ✅ Task 25.2: API Client
- Axios client with base URL
- Token storage using Expo Secure Store
- Request interceptor for auth token
- Response interceptor for token refresh
- Automatic retry on 401

### ✅ Task 25.3: State Management
- React Query for server state
- Zustand for auth state
- Token management utilities

### ✅ Task 26: Authentication Screens
- Login screen with form validation
- Register screen with password confirmation
- Onboarding placeholder (Muse taste profile)
- Auto-redirect based on auth status

## Current Status

**Completed:**
- ✅ Project setup and configuration
- ✅ API client with auth handling
- ✅ State management (React Query + Zustand)
- ✅ Authentication flow (login, register)
- ✅ Main app navigation (tabs)
- ✅ Design system (colors, typography, spacing from vision.md)
- ✅ Library API integration
- ✅ Bookshelf UI with animations
- ✅ TypeScript configuration fixed

**In Progress:**
- � Task 27: CLibrary screen (bookshelf ✅, feed and picks next)

**Next Steps:**
- 📝 Task 27.2: New Chapters feed with bounded pagination
- 📝 Task 27.3: Quiet Picks section (max 5 recommendations)
- 📝 Task 28: Chapter Reader with page-turn
- 📝 Task 29: Study (Drafts, Notes)
- 📝 Task 30: Composer and Muse integration
- 📝 Task 31: Between the Lines
- 📝 Task 32: Profile and Settings

## Design System

### Colors
- **Background**: `#F5F1E8` (warm paper)
- **Primary Text**: `#2C2416` (dark brown)
- **Secondary Text**: `#5C4A3A` (medium brown)
- **Tertiary Text**: `#8B7355` (light brown)
- **Border**: `#D4C4B0` (tan)
- **White**: `#FFFFFF`

### Typography
- **Titles**: 32-48px, light weight (300)
- **Body**: 16px, regular weight
- **Small**: 14px

### Spacing
- **Padding**: 16, 24, 32px
- **Border Radius**: 12px

## Testing

```bash
npm test
```

## Building

### Development Build
```bash
npx expo install expo-dev-client
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Build
```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

## Notes

- Uses Expo Router for file-based navigation
- Auth tokens stored securely with Expo Secure Store
- Automatic token refresh on 401 responses
- Calm, paper-like design aesthetic
- No infinite scroll - bounded pagination
- Focus on depth over dopamine
