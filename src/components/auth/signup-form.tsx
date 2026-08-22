'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
  AlertCircle,
  Check,
  GraduationCap,
} from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { GoogleIcon } from '@/components/auth/google-icon'
import { isAcademicEmail, extractDomain } from '@/lib/auth/academic-email'

type Status = 'idle' | 'loading' | 'google-loading' | 'success'

function passwordChecks(password: string) {
  return [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
  ]
}

export function SignupForm() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const checks = useMemo(() => passwordChecks(password), [password])
  const isAcademic = useMemo(() => isAcademicEmail(email), [email])

  const clientValid =
    name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(email) &&
    checks.every((c) => c.valid) &&
    password === confirmPassword

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!clientValid) {
      setError('Please fix the highlighted fields before continuing.')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, password }),
      })
      const data = await res.json()

      if (!res.ok && res.status !== 202) {
        setStatus('idle')
        setError(data.error ?? 'Unable to create account. Please try again.')
        return
      }

      // Auto sign-in after successful signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setStatus('idle')
        router.push('/login')
        return
      }

      setStatus('success')
      router.push('/dashboard')
      router.refresh()
    } catch {
      setStatus('idle')
      setError('Network error. Please check your connection and try again.')
    }
  }

  async function handleGoogle() {
    setError(null)
    setStatus('google-loading')
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const busy = status === 'loading' || status === 'google-loading'

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="text-heading-md font-semibold text-foreground">
          Create your account
        </h1>
        <p className="text-body-sm mt-2 text-muted-foreground">
          Join students sharing real university experiences
        </p>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-3 font-ui text-sm font-medium text-foreground transition-all duration-[var(--duration-normal)] hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'google-loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon className="h-5 w-5" />
        )}
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-label text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Full name
            </label>
            <div className="relative">
              <User
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ayesha Khan"
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)] placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu.pk"
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)] placeholder:text-muted-foreground/60"
              />
            </div>
            {isAcademic && (
              <p className="mt-1.5 flex items-center gap-1.5 font-ui text-xs font-medium text-secondary">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                Student email detected ({extractDomain(email)})
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-12 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)] placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-muted-foreground transition-colors duration-[var(--duration-fast)] hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {password.length > 0 && (
              <ul className="mt-2 space-y-1">
                {checks.map((check) => (
                  <li
                    key={check.label}
                    className={`flex items-center gap-1.5 font-ui text-xs ${
                      check.valid ? 'text-secondary' : 'text-muted-foreground'
                    }`}
                  >
                    <Check className="h-3 w-3" aria-hidden="true" />
                    {check.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="text-label mb-1.5 block text-muted-foreground"
            >
              Confirm password
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full rounded-lg border bg-background py-3 pl-10 pr-4 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)] placeholder:text-muted-foreground/60 ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-destructive'
                    : 'border-border'
                }`}
              />
            </div>
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

        <button
          type="submit"
          disabled={busy || (!clientValid && status === 'idle')}
          className="btn-splash mt-6 flex w-full cursor-pointer items-center justify-center rounded-lg py-3 font-ui text-sm font-semibold text-accent-foreground shadow-md transition-transform duration-[var(--duration-fast)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="btn-content flex items-center gap-2">
            {status === 'loading' && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            Create account
          </span>
        </button>
      </form>

      <p className="text-body-sm mt-8 text-center text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-ui font-medium text-secondary underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
