import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { auth } from '@/auth'
import { User } from '@/lib/db/models/user'
import { connectMongoose } from '@/lib/db/mongoose'
import { SignOutButton } from '@/components/dashboard/sign-out-button'
import { SidebarNav, type NavItem } from '@/components/dashboard/sidebar-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return <>{children}</>
  }

  await connectMongoose()
  const user = (await User.findById(session.user.id)
    .select('name email image academicLevel')
    .lean()) as {
    name?: string
    email?: string
    image?: string | null
    academicLevel?: string | null
  } | null

  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Overview', icon: 'layout' },
    { href: '/dashboard/explore', label: 'Explore', icon: 'compass' },
    { href: '/dashboard/experiences', label: 'Experiences', icon: 'message' },
    { href: '/dashboard/profile', label: 'Profile', icon: 'user' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-[var(--blur-glass)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-2 text-primary transition-opacity duration-[var(--duration-fast)] hover:opacity-80"
          >
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
            <span className="font-display text-xl font-semibold tracking-tight">
              UniLens
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden font-ui text-sm text-muted-foreground sm:block">
              {user?.name}
            </span>
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=""
                className="h-8 w-8 rounded-full border border-border object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-ui text-xs font-semibold text-primary-foreground">
                {(user?.name ?? 'U').charAt(0).toUpperCase()}
              </span>
            )}
            <SignOutButton compact />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <SidebarNav items={navItems} />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="md:hidden">
            <SidebarNav items={navItems} horizontal />
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
