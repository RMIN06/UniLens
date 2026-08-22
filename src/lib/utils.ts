import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if the user prefers reduced motion
 * Used for SSR-safe reduced motion detection
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Hook for scroll-driven animations with reduced motion support
 * Returns whether animations should run
 */
export function useReducedMotion(): boolean {
  // This is a placeholder - actual implementation would use useEffect/useSyncExternalStore
  // For SSR safety, we return false initially and update on client
  return false
}