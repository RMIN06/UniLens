'use client';

import { useEffect, useRef, useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'unilens-cookie-preferences';

interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  savedAt: string;
}

function loadPreferences(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CookiePreferences) : null;
  } catch {
    return null;
  }
}

function savePreferences(prefs: Omit<CookiePreferences, 'savedAt'>) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...prefs, savedAt: new Date().toISOString() })
    );
  } catch {
    // storage unavailable — preferences won't persist
  }
  window.dispatchEvent(new CustomEvent('unilens-cookie-preferences-saved'));
}

const categories = [
  {
    id: 'necessary' as const,
    title: 'Strictly Necessary',
    description:
      'Required for the platform to function — authentication, security, and your core preferences. These cannot be disabled.',
    locked: true,
  },
  {
    id: 'analytics' as const,
    title: 'Analytics',
    description:
      'Help us understand how the platform is used so we can improve features, content, and performance.',
    locked: false,
  },
  {
    id: 'marketing' as const,
    title: 'Marketing & Preferences',
    description:
      'Used to remember your interests and, with your consent, show relevant updates about UniLens.',
    locked: false,
  },
];

export function CookiePreferencesButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefs = loadPreferences();
    if (prefs) {
      setAnalytics(prefs.analytics);
      setMarketing(prefs.marketing);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
    };
  }, [open]);

  const handleSave = (override?: { analytics: boolean; marketing: boolean }) => {
    savePreferences({
      necessary: true,
      analytics: override ? override.analytics : analytics,
      marketing: override ? override.marketing : marketing,
    });
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'font-body text-body-sm text-muted-foreground hover:text-foreground hover:text-accent transition-colors duration-fast',
          className
        )}
      >
        Cookie Preferences
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-prefs-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-card border border-border shadow-2xl outline-none"
          >
            <div className="flex items-start justify-between gap-4 p-6 pb-0">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-accent shrink-0">
                  <Cookie className="w-5 h-5" aria-hidden="true" />
                </span>
                <h2 id="cookie-prefs-title" className="font-display text-heading-sm text-foreground">
                  Cookie Preferences
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close cookie preferences"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-fast"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <p className="px-6 pt-3 font-body text-body-sm text-muted-foreground leading-relaxed">
              We use cookies to keep UniLens working properly and to improve your experience. Choose
              which categories you&apos;re comfortable with. You can change these at any time from
              this page.
            </p>

            <div className="p-6 space-y-4">
              {categories.map((category) => {
                const checked =
                  category.id === 'necessary'
                    ? true
                    : category.id === 'analytics'
                      ? analytics
                      : marketing;
                return (
                  <div
                    key={category.id}
                    className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4"
                  >
                    <div>
                      <h3 className="font-ui text-label text-foreground mb-1">{category.title}</h3>
                      <p className="font-body text-body-sm text-muted-foreground leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={checked}
                      aria-label={category.title}
                      disabled={category.locked}
                      onClick={() => {
                        if (category.id === 'analytics') setAnalytics((v) => !v);
                        if (category.id === 'marketing') setMarketing((v) => !v);
                      }}
                      className={cn(
                        'relative mt-1 w-11 h-6 rounded-full shrink-0 transition-colors duration-normal',
                        checked ? 'bg-accent' : 'bg-border',
                        category.locked && 'opacity-60 cursor-not-allowed'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-normal',
                          checked && 'translate-x-5'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 p-6 pt-0">
              <button
                type="button"
                onClick={() => handleSave({ analytics: false, marketing: false })}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border font-ui text-label text-foreground hover:bg-muted transition-colors duration-fast"
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={() => handleSave({ analytics: true, marketing: true })}
                className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground font-ui text-label hover:opacity-90 transition-opacity duration-fast"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => handleSave()}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-ui text-label hover:opacity-90 transition-opacity duration-fast"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
