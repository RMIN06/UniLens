'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { HeroBackground3D } from './hero-background-3d';
import { Typewriter } from './typewriter';
import { LiveCounter } from './live-counter';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const fadeIn = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
        };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
      {/* 3D background - visible and prominent */}
      <HeroBackground3D />

      {/* Subtle vignette for text readability - much lighter */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/60"
        aria-hidden="true"
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            {...fadeIn(0)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-muted border border-accent/30 text-accent font-ui text-label mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Pakistan's First Student-Driven University Platform
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            {...fadeIn(0.1)}
            className="font-display text-display-xl md:text-display-lg lg:text-display-xl text-foreground text-balance leading-tight mb-8"
          >
            Choose Your University Based on
            <br />
            <span className="text-accent">Real Student Outcomes</span>
            <br />
            <span className="text-muted-foreground font-normal">Not Rankings</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            {...fadeIn(0.2)}
            className="font-body text-body-lg md:text-body-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed"
          >
            Connect with verified graduates from Pakistani universities. Get honest insights about teaching quality, career outcomes, campus life, and ROI — from people who've actually been there.
          </motion.p>

          {/* Typewriter */}
          <motion.div
            {...fadeIn(0.3)}
            className="mb-10 min-h-[3rem] flex items-center justify-center"
          >
            <Typewriter
              prefix="Discover universities for "
              words={['pre-med students', 'engineering aspirants', 'business majors', 'CS & IT students', 'arts & humanities']}
              className="font-body text-body-lg md:text-body-lg"
              wordClassName="text-foreground font-medium"
              cursorClassName="bg-accent"
              typeSpeed={22}
              deleteSpeed={12}
              pauseDuration={900}
            />
          </motion.div>

          {/* CTA Buttons - Better spacing, animated */}
          <motion.div
            {...fadeIn(0.4)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/signup"
              className="btn-splash group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 font-ui text-label text-accent-foreground rounded-lg min-h-[52px] touch-manipulation"
            >
              <span className="btn-content flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
            <Link
              href="/login"
              className="btn-fill w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 font-ui text-label text-foreground rounded-lg border-2 border-border hover:border-accent/50 transition-colors duration-normal min-h-[52px] touch-manipulation"
            >
              <span className="btn-content">Login</span>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            {...fadeIn(0.5)}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-display text-heading-md text-foreground">12,480+</span>
              <span className="font-body text-body-sm">Verified Experiences</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-display text-heading-md text-foreground">150+</span>
              <span className="font-body text-body-sm">Pakistani Universities</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-display text-heading-md text-foreground">94%</span>
              <span className="font-body text-body-sm">Student Satisfaction</span>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            style={{ display: prefersReducedMotion ? 'none' : 'block' }}
          >
            <svg className="w-6 h-6 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}