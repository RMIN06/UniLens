import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { User } from '@/lib/db/models/user'
import { connectMongoose } from '@/lib/db/mongoose'
import { ExperiencesBrowser } from '@/components/dashboard/experiences-browser'

export const metadata: Metadata = {
  title: 'Experiences — UniLens',
}

export default async function ExperiencesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectMongoose()
  const user = await User.findById(session.user.id)
    .select('onboardingCompleted')
    .lean()
  if (!user) redirect('/login')
  if (!user.onboardingCompleted) redirect('/onboarding')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-heading-md font-semibold text-foreground">
            Experiences
          </h1>
          <p className="text-body-sm mt-1 max-w-2xl text-muted-foreground">
            Real stories from undergraduates and graduates. Every detailed
            review published now will be waiting for the students who arrive in
            May 2027.
          </p>
        </div>
        <Link
          href="/dashboard/experiences/new"
          className="btn-splash flex cursor-pointer items-center rounded-lg px-5 py-3 font-ui text-sm font-semibold text-accent-foreground shadow-md transition-transform duration-[var(--duration-fast)] hover:-translate-y-px"
        >
          <span className="btn-content">Share your experience</span>
        </Link>
      </div>

      <ExperiencesBrowser />
    </div>
  )
}
