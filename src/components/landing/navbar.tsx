'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, GraduationCap, BookOpen, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { scrollY } = useScroll();
  const scrolledProgress = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Universities', href: '#universities' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why Experience', href: '#why-experience' },
    { label: 'Rankings', href: '#rankings' },
  ];

  if (!mounted) {
    return (
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-normal',
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18" />
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-normal',
        isScrolled ? 'bg-background/80 backdrop-blur-[var(--blur-glass)] border-b border-border/50 shadow-sm' : 'bg-transparent',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
      style={{ backdropFilter: isScrolled ? 'var(--blur-glass)' : 'none' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-heading-md text-foreground hover:opacity-80 transition-opacity"
            aria-label="UniLens Home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="UniLens logo"
              className="w-9 h-9 rounded-xl object-contain"
              aria-hidden="true"
            />
            <span className="hidden sm:block font-semibold">UniLens</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-ui text-label text-muted-foreground hover:text-foreground transition-colors duration-fast relative"
              >
                {link.label}
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-normal ease-out"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="btn-fill px-6 py-2.5 font-ui text-label text-muted-foreground hover:text-foreground transition-colors duration-fast min-h-[44px] flex items-center justify-center"
            >
              <span className="btn-content">Login</span>
            </Link>
            <Link
              href="/signup"
              className="btn-splash px-6 py-2.5 font-ui text-label text-accent-foreground rounded-md min-h-[44px] flex items-center justify-center"
            >
              <span className="btn-content">Sign Up</span>
            </Link>
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          id="mobile-menu"
          className="md:hidden overflow-hidden bg-background border-t border-border"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="py-6 space-y-4 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block font-ui text-body-md text-muted-foreground hover:text-foreground transition-colors duration-fast py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex flex-col gap-3">
              <Link
                href="/login"
                className="btn-fill px-6 py-3 font-ui text-label text-muted-foreground hover:text-foreground transition-colors duration-fast min-h-[44px] flex items-center justify-center text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="btn-content">Login</span>
              </Link>
              <Link
                href="/signup"
                className="btn-splash px-6 py-3 font-ui text-label text-accent-foreground rounded-md min-h-[44px] flex items-center justify-center text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="btn-content">Sign Up</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}