'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { Search, CheckCircle, Star, ArrowRight, Users, GraduationCap, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AboutSectionProps {
  className?: string
}

type HTMLSectionElement = HTMLElement

// Data for the three paths - tailored for Pakistani context
const paths = [
  {
    id: 'pre-uni',
    label: 'Pre-University',
    icon: Search,
    iconBg: 'bg-primary/10 text-primary',
    number: '01',
    title: 'Discover & Match',
    description: 'Explore 150+ Pakistani universities matched to your grades, budget, and preferences. Filter by HEC ranking, city, program, and real student satisfaction.',
    details: [
      'Browse 150+ HEC-recognized universities',
      'Match by FSc/Intermediate grades & budget',
      'See real student satisfaction scores',
      'Compare programs: MBBS, Engineering, CS, Business',
    ],
    color: 'text-primary',
    borderColor: 'border-primary/30',
  },
  {
    id: 'undergrad',
    label: 'Undergraduate',
    icon: CheckCircle,
    iconBg: 'bg-accent/10 text-accent',
    number: '02',
    title: 'Validate & Share',
    description: 'Confirm if your program delivers. Share your day-to-day — teaching quality, labs, internships, campus culture — so juniors learn from your journey.',
    details: [
      'Rate your program & university anonymously',
      'Share experience posts with photos',
      'Connect with prospective students',
      'Earn credibility badges for helpful reviews',
    ],
    color: 'text-accent',
    borderColor: 'border-accent/30',
  },
  {
    id: 'graduate',
    label: 'Graduate',
    icon: Star,
    iconBg: 'bg-secondary/10 text-secondary',
    number: '03',
    title: 'Reflect & Guide',
    description: 'Rate your university and field out of 10. Give a recommendation level. Share your career outcome — where you work, what you earn, whether you\'d do it again.',
    details: [
      'Overall rating out of 10',
      'Would you recommend? (Yes/No/Maybe)',
      'Career outcome & salary transparency',
      'Alumni network strength indicator',
    ],
    color: 'text-secondary',
    borderColor: 'border-secondary/30',
  },
]

