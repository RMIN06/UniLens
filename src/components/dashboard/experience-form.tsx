'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  AlertCircle,
  Plus,
  X,
  ShieldCheck,
  Star,
} from 'lucide-react'
import {
  RECOMMENDATION_LEVELS,
  WOULD_CHOOSE_AGAIN,
  OUTCOME_STATUSES,
  FIELD_RELEVANCE,
  RATING_CATEGORIES,
  EXPERIENCE_MIN_STORY,
  EXPERIENCE_MAX_LIST_ITEMS,
} from '@/lib/experience-options'
import { cn } from '@/lib/utils'

export type ExperienceFormInitial = {
  id?: string
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
    details: string
    fieldRelevance: string
  } | null
  anonymous: boolean
}

const SCALE = Array.from({ length: 10 }, (_, i) => i + 1)

function ListEditor({
  label,
  items,
  setItems,
  placeholder,
}: {
  label: string
  items: string[]
  setItems: (v: string[]) => void
  placeholder: string
}) {
  return (
    <div>
      <span className="text-label mb-1.5 block text-muted-foreground">
        {label}{' '}
        <span className="normal-case tracking-normal">
          (up to {EXPERIENCE_MAX_LIST_ITEMS})
        </span>
      </span>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              maxLength={150}
              onChange={(e) => {
                const next = [...items]
                next[i] = e.target.value
                setItems(next)
              }}
              placeholder={placeholder}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground/60"
            />
            <button
              type="button"
              aria-label={`Remove ${label.toLowerCase()} item`}
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              className="shrink-0 cursor-pointer rounded-lg border border-border px-2.5 text-muted-foreground transition-colors duration-[var(--duration-fast)] hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      {items.length < EXPERIENCE_MAX_LIST_ITEMS && (
        <button
          type="button"
          onClick={() => setItems([...items, ''])}
          className="mt-2 flex cursor-pointer items-center gap-1.5 font-ui text-sm font-medium text-secondary transition-colors duration-[var(--duration-fast)] hover:text-primary"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add point
        </button>
      )}
    </div>
  )
}

