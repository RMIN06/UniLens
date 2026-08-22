import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { User, GraduationCap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — UniLens',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            className="mx-auto h-16 w-16 rounded-full border border-border object-cover"
          />
        ) : (
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <User className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </span>
        )}
        <h1 className="text-heading-sm mt-4 font-semibold text-foreground">
          Welcome, {session.user.name}
        </h1>
        <p className="text-body-sm mt-1 text-muted-foreground">
          {session.user.email}
        </p>
        {session.user.isStudent && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 font-ui text-xs font-medium text-secondary">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
            Verified student domain
          </span>
        )}
      </div>
    </div>
  )
}
