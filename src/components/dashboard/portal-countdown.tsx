'use client'

import { useEffect, useState } from 'react'
import { Lock, CalendarClock } from 'lucide-react'

const PORTAL_OPEN_DATE = new Date('2027-05-01T00:00:00')

function getTimeLeft() {
  const diff = Math.max(0, PORTAL_OPEN_DATE.getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function PortalCountdown() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = time
    ? [
        { label: 'Days', value: time.days },
        { label: 'Hours', value: time.hours },
        { label: 'Mins', value: time.minutes },
        { label: 'Secs', value: time.seconds },
      ]
    : []

  return (
    <section
      aria-labelledby="portal-heading"
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-md"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(30,58,95,0.03) 12px, rgba(30,58,95,0.03) 24px)',
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-accent" aria-hidden="true" />
          <span className="text-label text-muted-foreground">
            Coming soon — May 2027
          </span>
        </div>

        <h2
          id="portal-heading"
          className="text-heading-sm mt-2 font-semibold text-foreground"
        >
          Prospective Students Portal
        </h2>
        <p className="text-body-sm mt-2 max-w-lg text-muted-foreground">
          When the new admission season opens in May 2027, future students will
          be able to browse honest reviews and connect with undergraduates and
          graduates like you. Your insights will be waiting for them.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex items-center gap-2 font-ui text-sm text-muted-foreground">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            Opens 1 May 2027
          </div>
          <div
            className="flex items-center gap-4 font-ui"
            aria-label="Time until portal opens"
          >
            {units.map((u) => (
              <div key={u.label} className="text-center">
                <div className="min-w-[2.5rem] rounded-lg border border-border bg-background px-2 py-1.5 text-lg font-semibold tabular-nums text-foreground">
                  {String(u.value).padStart(2, '0')}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {u.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
