'use client';

import { useEffect, useState } from 'react';
import { LiveCounter } from './live-counter';

export function ExperienceCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/public/experiences/count', {
          next: { revalidate: 60 },
        });
        if (res.ok) {
          const data = await res.json();
          setCount(data.count || 0);
        }
      } catch {
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCount();

    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-baseline gap-2">
        <span className="font-display tabular-nums text-heading-md text-foreground animate-pulse">
          <span className="bg-muted h-8 w-20 rounded" aria-hidden="true" />
        </span>
        <span className="font-ui text-muted-foreground text-body-sm">Verified Experiences</span>
      </div>
    );
  }

  return (
    <LiveCounter
      target={count}
      from={0}
      duration={2000}
      label="Verified Experiences"
      numberClassName="text-heading-md text-foreground"
      labelClassName="text-body-sm"
    />
  );
}