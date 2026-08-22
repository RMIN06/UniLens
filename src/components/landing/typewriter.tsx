'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TypewriterProps {
  /** Prefix text that stays static */
  prefix?: string;
  /** Array of words to cycle through */
  words: string[];
  /** Typing speed in ms per character (default: 125ms ~ 80 WPM) */
  typeSpeed?: number;
  /** Deleting speed in ms per character */
  deleteSpeed?: number;
  /** Pause duration after typing complete */
  pauseDuration?: number;
  /** CSS class for the wrapper */
  className?: string;
  /** CSS class for the typed word */
  wordClassName?: string;
  /** CSS class for the cursor */
  cursorClassName?: string;
}

/**
 * Typewriter component with character-by-character animation
 * ~80 WPM default speed (125ms per character)
 * Supports reduced motion fallback (cross-fade between words)
 */
export function Typewriter({
  prefix = '',
  words = ['pre-med students', 'engineering aspirants', 'business majors', 'CS & IT students', 'arts & humanities'],
  typeSpeed = 30,
  deleteSpeed = 15,
  pauseDuration = 900,
  className = '',
  wordClassName = '',
  cursorClassName = '',
}: TypewriterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordRef = useRef(words[currentWordIndex]);

  // Update word ref when words array changes
  useEffect(() => {
    wordRef.current = words[currentWordIndex];
  }, [words, currentWordIndex]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const nextWord = useCallback(() => {
    setCurrentWordIndex((prev) => (prev + 1) % words.length);
    setIsDeleting(false);
    setIsPaused(false);
  }, [words.length]);

  const tick = useCallback(() => {
    if (prefersReducedMotion) return;

    const currentWord = words[currentWordIndex];
    const targetLength = isDeleting ? 0 : currentWord.length;

    if (!isDeleting && displayText.length === currentWord.length) {
      // Finished typing, pause then start deleting
      setIsPaused(true);
      timeoutRef.current = setTimeout(() => {
        setIsDeleting(true);
        setIsPaused(false);
        tick();
      }, pauseDuration);
      return;
    }

    if (isDeleting && displayText.length === 0) {
      // Finished deleting, move to next word
      nextWord();
      return;
    }

    // Calculate next display text
    const nextLength = isDeleting
      ? displayText.length - 1
      : displayText.length + 1;
    setDisplayText(currentWord.slice(0, nextLength));

    // Schedule next tick
    const speed = isDeleting ? deleteSpeed : typeSpeed;
    timeoutRef.current = setTimeout(tick, speed);
  }, [
    currentWordIndex,
    displayText,
    isDeleting,
    isPaused,
    words,
    typeSpeed,
    deleteSpeed,
    pauseDuration,
    prefersReducedMotion,
    nextWord,
  ]);

  // Reduced motion: cross-fade between words
  useEffect(() => {
    if (!prefersReducedMotion) return;

    const interval = setInterval(() => {
      nextWord();
    }, pauseDuration + 1000); // Longer interval for cross-fade

    return () => clearInterval(interval);
  }, [prefersReducedMotion, nextWord, pauseDuration]);

  // Start the animation
  useEffect(() => {
    if (prefersReducedMotion) {
      // Immediately show first word
      setDisplayText(words[0]);
      return;
    }

    // Initial delay before starting
    timeoutRef.current = setTimeout(() => {
      tick();
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [prefersReducedMotion, tick, words]);

  const currentWord = words[currentWordIndex];

  return (
    <span className={className}>
      {prefix && (
        <span className="font-ui text-muted-foreground">{prefix}</span>
      )}
      <span
        className={`inline-block min-w-[14ch] ${wordClassName}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {prefersReducedMotion ? (
          <motion.span
            key={currentWordIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="font-body text-foreground"
          >
            {currentWord}
          </motion.span>
        ) : (
          <>
            <span className="font-body text-foreground">{displayText}</span>
            <span
              className={`inline-block w-0.5 h-6 align-bottom animate-pulse ${cursorClassName}`}
              aria-hidden="true"
            >
              &#8203;
            </span>
          </>
        )}
      </span>
    </span>
  );
}