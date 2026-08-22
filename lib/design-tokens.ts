/**
 * UniLens Design Tokens
 * Dark theme, premium academic platform
 * No gradients, flat intentional colors, single accent
 */

// Color Palette - Dark Theme
export const colors = {
  // Background: near black, not pure black
  background: '#0A0A0A',
  // Subtle elevated surface
  card: '#111111',
  // Border color
  border: '#2A2A2A',
  // Muted elements
  muted: '#1A1A1A',
  mutedForeground: '#888888',

  // Text: warm off-white
  foreground: '#F2F1EC',
  cardForeground: '#F2F1EC',

  // Single accent color: Muted gold/amber (premium, academic feel)
  accent: '#B8860B', // Dark goldenrod - muted gold
  accentForeground: '#0A0A0A',
  accentMuted: '#2D2818', // Very subtle accent background
  ring: '#B8860B',

  // Destructive (for error states)
  destructive: '#991B1B',
  destructiveForeground: '#F2F1EC',
} as const;

// Type Scale - Dramatic on desktop, readable on mobile
export const typeScale = {
  // Display sizes (for headlines)
  'display-xl': {
    fontSize: 'clamp(3rem, 8vw, 5.5rem)',
    lineHeight: '1.05',
    letterSpacing: '-0.03em',
    fontWeight: '600',
  },
  'display-lg': {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    fontWeight: '600',
  },
  'display-md': {
    fontSize: 'clamp(2rem, 4.5vw, 3rem)',
    lineHeight: '1.15',
    letterSpacing: '-0.01em',
    fontWeight: '600',
  },
  'display-sm': {
    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
    lineHeight: '1.2',
    letterSpacing: '0',
    fontWeight: '600',
  },

  // Heading sizes
  'heading-lg': {
    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
    lineHeight: '1.2',
    letterSpacing: '0',
    fontWeight: '600',
  },
  'heading-md': {
    fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)',
    lineHeight: '1.3',
    letterSpacing: '0',
    fontWeight: '600',
  },
  'heading-sm': {
    fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
    lineHeight: '1.35',
    letterSpacing: '0',
    fontWeight: '600',
  },

  // Body sizes
  'body-lg': {
    fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: '400',
  },
  'body-md': {
    fontSize: '1rem',
    lineHeight: '1.6',
    letterSpacing: '0',
    fontWeight: '400',
  },
  'body-sm': {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    letterSpacing: '0',
    fontWeight: '400',
  },

  // Label (uppercase, small)
  label: {
    fontSize: '0.75rem',
    lineHeight: '1.5',
    letterSpacing: '0.05em',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
} as const;

// Spacing Scale
export const spacing = {
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
} as const;

// Motion Tokens
export const motion = {
  // Durations
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
  },
  // Easings
  easing: {
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // Stagger
  stagger: {
    base: '0.06s',
  },
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Z-index scale
export const zIndex = {
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
} as const;

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
} as const;

// Export all tokens as a single design system object
export const designTokens = {
  colors,
  typeScale,
  spacing,
  motion,
  breakpoints,
  zIndex,
  borderRadius,
} as const;

export type DesignTokens = typeof designTokens;
export type ColorToken = keyof typeof colors;
export type TypeScaleToken = keyof typeof typeScale;
export type SpacingToken = keyof typeof spacing;