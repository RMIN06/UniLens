import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { User } from '@/lib/db/models/user'
import { connectMongoose } from '@/lib/db/mongoose'
import { OnboardingForm } from '@/components/dashboard/onboarding-form'

export const metadata: Metadata = {
  title: 'Complete your profile — UniLens',
}

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectMongoose()
  const user = await User.findById(session.user.id).lean()
  if (!user) redirect('/login')
  if (user.onboardingCompleted) redirect('/dashboard')

  return (
    <OnboardingForm
      name={user.name}
      email={user.email}
      isStudent={user.isStudent}
      universityDomain={user.universityDomain ?? undefined}
    />
  )
}
