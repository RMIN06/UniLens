'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Shield, Clock, FileText, GitCompare, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankingTableProps {
  className?: string;
}

type HTMLSectionElement = HTMLElement;

const rankingSignals = [
  {
    id: 'verified',
    icon: Shield,
    signal: 'Verified Status',
    meaning: 'Confirmed enrollment or graduation via .edu.pk email — not anonymous claims',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    id: 'recency',
    icon: Clock,
    signal: 'Recency',
    meaning: 'How recent the experience is; reviews from the last 2 years carry highest weight',
    iconBg: 'bg-accent/10 text-accent',
  },
  {
    id: 'detail',
    icon: FileText,
    signal: 'Detail & Specificity',
    meaning: 'Vague one-line reviews carry less weight than detailed accounts with examples',
    iconBg: 'bg-secondary/10 text-secondary',
  },
  {
    id: 'consistency',
    icon: GitCompare,
    signal: 'Consistency',
    meaning: 'Whether the review aligns with other reviews of the same program & university',
    iconBg: 'bg-blue-600/10 text-blue-700 dark:text-blue-400',
  },
  {
    id: 'consistency',
    icon: GitCompare,
    signal: 'Consistency',
    meaning: 'Whether the review aligns with other reviews of the same program & university',
    iconBg: 'bg-purple-600/10 text-purple-700 dark:text-purple-400',
  },
  {
    id: 'validation',
    icon: Users,
    signal: 'Community Validation',
    meaning: 'Other students marking a review as genuinely helpful or accurate',
    iconBg: 'bg-rose-600/10 text-rose-700 dark:text-rose-400',
  },
];

export function RankingTable({ className }: RankingTableProps) {
  const sectionRef = useRef<HTMLSectionElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const sectionY = useTransform(scrollYProgress, [0, 0.15, 1], [60, 0, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0, 1, 1]);

  const tableInView = useInView(tableRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="ranking-table"
      className={cn(
        'relative py-20 md:py-28 lg:py-32',
        'bg-background',
        className
      )}
      aria-labelledby="ranking-table-heading"
    >
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
            How We Rank Experience
          </span>
          <h2
            id="ranking-table-heading"
            className="font-display text-display-sm md:text-display-md lg:text-display-lg text-foreground text-balance leading-tight"
          >
            Not all opinions carry equal weight
          </h2>
          <p className="mt-4 font-body text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
            Our system weighs each review against six signals. The result is a trust score that reflects real reliability, not just volume.
          </p>
        </motion.div>

        {/* Table / Card Grid */}
        <motion.div
          ref={tableRef}
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={tableInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse" role="table">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-6 font-ui text-label text-muted-foreground uppercase tracking-wider w-48">
                    Signal
                  </th>
                  <th className="text-left py-4 px-6 font-ui text-label text-muted-foreground uppercase tracking-wider">
                    What It Means
                  </th>
                  <th className="text-center py-4 px-6 font-ui text-label text-muted-foreground uppercase tracking-wider w-32">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {rankingSignals.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    className="hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={tableInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', item.iconBg)}>
                          <item.icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <span className="font-display text-heading-sm text-foreground">
                          {item.signal}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6 font-body text-body-md text-muted-foreground max-w-xl">
                      {item.meaning}
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary font-ui text-label font-medium">
                        Signal {index + 1}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-4">
            {rankingSignals.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-card border border-border rounded-xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={tableInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', item.iconBg)}>
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-heading-sm text-foreground">
                      {item.signal}
                    </h3>
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary font-ui text-label font-medium">
                      Signal {index + 1}
                    </span>
                  </div>
                </div>
                <p className="font-body text-body-md text-muted-foreground pl-12">
                  {item.meaning}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Explanatory Note */}
        <motion.div
          className="mt-12 md:mt-16 p-6 md:p-8 bg-card border border-border rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={tableInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-heading-sm text-foreground mb-2">
                How the trust score works
              </h3>
              <p className="font-body text-body-md text-muted-foreground leading-relaxed">
                Each review receives a trust score from 0 to 100 based on the six signals above.
                A verified graduate with a detailed, recent review that aligns with others and has
                community validation will score significantly higher than an anonymous, vague,
                years-old post. The score is visible on every review so you can judge reliability at a glance.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}