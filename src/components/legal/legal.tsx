import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegalPageProps {
  title: string;
  updated: string;
  children: React.ReactNode;
  className?: string;
}

export function LegalPage({ title, updated, children, className }: LegalPageProps) {
  return (
    <main className={cn('min-h-screen bg-background', className)}>
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-12 md:py-16 lg:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-ui text-label text-muted-foreground hover:text-foreground transition-colors duration-fast mb-8"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Home
        </Link>
        <header className="mb-10 md:mb-14 pb-8 border-b border-border">
          <h1 className="font-display text-heading-lg text-foreground mb-3">{title}</h1>
          <p className="font-body text-body-md text-muted-foreground">
            UniLens — Pakistan&apos;s Student-Driven University Platform · Last updated:{' '}
            <time dateTime={updated}>{updated}</time>
          </p>
        </header>
        <div className="space-y-10">{children}</div>
      </div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-heading-md text-foreground mb-4">{title}</h2>
      <div className="space-y-4 font-body text-body-md text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="space-y-2 list-disc pl-6 marker:text-accent" role="list">
      {children}
    </ul>
  );
}

export function LegalListItem({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}
