/**
 * Chapters Design System - Colors
 * 
 * Warm, human, poetic, low-stimulation
 * Feels like paper, ink, dusk, and lamplight
 * 
 * Source: docs/visuals.md
 */

export const colors = {
  // Primary colors
  inkBlack: '#1C1C1C',
  paperWhite: '#FAF8F4',
  
  // Secondary neutrals
  warmGray: '#CFCAC2',
  dustyCharcoal: '#4A4A4A',
  
  // Accent colors (use sparingly)
  inkBlue: '#2F3A4A',
  softSage: '#A8B8A0',
  
  // Emotional highlight (rare)
  mutedClay: '#C08A6A',
  
  // Dark mode
  nightPaper: '#121212',
  softInk: '#E6E4DF',
  ashGray: '#2A2A2A',
  
  // Semantic mappings for easier use
  background: '#FAF8F4', // paperWhite
  surface: '#FFFFFF',
  
  text: {
    primary: '#1C1C1C', // inkBlack
    secondary: '#4A4A4A', // dustyCharcoal
    tertiary: '#CFCAC2', // warmGray
    inverse: '#FAF8F4', // paperWhite
  },
  
  border: '#CFCAC2', // warmGray
  divider: '#CFCAC2',
  
  // Interactive elements
  link: '#2F3A4A', // inkBlue
  linkHover: '#1C1C1C', // inkBlack
  
  // Accent usage
  accent: {
    primary: '#2F3A4A', // inkBlue - links, actions
    success: '#A8B8A0', // softSage - saved, bookmarked
    special: '#C08A6A', // mutedClay - Open Pages, Muse, BTL
  },
  
  // Semantic colors
  success: '#A8B8A0', // softSage
  error: '#C08A6A', // mutedClay (muted, not aggressive)
  warning: '#C08A6A',
  info: '#2F3A4A', // inkBlue
  
  // Component-specific
  heart: '#A8B8A0', // softSage (not red!)
  bookmark: '#2F3A4A', // inkBlue
  openPage: '#C08A6A', // mutedClay
  muse: '#C08A6A', // mutedClay
  btl: '#C08A6A', // mutedClay
  
  // Overlay and shadows
  overlay: 'rgba(28, 28, 28, 0.5)', // inkBlack with opacity
  shadow: 'rgba(28, 28, 28, 0.1)',
} as const;

export type Colors = typeof colors;