export function ExperienceForm({
  initial,
  isGraduate,
  university,
  program,
}: {
  initial?: ExperienceFormInitial
  isGraduate: boolean
  university: string
  program: string
}) {
  const router = useRouter()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [overallRating, setOverallRating] = useState(initial?.overallRating ?? 0)
  const [recommendation, setRecommendation] = useState(initial?.recommendation ?? '')
  const [wouldChooseAgain, setWouldChooseAgain] = useState(
    initial?.wouldChooseAgain ?? ''
  )
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>(
    initial?.categoryRatings ?? {}
  )
  const [story, setStory] = useState(initial?.story ?? '')
  const [pros, setPros] = useState<string[]>(initial?.pros ?? [])
  const [cons, setCons] = useState<string[]>(initial?.cons ?? [])
  const [advice, setAdvice] = useState(initial?.advice ?? '')
  const [hasOutcome, setHasOutcome] = useState(Boolean(initial?.outcome))
  const [outcomeStatus, setOutcomeStatus] = useState(
    initial?.outcome?.status ?? ''
  )
  const [outcomeDetails, setOutcomeDetails] = useState(
    initial?.outcome?.details ?? ''
  )
  const [fieldRelevance, setFieldRelevance] = useState(
    initial?.outcome?.fieldRelevance ?? ''
  )
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState<string | null>(null)

  const valid = useMemo(
    () =>
      title.trim().length >= 10 &&
      overallRating >= 1 &&
      recommendation !== '' &&
      story.trim().length >= EXPERIENCE_MIN_STORY &&
      (!isGraduate || !hasOutcome || (outcomeStatus !== '' && fieldRelevance !== '')),
    [
      title,
      overallRating,
      recommendation,
      story,
      isGraduate,
      hasOutcome,
      outcomeStatus,
      fieldRelevance,
    ]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || status === 'loading') return
    setError(null)
    setStatus('loading')

    try {
      const payload = {
        title: title.trim(),
        overallRating,
        recommendation,
        wouldChooseAgain: wouldChooseAgain || null,
        categoryRatings:
          Object.keys(categoryRatings).length > 0 ? categoryRatings : undefined,
        story: story.trim(),
        pros: pros.map((p) => p.trim()).filter(Boolean),
        cons: cons.map((c) => c.trim()).filter(Boolean),
        advice: advice.trim() || undefined,
        outcome:
          isGraduate && hasOutcome && outcomeStatus && fieldRelevance
            ? {
                status: outcomeStatus,
                details: outcomeDetails.trim() || undefined,
                fieldRelevance,
              }
            : null,
        anonymous: true,
      }

      const res = await fetch(
        initial?.id ? `/api/experiences/${initial.id}` : '/api/experiences',
        {
          method: initial?.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await res.json()

      if (!res.ok) {
        setStatus('idle')
        setError(data.error ?? 'Unable to save. Please try again.')
        return
      }

      router.push('/dashboard/experiences?tab=mine')
      router.refresh()
    } catch {
      setStatus('idle')
      setError('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* About */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-heading-sm font-semibold text-foreground">
          Your experience at {university}
        </h2>
        <p className="text-body-sm mt-1 text-muted-foreground">
          Program: {program}
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="exp-title"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Title — sum it up in one line
            </label>
            <input
              id="exp-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder={
                isGraduate
                  ? 'e.g. Four years of CS at FAST taught me more than I expected'
                  : 'e.g. Two semesters into CS at FAST, here is the honest picture'
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <div>
            <label htmlFor="exp-rating" className="text-label mb-2 block text-muted-foreground">
              Overall rating out of 10
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {SCALE.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setOverallRating(n)}
                  aria-label={`Rate ${n} out of 10`}
                  aria-pressed={overallRating === n}
                  className={cn(
                    'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border font-ui text-sm font-semibold transition-all duration-[var(--duration-fast)]',
                    overallRating >= n
                      ? 'border-accent bg-accent-muted text-accent dark:text-accent'
                      : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/50'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="exp-recommend"
                className="text-label mb-1.5 block text-muted-foreground"
              >
                Recommendation level
              </label>
              <select
                id="exp-recommend"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground"
              >
                <option value="">Select</option>
                {RECOMMENDATION_LEVELS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="exp-again"
                className="text-label mb-1.5 block text-muted-foreground"
              >
                Would you choose this path again?
              </label>
              <select
                id="exp-again"
                value={wouldChooseAgain}
                onChange={(e) => setWouldChooseAgain(e.target.value)}
                className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground"
              >
                <option value="">Select</option>
                {WOULD_CHOOSE_AGAIN.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category ratings */}
          <fieldset>
            <legend className="text-label mb-2 text-muted-foreground">
              Rate by category (optional)
            </legend>
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {RATING_CATEGORIES.map((cat) => (
                <div key={cat.key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-ui text-xs text-foreground">
                      {cat.label}
                    </span>
                    {categoryRatings[cat.key] ? (
                      <span className="font-ui text-xs font-semibold text-accent">
                        {categoryRatings[cat.key]}/10
                      </span>
                    ) : null}
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={categoryRatings[cat.key] ?? 5}
                    onChange={(e) =>
                      setCategoryRatings((prev) => ({
                        ...prev,
                        [cat.key]: Number(e.target.value),
                      }))
                    }
                    className="w-full cursor-pointer accent-[#A16207]"
                    aria-label={`${cat.label} rating`}
                  />
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      {/* Story */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-heading-sm font-semibold text-foreground">
          The full story
        </h2>
        <p className="text-body-sm mt-1 text-muted-foreground">
          What surprised you, what struggled you, what you wish someone had told
          you before day one.
        </p>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={8}
          maxLength={5000}
          placeholder="Describe your routine, teaching quality, workload, exams, the people, hostel or commute, food, expenses…"
          className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60"
        />
        <p
          className={cn(
            'mt-1.5 text-right font-ui text-xs',
            story.trim().length >= EXPERIENCE_MIN_STORY
              ? 'text-secondary'
              : 'text-muted-foreground'
          )}
        >
          {Math.max(0, EXPERIENCE_MIN_STORY - story.trim().length)} characters
          to go for a detailed review
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <ListEditor
            label="Pros"
            items={pros}
            setItems={setPros}
            placeholder="e.g. Strong programming society"
          />
          <ListEditor
            label="Cons"
            items={cons}
            setItems={setCons}
            placeholder="e.g. Limited parking, heavy exam schedule"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="exp-advice"
            className="text-label mb-1.5 block text-muted-foreground"
          >
            One advice for juniors (optional)
          </label>
          <textarea
            id="exp-advice"
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            rows={3}
            maxLength={1500}
            placeholder="If you are about to start this degree, do this one thing…"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground placeholder:text-muted-foreground/60"
          />
        </div>
      </section>

      {/* Outcome — graduates only */}
      {isGraduate && (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-heading-sm font-semibold text-foreground">
            Where did you end up?
          </h2>
          <p className="text-body-sm mt-1 text-muted-foreground">
            Outcome data carries the most weight for future students deciding on
            this field.
          </p>

          <div className="mt-4">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={hasOutcome}
                onChange={(e) => setHasOutcome(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-[#A16207]"
              />
              <span className="font-ui text-sm text-foreground">
                I want to share my career outcome
              </span>
            </label>
          </div>

          {hasOutcome && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="outcome-status"
                  className="text-label mb-1.5 block text-muted-foreground"
                >
                  Current status
                </label>
                <select
                  id="outcome-status"
                  value={outcomeStatus}
                  onChange={(e) => setOutcomeStatus(e.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground"
                >
                  <option value="">Select</option>
                  {OUTCOME_STATUSES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="outcome-relevance"
                  className="text-label mb-1.5 block text-muted-foreground"
                >
                  Is your work related to your degree?
                </label>
                <select
                  id="outcome-relevance"
                  value={fieldRelevance}
                  onChange={(e) => setFieldRelevance(e.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground"
                >
                  <option value="">Select</option>
                  {FIELD_RELEVANCE.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="outcome-details"
                  className="text-label mb-1.5 block text-muted-foreground"
                >
                  Details (optional)
                </label>
                <textarea
                  id="outcome-details"
                  value={outcomeDetails}
                  onChange={(e) => setOutcomeDetails(e.target.value)}
                  rows={3}
                  maxLength={800}
                  placeholder="e.g. Software engineer at a fintech startup in Lahore, six months after graduating"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
          )}
        </section>
      )}

      {/* Privacy */}
      <section className="flex items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary/5 p-5">
        <ShieldCheck
          className="mt-0.5 h-5 w-5 shrink-0 text-secondary"
          aria-hidden="true"
        />
        <div>
          <p className="font-ui text-sm font-medium text-foreground">
            Always anonymous
          </p>
          <p className="text-body-sm mt-1 text-muted-foreground">
            Shown as &ldquo;Anonymous Undergraduate/Graduate&rdquo;. Only you can see and manage this post.
          </p>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <p className="font-ui text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pb-4">
        <Star
          className="hidden h-4 w-4 text-accent sm:block"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={!valid || status === 'loading'}
          className="btn-splash flex cursor-pointer items-center justify-center rounded-lg px-8 py-3 font-ui text-sm font-semibold text-accent-foreground shadow-md transition-transform duration-[var(--duration-fast)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="btn-content flex items-center gap-2">
            {status === 'loading' && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {initial?.id ? 'Save changes' : 'Publish experience'}
          </span>
        </button>
      </div>
    </form>
  )
}
