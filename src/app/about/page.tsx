import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  GraduationCap,
  MapPin,
  Cpu,
  ShieldCheck,
  Heart,
  Terminal,
  Code2,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About MEOW AI — Engineering Vision & Leadership',
  description:
    'Learn about MEOW AI, our early-stage journey from Bengaluru, Karnataka, and our mission to build practical AI systems that do real work.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white/20">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>ORIGIN &amp; MISSION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            AI That Does the Work.{' '}
            <span className="text-zinc-500">Not Just Talks About It.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            MEOW AI was born out of frustration with superficial AI demos and conversational wrappers that produce entertaining replies but fail to execute actual business operations.
          </p>
        </div>

        {/* Narrative Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-8 sm:p-12 space-y-6">
            <h2 className="text-2xl font-bold text-white">The Problem We Are Solving</h2>
            <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
              <p>
                In India today, millions of service businesses—from neighborhood healthcare clinics in Bengaluru and Hyderabad to coaching institutes and real estate developers—struggle with communication bottlenecks. Inbound calls go unanswered during rush hours. Inquiries from vernacular-speaking customers (like Telugu speakers) face rigid IVR barriers. And valuable inquiries get stranded in messaging inboxes because no one has time to manually enter them into a database.
              </p>
              <p>
                At the same time, enterprise automation software remains priced in US dollars, designed for multinational corporations with dedicated IT teams. Small and medium enterprises are left behind with manual spreadsheets.
              </p>
              <p>
                MEOW AI bridges this divide. We engineer AI agents that pick up the phone, converse with authentic warmth in Telugu or English, lock calendar slots, and sync business databases—backed by deterministic safeguards so humans always retain control.
              </p>
            </div>
          </div>

          {/* Institutional Capital & Corporate Entity */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 sm:p-10 space-y-6 shadow-subtle">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
                  CORPORATE ENTITY &amp; VENTURE BACKING
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">MeowBoxAI Inc.</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Incorporated startup operating global AI voice &amp; workflow orchestration platforms.
                </p>
              </div>

              <Link
                href="/verify"
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-mono text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Credentials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">CAPITAL BACKING</span>
                <div className="text-base font-bold text-white">$25,000 USD Pre-Seed</div>
                <p className="text-[10px] text-zinc-400 font-sans">Post-Money SAFE • 100% Disbursed</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">LEAD SYNDICATE</span>
                <div className="text-sm font-bold text-white leading-tight">Apex Frontier Syndicate &amp; Horizon DeepTech Lab</div>
                <p className="text-[10px] text-zinc-400 font-sans">Co-investors &amp; Technology Advisory</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">PRIMARY PARTNER CODE</span>
                <div className="text-sm font-bold text-white font-mono tracking-wider">APX-GROQ-25K-MBX-2026</div>
                <p className="text-[10px] text-zinc-400 font-sans">Alt: GROQ-APEX-SYNDICATE-MBX</p>
              </div>
            </div>
          </div>

          {/* Engineering Leadership */}
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-8 sm:p-12 space-y-8 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                  SYSTEMS &amp; ARCHITECTURE
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">MEOW Engineering Group</h3>
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    Bengaluru, Karnataka, India
                  </span>
                  <span>•</span>
                  <span>Autonomous Systems Lab</span>
                </div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-white">
                <Terminal className="w-7 h-7 text-zinc-300" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm">
              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  <strong>Architecture Focus:</strong> Full-stack agentic systems, deterministic workflow orchestration, and sub-200ms vernacular voice synthesis.
                </p>
                <p>
                  <strong>Design Philosophy:</strong> Rooted in radical simplicity, privacy-first data boundaries, and verifiable execution outcomes over synthetic hype.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.06] space-y-3 font-mono text-xs">
                <div className="text-zinc-400 font-semibold uppercase">Engineered With:</div>
                <ul className="space-y-1.5 text-zinc-300">
                  <li>• Next.js 14 App Router &amp; TypeScript</li>
                  <li>• Anthropic Claude Neural Reasoning Core</li>
                  <li>• Kokoro &amp; Indic Speech Neural Voice Synthesizers</li>
                  <li>• Google Cloud Firestore Zero-Loss Edge Sync</li>
                  <li>• Dynamic UPI &amp; Form GST INV-01 Invoicing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Operating Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/30 space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-semibold text-white">Pragmatic Transparency</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We let verified code, test suites, and transparent workflows demonstrate reliability without fabricated marketing claims.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/30 space-y-2">
              <Cpu className="w-5 h-5 text-violet-400" />
              <h4 className="text-base font-semibold text-white">Vernacular Native</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Engineered for India’s multilingual reality, prioritizing authentic vernacular dialogue before generic global interfaces.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/30 space-y-2">
              <Heart className="w-5 h-5 text-zinc-300" />
              <h4 className="text-base font-semibold text-white">Human Oversight</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                AI augments human capability and eliminates repetitive tasks, while preserving human authority for all critical decisions.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-20 text-center max-w-3xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Connect with our engineering team
          </h3>
          <p className="text-zinc-400 text-sm mb-8">
            Explore how MEOW integrates with your business workflows, telephony, or practice management tools.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all"
            >
              Contact Team
            </Link>
            <Link
              href="/platform"
              className="px-6 py-2.5 rounded-full bg-zinc-800 text-white font-medium text-xs hover:bg-zinc-700 border border-white/10 transition-all"
            >
              Platform Overview
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

