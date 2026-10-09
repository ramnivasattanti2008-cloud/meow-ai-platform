import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Globe, Terminal, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-zinc-950 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 17V8.5L8 12.5L12 7L16 12.5L20 8.5V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17Z"
                    fill="white"
                  />
                  <circle cx="8.5" cy="11.5" r="1" fill="#8b5cf6" />
                  <circle cx="15.5" cy="11.5" r="1" fill="#8b5cf6" />
                </svg>
              </div>
              <span className="font-semibold text-white tracking-tight text-lg">MEOW AI</span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              AI that does the work, not just talks about the work. Multilingual voice agents, business workflow automation, and AI-powered growth systems engineered for modern Indian SMBs and startups.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Bengaluru, Karnataka, India</span>
              <span className="text-zinc-600">•</span>
              <span>English &amp; తెలుగు Native</span>
            </div>
          </div>

          {/* Core Products */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 mb-4 font-mono">Products</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/voice-ai" className="hover:text-white transition-colors">
                  MEOW Voice
                </Link>
              </li>
              <li>
                <Link href="/platform" className="hover:text-white transition-colors">
                  MEOW Automate
                </Link>
              </li>
              <li>
                <Link href="/growth" className="hover:text-white transition-colors">
                  MEOW Growth
                </Link>
              </li>
              <li>
                <Link href="/ai-services" className="hover:text-white transition-colors">
                  Custom AI Services
                </Link>
              </li>
              <li>
                <Link href="/app" className="text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 font-mono text-xs">
                  <span>Workspace Demo</span>
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
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} MEOW AI. Engineered by Ram Nivas Attanti. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>Human-in-the-Loop Safeguards</span>
            </span>
            <span className="text-zinc-700">•</span>
            <span>Indian SMB Focus</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

