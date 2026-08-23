'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Search,
  GraduationCap,
  BookOpen,
  Loader2,
  Users,
  SlidersHorizontal,
  UserCircle,
  X,
  ThumbsUp,
  ChevronDown,
  BriefcaseBusiness,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewerLevel = 'undergraduate' | 'graduate'

type PublicUser = {
  id: string
  academicLevel: string | null
  university: string | null
  program: string | null
  graduationYear: number | null
  higherStream: string | null
}

type ExperienceItem = {
  id: string
  displayName: string
  isOwn: boolean
  academicLevel: 'undergraduate' | 'graduate' | null
  university: string
  program: string
  graduationYear: number | null
  title: string
  overallRating: number
  recommendation: string
  wouldChooseAgain: string | null
  categoryRatings: Record<string, number> | null
  story: string
  pros: string[]
  cons: string[]
  advice: string
  outcome: {
    status: string
    details?: string
    fieldRelevance: string
  } | null
  helpfulCount: number
  editedAt: string | null
  createdAt: string
}

const STREAM_LABELS: Record<string, string> = {
  'fsc-pre-medical': 'FSc Pre-Medical',
  'fsc-pre-engineering': 'FSc Pre-Engineering',
  ics: 'ICS',
  fa: 'FA (Arts)',
  'a-level': 'A-Level',
  other: 'Other',
}

const RECOMMENDATION_LABELS: Record<string, string> = {
  'highly-recommend': 'Highly recommend',
  recommend: 'Recommend',
  neutral: 'Neutral',
  'not-recommended': 'Not recommended',
}

const OUTCOME_LABELS: Record<string, string> = {
  employed: 'Employed',
  'higher-study': 'Further study',
  entrepreneurship: 'Entrepreneurship',
  'still-searching': 'Still searching',
  other: 'Other path',
}

function levelLabel(level: string | null): string {
  return level === 'graduate' ? 'Anonymous Graduate' : 'Anonymous Undergraduate'
}

const PAGE_SIZE = 24

export function ExploreClient({ viewerLevel }: { viewerLevel: ViewerLevel }) {
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('all')
  const [university, setUniversity] = useState('')
  const [program, setProgram] = useState('')
  const [users, setUsers] = useState<PublicUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchUsers = useCallback(
    async (targetPage: number, append: boolean) => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        if (level !== 'all') params.set('level', level)
        if (university) params.set('university', university)
        if (program) params.set('program', program)
        params.set('page', String(targetPage))

        const res = await fetch(`/api/users?${params.toString()}`)
        if (!res.ok) throw new Error('failed')
        const data = await res.json()

        setUsers((prev) =>
          append ? [...prev, ...data.users] : data.users
        )
        setTotal(data.total)
        setPage(data.page)
        setHasMore(data.hasMore)
      } catch {
        // keep previous list on transient errors
      } finally {
        setLoading(false)
      }
    },
    [q, level, university, program]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchUsers(1, false), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [fetchUsers])

  // Lock body scroll while the experiences modal is open
  useEffect(() => {
    if (selectedUserId) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [selectedUserId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-md font-semibold text-foreground">
          Explore profiles
        </h1>
        <p className="text-body-sm mt-1 text-muted-foreground">
          All profiles are fully anonymous. Click a profile to read their experiences.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by university or degree…"
            aria-label="Search profiles"
            className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 font-ui text-sm text-foreground shadow-sm transition-colors duration-[var(--duration-fast)] placeholder:text-muted-foreground/60"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-lg border px-4 font-ui text-sm font-medium transition-colors duration-[var(--duration-fast)]',
            showFilters
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-3">
          <div>
            <label
              htmlFor="filter-level"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Status
            </label>
            <select
              id="filter-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-2.5 font-ui text-sm text-foreground"
            >
              <option value="all">All</option>
              <option value="undergraduate">Undergraduates</option>
              <option value="graduate">Graduates</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-university"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              University
            </label>
            <input
              id="filter-university"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g. NUST"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          <div>
            <label
              htmlFor="filter-program"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Degree / Program
            </label>
            <input
              id="filter-program"
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      )}

      {/* Results meta */}
      <p className="font-ui text-sm text-muted-foreground" role="status">
        {loading && users.length === 0
          ? 'Searching…'
          : `${total} profile${total === 1 ? '' : 's'} found`}
      </p>

      {/* Results grid */}
      {users.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => setSelectedUserId(u.id)}
                aria-haspopup="dialog"
                className="flex h-full w-full cursor-pointer items-start gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-shadow duration-[var(--duration-normal)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserCircle className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-ui text-sm font-semibold text-foreground">
                      {levelLabel(u.academicLevel)}
                    </span>
                    {u.academicLevel === 'graduate' ? (
                      <BookOpen
                        className="h-3.5 w-3.5 shrink-0 text-accent"
                        aria-label="Graduate"
                      />
                    ) : (
                      <GraduationCap
                        className="h-3.5 w-3.5 shrink-0 text-secondary"
                        aria-label="Undergraduate"
                      />
                    )}
                  </span>
                  <span className="mt-0.5 block truncate font-ui text-xs text-muted-foreground">
                    {u.program ?? '—'}
                  </span>
                  <span className="block truncate font-ui text-xs text-muted-foreground">
                    {u.university ?? '—'}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-muted px-2 py-0.5 font-ui text-[11px] font-medium capitalize text-muted-foreground">
                      {u.academicLevel ?? 'student'}
                    </span>
                    {u.graduationYear && (
                      <span className="rounded-full bg-muted px-2 py-0.5 font-ui text-[11px] font-medium text-muted-foreground">
                        {u.academicLevel === 'graduate' ? '' : 'exp. '}
                        {u.graduationYear}
                      </span>
                    )}
                    {u.higherStream && (
                      <span className="rounded-full bg-muted px-2 py-0.5 font-ui text-[11px] font-medium text-muted-foreground">
                        {STREAM_LABELS[u.higherStream] ?? u.higherStream}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 font-ui text-sm font-medium text-foreground">
              No profiles match your search
            </p>
            <p className="mt-1 text-body-sm text-muted-foreground">
              Try clearing filters or using a broader term.
            </p>
          </div>
        )
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => fetchUsers(page + 1, true)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 font-ui text-sm font-medium text-foreground shadow-sm transition-colors duration-[var(--duration-fast)] hover:bg-muted disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            Load more
          </button>
        </div>
      )}

      {/* Profile experiences modal */}
      {selectedUserId && (
        <ProfileExperiencesModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  )
}

