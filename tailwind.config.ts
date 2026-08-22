import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // UniLens Design Tokens - Swiss Modernism 2.0 + Academic
        // Institutional Navy + Research Accent + Academic Serif

        // Primary - Institutional Navy
        primary: {
          DEFAULT: '#1E3A5F',
          foreground: '#FFFFFF',
        },

        // Secondary - Research Blue
        secondary: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
        },

        // Accent/CTA - Research Gold/Amber
        accent: {
          DEFAULT: '#A16207',
          foreground: '#FFFFFF',
          muted: '#FEF3C7',
        },

        // Background - Clean Off-White
        background: '#F8FAFC',
        foreground: '#0F172A',

        // Card
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },

        // Muted
        muted: {
          DEFAULT: '#E9EEF5',
          foreground: '#475569',
        },

        // Border
        border: '#CBD5E1',

        // Ring
        ring: '#1E3A5F',

        // Destructive
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        // Display/Headline: EB Garamond (academic serif)
        display: ['var(--font-display)', 'EB Garamond', 'Georgia', 'serif'],
        // Body: Crimson Text (readable serif)
        body: ['var(--font-body)', 'Crimson Text', 'Georgia', 'serif'],
        // UI: Inter (clean sans for UI elements)
        ui: ['var(--font-ui)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Type scale - mobile first, clamp for fluid scaling
        'display-xl': ['clamp(3rem, 8vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['clamp(2rem, 4.5vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],
        'heading-lg': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],
        'heading-md': ['clamp(1.375rem, 2.5vw, 1.875rem)', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        'heading-sm': ['clamp(1.125rem, 2vw, 1.375rem)', { lineHeight: '1.35', letterSpacing: '0', fontWeight: '600' }],
        'body-lg': ['clamp(1.125rem, 1.5vw, 1.25rem)', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em', fontWeight: '500', textTransform: 'uppercase' }],
      },
      spacing: {
        // Spacing scale - mathematical ratios
        'space-0': '0',
        'space-1': '0.25rem',   // 4px
        'space-2': '0.5rem',    // 8px
        'space-3': '0.75rem',   // 12px
        'space-4': '1rem',      // 16px
        'space-5': '1.25rem',   // 20px
        'space-6': '1.5rem',    // 24px
        'space-8': '2rem',      // 32px
        'space-10': '2.5rem',   // 40px
        'space-12': '3rem',     // 48px
        'space-16': '4rem',     // 64px
        'space-20': '5rem',     // 80px
        'space-24': '6rem',     // 96px
        'space-32': '8rem',     // 128px
      },
      animation: {
        // Motion tokens - respectful of reduced motion
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-up-slow': 'slideUp 0.8s ease-out forwards',
        'stagger-1': 'slideUp 0.5s ease-out 0.1s forwards',
        'stagger-2': 'slideUp 0.5s ease-out 0.2s forwards',
        'stagger-3': 'slideUp 0.5s ease-out 0.3s forwards',
        'stagger-4': 'slideUp 0.5s ease-out 0.4s forwards',
        'fill-in': 'fillIn 0.4s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fillIn: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
        'slower': '400ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      backdropBlur: {
        'glass': '15px',
        'glass-strong': '20px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config