export function AboutSection({ className }: AboutSectionProps) {
  const sectionRef = useRef<HTMLSectionElement>(null)
  const cardRefs = paths.map(() => useRef<HTMLDivElement>(null))

  // Scroll progress for the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Reduced motion check
  const prefersReducedMotion = useRef(false)
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Section-level entrance animation
  const sectionY = useTransform(scrollYProgress, [0, 0.15, 1], [60, 0, 0])
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0, 1, 1])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className={cn(
        'relative py-20 md:py-28 lg:py-32',
        'bg-background',
        className
      )}
      aria-labelledby="how-it-works-heading"
    >
      {/* Background subtle pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border/30" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
          style={{
            y: prefersReducedMotion.current ? 0 : sectionY,
            opacity: sectionOpacity,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="inline-block font-ui text-label text-primary uppercase tracking-widest mb-4">
            How It Works
          </span>
          <h2
            id="how-it-works-heading"
            className="font-display text-display-sm md:text-display-md lg:text-display-lg text-foreground text-balance leading-tight"
          >
            Three paths, one continuous cycle
          </h2>
          <p className="mt-4 font-body text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
            Graduates' insights feed back into what pre-university students see — creating a living ecosystem of real experience for Pakistan's students.
          </p>
        </motion.div>

        {/* Three Path Cards - Horizontal on desktop, stacked on mobile */}
        <div className="relative">
          {/* Connecting line / cycle visualization - desktop only */}
          <div className="hidden lg:block absolute top-[140px] left-1/2 -translate-x-1/2 w-[80%] h-[200px] pointer-events-none">
            <svg viewBox="0 0 800 200" className="w-full h-full" aria-hidden="true">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                </marker>
              </defs>
              {/* Curved path connecting the three cards */}
              <path
                d="M 100 100 Q 250 20 400 100 Q 550 180 700 100"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-border/30"
                strokeDasharray="8 4"
              />
              {/* Return arrow at the end */}
              <path
                d="M 700 100 Q 750 100 780 130"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-accent/40"
                markerEnd="url(#arrowhead)"
              />
              {/* Cycle indicator */}
              <text x="400" y="170" textAnchor="middle" className="text-xs text-muted-foreground font-ui" fontFamily="var(--font-ui)">
                Cycle repeats →
              </text>
            </svg>
          </div>

          {/* Mobile connecting dots */}
          <div className="lg:hidden flex justify-center gap-2 mb-8" aria-hidden="true">
            {paths.map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-border/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
              />
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
            {paths.map((path, index) => {
              const Icon = path.icon
              const cardRef = cardRefs[index]

              // Individual card scroll animations
              const cardScrollY = useTransform(scrollYProgress, [0, 0.2 + index * 0.25, 1], [40, 0, 0])
              const cardScrollOpacity = useTransform(scrollYProgress, [0, 0.2 + index * 0.25, 1], [0, 1, 1])

              // Staggered reveal
              const isInView = useInView(cardRef, { once: true, margin: '-100px' })

              return (
                <motion.div
                  ref={cardRef}
                  key={path.id}
                  className={cn(
                    'relative group',
                    'bg-card border rounded-2xl p-6 md:p-8',
                    'transition-all duration-normal ease-out',
                    'hover:border-accent/40 hover:shadow-xl',
                    path.borderColor
                  )}
                  style={{
                    y: prefersReducedMotion.current ? 0 : cardScrollY,
                    opacity: cardScrollOpacity,
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.1 * index, ease: 'easeOut' }}
                  whileHover={{ y: prefersReducedMotion.current ? 0 : -6 }}
                >
                  {/* Number badge */}
                  <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4">
                    <span className={cn(
                      'font-display text-display-sm font-medium',
                      'bg-background px-3 py-1 rounded-full border',
                      path.borderColor,
                      path.color
                    )}>
                      {path.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center mb-6', path.iconBg)}>
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </div>

                  {/* User type label */}
                  <span className={cn('font-ui text-label uppercase tracking-widest', path.color)}>
                    {path.label}
                  </span>

                  {/* Title */}
                  <h3 className="mt-3 font-display text-heading-md text-foreground leading-tight">
                    {path.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 font-body text-body-md text-muted-foreground leading-relaxed">
                    {path.description}
                  </p>

                  {/* Details list */}
                  <ul className="mt-6 space-y-3" role="list">
                    {path.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        className={cn('flex items-start gap-3 font-body text-body-sm text-muted-foreground', 'group-hover:text-foreground transition-colors')}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                      >
                        <span className={cn('w-5 h-5 flex-shrink-0 flex items-center justify-center mt-0.5', path.color)}>
                          <CheckCircle className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Forward arrow - shows connection to next stage */}
                  {index < paths.length - 1 && (
                    <motion.div
                      className="absolute bottom-6 right-6 md:bottom-8 md:right-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ display: prefersReducedMotion.current ? 'none' : 'block' }}
                      aria-hidden="true"
                    >
                      <ArrowRight className={cn('w-5 h-5', path.color)} />
                    </motion.div>
                  )}

                  {/* Cycle back indicator for last card */}
                  {index === paths.length - 1 && (
                    <motion.div
                      className="absolute bottom-6 right-6 md:bottom-8 md:right-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ display: prefersReducedMotion.current ? 'none' : 'block' }}
                      aria-hidden="true"
                    >
                      <ArrowRight className={cn('w-5 h-5', 'text-accent')} />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Cycle summary - mobile */}
        <motion.div
          className="lg:hidden mt-12 p-6 bg-muted/50 rounded-xl border border-border/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2 flex-wrap">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>Pre-Uni</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            <GraduationCap className="w-4 h-4" aria-hidden="true" />
            <span>Undergrad</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            <Briefcase className="w-4 h-4" aria-hidden="true" />
            <span>Graduate</span>
            <ArrowRight className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-accent font-medium">Back to Pre-Uni</span>
          </div>
          <p className="font-body text-body-sm text-muted-foreground">
            Each graduate's reflection becomes a pre-university student's guidance
          </p>
        </motion.div>
      </div>
    </section>
  )
}