function ProfileExperiencesModal({
  userId,
  onClose,
}: {
  userId: string
  onClose: () => void
}) {
  const [items, setItems] = useState<ExperienceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/experiences?author=${userId}`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (!cancelled) setItems(data.experiences ?? [])
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Anonymous profile experiences"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-card shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-card p-5">
          <div className="min-w-0">
            <h2 className="truncate font-ui text-base font-semibold text-foreground">
              Anonymous profile
            </h2>
            <p className="font-ui text-xs text-muted-foreground">
              Experiences shared by this member
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors duration-[var(--duration-fast)] hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {loading && (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            </div>
          )}

          {!loading && error && (
            <p className="py-8 text-center font-ui text-sm text-muted-foreground">
              Could not load experiences. Please try again.
            </p>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="py-8 text-center font-ui text-sm text-muted-foreground">
              This member has not shared any experiences yet.
            </p>
          )}

          {items.map((it) => (
            <ExperienceCard key={it.id} it={it} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ExperienceCard({ it }: { it: ExperienceItem }) {
  return (
    <article className="rounded-xl border border-border bg-background p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ui text-xs font-medium text-muted-foreground">
              Anonymous {it.academicLevel === 'graduate' ? 'Graduate' : 'Undergraduate'}
            </span>
            <span className="font-ui text-[11px] text-muted-foreground">
              {new Date(it.createdAt).toLocaleDateString()}
              {it.editedAt ? ' · edited' : ''}
            </span>
          </div>
          <h3 className="mt-1.5 font-ui text-sm font-semibold text-foreground">
            {it.title}
          </h3>
          <p className="font-ui text-xs text-muted-foreground">
            {it.program} · {it.university}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent-muted px-3 py-1.5 font-ui text-sm font-bold text-accent dark:text-accent">
            <StarIcon />
            {it.overallRating}/10
          </span>
        </div>
      </div>

      <details className="group mt-3">
        <summary className="cursor-pointer list-none font-ui text-xs leading-relaxed text-foreground [&::-webkit-details-marker]:hidden">
          <span className="line-clamp-2 group-open:line-clamp-none">{it.story}</span>
          <span className="mt-1 inline-flex cursor-pointer items-center gap-1 font-ui text-[11px] font-medium text-secondary group-open:hidden">
            Read full story
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
          </span>
        </summary>
        <button
          type="button"
          onClick={(e) =>
            (e.currentTarget.closest('details') as HTMLDetailsElement).open = false
          }
          className="mt-1 inline-flex cursor-pointer items-center gap-1 font-ui text-[11px] font-medium text-secondary"
        >
          Show less
          <ChevronDown className="h-3 w-3 rotate-180" aria-hidden="true" />
        </button>
      </details>

      {it.outcome && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent/25 bg-accent-muted/50 p-3">
          <BriefcaseBusiness className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
          <p className="font-ui text-[11px] text-foreground">
            <span className="font-semibold">Outcome: {OUTCOME_LABELS[it.outcome.status]}</span>
            {it.outcome.details && (
              <span className="block text-muted-foreground">{it.outcome.details}</span>
            )}
          </p>
        </div>
      )}

      {it.advice && (
        <p className="mt-3 border-l-2 border-accent pl-3 font-ui text-[11px] italic text-muted-foreground">
          Advice: {it.advice}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-ui text-[11px] font-medium text-muted-foreground">
          <ThumbsUp className="h-3 w-3" aria-hidden="true" />
          {it.helpfulCount} found this helpful
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1 font-ui text-[11px] font-medium capitalize text-muted-foreground">
          {RECOMMENDATION_LABELS[it.recommendation]}
        </span>
      </div>
    </article>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6L12 2z" />
    </svg>
  )
}
