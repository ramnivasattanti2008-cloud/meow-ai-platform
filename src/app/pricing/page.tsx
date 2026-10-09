'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Sparkles, Globe, Bot, Workflow, Zap } from 'lucide-react';
import Link from 'next/link';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<{ title: string; amount: number } | null>(null);

  const tiers = [
    {
      name: 'Website & Full Tech Setup',
      category: 'Design & Infrastructure',
      indicativeRange: '₹19,999 / turnkey setup',
      badge: 'Turnkey Launch',
      amount: 19999,
      description:
        'Apple-grade bespoke responsive website, business email infrastructure, domain DNS, SSL, and payment gateway setup.',
      features: [
        'Bespoke Next.js 14 responsive design & mobile CRO',
        'Custom domain DNS setup (Cloudflare) & SSL encryption',
        'Google Workspace / Titan / Zoho business emails',
        'Turnkey Razorpay & UPI Instant payment gateway integration',
        '100/100 Lighthouse performance & on-page SEO setup',
      ],
      ctaText: 'Pay Setup Advance (₹19,999)',
    },
    {
      name: 'MEOW Voice Pilot (Sara)',
      category: 'Conversational Telephony',
      indicativeRange: '₹25,000 / pilot setup',
      badge: 'Pilot Engagement',
      amount: 25000,
      description:
        'Dedicated Sara voice agent configured for your clinic, hospital, coaching center, or startup in 8 Indian languages.',
      features: [
        'Custom Telugu, Hindi & English dialogue flows',
        'Direct calendar slot locking & double-booking prevention',
        'Emergency symptom / keyword human duty nurse escalation',
        'Browser & phone test sandbox with instant pickup chime',
        '2 weeks of post-deployment prompt optimization',
      ],
      ctaText: 'Start Voice Pilot (₹25,000)',
    },
    {
      name: 'Custom Workflow Automation',
      category: 'MEOW Automate Core',
      indicativeRange: '₹45,000 / project',
      badge: 'Popular for SMBs',
      amount: 45000,
      description:
        'End-to-end integration connecting your forms, CRMs, WhatsApp Business API, and internal databases.',
      features: [
        'Document intelligence parser (Invoices/Prescriptions)',
        'Bi-directional CRM & spreadsheet synchronization (Zoho/HubSpot)',
        'Meta WhatsApp Business API Cloud auto-dispatch',
        'Human supervisor review gate configuration',
        'Full source code & cloud deployment handover',
      ],
      ctaText: 'Deploy Automation (₹45,000)',
    },
    {
      name: 'All-in-One Startup Tech Stack',
      category: 'Complete Startup Suite',
      indicativeRange: '₹59,999 / full package',
      badge: 'Best Value',
      amount: 59999,
      description:
        'The complete technology and AI package to launch your modern clinic, startup, or business with maximum conversion authority.',
      features: [
        'Sara Multilingual Voice AI Telephony (24/7 inbound & missed call recovery)',
        'Bespoke High-Converting Next.js Website + Mobile App UI',
        'Official Meta WhatsApp Business Cloud API setup',
        'Turnkey Payment Gateway (Razorpay + UPI + Cards + GST Tax Invoices)',
        'Complete Cloud Infra, Domain DNS, Business Emails & CRM Auto-Sync',
      ],
      ctaText: 'Lock Full Stack (₹59,999)',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-violet-600/30">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>TRANSPARENT COMMERCIALS &amp; EASY CHECKOUT</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Clear Pricing.{' '}
            <span className="text-zinc-500">Zero Technical Friction.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From bespoke website design and complete tech setup to multilingual Sara Voice AI and automated payment gateways. Choose a turnkey package or pay a booking advance instantly.
          </p>

          {/* Quick Payment Banner */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <button
              type="button"
              onClick={() => setSelectedPlan({ title: 'Discovery Consultation Advance', amount: 600 })}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-white/10 hover:border-violet-500/40 text-zinc-300 hover:text-white transition-all flex items-center gap-2 shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pay Consultation Advance (₹600 via UPI / Card)</span>
            </button>
            <Link
              href="/book"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
            >
              Book 30-Min Discovery Call First →
            </Link>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 p-6 flex flex-col justify-between transition-all text-left relative overflow-hidden group"
            >
              {tier.badge && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-violet-400 mb-1">
                  {tier.category}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-xs font-mono text-zinc-300 bg-zinc-950/80 px-2.5 py-1.5 rounded-lg border border-white/[0.06] mb-4">
                  {tier.indicativeRange}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">{tier.description}</p>

                <div className="space-y-2 mb-8 text-xs text-zinc-300">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlan({ title: tier.name, amount: tier.amount })}
                  className="w-full text-center py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5 text-violet-600" />
                  <span>{tier.ctaText}</span>
                </button>
                <Link
                  href={`/contact?service=${encodeURIComponent(tier.name)}`}
                  className="w-full block text-center py-1.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Or Request Custom Scope Scope →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Disclosure Banner */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/30 text-xs text-zinc-400 space-y-2 text-left">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Full Commercial Transparency &amp; Direct Source Code Ownership</span>
            </div>
            <p className="leading-relaxed">
              Every project comes with 100% verified source code ownership, private deployment on your own AWS/Vercel cloud accounts, and direct payment gateway settlements into your verified business bank account. No locked-in vendor traps or hidden per-transaction royalties.
            </p>
          </div>
        </div>
      </main>

      {/* Easy Payment Modal */}
      <EasyPaymentModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        defaultPlan={selectedPlan?.title || 'MEOW AI Service'}
        defaultAmount={selectedPlan?.amount || 600}
      />

      <Footer />
    </div>
  );
}
