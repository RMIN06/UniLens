'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Loader2,
  ThumbsUp,
  Pencil,
  Trash2,
  BriefcaseBusiness,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

const RECOMMENDATION_LABELS: Record<string, string> = {
  'highly-recommend': 'Highly recommend',
  recommend: 'Recommend',
  neutral: 'Neutral',
  'not-recommended': 'Not recommended',
}

const RECOMMENDATION_STYLES: Record<string, string> = {
  'highly-recommend': 'bg-secondary/10 text-secondary border-secondary/30',
  recommend: 'bg-secondary/5 text-secondary/80 border-secondary/20',
  neutral: 'bg-muted text-muted-foreground border-border',
  'not-recommended': 'bg-destructive/10 text-destructive border-destructive/30',
}

const OUTCOME_LABELS: Record<string, string> = {
  employed: 'Employed',
  'higher-study': 'Further study',
  entrepreneurship: 'Entrepreneurship',
  'still-searching': 'Still searching',
  other: 'Other path',
}

export function ExperiencesBrowser() {
  const [tab, setTab] = useState<'browse' | 'mine'>('browse')
  const [level, setLevel] = useState('all')
  const [university, setUniversity] = useState('')
  const [program, setProgram] = useState('')
  const [sort, setSort] = useState('recent')
  const [items, setItems] = useState<ExperienceItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchItems = useCallback(
    async (targetPage: number, append: boolean) => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (tab === 'mine') params.set('mine', 'true')
        if (level !== 'all') params.set('level', level)
        if (university) params.set('university', university)
        if (program) params.set('program', program)
        params.set('sort', sort)
        params.set('page', String(targetPage))

        const res = await fetch(`/api/experiences?${params.toString()}`)
        if (!res.ok) throw new Error()
        const data = await res.json()

        setItems((prev) => (append ? [...prev, ...data.experiences] : data.experiences))
        setTotal(data.total)
        setPage(data.page)
        setHasMore(data.hasMore)

        if (!append && tab === 'browse') {
          // Optimistically keep client-side vote state for fresh lists
          setVotedIds(new Set())
        }
      } catch {
        // keep previous list on transient errors
      } finally {
        setLoading(false)
      }
    },
    [tab, level, university, program, sort]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchItems(1, false), 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [fetchItems])

  async function handleHelpful(id: string) {
    const res = await fetch(`/api/experiences/${id}/helpful`, { method: 'POST' })
    if (!res.ok) return
    const data = await res.json()
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, helpfulCount: data.helpfulCount } : it
      )
    )
    setVotedIds((prev) => {
      const next = new Set(prev)
      if (data.voted) next.add(id)
      else next.delete(id)
      return next
    })
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this experience? This cannot be undone.')) return
    const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' })
    if (res.ok) setItems((prev) => prev.filter((it) => it.id !== id))
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1 shadow-sm sm:inline-flex">
        {(
          [
            { key: 'browse', label: 'Browse all' },
            { key: 'mine', label: 'My experiences' },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={cn(
              'flex-1 cursor-pointer rounded-lg px-4 py-2 font-ui text-sm font-medium transition-colors duration-[var(--duration-fast)] sm:flex-none',
              tab === t.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters — browse only */}
      {tab === 'browse' && (
        <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-4">
          <div>
            <label htmlFor="exp-filter-level" className="text-label mb-1.5 block text-muted-foreground">
              Status
            </label>
            <select
              id="exp-filter-level"
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
            <label htmlFor="exp-filter-uni" className="text-label mb-1.5 block text-muted-foreground">
              University
            </label>
            <input
              id="exp-filter-uni"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g. NUST"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          <div>
            <label htmlFor="exp-filter-prog" className="text-label mb-1.5 block text-muted-foreground">
              Program
            </label>
            <input
              id="exp-filter-prog"
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          <div>
            <label htmlFor="exp-sort" className="text-label mb-1.5 block text-muted-foreground">
              Sort by
            </label>
            <select
              id="exp-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-border bg-background px-3 py-2.5 font-ui text-sm text-foreground"
            >
              <option value="recent">Most recent</option>
              <option value="helpful">Most helpful</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>
      )}

      <p className="mt-4 font-ui text-sm text-muted-foreground" role="status">
        {loading && items.length === 0
          ? 'Loading…'
          : `${total} experience${total === 1 ? '' : 's'}`}
      </p>

      {/* List */}
      <ul className="mt-2 space-y-4">
        {items.map((it) => (
          <li key={it.id}>
            <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-ui text-xs font-medium text-muted-foreground">
                      {it.displayName}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 font-ui text-[11px] font-medium capitalize text-muted-foreground">
                      {it.academicLevel ?? 'student'}
                    </span>
                    <span className="font-ui text-[11px] text-muted-foreground">
                      {new Date(it.createdAt).toLocaleDateString()}
                      {it.editedAt ? ' · edited' : ''}
                    </span>
                  </div>
                  <h2 className="text-heading-sm mt-2 font-semibold text-foreground">
                    {it.title}
                  </h2>
                  <p className="text-body-sm mt-0.5 text-muted-foreground">
                    {it.program} · {it.university}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent-muted px-3 py-1.5 font-ui text-sm font-bold text-accent dark:text-accent">
                    <StarIcon />
                    {it.overallRating}/10
                  </span>
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-0.5 font-ui text-[11px] font-medium',
                      RECOMMENDATION_STYLES[it.recommendation]
                    )}
                  >
                    {RECOMMENDATION_LABELS[it.recommendation]}
                  </span>
                </div>
              </div>

              {/* Category ratings */}
              {it.categoryRatings &&
                Object.values(it.categoryRatings).some(Boolean) && (
                  <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                    {Object.entries(it.categoryRatings)
                      .filter(([, v]) => v)
                      .map(([key, value]) => (
                        <div key={key}>
                          <dt className="truncate font-ui text-[11px] capitalize text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </dt>
                          <dd className="font-ui text-sm font-semibold text-foreground">
                            {value}/10
                          </dd>
                        </div>
                      ))}
                  </dl>
                )}

              {/* Story with expand */}
              <details className="group mt-4">
                <summary className="cursor-pointer list-none font-ui text-sm leading-relaxed text-foreground [&::-webkit-details-marker]:hidden">
                  <span className="line-clamp-3 group-open:line-clamp-none">
                    {it.story}
                  </span>
                  <span className="mt-1 inline-flex cursor-pointer items-center gap-1 font-ui text-xs font-medium text-secondary group-open:hidden">
                    Read full story
                    <ChevronDown className="h-3 w-3" aria-hidden="true" />
                  </span>
                </summary>
                <button
                  type="button"
                  onClick={(e) =>
                    (e.currentTarget.closest('details') as HTMLDetailsElement).open =
                      false
                  }
                  className="mt-1 inline-flex cursor-pointer items-center gap-1 font-ui text-xs font-medium text-secondary"
                >
                  Show less
                  <ChevronDown className="h-3 w-3 rotate-180" aria-hidden="true" />
                </button>
              </details>

              {/* Pros / cons */}
              {(it.pros.length > 0 || it.cons.length > 0) && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {it.pros.length > 0 && (
                    <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4">
                      <h3 className="text-label text-secondary">Pros</h3>
                      <ul className="mt-1.5 space-y-1">
                        {it.pros.map((p, i) => (
                          <li key={i} className="font-ui text-xs text-foreground">
                            + {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {it.cons.length > 0 && (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                      <h3 className="text-label text-destructive">Cons</h3>
                      <ul className="mt-1.5 space-y-1">
                        {it.cons.map((c, i) => (
                          <li key={i} className="font-ui text-xs text-foreground">
                            − {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Outcome */}
              {it.outcome && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent/25 bg-accent-muted/50 p-4">
                  <BriefcaseBusiness
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <p className="font-ui text-xs text-foreground">
                    <span className="font-semibold">
                      Outcome: {OUTCOME_LABELS[it.outcome.status]}
                      {it.outcome.fieldRelevance === 'directly'
                        ? ' · field-relevant'
                        : it.outcome.fieldRelevance === 'partially'
                          ? ' · partially related'
                          : ' · unrelated to degree'}
                    </span>
                    {it.outcome.details && (
                      <span className="block text-muted-foreground">
                        {it.outcome.details}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Advice */}
              {it.advice && (
                <p className="mt-4 border-l-2 border-accent pl-3 font-ui text-xs italic text-muted-foreground">
                  Advice: {it.advice}
                </p>
              )}

              {/* Footer actions */}
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                {!it.isOwn ? (
                  <button
                    type="button"
                    onClick={() => handleHelpful(it.id)}
                    aria-pressed={votedIds.has(it.id)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 font-ui text-xs font-medium transition-colors duration-[var(--duration-fast)]',
                      votedIds.has(it.id)
                        ? 'border-secondary bg-secondary/10 text-secondary'
                        : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                    Helpful ({it.helpfulCount})
                  </button>
                ) : (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 font-ui text-[11px] font-medium text-primary">
                    Your post
                  </span>
                )}

                {it.isOwn && (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/experiences/${it.id}/edit`}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-ui text-xs font-medium text-muted-foreground transition-colors duration-[var(--duration-fast)] hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(it.id)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-ui text-xs font-medium text-muted-foreground transition-colors duration-[var(--duration-fast)] hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div className="mt-2 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="font-ui text-sm font-medium text-foreground">
            {tab === 'mine'
              ? 'You have not shared an experience yet.'
              : 'No experiences match your filters yet.'}
          </p>
          {tab === 'mine' && (
            <Link
              href="/dashboard/experiences/new"
              className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-accent px-5 py-2.5 font-ui text-sm font-semibold text-accent-foreground shadow-md transition-transform duration-[var(--duration-fast)] hover:-translate-y-px"
            >
              Write the first one
            </Link>
          )}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => fetchItems(page + 1, true)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 font-ui text-sm font-medium text-foreground shadow-sm transition-colors duration-[var(--duration-fast)] hover:bg-muted disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            Load more
          </button>
        </div>
      )}
    </div>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6L12 2z" />
    </svg>
  )
}
