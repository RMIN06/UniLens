import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Sign in — UniLens',
  description: 'Sign in to UniLens to connect with real university students.',
}

export default function LoginPage() {
  return <LoginForm />
}
