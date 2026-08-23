'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, GraduationCap, MapPin, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { topPakistaniUniversities } from '@/lib/universities-data';

interface UniversitiesSectionProps {
  className?: string;
}

const categories = ['All', 'General', 'Engineering & IT', 'Medical', 'Business & Management', 'Agriculture', 'Art & Design', 'Liberal Arts', 'Islamic Studies'];

export function UniversitiesSection({ className }: UniversitiesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Public' | 'Private'>('All');
  const [showAll, setShowAll] = useState(false);

  const PREVIEW_COUNT = 5;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return topPakistaniUniversities.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.city.toLowerCase().includes(q)) return false;
      if (categoryFilter !== 'All' && u.category !== categoryFilter) return false;
      if (typeFilter !== 'All' && u.type !== typeFilter) return false;
      return true;
    });
  }, [search, categoryFilter, typeFilter]);

  const isDefaultView =
    !search.trim() && categoryFilter === 'All' && typeFilter === 'All';

  const visible = useMemo(() => {
    if (isDefaultView && !showAll) return filtered.slice(0, PREVIEW_COUNT);
    return filtered;
  }, [filtered, isDefaultView, showAll]);

  return (
    <section
      ref={sectionRef}
      id="universities"
      className={cn(
        'relative py-20 md:py-28 lg:py-32',
        'bg-background',
        className
      )}
      aria-labelledby="universities-heading"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="inline-block font-ui text-label text-primary uppercase tracking-widest mb-4">
            Explore Universities
          </span>
          <h2
            id="universities-heading"
            className="font-display text-display-sm md:text-display-md lg:text-display-lg text-foreground text-balance leading-tight"
          >
            Top 100 Pakistani Universities
          </h2>
          <p className="mt-4 font-body text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
            Browse HEC-recognized universities across Pakistan. Use search and filters to explore the full list.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or city..."
                aria-label="Search universities"
                className={cn(
                  'w-full pl-12 pr-4 py-3 rounded-lg',
                  'bg-card border border-border',
                  'font-body text-body-md text-foreground placeholder:text-muted-foreground/60',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent/50',
                  'transition-colors'
                )}
              />
            </div>

            {/* Type filter */}
            <div className="flex gap-2" role="group" aria-label="Filter by type">
              {(['All', 'Public', 'Private'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  aria-pressed={typeFilter === t}
                  className={cn(
                    'px-5 py-3 rounded-lg font-ui text-label min-h-[48px]',
                    'border transition-colors duration-fast',
                    typeFilter === t
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-accent/40'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                aria-pressed={categoryFilter === c}
                className={cn(
                  'px-4 py-1.5 rounded-full font-ui text-label',
                  'border transition-colors duration-fast',
                  categoryFilter === c
                    ? 'bg-accent-muted text-accent border-accent/50'
                    : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-accent/30'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <p className="mb-4 font-ui text-body-sm text-muted-foreground" role="status">
          Showing {visible.length} of {topPakistaniUniversities.length} universities
        </p>

        {/* University Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {visible.map((u, index) => (
            <motion.article
              key={u.id}
              tabIndex={0}
              className={cn(
                'group bg-card border border-border rounded-xl p-5',
                'hover:border-accent/40 hover:shadow-lg transition-all duration-normal',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={gridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.5), ease: 'easeOut' }}
              aria-label={`${u.name}, ${u.city}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent-muted text-accent font-ui text-label font-medium flex-shrink-0">
                  #{u.ranking}
                </span>
              </div>

              <h3 className="font-display text-heading-sm text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
                {u.name}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-ui text-body-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  {u.city}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                  {u.type}
                </span>
              </div>

              <span className="mt-3 inline-block px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-ui text-label">
                {u.category}
              </span>
            </motion.article>
          ))}
        </div>

        {/* Show all toggle */}
        {isDefaultView && filtered.length > PREVIEW_COUNT && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              aria-expanded={showAll}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-ui text-label min-h-[48px]',
                'border border-border bg-card text-foreground',
                'hover:border-accent/40 hover:text-accent transition-all duration-fast active:scale-[0.98]'
              )}
            >
              {showAll ? (
                'Show top 5 only'
              ) : (
                `Show all ${filtered.length} universities`
              )}
            </button>
          </div>
        )}

        {/* Empty state */}
        {visible.length === 0 && (
          <div className="py-16 text-center">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" aria-hidden="true" />
            <h3 className="font-display text-heading-md text-foreground mb-2">
              No universities found
            </h3>
            <p className="font-body text-body-md text-muted-foreground max-w-md mx-auto mb-6">
              Try a different search term or filter to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setTypeFilter('All');
                setShowAll(false);
              }}
              className="btn-splash inline-flex items-center gap-2 px-6 py-3 rounded-lg font-ui text-label text-accent-foreground"
            >
              <span className="btn-content">Clear search &amp; filters</span>
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          <Link
            href="/signup"
            className="btn-splash inline-flex items-center gap-2 px-8 py-4 rounded-lg font-ui text-label text-accent-foreground min-h-[52px]"
          >
            <span className="btn-content">Sign up to see real student reviews</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
