'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Terminal } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-xl border-b border-white/[0.08] shadow-subtle'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo & Brand Mark */}
          <Link href="/" className="group focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-lg">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 border border-white/[0.08] rounded-full px-3 py-1 backdrop-blur-xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  isActive(link.href)
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/app"
              className="px-3.5 py-1.5 text-xs font-mono font-medium text-zinc-300 hover:text-white rounded-full border border-white/10 hover:border-white/20 bg-zinc-900/80 hover:bg-zinc-800 transition-all flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              <span>Console</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
            </Link>

            <Link
              href="/book"
              className="px-3.5 py-1.5 text-xs font-medium text-black bg-white hover:bg-zinc-200 active:scale-[0.98] rounded-full transition-all shadow-sm flex items-center gap-1"
            >
              <span>Book Call</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/app"
              className="px-2.5 py-1.5 text-xs font-mono text-zinc-300 rounded-full border border-white/10 bg-zinc-900/60 flex items-center gap-1"
            >
              <Terminal className="w-3 h-3 text-zinc-400" />
              App
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-black/95 backdrop-blur-2xl px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
              <Link
                href="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full text-xs font-medium text-white border border-white/15 bg-zinc-900 flex items-center justify-center gap-2"
              >
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                Launch Console
              </Link>
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full text-xs font-medium text-black bg-white"
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

