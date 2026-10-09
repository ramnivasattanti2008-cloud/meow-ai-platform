import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export const metadata = {
  title: 'Privacy Policy | MEOW AI',
  description: 'How MEOW AI collects, handles, stores, and protects customer inquiry and voice demonstration data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-violet-600/30">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-8">
          <div className="border-b border-white/[0.08] pb-6">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400">LEGAL &amp; COMPLIANCE</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">Privacy Policy</h1>
            <p className="text-xs text-zinc-400 mt-2 font-mono">Last Updated: October 2026 • Effective Date: October 9, 2026</p>
          </div>

          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.08] text-xs text-zinc-400 space-y-1">
              <strong>Notice &amp; Disclaimer:</strong> This document reflects the actual data handling practices of MEOW AI (Founder: Ram Nivas Attanti, Bengaluru, Karnataka, India). This starter policy is subject to formal legal review upon corporate incorporation.
            </div>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
              <p>
                We only collect information directly submitted by you or generated during your interactive use of our website:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-zinc-400">
                <li>
                  <strong>Contact &amp; Discovery Inquiries:</strong> Your name, business email address, company name, website, and description of your business challenges submitted via our contact forms.
                </li>
                <li>
                  <strong>Voice AI Sandbox Audio &amp; Transcripts:</strong> Audio speech input during the in-browser demonstration is processed locally via your browser’s Web Speech API. We do not record, store, or sell raw audio files.
                </li>
                <li>
                  <strong>Technical Data:</strong> Basic HTTP request headers, IP address (for anti-spam rate limiting), and user-agent information.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. How We Use Information</h2>
              <p>Your information is used strictly to:</p>
              <ul className="list-disc pl-6 space-y-1 text-zinc-400">
                <li>Respond to your technical discovery requests and schedule discovery calls.</li>
                <li>Demonstrate product workflows and voice agent capabilities.</li>
                <li>Prevent denial-of-service abuse and automated spam submissions.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Third-Party AI Processors</h2>
              <p>
                When you interact with AI generation features (such as our Campaign Brief Architect), prompts are processed server-side via official API connectors with Anthropic PBC (Claude API). In accordance with Anthropic’s commercial terms, API inputs and outputs are not used to train generative AI models.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">4. Data Retention &amp; Deletion</h2>
              <p>
                Contact inquiries are retained in our operational inbox for up to 12 months for correspondence purposes. You may request immediate deletion of your contact information at any time by emailing <code>founder@meowboxai.tech</code>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">5. Contact Information</h2>
              <p>
                For privacy inquiries or data removal requests:
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 font-mono text-xs text-zinc-300">
                MEOW AI — Data Protection Officer<br />
                Founder: Ram Nivas Attanti<br />
                Bengaluru, Karnataka, India<br />
                Email: founder@meowboxai.tech
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

