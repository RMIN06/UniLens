'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function SignOutButton({ compact }: { compact?: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-lg font-ui text-sm font-medium text-muted-foreground transition-colors duration-[var(--duration-fast)] hover:bg-muted hover:text-foreground disabled:opacity-60',
        compact ? 'px-3 py-2' : 'w-full px-3 py-2.5'
      )}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign out
    </button>
  )
}
