import type { Metadata } from 'next'
import { auth } from '@/auth'
import { User } from '@/lib/db/models/user'
import { connectMongoose } from '@/lib/db/mongoose'
import { redirect } from 'next/navigation'
import { ExploreClient, type ViewerLevel } from '@/components/dashboard/explore-client'

export const metadata: Metadata = {
  title: 'Explore — UniLens',
}

export default async function ExplorePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectMongoose()
  const user = await User.findById(session.user.id)
    .select('academicLevel onboardingCompleted')
    .lean()
  if (!user) redirect('/login')
  if (!user.onboardingCompleted) redirect('/onboarding')

  const viewerLevel: ViewerLevel =
    user.academicLevel === 'graduate' ? 'graduate' : 'undergraduate'

  return <ExploreClient viewerLevel={viewerLevel} />
}
