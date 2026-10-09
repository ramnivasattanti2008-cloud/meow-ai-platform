import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export const metadata = {
  title: 'Cookie Policy | MEOW AI',
  description: 'Information regarding the cookies and local storage used by MEOW AI.',
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-violet-600/30">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
          <div className="border-b border-white/[0.08] pb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400">LEGAL &amp; TRACKING</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">Cookie &amp; Storage Policy</h1>
            <p className="text-xs text-zinc-400 mt-2 font-mono">Last Updated: October 2026</p>
          </div>

          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. What We Store</h2>
              <p>
                MEOW AI operates on a privacy-first architecture. We do not use third-party advertising trackers, invasive behavioral cookies, or cross-site fingerprinting scripts.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Essential &amp; Functional Storage</h2>
              <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                <li>
                  <strong>Local Storage Preferences:</strong> Retains your selected language preference (English vs. Telugu) and workspace demo record modifications during your browser session.
                </li>
                <li>
                  <strong>Microphone Permission State:</strong> Tracks whether you have granted consent to test the in-browser voice sandbox during your current visit.
                </li>
                <li>
                  <strong>Security Headers &amp; Tokens:</strong> Temporary session cookies utilized to mitigate CSRF and rate-limit abusive requests to our contact endpoints.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Managing Your Browser Storage</h2>
              <p>
                You can clear your local storage and cookies at any time via your browser settings. Clearing local storage will simply reset the workspace demo records back to the default sample configuration.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
