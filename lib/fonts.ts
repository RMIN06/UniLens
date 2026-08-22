/**
 * UniLens Font Configuration
 * Using next/font for optimal loading and self-hosting
 * Display: EB Garamond (academic serif with institutional gravitas)
 * Body: Crimson Text (highly readable serif for long-form content)
 * UI: Inter (clean, modern sans for UI elements)
 */

import { EB_Garamond, Crimson_Text, Inter } from 'next/font/google';

// Display font - EB Garamond: academic serif with institutional gravitas
// Weights: 400, 500, 600, 700, 800 for hierarchy
export const fontDisplay = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

// Body font - Crimson Text: readable serif for long-form content
// Weights: 400, 600, 700
export const fontBody = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

// UI font - Inter: clean, modern sans for UI elements (buttons, labels, navigation)
// Weights: 400, 500, 600, 700
export const fontUI = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
  preload: true,
});

// Export font variables for CSS
export const fontVariables = {
  display: fontDisplay.variable,
  body: fontBody.variable,
  ui: fontUI.variable,
};

// CSS class names for easy usage
export const fontClasses = {
  display: fontDisplay.className,
  body: fontBody.className,
  ui: fontUI.className,
};
