import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Chapters Design System (from docs/visuals.md)
        inkBlack: '#1C1C1C',
        paperWhite: '#FAF8F4',
        warmGray: '#CFCAC2',
        dustyCharcoal: '#4A4A4A',
        inkBlue: '#2F3A4A',
        softSage: '#A8B8A0',
        mutedClay: '#C08A6A',
        
        // Dark mode
        nightBlack: '#0F0F0E',
        inkPaper: '#1E1E1C',
        softAsh: '#2A2A27',
        primaryText: '#E8E6E1',
        secondaryText: '#B8B6B0',
        
        // Semantic mappings using CSS variables
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Iowan Old Style', 'serif'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.25rem',     // 20px
        xl: '1.5rem',      // 24px
        '2xl': '2rem',     // 32px
        '3xl': '3rem',     // 48px
      },
      spacing: {
        xs: '0.25rem',     // 4px
        sm: '0.5rem',      // 8px
        md: '1rem',        // 16px
        lg: '1.5rem',      // 24px
        xl: '2rem',        // 32px
        '2xl': '3rem',     // 48px
      },
      borderRadius: {
        sm: '0.5rem',      // 8px
        md: '0.75rem',     // 12px
        lg: '1rem',        // 16px
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(28, 28, 28, 0.05)',
        DEFAULT: '0 2px 4px 0 rgba(28, 28, 28, 0.08)',
        md: '0 4px 8px 0 rgba(28, 28, 28, 0.12)',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

export default config
