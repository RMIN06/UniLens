import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { User } from '@/lib/db/models/user'
import { connectMongoose } from '@/lib/db/mongoose'
import { ProfileForm } from '@/components/dashboard/profile-form'

export const metadata: Metadata = {
  title: 'Profile — UniLens',
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectMongoose()
  const user = await User.findById(session.user.id).lean()
  if (!user) redirect('/login')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-md font-semibold text-foreground">
          Profile
        </h1>
        <p className="text-body-sm mt-1 text-muted-foreground">
          Manage your account details and academic information.
        </p>
      </div>

      <ProfileForm
        initial={{
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          academicLevel: user.academicLevel ?? 'undergraduate',
          university: user.university ?? '',
          program: user.program ?? '',
          graduationYear: user.graduationYear ?? null,
          secondaryStream: user.secondaryStream ?? null,
          secondaryGrade: user.secondaryGrade ?? '',
          higherStream: user.higherStream ?? null,
          higherGrade: user.higherGrade ?? '',
          isStudent: user.isStudent,
          universityDomain: user.universityDomain ?? null,
          providers: user.providers ?? [],
        }}
      />
    </div>
  )
}
