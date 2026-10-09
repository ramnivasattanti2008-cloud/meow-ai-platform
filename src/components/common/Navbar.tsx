'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Sparkles, Terminal } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Platform', href: '/platform' },
    { name: 'Voice AI', href: '/voice-ai' },
    { name: 'AI Services', href: '/ai-services' },
    { name: 'Growth', href: '/growth' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08] shadow-subtle'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand Mark */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-lg">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/15 flex items-center justify-center shadow-subtle group-hover:border-violet-500/40 transition-colors">
              {/* MEOW Abstract Signal/Cat Crest */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 17V8.5L8 12.5L12 7L16 12.5L20 8.5V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17Z"
                  fill="currentColor"
                  className="text-white"
                />
                <circle cx="8.5" cy="11.5" r="1" fill="#8b5cf6" />
                <circle cx="15.5" cy="11.5" r="1" fill="#8b5cf6" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-tight text-white flex items-center gap-1.5">
                MEOW <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/40 border border-white/[0.06] rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isActive(link.href)
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/app"
              className="px-3.5 py-2 text-xs font-mono font-medium text-zinc-300 hover:text-white rounded-lg border border-white/10 hover:border-white/20 bg-zinc-900/50 hover:bg-zinc-800/60 transition-all flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-violet-400" />
              <span>Workspace Demo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </Link>

            <Link
              href="/book"
              className="px-4 py-2 text-sm font-medium text-zinc-950 bg-white hover:bg-zinc-100 active:scale-[0.98] rounded-full transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Book Call</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/app"
              className="px-2.5 py-1.5 text-xs font-mono text-zinc-300 rounded-md border border-white/10 bg-zinc-900/60 flex items-center gap-1"
            >
              <Terminal className="w-3 h-3 text-violet-400" />
              App
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-zinc-950/95 backdrop-blur-2xl px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <Link
                href="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-white border border-white/15 bg-zinc-900 flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4 text-violet-400" />
                Launch Workspace Demo
              </Link>
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-zinc-950 bg-white"
              >
                Book Discovery Call
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
