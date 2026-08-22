'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GraduationCap,
  BookOpen,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  School,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Level = 'undergraduate' | 'graduate'
type Step = 1 | 2 | 3

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

export function OnboardingForm({
  name,
  email,
  isStudent,
  universityDomain,
}: {
  name: string
  email: string
  isStudent: boolean
  universityDomain?: string
}) {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [level, setLevel] = useState<Level | null>(null)
  const [university, setUniversity] = useState('')
  const [program, setProgram] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [secondaryStream, setSecondaryStream] = useState('')
  const [secondaryGrade, setSecondaryGrade] = useState('')
  const [higherStream, setHigherStream] = useState('')
  const [higherGrade, setHigherGrade] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState<string | null>(null)

  const step1Valid = level !== null
  const step2Valid =
    university.trim().length >= 2 &&
    program.trim().length >= 2 &&
    graduationYear !== ''
  const allValid =
    step1Valid && step2Valid && secondaryStream !== '' && higherStream !== ''

  async function handleSubmit() {
    if (!allValid || status === 'loading') return
    setError(null)
    setStatus('loading')

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academicLevel: level,
          university: university.trim(),
          program: program.trim(),
          graduationYear: Number(graduationYear),
          secondaryStream,
          secondaryGrade: secondaryGrade.trim() || undefined,
          higherStream,
          higherGrade: higherGrade.trim() || undefined,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('idle')
        setStep(1)
        setError(data.error ?? 'Unable to save. Please try again.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setStatus('idle')
      setStep(1)
      setError('Network error. Please check your connection and try again.')
    }
  }

  const levelOptions: {
    value: Level
    title: string
    desc: string
    icon: React.ElementType
  }[] = [
    {
      value: 'undergraduate',
      title: 'Current undergraduate',
      desc: 'I am currently studying for a bachelor’s degree',
      icon: GraduationCap,
    },
    {
      value: 'graduate',
      title: 'Graduate / Alumni',
      desc: 'I have completed my degree and graduated',
      icon: BookOpen,
    },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(30,58,95,0.06), transparent 40%), radial-gradient(circle at 80% 80%, rgba(161,98,7,0.05), transparent 40%)',
        }}
      />

      <div className="relative w-full max-w-xl">
        {/* Progress indicator */}
        <div className="mb-6 flex items-center gap-2" aria-hidden="true">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors duration-[var(--duration-normal)]',
                step >= s ? 'bg-primary' : 'bg-border'
              )}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg sm:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-heading-md font-semibold text-foreground">
              Welcome, {name.split(' ')[0]}
            </h1>
            <p className="text-body-sm mt-2 text-muted-foreground">
              Tell us about your academic journey so we can tailor your
              experience
            </p>
          </div>

          {/* Step 1: status */}
          {step === 1 && (
            <fieldset>
              <legend className="text-label mb-3 text-muted-foreground">
                I am a…
              </legend>
              <div className="space-y-3">
                {levelOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLevel(opt.value)}
                    className={cn(
                      'flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-all duration-[var(--duration-normal)]',
                      level === opt.value
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-background hover:border-muted-foreground/50'
                    )}
                    aria-pressed={level === opt.value}
                  >
                    <opt.icon
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-ui text-sm font-semibold text-foreground">
                        {opt.title}
                      </span>
                      <span className="mt-0.5 block text-body-sm text-muted-foreground">
                        {opt.desc}
                      </span>
                    </span>
                    {level === opt.value && (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-secondary"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}

                {/* Locked pre-university option */}
                <div
                  aria-disabled="true"
                  className="relative flex select-none items-start gap-3 rounded-xl border border-dashed border-border bg-muted/50 p-4 opacity-70"
                >
                  <Lock
                    className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-ui text-sm font-semibold text-muted-foreground">
                      Pre-university student
                    </span>
                    <span className="mt-0.5 block text-body-sm text-muted-foreground">
                      I&apos;m deciding which university to apply to
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-accent-muted px-2.5 py-0.5 font-ui text-xs font-medium text-accent-foreground dark:text-accent">
                    Opens May 2027
                  </span>
                </div>
                <p className="text-center font-ui text-xs text-muted-foreground">
                  The portal for pre-university students goes live next May when
                  admission season begins.
                </p>
              </div>

              {error && <ErrorBanner message={error} />}

              <button
                type="button"
                disabled={!step1Valid}
                onClick={() => setStep(2)}
                className="btn-splash mt-6 flex w-full cursor-pointer items-center justify-center rounded-lg py-3 font-ui text-sm font-semibold text-accent-foreground shadow-md transition-transform duration-[var(--duration-fast)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="btn-content flex items-center gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </fieldset>
          )}

          {/* Step 2: university details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="university"
                  className="text-label mb-1.5 block text-muted-foreground"
                >
                  University
                </label>
                <input
                  id="university"
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder={
                    universityDomain ? `e.g. ${universityDomain}` : 'e.g. FAST NUCES'
                  }
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)] placeholder:text-muted-foreground/60"
                />
              </div>

              <div>
                <label
                  htmlFor="program"
                  className="text-label mb-1.5 block text-muted-foreground"
                >
                  Program / Field of study
                </label>
                <input
                  id="program"
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)] placeholder:text-muted-foreground/60"
                />
              </div>

              <div>
                <label
                  htmlFor="grad-year"
                  className="text-label mb-1.5 block text-muted-foreground"
                >
                  {level === 'graduate'
                    ? 'Graduation year'
                    : 'Expected graduation year'}
                </label>
                <select
                  id="grad-year"
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

              {error && <ErrorBanner message={error} />}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-5 py-3 font-ui text-sm font-medium text-foreground transition-colors duration-[var(--duration-fast)] hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={!step2Valid}
                  onClick={() => setStep(3)}
                  className="btn-splash flex flex-1 cursor-pointer items-center justify-center rounded-lg py-3 font-ui text-sm font-semibold text-accent-foreground shadow-md transition-transform duration-[var(--duration-fast)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="btn-content flex items-center gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: academic background */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="secondary-stream"
                    className="text-label mb-1.5 block text-muted-foreground"
                  >
                    Secondary school
                  </label>
                  <select
                    id="secondary-stream"
                    value={secondaryStream}
                    onChange={(e) => setSecondaryStream(e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)]"
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
                    htmlFor="secondary-grade"
                    className="text-label mb-1.5 block text-muted-foreground"
                  >
                    Grade / Marks{' '}
                    <span className="normal-case tracking-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="secondary-grade"
                    type="text"
                    value={secondaryGrade}
                    onChange={(e) => setSecondaryGrade(e.target.value)}
                    placeholder="e.g. 92% or 7A*"
                    maxLength={20}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)] placeholder:text-muted-foreground/60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="higher-stream"
                    className="text-label mb-1.5 block text-muted-foreground"
                  >
                    Higher secondary / Intermediate
                  </label>
                  <select
                    id="higher-stream"
                    value={higherStream}
                    onChange={(e) => setHigherStream(e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)]"
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
                    htmlFor="higher-grade"
                    className="text-label mb-1.5 block text-muted-foreground"
                  >
                    Grade / Marks{' '}
                    <span className="normal-case tracking-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="higher-grade"
                    type="text"
                    value={higherGrade}
                    onChange={(e) => setHigherGrade(e.target.value)}
                    placeholder="e.g. 88% or AAB"
                    maxLength={20}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)] placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              {/* Anonymity persuasion note */}
              <div className="flex items-start gap-3 rounded-xl border border-secondary/30 bg-secondary/5 p-4">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-secondary"
                  aria-hidden="true"
                />
                <p className="text-body-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Completely anonymous.
                  </span>{' '}
                  Your grades are never shown with your name or profile — they
                  only power anonymous stats like &ldquo;students admitted to{' '}
                  {university.trim() || 'your university'} typically scored
                  X%&rdquo;. Sharing them helps juniors set realistic targets
                  and decide effectively.
                </p>
              </div>

              {error && <ErrorBanner message={error} />}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-5 py-3 font-ui text-sm font-medium text-foreground transition-colors duration-[var(--duration-fast)] hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={!allValid || status === 'loading'}
                  onClick={handleSubmit}
                  className="btn-splash flex flex-1 cursor-pointer items-center justify-center rounded-lg py-3 font-ui text-sm font-semibold text-accent-foreground shadow-md transition-transform duration-[var(--duration-fast)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="btn-content flex items-center gap-2">
                    {status === 'loading' ? (
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <School className="h-4 w-4" aria-hidden="true" />
                    )}
                    Finish setup
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3"
    >
      <AlertCircle
        className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
        aria-hidden="true"
      />
      <p className="font-ui text-sm text-destructive">{message}</p>
    </div>
  )
}
