'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface LiveCounterProps {
  /** Target number to count up to */
  target: number;
  /** Starting number (default: 0) */
  from?: number;
  /** Animation duration in ms (default: 2000) */
  duration?: number;
  /** Label to display after the number */
  label: string;
  /** Trigger animation on scroll into view (default: true) */
  triggerOnScroll?: boolean;
  /** Decimal places (default: 0) */
  decimals?: number;
  /** Custom formatter function */
  formatter?: (value: number) => string;
  /** CSS class for the number */
  numberClassName?: string;
  /** CSS class for the label */
  labelClassName?: string;
  /** CSS class for the wrapper */
  className?: string;
}

/**
 * LiveCounter component with animated count-up
 * Uses Framer Motion's useSpring for smooth animation
 * Supports reduced motion and scroll-triggered animation
 */
export function LiveCounter({
  target,
  from = 0,
  duration = 2000,
  label,
  triggerOnScroll = true,
  decimals = 0,
  formatter,
  numberClassName = '',
  labelClassName = '',
  className = '',
}: LiveCounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayValue, setDisplayValue] = useState(from);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const shouldAnimate = !triggerOnScroll || isInView;

  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const animate = useCallback((timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const currentValue = from + (target - from) * easedProgress;

    if (formatter) {
      setDisplayValue(parseFloat(formatter(currentValue)));
    } else {
      setDisplayValue(Number(currentValue.toFixed(decimals)));
    }

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setHasAnimated(true);
      if (formatter) {
        setDisplayValue(parseFloat(formatter(target)));
      } else {
        setDisplayValue(Number(target.toFixed(decimals)));
      }
    }
  }, [from, target, duration, decimals, formatter]);

  // Start animation when in view (or immediately if not triggerOnScroll)
  useEffect(() => {
    if (!shouldAnimate || hasAnimated || prefersReducedMotion) {
      if (prefersReducedMotion || !shouldAnimate) {
        setDisplayValue(target);
        setHasAnimated(true);
      }
      return;
    }

    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shouldAnimate, hasAnimated, prefersReducedMotion, animate, target]);

  // Format the display value for rendering
  const formattedValue = formatter
    ? formatter(displayValue)
    : displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <div ref={ref} className={className}>
      <div className="flex items-baseline gap-2">
        <span
          className={`font-display tabular-nums ${numberClassName}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {formattedValue}
        </span>
        <span className={`font-ui text-muted-foreground ${labelClassName}`}>
          {label}
        </span>
      </div>
    </div>
  );
}