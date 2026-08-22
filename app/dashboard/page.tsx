import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  GraduationCap,
  BookOpen,
  University,
  LibraryBig,
  CalendarDays,
  MessageSquareText,
  HandHeart,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { auth } from '@/auth'
import { User } from '@/lib/db/models/user'
import { connectMongoose } from '@/lib/db/mongoose'
import { PortalCountdown } from '@/components/dashboard/portal-countdown'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  await connectMongoose()
  const user = await User.findById(session.user.id).lean()
  if (!user) redirect('/login')
  if (!user.onboardingCompleted) redirect('/onboarding')

  const isGraduate = user.academicLevel === 'graduate'
  const firstName = user.name.split(' ')[0]

  const infoCards = [
    {
      icon: isGraduate ? BookOpen : GraduationCap,
      label: 'Academic status',
      value: isGraduate ? 'Graduate / Alumni' : 'Undergraduate',
    },
    { icon: University, label: 'University', value: user.university ?? '—' },
    { icon: LibraryBig, label: 'Program', value: user.program ?? '—' },
    {
      icon: CalendarDays,
      label: isGraduate ? 'Graduated' : 'Expected graduation',
      value: user.graduationYear ? String(user.graduationYear) : '—',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-heading-md font-semibold text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="text-body-sm mt-1 text-muted-foreground">
          Here&apos;s your UniLens dashboard.
        </p>
      </div>

      {/* Academic info */}
      <section aria-label="Academic information" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {infoCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <card.icon
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
            <p className="text-label mt-3 text-muted-foreground">{card.label}</p>
            <p className="mt-1 font-ui text-sm font-semibold text-foreground">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      {/* Level-specific panel */}
      <LevelPanel isGraduate={isGraduate} firstName={firstName} />

      <PortalCountdown />
    </div>
  )
}

function LevelPanel({
  isGraduate,
  firstName,
}: {
  isGraduate: boolean
  firstName: string
}) {
  if (isGraduate) {
    return (
      <section
        aria-labelledby="grad-panel-heading"
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <HandHeart className="h-5 w-5 text-accent" aria-hidden="true" />
          <h2
            id="grad-panel-heading"
            className="text-heading-sm font-semibold text-foreground"
          >
            Alumni insights, {firstName}
          </h2>
        </div>
        <p className="text-body-sm mt-3 max-w-2xl text-muted-foreground">
          You&apos;ve walked the path future students are trying to choose. As a
          graduate, you can share how your program shaped your career, what you
          wish you knew before applying, and mentor the next generation.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ActionCard
            icon={MessageSquareText}
            title="Share your career journey"
            description="Write about life after graduation — jobs, higher studies, or entrepreneurship."
            href="/dashboard/experiences/new"
          />
          <ActionCard
            icon={Sparkles}
            title="Browse the community"
            description="Read experiences from other students and alumni across universities."
            href="/dashboard/experiences"
          />
        </div>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="ug-panel-heading"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-5 w-5 text-accent" aria-hidden="true" />
        <h2
          id="ug-panel-heading"
          className="text-heading-sm font-semibold text-foreground"
        >
          Your student experience, {firstName}
        </h2>
      </div>
      <p className="text-body-sm mt-3 max-w-2xl text-muted-foreground">
        You&apos;re living university life right now — the hostels, the
        societies, the exams, the food. When admissions open in May 2027,
        thousands of students will rely on honest reviews like yours to make one
        of the biggest decisions of their lives.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <ActionCard
          icon={LibraryBig}
          title="Review your program"
          description="Curriculum quality, workload, faculty — tell it like it is."
          href="/dashboard/experiences/new"
        />
        <ActionCard
          icon={University}
          title="Review campus life"
          description="Hostels, societies, food, facilities and everything in between."
          href="/dashboard/experiences/new"
        />
      </div>
    </section>
  )
}

function ActionCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ElementType
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-background p-5 transition-colors duration-[var(--duration-normal)] hover:border-primary/40"
    >
      <div className="flex items-center justify-between gap-2">
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
      <p className="mt-3 font-ui text-sm font-semibold text-foreground">
        {title}
      </p>
      <p className="text-body-sm mt-1 text-muted-foreground">{description}</p>
    </Link>
  )
}
