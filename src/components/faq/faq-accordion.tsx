'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-button-${index}`}
                className="flex w-full items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left font-display text-heading-sm text-foreground hover:bg-muted/50 transition-colors duration-fast"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-normal',
                    isOpen && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-button-${index}`}
              hidden={!isOpen}
              className="px-5 md:px-6 pb-5 font-body text-body-md text-muted-foreground leading-relaxed"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
