'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  Sparkles,
  Zap,
  Bot,
  User,
  Building2,
  Briefcase,
  Layers,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'subscription' | 'services'>('subscription');
  const [selectedPlan, setSelectedPlan] = useState<{ title: string; amount: number } | null>(null);

  const subscriptionTiers = [
    {
      name: 'Free',
      badge: 'Everyday Users',
      price: '₹0',
      period: 'forever',
      amount: 0,
      description: 'Ideal for students and everyday users exploring the AI Command Center.',
      features: [
        'Natural conversation assistant',
        'Basic goal execution & study plans',
        'Single resume ATS analysis & export',
        'Web dialer preview (Sara)',
        'Community support',
      ],
      ctaText: 'Get Started Free',
      ctaHref: '/app',
    },
    {
      name: 'Personal Plus',
      badge: 'Students & Career',
      price: '₹399',
      period: 'per month',
      amount: 399,
      description: 'Full career intelligence, unlimited tailored resumes, and personal memory vault.',
      features: [
        'Unlimited ATS resume tailoring & vector PDF print',
        'Automated internship & opportunity tracking',
        'Personal memory vault (persists context & goals)',
        'Tailored interview prep question generator',
        'Standard voice assistant turns',
      ],
      ctaText: 'Subscribe (₹399/mo)',
      highlight: true,
    },
    {
      name: 'Personal Pro',
      badge: 'Freelancers & Creators',
      price: '₹1,499',
      period: 'per month',
      amount: 1499,
      description: 'For independent consultants, creators, and professionals needing proposal velocity.',
      features: [
        'All Personal Plus features',
        'Maya: Commercial proposal & SOW generator',
        'Deliverables & milestone tracking',
        'WhatsApp vernacular copy studio',
        'Dynamic UPI invoice link generator',
      ],
      ctaText: 'Subscribe (₹1,499/mo)',
    },
    {
      name: 'Business',
      badge: 'Clinics & Startups',
      price: '₹4,999',
      period: 'per month',
      amount: 4999,
      description: 'Turnkey operational suite for local clinics, healthcare practices, and SMBs.',
      features: [
        'Sara Voice Concierge (8 Indian languages)',
        'Full Appointments & Patient CRM hub',
        'Automated WhatsApp appointment confirmations',
        'Instant UPI QR codes & GST tax invoices',
        'Google Cloud Firestore edge synchronization',
      ],
      ctaText: 'Activate Business (₹4,999/mo)',
    },
  ];

  const serviceTiers = [
    {
      name: 'Website & Full Tech Setup',
      badge: 'Turnkey Launch',
      price: '₹19,999',
      period: 'one-time setup',
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
      badge: 'Pilot Engagement',
      price: '₹25,000',
      period: 'pilot setup',
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
      badge: 'Popular for SMBs',
      price: '₹45,000',
      period: 'per project',
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
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-violet-600/30">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Apple Clean Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 font-mono mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>TRANSPARENT, HONEST PRICING</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-4">
            One AI.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600">
              Clear Value.
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Start free with ₹0, upgrade as your productivity multiplies, or engage our Bengaluru engineering team for turnkey enterprise setups.
          </p>

          {/* Segmented Pill Selector (Apple Style) */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-zinc-900/80 border border-white/[0.08] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setActiveTab('subscription')}
              className={`py-2 px-5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'subscription'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Platform Plans (Personal &amp; Business)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`py-2 px-5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'services'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Turnkey Engineering &amp; AI Setup
            </button>
          </div>
        </div>

        {/* Tab 1: Platform Subscriptions */}
        {activeTab === 'subscription' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {subscriptionTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-3xl border p-6 flex flex-col justify-between transition-all text-left relative backdrop-blur-xl ${
                  tier.highlight
                    ? 'border-violet-500/40 bg-zinc-900/70 shadow-lg shadow-violet-500/10'
                    : 'border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-white/5 uppercase">
                      {tier.badge}
                    </span>
                    {tier.highlight && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        MOST POPULAR
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>

                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">/ {tier.period}</span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <div className="space-y-2.5 mb-8 text-xs text-zinc-300">
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {tier.ctaHref ? (
                    <Link
                      href={tier.ctaHref}
                      className="w-full text-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-white/10"
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPlan({ title: `MEOW ${tier.name} Plan`, amount: tier.amount })
                      }
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        tier.highlight
                          ? 'bg-white hover:bg-zinc-200 text-zinc-950 shadow-sm'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{tier.ctaText}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Turnkey Engineering Services */}
        {activeTab === 'services' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {serviceTiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 p-7 flex flex-col justify-between transition-all text-left backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-white/5 uppercase">
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>

                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">/ {tier.period}</span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <div className="space-y-2.5 mb-8 text-xs text-zinc-300">
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
                    className="w-full text-center py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-zinc-950" />
                    <span>{tier.ctaText}</span>
                  </button>
                  <Link
                    href={`/contact?service=${encodeURIComponent(tier.name)}`}
                    className="w-full block text-center py-1 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Or Request Custom Scope →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enterprise & Transparency Callout */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/30 text-xs text-zinc-400 space-y-2 text-left backdrop-blur-xl">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full Commercial Transparency &amp; Direct Bank Settlements</span>
            </div>
            <p className="leading-relaxed">
              Every subscription and service setup is backed by genuine Indian GST tax invoices, instant UPI receipt confirmations, and 100% direct ownership of your data and configurations.
            </p>
          </div>
        </div>
      </main>

      {/* Easy Payment Modal */}
      <EasyPaymentModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        defaultPlan={selectedPlan?.title || 'MEOW AI Plan'}
        defaultAmount={selectedPlan?.amount || 399}
      />

      <Footer />
    </div>
  );
}
