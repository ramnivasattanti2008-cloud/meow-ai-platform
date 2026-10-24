import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-black text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo size={22} />
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Autonomous execution engines, voice telephony agents, and memory vault systems engineered for high-growth operations.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Bengaluru, Karnataka, India</span>
              <span className="text-zinc-600">•</span>
              <span>English &amp; Regional Multi-Dialect</span>
            </div>
          </div>

          {/* Core Products */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4 font-mono">Products</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/voice-ai" className="hover:text-white transition-colors">
                  Sara Voice Engine
                </Link>
              </li>
              <li>
                <Link href="/platform" className="hover:text-white transition-colors">
                  Autonomous Pipelines
                </Link>
              </li>
              <li>
                <Link href="/growth" className="hover:text-white transition-colors">
                  Growth Systems
                </Link>
              </li>
              <li>
                <Link href="/ai-services#automation-configurator" className="hover:text-white transition-colors">
                  Infrastructure Setup
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Platform Status &amp; SLA</span>
                </Link>
              </li>
              <li>
                <Link href="/app" className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1 font-mono text-xs">
                  <span>Developer Console</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions & Use Cases */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4 font-mono">Use Cases</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/solutions#clinics" className="hover:text-white transition-colors">
                  Healthcare &amp; Clinics
                </Link>
              </li>
              <li>
                <Link href="/solutions#real-estate" className="hover:text-white transition-colors">
                  Real Estate
                </Link>
              </li>
              <li>
                <Link href="/solutions#ecommerce" className="hover:text-white transition-colors">
                  E-Commerce &amp; Retail
                </Link>
              </li>
              <li>
                <Link href="/solutions#education" className="hover:text-white transition-colors">
                  EdTech &amp; Coaching
                </Link>
              </li>
              <li>
                <Link href="/solutions#startups" className="hover:text-white transition-colors">
                  Fast-Growing Startups
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4 font-mono">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About MEOW AI
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-emerald-300 text-emerald-400 font-mono text-xs flex items-center gap-1 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Investor Verification</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Transparent Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Discovery
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Uptime Status (99.98%)</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} MeowBoxAI Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enterprise Security &amp; Oversight</span>
            </span>
            <span className="text-zinc-700">•</span>
            <span>Privacy First</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

