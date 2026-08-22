'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GitBranch, X, Link, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '0px' });

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why Real Experience', href: '#value-prop' },
    { label: 'Ranking Methodology', href: '#ranking-table' },
  ];

  const resourceLinks = [
    { label: 'Student Stories', href: '#' },
    { label: 'University Guides', href: '#' },
    { label: 'Career Outcomes', href: '#' },
    { label: 'Help Center', href: '#' },
  ];

  const legalLinks = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Accessibility', href: '#' },
  ];

  const socialLinks = [
    { icon: X, label: 'X', href: '#' },
    { icon: GitBranch, label: 'GitHub', href: '#' },
    { icon: Link, label: 'LinkedIn', href: '#' },
    { icon: Mail, label: 'Email', href: 'mailto:hello@unilens.app' },
  ];

  return (
    <footer
      ref={footerRef}
      className={cn(
        'relative bg-background border-t border-border',
        className
      )}
      role="contentinfo"
      aria-labelledby="footer-heading"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <h2 id="footer-heading" className="font-display text-heading-md text-foreground mb-4">
              UniLens
            </h2>
            <p className="font-body text-body-md text-muted-foreground max-w-sm leading-relaxed mb-6">
              Real student experience. Real university choices. A living ecosystem where graduates guide the next generation.
            </p>
            <div className="flex items-center gap-4" role="list" aria-label="Social links">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/40 transition-all duration-normal"
                    aria-label={social.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Platform navigation">
            <h3 className="font-ui text-label text-foreground uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-3" role="list">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-body-md text-muted-foreground hover:text-foreground hover:text-accent transition-colors duration-fast"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h3 className="font-ui text-label text-foreground uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3" role="list">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-body-md text-muted-foreground hover:text-foreground hover:text-accent transition-colors duration-fast"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <p className="font-body text-body-sm text-muted-foreground">
            © {currentYear} UniLens. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-body-sm text-muted-foreground hover:text-foreground hover:text-accent transition-colors duration-fast"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}