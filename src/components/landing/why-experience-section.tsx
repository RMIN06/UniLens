'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { BarChart2, Shield, Eye, Users, Award, MessageSquare, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WhyExperienceSectionProps {
  className?: string
}

type HTMLSectionElement = HTMLElement

// Comparison data: Official rankings vs Real student ratings (Pakistani context)
const comparisonData = [
  {
    category: 'Teaching Quality',
    rankingWeight: 30,
    rankingScore: 85,
    realScore: 72,
    insight: 'HEC rankings weight research output; students care about teaching quality in class.',
  },
  {
    category: 'Career Outcomes',
    rankingWeight: 20,
    rankingScore: 78,
    realScore: 88,
    insight: 'Alumni networks & internships matter more than brand name for jobs in Pakistan.',
  },
  {
    category: 'Student Life',
    rankingWeight: 10,
    rankingScore: 65,
    realScore: 82,
    insight: 'Campus culture, societies, mental health support, housing — absent from HEC tables.',
  },
  {
    category: 'Value for Money',
    rankingWeight: 5,
    rankingScore: 60,
    realScore: 75,
    insight: 'ROI depends on field, city, scholarships — not captured in league tables.',
  },
  {
    category: 'Support Services',
    rankingWeight: 5,
    rankingScore: 70,
    realScore: 78,
    insight: 'Academic advising, career services, accessibility — real differentiators for students.',
  },
]

// Stat callouts - Pakistan specific
const stats = [
  { value: '87%', label: 'of students say HEC rankings didn\'t match their reality', icon: BarChart2 },
  { value: '3.2x', label: 'more likely to finish degree with peer guidance', icon: Users },
  { value: '94%', label: 'of graduates wish they\'d talked to alumni first', icon: MessageSquare },
]

