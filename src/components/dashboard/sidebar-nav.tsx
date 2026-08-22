'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, User, Compass, MessageSquareText } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NavItem = {
  href: string
  label: string
  icon: 'layout' | 'user' | 'compass' | 'message'
}

const ICONS = {
  layout: LayoutDashboard,
  user: User,
  compass: Compass,
  message: MessageSquareText,
} as const

export function SidebarNav({
  items,
  horizontal,
}: {
  items: NavItem[]
  horizontal?: boolean
}) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'flex gap-1',
        horizontal ? 'flex-row overflow-x-auto pb-2 md:hidden' : 'flex-col'
      )}
      aria-label="Dashboard navigation"
    >
      {items.map((item) => {
        const active =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
        const Icon = ICONS[item.icon]
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex shrink-0 cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-ui text-sm font-medium transition-colors duration-[var(--duration-fast)]',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
