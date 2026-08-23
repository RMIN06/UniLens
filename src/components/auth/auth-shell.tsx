import Link from 'next/link'

export function AuthShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Subtle academic backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(30,58,95,0.06), transparent 40%), radial-gradient(circle at 80% 80%, rgba(161,98,7,0.05), transparent 40%)',
        }}
      />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex cursor-pointer items-center justify-center gap-2 text-primary transition-opacity duration-[var(--duration-fast)] hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="h-8 w-8 rounded-lg object-contain"
            aria-hidden="true"
          />
          <span className="font-display text-2xl font-semibold tracking-tight">
            UniLens
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg sm:p-10">
          {children}
        </div>
      </div>
    </div>
  )
}
