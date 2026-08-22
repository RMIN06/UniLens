import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/auth'
import { User } from '@/lib/db/models/user'
import { Experience } from '@/lib/db/models/experience'
import { connectMongoose } from '@/lib/db/mongoose'
import {
  ExperienceForm,
  type ExperienceFormInitial,
} from '@/components/dashboard/experience-form'

export const metadata: Metadata = {
  title: 'Edit experience — UniLens',
}

export default async function EditExperiencePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectMongoose()
  const user = await User.findById(session.user.id)
    .select('onboardingCompleted academicLevel university program')
    .lean()
  if (!user) redirect('/login')

  const doc = await Experience.findOne({
    _id: params.id,
    author: session.user.id,
  }).lean()
  if (!doc) notFound()

  const initial: ExperienceFormInitial = {
    id: String(doc._id),
    title: doc.title,
    overallRating: doc.overallRating,
    recommendation: doc.recommendation,
    wouldChooseAgain: doc.wouldChooseAgain ?? null,
    categoryRatings: (doc.categoryRatings as Record<string, number>) ?? null,
    story: doc.story,
    pros: doc.pros ?? [],
    cons: doc.cons ?? [],
    advice: doc.advice ?? '',
    outcome: doc.outcome
      ? {
          status: doc.outcome.status ?? 'other',
          details: doc.outcome.details ?? '',
          fieldRelevance: doc.outcome.fieldRelevance ?? 'partially',
        }
      : null,
    anonymous: doc.anonymous,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-md font-semibold text-foreground">
          Edit experience
        </h1>
      </div>

      <ExperienceForm
        initial={initial}
        isGraduate={user.academicLevel === 'graduate'}
        university={user.university ?? doc.university}
        program={user.program ?? doc.program}
      />
    </div>
  )
}
