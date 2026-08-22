import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Create account — UniLens',
  description:
    'Join UniLens and connect with real university students sharing honest experiences.',
}

export default function SignupPage() {
  return <SignupForm />
}
