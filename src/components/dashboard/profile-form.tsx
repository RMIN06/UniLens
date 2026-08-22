'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ProfileData = {
  name: string
  email: string
  image: string | null
  academicLevel: 'undergraduate' | 'graduate'
  university: string
  program: string
  graduationYear: number | null
  secondaryStream: string | null
  secondaryGrade: string
  higherStream: string | null
  higherGrade: string
  isStudent: boolean
  universityDomain: string | null
  providers: string[]
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 51 }, (_, i) => CURRENT_YEAR + 10 - i)

const SECONDARY_STREAMS = [
  { value: 'matriculation', label: 'Matriculation' },
  { value: 'o-level', label: 'O-Level' },
]

const HIGHER_STREAMS = [
  { value: 'fsc-pre-medical', label: 'FSc — Pre-Medical' },
  { value: 'fsc-pre-engineering', label: 'FSc — Pre-Engineering' },
  { value: 'ics', label: 'ICS (Computer Science)' },
  { value: 'fa', label: 'FA (Arts / Humanities)' },
  { value: 'a-level', label: 'A-Level' },
  { value: 'other', label: 'Other discipline' },
]

export function ProfileForm({ initial }: { initial: ProfileData }) {
  const router = useRouter()
  const [name, setName] = useState(initial.name)
  const [university, setUniversity] = useState(initial.university)
  const [program, setProgram] = useState(initial.program)
  const [graduationYear, setGraduationYear] = useState(
    initial.graduationYear ? String(initial.graduationYear) : ''
  )
  const [secondaryStream, setSecondaryStream] = useState(initial.secondaryStream ?? '')
  const [secondaryGrade, setSecondaryGrade] = useState(initial.secondaryGrade)
  const [higherStream, setHigherStream] = useState(initial.higherStream ?? '')
  const [higherGrade, setHigherGrade] = useState(initial.higherGrade)
  const [status, setStatus] = useState<'idle' | 'loading' | 'saved'>('idle')
  const [error, setError] = useState<string | null>(null)

  const dirty = useMemo(() => {
    return (
      name !== initial.name ||
      university !== initial.university ||
      program !== initial.program ||
      graduationYear !==
        (initial.graduationYear ? String(initial.graduationYear) : '') ||
      secondaryStream !== (initial.secondaryStream ?? '') ||
      secondaryGrade !== initial.secondaryGrade ||
      higherStream !== (initial.higherStream ?? '') ||
      higherGrade !== initial.higherGrade
    )
  }, [
    name,
    university,
    program,
    graduationYear,
    secondaryStream,
    secondaryGrade,
    higherStream,
    higherGrade,
    initial,
  ])

  const valid =
    name.trim().length >= 2 &&
    university.trim().length >= 2 &&
    program.trim().length >= 2 &&
    graduationYear !== '' &&
    secondaryStream !== '' &&
    higherStream !== ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || status === 'loading') return
    setError(null)
    setStatus('loading')

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          university: university.trim(),
          program: program.trim(),
          graduationYear: Number(graduationYear),
          secondaryStream,
          secondaryGrade: secondaryGrade.trim() || null,
          higherStream,
          higherGrade: higherGrade.trim() || null,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('idle')
        setError(data.error ?? 'Unable to save changes.')
        return
      }

      setStatus('saved')
      router.refresh()
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('idle')
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Account summary */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-heading-sm font-semibold text-foreground">Account</h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-label text-muted-foreground">Email</dt>
            <dd className="mt-1 break-all font-ui text-sm font-medium text-foreground">
              {initial.email}
            </dd>
          </div>
          <div>
            <dt className="text-label text-muted-foreground">Sign-in methods</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {initial.providers.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-border px-2.5 py-0.5 font-ui text-xs font-medium capitalize text-muted-foreground"
                >
                  {p === 'credentials' ? 'Email & password' : p}
                </span>
              ))}
            </dd>
          </div>
          {initial.isStudent && (
            <div>
              <dt className="text-label text-muted-foreground">
                Student verification
              </dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 font-ui text-xs font-medium text-secondary">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                Academic domain ({initial.universityDomain})
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Editable details */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2"
      >
        <h2 className="text-heading-sm font-semibold text-foreground">
          Personal & academic details
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="profile-name"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Full name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)]"
            />
          </div>

          <div>
            <label
              htmlFor="profile-level"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Academic status
            </label>
            <input
              id="profile-level"
              type="text"
              value={
                initial.academicLevel === 'graduate'
                  ? 'Graduate / Alumni'
                  : 'Undergraduate'
              }
              readOnly
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-4 py-3 font-ui text-sm text-muted-foreground opacity-70"
            />
            <p className="mt-1.5 font-ui text-xs text-muted-foreground">
              Contact support to change your academic status.
            </p>
          </div>

          <div>
            <label
              htmlFor="profile-university"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              University
            </label>
            <input
              id="profile-university"
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)]"
            />
          </div>

          <div>
            <label
              htmlFor="profile-program"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Program / Field of study
            </label>
            <input
              id="profile-program"
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)]"
            />
          </div>

          <div>
            <label
              htmlFor="profile-year"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              {initial.academicLevel === 'graduate'
                ? 'Graduation year'
                : 'Expected graduation year'}
            </label>
            <select
              id="profile-year"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)]"
            >
              <option value="">Select year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="profile-secondary-stream"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Secondary school
            </label>
            <select
              id="profile-secondary-stream"
              value={secondaryStream}
              onChange={(e) => setSecondaryStream(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground"
            >
              <option value="">Select</option>
              {SECONDARY_STREAMS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="profile-secondary-grade"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Grade / Marks{' '}
              <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="profile-secondary-grade"
              type="text"
              value={secondaryGrade}
              onChange={(e) => setSecondaryGrade(e.target.value)}
              placeholder="e.g. 92% or 7A*"
              maxLength={20}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <div>
            <label
              htmlFor="profile-higher-stream"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Higher secondary / Intermediate
            </label>
            <select
              id="profile-higher-stream"
              value={higherStream}
              onChange={(e) => setHigherStream(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground"
            >
              <option value="">Select</option>
              {HIGHER_STREAMS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="profile-higher-grade"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Grade / Marks{' '}
              <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="profile-higher-grade"
              type="text"
              value={higherGrade}
              onChange={(e) => setHigherGrade(e.target.value)}
              placeholder="e.g. 88% or AAB"
              maxLength={20}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground placeholder:text-muted-foreground/60"
            />
            <p className="mt-1.5 flex items-center gap-1.5 font-ui text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden="true" />
              Grades are anonymous — never shown on your public profile.
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <p className="font-ui text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={!dirty || !valid || status === 'loading'}
            className="btn-splash flex cursor-pointer items-center justify-center rounded-lg px-6 py-2.5 font-ui text-sm font-semibold text-accent-foreground shadow-md transition-transform duration-[var(--duration-fast)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="btn-content flex items-center gap-2">
              {status === 'loading' && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              Save changes
            </span>
          </button>
          {status === 'saved' && (
            <span className="flex items-center gap-1.5 font-ui text-sm font-medium text-secondary">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