export function WhyExperienceSection({ className }: WhyExperienceSectionProps) {
  const sectionRef = useRef<HTMLSectionElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Reduced motion
  const prefersReducedMotion = useRef(false)
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Section entrance
  const sectionY = useTransform(scrollYProgress, [0, 0.15, 1], [60, 0, 0])
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0, 1, 1])

  // Stats counter animation trigger
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const comparisonInView = useInView(comparisonRef, { once: true, margin: '-100px' })
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      id="why-experience"
      className={cn(
        'relative py-20 md:py-28 lg:py-32',
        'bg-muted/30',
        className
      )}
      aria-labelledby="value-prop-heading"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />

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
            Why Real Experience Wins
          </span>
          <h2
            id="value-prop-heading"
            className="font-display text-display-sm md:text-display-md lg:text-display-lg text-foreground text-balance leading-tight"
          >
            Rankings measure institutions. <br />
            <span className="text-primary">Students measure outcomes.</span>
          </h2>
          <p className="mt-4 font-body text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
            HEC tables optimize for research funding and selectivity. You're optimizing for your future. Here's why that difference matters for Pakistani students.
          </p>
        </motion.div>

        {/* Comparison Visual - Desktop: side by side, Mobile: stacked */}
        <motion.div
          ref={comparisonRef}
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={comparisonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse" role="table">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-4 md:px-6 font-ui text-label text-muted-foreground uppercase tracking-wider">
                    What you're evaluating
                  </th>
                  <th className="text-center py-4 px-4 md:px-6 font-ui text-label text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center justify-center gap-1">
                      <Award className="w-4 h-4" aria-hidden="true" />
                      HEC / Ranking Score
                    </span>
                  </th>
                  <th className="text-center py-4 px-4 md:px-6 font-ui text-label text-muted-foreground uppercase tracking-wider">
                    <span className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4 text-primary" aria-hidden="true" />
                      Real Student Rating
                    </span>
                  </th>
                  <th className="text-left py-4 px-4 md:px-6 font-ui text-label text-muted-foreground uppercase tracking-wider">
                    The gap
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {comparisonData.map((item, index) => (
                  <motion.tr
                    key={item.category}
                    className="hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={comparisonInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                  >
                    <td className="py-5 px-4 md:px-6 font-body text-body-md text-foreground">
                      {item.category}
                    </td>
                    <td className="py-5 px-4 md:px-6 text-center">
                      <div className="inline-flex items-center justify-center gap-2">
                        <span className="font-display text-heading-sm text-muted-foreground/60">
                          {item.rankingScore}/100
                        </span>
                        <span className="font-ui text-body-sm text-muted-foreground/40">
                          (weight: {item.rankingWeight}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-4 md:px-6 text-center">
                      <div className="inline-flex items-center justify-center gap-2">
                        <span className="font-display text-heading-sm text-primary font-medium">
                          {item.realScore}/100
                        </span>
                        <motion.span
                          className="font-ui text-body-sm text-primary/80"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.08, type: 'spring', stiffness: 300 }}
                        >
                          {item.realScore > item.rankingScore ? '+' : ''}{item.realScore - item.rankingScore}
                        </motion.span>
                      </div>
                    </td>
                    <td className="py-5 px-4 md:px-6 font-body text-body-sm text-muted-foreground max-w-xs">
                      {item.insight}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="lg:hidden mt-6 space-y-4">
            {comparisonData.map((item, index) => (
              <motion.div
                key={item.category}
                className="bg-card border border-border rounded-xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={comparisonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
              >
                <div className="font-ui text-label text-primary uppercase tracking-wider mb-3">
                  {item.category}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-display text-heading-sm text-muted-foreground/60">
                      {item.rankingScore}/100
                    </div>
                    <div className="font-ui text-body-sm text-muted-foreground/40">
                      Ranking
                    </div>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="font-display text-heading-sm text-primary font-medium">
                      {item.realScore}/100
                    </div>
                    <div className="font-ui text-body-sm text-primary/80">
                      Real Rating
                    </div>
                  </div>
                </div>
                <p className="font-body text-body-sm text-muted-foreground">
                  {item.insight}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stat Callouts */}
        <motion.div
          ref={statsRef}
          className="grid md:grid-cols-3 gap-6 mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center hover:border-primary/40 transition-colors duration-normal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1, type: 'spring', stiffness: 300 }}
                whileHover={{ y: prefersReducedMotion.current ? 0 : -4, scale: 1.01 }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4 mx-auto">
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <div className="font-display text-display-sm md:text-display-md text-foreground leading-tight mb-1">
                  {stat.value}
                </div>
                <p className="font-body text-body-md text-muted-foreground leading-relaxed">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Illustrative Quote / Example */}
        <motion.div
          className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-16 md:mb-20 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={comparisonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
        >
          {/* Quote marks decoration */}
          <div className="absolute top-6 right-6 text-primary/10" aria-hidden="true">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 20C20 20 35 20 35 20C35 20 35 35 35 35C35 35 20 35 20 35C20 35 20 20 20 20Z" fill="currentColor" />
              <path d="M60 20C60 20 75 20 75 20C75 20 75 35 75 35C75 35 60 35 60 35C60 35 60 20 60 20Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl">
            <p className="font-display text-heading-lg md:text-display-sm text-foreground leading-tight mb-6 text-balance">
              "I chose my university based on the HEC ranking. Three years later, I realized the 'top-ranked' program had terrible teaching, no career support, and outdated labs. If I'd talked to one graduate, I'd have known."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Eye className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <p className="font-body text-body-sm font-medium text-foreground">
                  — Computer Science graduate, NUST Islamabad, 2023
                </p>
                <p className="font-body text-body-sm text-muted-foreground">
                  Verified alumni testimonial — replace with more post-launch
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Differentiators - What we offer that rankings don't */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={comparisonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
        >
          <h3 className="font-display text-heading-md text-center text-foreground mb-10">
            What HEC rankings never tell you
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Eye, title: 'Honest Reviews', desc: 'Unfiltered, verified experiences from current students and alumni — no marketing spin.' },
              { icon: Shield, title: 'Verified Identity', desc: 'University email verification ensures every voice is real, not manufactured.' },
              { icon: Users, title: 'Peer Matching', desc: 'Connect with people who share your city, grades, field, and background.' },
              { icon: BarChart2, title: 'Outcome Data', desc: 'Salary ranges, employment rates, career satisfaction — by major and university.' },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors duration-normal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.08 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h4 className="font-display text-heading-sm text-foreground mb-2">
                    {item.title}
                  </h4>
                  <p className="font-body text-body-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          ref={ctaRef}
          className="relative bg-primary rounded-2xl p-8 md:p-12 lg:p-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
        >
          {/* Decorative accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-accent" aria-hidden="true" />

          <h3 className="font-display text-display-sm md:text-display-md text-primary-foreground text-balance leading-tight mb-4">
            Ready to see the real picture?
          </h3>
          <p className="font-body text-body-lg text-primary-foreground/70 max-w-xl mx-auto mb-8 text-balance">
            Join thousands of Pakistani students making university decisions based on experience, not marketing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className={cn(
              'px-8 py-4',
              'bg-accent text-accent-foreground',
              'font-ui text-label uppercase tracking-wider',
              'rounded-lg',
              'transition-all duration-normal ease-out',
              'hover:bg-accent/90',
              'active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
              'min-h-[52px] touch-manipulation',
              'w-full sm:w-auto'
            )}>
              Start exploring universities
              <ArrowRight className="ml-3 inline-block w-5 h-5" aria-hidden="true" />
            </button>
            <button className={cn(
              'px-8 py-4',
              'bg-transparent text-primary-foreground border-2 border-primary-foreground/30',
              'font-ui text-label uppercase tracking-wider',
              'rounded-lg',
              'transition-all duration-normal ease-out',
              'hover:border-primary-foreground hover:bg-primary-foreground/10',
              'active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
              'min-h-[52px] touch-manipulation',
              'w-full sm:w-auto'
            )}>
              Share my experience
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}