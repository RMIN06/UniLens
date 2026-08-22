'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Search,
  GraduationCap,
  BookOpen,
  Loader2,
  Users,
  SlidersHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewerLevel = 'undergraduate' | 'graduate'

type PublicUser = {
  id: string
  name: string
  image: string | null
  academicLevel: string | null
  university: string | null
  program: string | null
  graduationYear: number | null
  higherStream: string | null
}

const STREAM_LABELS: Record<string, string> = {
  'fsc-pre-medical': 'FSc Pre-Medical',
  'fsc-pre-engineering': 'FSc Pre-Engineering',
  ics: 'ICS',
  fa: 'FA (Arts)',
  'a-level': 'A-Level',
  other: 'Other',
}

const PAGE_SIZE = 24

export function ExploreClient({ viewerLevel }: { viewerLevel: ViewerLevel }) {
  const defaultLevel = viewerLevel === 'undergraduate' ? 'graduate' : 'undergraduate'

  const [q, setQ] = useState('')
  const [level, setLevel] = useState(defaultLevel)
  const [university, setUniversity] = useState('')
  const [program, setProgram] = useState('')
  const [users, setUsers] = useState<PublicUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-md font-semibold text-foreground">
          Explore profiles
        </h1>
        <p className="text-body-sm mt-1 text-muted-foreground">
          Browse verified students and alumni. Contact details stay private.
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
            placeholder="Search by name, university or degree…"
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
              <article className="flex h-full items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow duration-[var(--duration-normal)] hover:shadow-md">
                {u.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={u.image}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-full border border-border object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-ui text-base font-semibold text-primary">
                    {u.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate font-ui text-sm font-semibold text-foreground">
                      {u.name}
                    </h2>
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
                  </div>
                  <p className="mt-0.5 truncate font-ui text-xs text-muted-foreground">
                    {u.program ?? '—'}
                  </p>
                  <p className="truncate font-ui text-xs text-muted-foreground">
                    {u.university ?? '—'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
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
                  </div>
                </div>
              </article>
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
    </div>
  )
}
