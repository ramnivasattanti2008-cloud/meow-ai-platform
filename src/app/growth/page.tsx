import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CampaignBriefBuilder } from '@/components/growth/CampaignBriefBuilder';
import {
  Zap,
  Target,
  FileText,
  Share2,
  Mail,
  Search,
  BarChart3,
  Layers,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'MEOW Growth — AI Marketing Operations & Lead Velocity',
  description:
    'Structured marketing campaign planning, high-converting copy generation, and automated lead qualification workflows for Indian businesses.',
};

export default function GrowthPage() {
  const capabilities = [
    {
      title: 'Structured Campaign Architecture',
      desc: 'Translates high-level business goals into cross-channel campaign briefs with clear value hooks and audience segmentation.',
      icon: Target,
    },
    {
      title: 'Multichannel Copy Production',
      desc: 'Generates tailored copy optimized for WhatsApp Business broadcasts, Meta Ads, LinkedIn, and Google Search campaigns.',
      icon: FileText,
    },
    {
      title: 'Automated Lead Qualification',
      desc: 'Instantly triages inbound lead forms, scores intent, and routes high-priority prospects to sales teams.',
      icon: Zap,
    },
    {
      title: 'CRM & WhatsApp Automation',
      desc: 'Triggers instant double-opt-in confirmations, digital brochures, and calendar scheduling via WhatsApp Business API.',
      icon: MessageSquare,
    },
    {
      title: 'High-Converting Landing Pages',
      desc: 'Fast-loading, Apple-grade landing pages engineered with clean typography and sub-second mobile page loads.',
      icon: Layers,
    },
    {
      title: 'Marketing Performance Analytics',
      desc: 'Unified visibility into inquiry volume, conversion rates, and channel performance without vanity metrics.',
      icon: BarChart3,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-violet-600/30">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>AI MARKETING OPERATIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Marketing That Converts.{' '}
            <span className="text-zinc-500">Without the Fluff.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Stop guessing campaign copy and losing leads in manual spreadsheets. MEOW Growth systematizes your entire customer acquisition pipeline.
          </p>
        </div>

        {/* Interactive Campaign Brief Architect */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <CampaignBriefBuilder />
        </section>

        {/* Capabilities Grid */}
        <section className="py-20 border-t border-white/[0.08] bg-zinc-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-2">
                GROWTH STACK
              </h2>
              <h3 className="text-3xl font-bold text-white">Full-Funnel Marketing Automation</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((c, idx) => {
                const Icon = c.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 transition-all space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-semibold text-white">{c.title}</h4>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ethical Growth Policy */}
        <section className="py-16 max-w-4xl mx-auto px-4 text-left">
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-8 space-y-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">Our Anti-Spam &amp; Ethical Marketing Policy</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              MEOW does not build, sell, or support automated mass spam dialers, unsolicited bulk SMS scrapers, or deceptive marketing tactics. All automated customer communications are configured strictly on an opt-in basis, adhering to TRAI regulations, DND registry policies, and data privacy rights.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-16 text-center max-w-3xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Accelerate your inbound customer pipeline
          </h3>
          <p className="text-zinc-400 text-sm mb-8">
            Let us design a dedicated lead intake and qualification engine for your business.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all"
            >
              Consult on Marketing Automation
            </Link>
            <Link
              href="/app/campaigns"
              className="px-6 py-3 rounded-full bg-zinc-800 text-white font-medium text-xs hover:bg-zinc-700 border border-white/10 transition-all"
            >
              View Campaigns in Workspace
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
