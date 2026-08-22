'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { GoogleIcon } from '@/components/auth/google-icon'

type Status = 'idle' | 'loading' | 'google-loading' | 'success'

const OAUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked:
    'This email is already registered with a password. Sign in with your email and password instead.',
  Configuration:
    'Server configuration error. Please try again later.',
  AccessDenied: 'Sign-in was denied.',
  Verification: 'Sign-in link has expired. Please try again.',
}

function describeOAuthError(code: string): string {
  return OAUTH_ERRORS[code] ?? `Sign-in failed (${code}). Please try again.`
}

export function LoginForm() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Surface OAuth errors that NextAuth appends as ?error= on redirect
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('error')
    if (code) setError(describeOAuthError(code))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setStatus('loading')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setStatus('idle')
      // Generic message — never reveal whether the email exists
      setError(
        result.code === 'credentials_signin'
          ? 'Invalid email or password.'
          : 'Unable to sign in. Please try again.'
      )
      return
    }

    setStatus('success')
    router.push('/dashboard')
    router.refresh()
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
          Welcome back
        </h1>
        <p className="text-body-sm mt-2 text-muted-foreground">
          Sign in to continue your university journey
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
              htmlFor="email"
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
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu.pk"
                className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 font-ui text-sm text-foreground transition-colors duration-[var(--duration-fast)] placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
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
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
          disabled={busy}
          className="btn-splash mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-3 font-ui text-sm font-semibold text-accent-foreground shadow-md transition-transform duration-[var(--duration-fast)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="btn-content flex items-center gap-2">
            {status === 'loading' && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            Sign in
          </span>
        </button>
      </form>

      <p className="text-body-sm mt-8 text-center text-muted-foreground">
        New to UniLens?{' '}
        <Link
          href="/signup"
          className="font-ui font-medium text-secondary underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}
