import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { User } from '@/lib/db/models/user'
import { connectMongoose } from '@/lib/db/mongoose'
import { ExperienceForm } from '@/components/dashboard/experience-form'

export const metadata: Metadata = {
  title: 'Share your experience — UniLens',
}

export default async function NewExperiencePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectMongoose()
  const user = await User.findById(session.user.id)
    .select('onboardingCompleted academicLevel university program')
    .lean()
  if (!user) redirect('/login')
  if (!user.onboardingCompleted || !user.university || !user.program) {
    redirect('/onboarding')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-md font-semibold text-foreground">
          Share your experience
        </h1>
        <p className="text-body-sm mt-1 max-w-2xl text-muted-foreground">
          Everything you publish now is stored and will be surfaced to
          pre-university students when their portal opens in May 2027.
        </p>
      </div>

      <ExperienceForm
        isGraduate={user.academicLevel === 'graduate'}
        university={user.university}
        program={user.program}
      />
    </div>
  )
}
