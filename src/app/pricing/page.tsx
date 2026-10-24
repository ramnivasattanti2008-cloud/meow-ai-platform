'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  CheckCircle2,
  ArrowRight,
  CreditCard,
  Sparkles,
  Calculator,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'subscription' | 'services'>('subscription');
  const [selectedPlan, setSelectedPlan] = useState<{ title: string; amount: number } | null>(null);

  // ROI Calculator State
  const [monthlyCalls, setMonthlyCalls] = useState(450);
  const [avgTicket, setAvgTicket] = useState(1200);
  const [missedRatePercent, setMissedRatePercent] = useState(25);

  const recoveredCalls = Math.round(monthlyCalls * (missedRatePercent / 100) * 0.85);
  const monthlyRevenueRecovered = recoveredCalls * avgTicket;
  const staffHoursSaved = Math.round(monthlyCalls * 0.08);
  const businessPlanCost = 4999;
  const roiMultiple = ((monthlyRevenueRecovered - businessPlanCost) / businessPlanCost).toFixed(1);

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does the voice assistant handle emergency clinical symptoms?',
      a: 'The system has automated safety gates. If emergency clinical terms or severe distress are detected, autonomous dialogue immediately halts and escalates directly to a human manager or duty staff.',
    },
    {
      q: 'Are there hidden per-minute telephony charges?',
      a: 'No. Web voice testing and browser audio are completely free. When connecting cellular SIP trunks, you connect standard carrier rates with zero markups from MEOW.',
    },
    {
      q: 'Do you issue compliant Indian GST tax invoices?',
      a: 'Yes. Every transaction issues an official Form GST INV-01 tax invoice with your company GSTIN, HSN code 998313, and full input tax credit breakdown.',
    },
    {
      q: 'What is the turnaround time for turnkey engineering setups?',
      a: 'Voice pilot configurations deploy within 48 to 72 hours. Complete startup tech stacks deploy within 5 to 7 business days with full source code handover.',
    },
    {
      q: 'Do I own my data and source code?',
      a: 'Yes. You retain 100% ownership of your data, custom prompt blueprints, exported source code, and integration credentials.',
    },
    {
      q: 'Can I cancel or change my plan anytime?',
      a: 'Yes. There are no long-term contracts. You can upgrade, downgrade, or cancel your subscription at any time directly in Settings.',
    },
  ];

  const subscriptionTiers = [
    {
      name: 'Free',
      badge: 'Starter',
      price: '₹0',
      period: 'forever',
      amount: 0,
      description: 'Essential conversational assistant and task execution tools.',
      features: [
        'Natural conversation assistant',
        'Basic goal execution engine',
        'ATS resume analysis & PDF export',
        'Web dialer voice preview',
        'Standard response speeds',
      ],
      ctaText: 'Get Started Free',
      ctaHref: '/app',
    },
    {
      name: 'Personal Plus',
      badge: 'Students & Career',
      price: '₹399',
      period: 'month',
      amount: 399,
      description: 'Career intelligence, unlimited tailored resumes, and persistent memory.',
      features: [
        'Unlimited tailored ATS resumes & vector print',
        'Automated job & internship opportunity tracking',
        'Personal memory vault (persists context across sessions)',
        'Technical interview question prep generator',
        'Standard voice assistant turns',
      ],
      ctaText: 'Subscribe (₹399/mo)',
      highlight: true,
    },
    {
      name: 'Personal Pro',
      badge: 'Freelancers',
      price: '₹1,499',
      period: 'month',
      amount: 1499,
      description: 'Commercial proposal velocity, client tracking, and growth scripts.',
      features: [
        'All Personal Plus features',
        'Commercial proposal & Statement of Work generator',
        'Client deliverables & milestone tracker',
        'WhatsApp vernacular copy studio',
        'Dynamic UPI invoice link generator',
      ],
      ctaText: 'Subscribe (₹1,499/mo)',
    },
    {
      name: 'Business',
      badge: 'Clinics & Teams',
      price: '₹4,999',
      period: 'month',
      amount: 4999,
      description: 'Turnkey operational suite for clinics, practices, and local businesses.',
      features: [
        'Multilingual voice concierge (8 Indian languages)',
        'Appointments CRM with double-booking prevention',
        'Automated WhatsApp appointment confirmations',
        'Dynamic UPI QR links & GST tax invoicing',
        'Real-time cloud database synchronization',
      ],
      ctaText: 'Activate Business (₹4,999/mo)',
    },
  ];

  const serviceTiers = [
    {
      name: 'Website & Tech Setup',
      badge: 'Turnkey Launch',
      price: '₹19,999',
      period: 'one-time',
      amount: 19999,
      description: 'Bespoke Next.js 14 responsive website, business email, domain DNS, and payment gateway setup.',
      features: [
        'Bespoke Next.js responsive design & mobile optimization',
        'Custom domain DNS setup & SSL encryption',
        'Business email accounts setup',
        'Razorpay & UPI instant payment integration',
        'Full source code handover',
      ],
      ctaText: 'Start Setup (₹19,999)',
    },
    {
      name: 'Voice Pilot (Sara)',
      badge: 'Pilot',
      price: '₹25,000',
      period: 'pilot',
      amount: 25000,
      description: 'Dedicated voice agent configured for your business in 8 Indian languages.',
      features: [
        'Custom Telugu, Hindi & English dialogue flows',
        'Calendar slot locking & double-booking protection',
        'Clinical symptom & emergency human escalation',
        'Browser & phone test sandbox',
        '2 weeks of post-deployment prompt optimization',
      ],
      ctaText: 'Start Pilot (₹25,000)',
    },
    {
      name: 'Workflow Automation',
      badge: 'Custom',
      price: '₹45,000',
      period: 'project',
      amount: 45000,
      description: 'End-to-end integration connecting forms, CRMs, WhatsApp Business API, and databases.',
      features: [
        'Document intelligence parser (invoices & receipts)',
        'Bi-directional CRM & spreadsheet synchronization',
        'WhatsApp Business API automated dispatch',
        'Human supervisor review gate configuration',
        'Full source code & deployment handover',
      ],
      ctaText: 'Deploy Automation (₹45,000)',
    },
    {
      name: 'Full Startup Tech Stack',
      badge: 'Complete Suite',
      price: '₹59,999',
      period: 'package',
      amount: 59999,
      description: 'The complete software, voice AI, and payments suite to launch your business.',
      features: [
        'Multilingual Voice AI Telephony (24/7 inbound reception)',
        'Bespoke responsive website + Mobile App UI',
        'WhatsApp Business Cloud API setup',
        'Payment Gateway (Razorpay + UPI + GST Tax Invoices)',
        'Cloud infrastructure, domain DNS & CRM sync',
      ],
      ctaText: 'Get Full Stack (₹59,999)',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white/20">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Apple Minimalist Header */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-4">
            Predictable plans. Built to scale.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Start with ₹0. Upgrade when your productivity accelerates. No hidden telecom markups.
          </p>

          {/* Segmented Pill Selector */}
          <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-zinc-900/90 border border-white/[0.08] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setActiveTab('subscription')}
              className={`py-2 px-6 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'subscription'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Software Plans
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`py-2 px-6 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'services'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Turnkey Engineering
            </button>
          </div>
        </div>

        {/* Tab 1: Platform Subscriptions */}
        {activeTab === 'subscription' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {subscriptionTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-3xl border p-7 flex flex-col justify-between transition-all text-left backdrop-blur-xl ${
                  tier.highlight
                    ? 'border-white/30 bg-zinc-900/60 shadow-2xl'
                    : 'border-white/[0.08] bg-zinc-900/30 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      {tier.badge}
                    </span>
                    {tier.highlight && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white text-black font-semibold">
                        Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>

                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-4xl font-bold text-white tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">/ {tier.period}</span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <div className="space-y-3 mb-8 text-xs text-zinc-300">
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
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
                      className="w-full text-center py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 border border-white/10"
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPlan({ title: `MEOW ${tier.name} Plan`, amount: tier.amount })
                      }
                      className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-1.5 ${
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {serviceTiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-3xl border border-white/[0.08] bg-zinc-900/30 hover:border-white/15 p-7 flex flex-col justify-between transition-all text-left backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      {tier.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>

                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-4xl font-bold text-white tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">/ {tier.period}</span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <div className="space-y-3 mb-8 text-xs text-zinc-300">
                    {tier.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan({ title: tier.name, amount: tier.amount })}
                    className="w-full text-center py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{tier.ctaText}</span>
                  </button>
                  <Link
                    href={`/contact?service=${encodeURIComponent(tier.name)}`}
                    className="w-full block text-center py-1 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Request Custom Scope →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Minimalist ROI Calculator */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-left">
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-8 sm:p-10 backdrop-blur-xl space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Calculate Return on Investment
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Estimate recovered revenue from after-hours calls and automated intake.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">Projected ROI</span>
                <span className="text-2xl font-bold text-emerald-400 font-mono">+{roiMultiple}x</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">Monthly Inbound Calls</span>
                  <span className="font-mono text-white font-semibold">{monthlyCalls}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={monthlyCalls}
                  onChange={(e) => setMonthlyCalls(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">Average Ticket / Fee</span>
                  <span className="font-mono text-white font-semibold">₹{avgTicket}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="100"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">After-Hours Missed Rate</span>
                  <span className="font-mono text-white font-semibold">{missedRatePercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={missedRatePercent}
                  onChange={(e) => setMissedRatePercent(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.06]">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Recovered Inquiries</span>
                <div className="text-xl font-bold text-white font-mono mt-1">
                  {recoveredCalls} <span className="text-xs text-zinc-500 font-sans font-normal">/ mo</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.06]">
                <span className="text-[10px] font-mono text-emerald-400 uppercase block">Monthly Recovered Revenue</span>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                  ₹{monthlyRevenueRecovered.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.06]">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Staff Hours Saved</span>
                <div className="text-xl font-bold text-white font-mono mt-1">
                  {staffHoursSaved} <span className="text-xs text-zinc-500 font-sans font-normal">hrs / mo</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/[0.06]">
              <span className="text-xs text-zinc-500">
                Calculated on the Business Plan at ₹4,999/month.
              </span>

              <button
                type="button"
                onClick={() =>
                  setSelectedPlan({ title: 'MEOW Business Plan (₹4,999/mo)', amount: 4999 })
                }
                className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5"
              >
                <span>Activate Business Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Minimalist FAQ Accordion */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-left">
          <h2 className="text-2xl font-semibold tracking-tight text-white text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.06] bg-zinc-900/30 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-sm text-zinc-200 font-medium">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimalist Enterprise Banner */}
        <div className="max-w-4xl mx-auto px-4 mb-16 text-center">
          <div className="p-8 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-3">
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Enterprise &amp; Multi-Location Deployments
            </h3>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Custom EHR/CRM integrations, private data isolation, dedicated phone SIP trunks, and custom SLAs.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/contact?service=enterprise"
                className="px-5 py-2 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5"
              >
                <span>Contact Sales</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
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
