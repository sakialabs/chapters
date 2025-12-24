# Chapter Reader Components

Beautiful, immersive reading experience for Chapters mobile app.

## Components

### ChapterBlock
Renders different types of chapter content blocks:
- **Text**: Serif typography with optimal line height for reading
- **Quote**: Styled with left border and italic text
- **Image**: Full-width with optional caption
- **Audio**: Interactive media player preview
- **Video**: Interactive media player preview

Long-press on blocks to add margins (comments).

### MarginsDrawer
Bottom drawer that displays chapter margins (comments):
- Swipe-to-dismiss gesture using Reanimated 3
- Smooth spring animations
- User avatars and timestamps
- Empty state for chapters without margins

## Features

### Reading Experience
- Clean, distraction-free layout
- Serif fonts for body text
- Optimal line spacing and margins
- Paper-like background color
- Subtle shadows and depth

### Engagement
- Heart chapters (with optimistic updates)
- Bookmark chapters
- View and create margins
- Real-time engagement counts

### Gestures
- Swipe down to close margins drawer
- Long-press blocks to add comments
- Smooth, native-feeling animations

## API Integration

Uses React Query for:
- Chapter data fetching
- Margins loading
- Optimistic updates for hearts/bookmarks
- Automatic cache invalidation

## Accessibility

- Proper ARIA labels
- Screen reader support
- Keyboard navigation
- High contrast text
- Touch target sizes (44x44pt minimum)

## Performance

- Lazy loading of images
- Optimized re-renders with React.memo
- Efficient gesture handling
- Smooth 60fps animations
