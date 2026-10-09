import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export const metadata = {
  title: 'Terms of Service | MEOW AI',
  description: 'Terms governing the use of MEOW AI website, demonstration environments, and client engagements.',
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-violet-600/30">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
          <div className="border-b border-white/[0.08] pb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400">LEGAL AGREEMENT</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">Terms of Service</h1>
            <p className="text-xs text-zinc-400 mt-2 font-mono">Last Updated: October 2026</p>
          </div>

          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the MEOW AI website, interactive voice sandboxes, and workflow demonstration environments, you agree to comply with and be bound by these Terms of Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Nature of Demonstrations</h2>
              <p>
                The in-browser voice agents, campaign generators, and workflow builders provided on this site are for demonstration and technical scoping purposes. They do not constitute guaranteed commercial service availability until formalized through an executed statement of work (SOW).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Acceptable Use Policy</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-1 text-zinc-400">
                <li>Attempt to bypass rate limits or perform automated denial-of-service tests against our endpoints.</li>
                <li>Use our voice or messaging tools to generate unsolicited automated spam, deceptive robocalls, or harassment.</li>
                <li>Submit misleading, fraudulent, or malicious payloads through discovery inquiry forms.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">4. Intellectual Property</h2>
              <p>
                All software code, custom prompt architectures, UI design tokens, brand marks, and documentation of MEOW AI are the intellectual property of Ram Nivas Attanti, unless otherwise specified.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">5. Governing Jurisdiction</h2>
              <p>
                These terms are governed by the laws of India, subject to the jurisdiction of courts in Bengaluru, Karnataka.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

