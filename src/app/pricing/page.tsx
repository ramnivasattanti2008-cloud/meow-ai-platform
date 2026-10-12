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
  Calculator,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Smartphone,
  ExternalLink,
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

  // Calculated ROI values
  const recoveredCalls = Math.round(monthlyCalls * (missedRatePercent / 100) * 0.85);
  const monthlyRevenueRecovered = recoveredCalls * avgTicket;
  const staffHoursSaved = Math.round(monthlyCalls * 0.08);
  const businessPlanCost = 4999;
  const roiMultiple = ((monthlyRevenueRecovered - businessPlanCost) / businessPlanCost).toFixed(1);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does Sara handle medical emergencies or complex clinical questions?',
      a: 'Sara is strictly configured with deterministic safety boundaries. If a caller mentions emergency clinical keywords (e.g., chest pain, severe bleeding, breathing distress) or explicitly asks for human intervention, the system instantly halts autonomous triage and triggers a zero-delay supervisor escalation to the duty doctor or clinic manager.',
    },
    {
      q: 'Are there hidden per-minute telecom markups or telephony surcharges?',
      a: 'None. MEOW operates on a predictable flat-rate model. Web audio previews and browser calling are completely free and zero-cost. For live cellular/SIP inbound routing, you connect your standard telecom trunk or Twilio/Exotel account with zero markups from our side.',
    },
    {
      q: 'Do you issue compliant Indian GST Tax Invoices with Input Tax Credit (ITC)?',
      a: 'Yes. Every transaction automatically generates an official Indian Form GST INV-01 tax invoice with your company legal name, GSTIN, and HSN code 998313 (IT & AI Software Services), with CGST 9% + SGST 9% (or IGST 18%) clearly broken down for full input credit.',
    },
    {
      q: 'What is the deployment turnaround time for Turnkey Engineering setups?',
      a: 'The MEOW Voice Pilot (Sara) deploys within 48 to 72 hours for your clinic or business. The All-in-One Startup Tech Stack (website, voice AI, payment links, and CRM) is fully launched in 5 to 7 business days with a complete handover.',
    },
    {
      q: 'Do I own my data, prompts, and website source code?',
      a: '100% yes. You receive complete ownership of all website source files, workflow blueprints, and customer data. We never lock you into proprietary black-box systems.',
    },
    {
      q: 'Can I cancel or pause my subscription at any time?',
      a: 'Yes. There are no annual lock-ins. You can upgrade, downgrade, or pause your monthly subscription anytime from your Workspace Settings console with one click.',
    },
  ];

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
    {
      name: 'All-in-One Startup Tech Stack',
      badge: 'Best Value',
      price: '₹59,999',
      period: 'full package',
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

        {/* ===================== INTERACTIVE BUSINESS ROI CALCULATOR ===================== */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-left">
          <div className="rounded-3xl border border-white/[0.1] bg-zinc-900/60 p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono mb-2">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>INTERACTIVE ROI MODEL</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Calculate Your Monthly Revenue Return
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  See how much uncaptured revenue your clinic or practice recovers each month with 24/7 vernacular reception.
                </p>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-zinc-950 border border-white/10 text-right">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Calculated ROI</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">+{roiMultiple}x</span>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 rounded-2xl bg-zinc-950/60 border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-zinc-300">Monthly Inbound Calls</label>
                  <span className="font-mono text-violet-400 font-bold">{monthlyCalls}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={monthlyCalls}
                  onChange={(e) => setMonthlyCalls(Number(e.target.value))}
                  className="w-full accent-violet-500 cursor-pointer"
                />
                <span className="text-[11px] text-zinc-500 block">Total monthly patient / customer calls</span>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-zinc-950/60 border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-zinc-300">Avg Fee / Consultation</label>
                  <span className="font-mono text-emerald-400 font-bold">₹{avgTicket}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="100"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[11px] text-zinc-500 block">Average consultation or ticket fee</span>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-zinc-950/60 border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-zinc-300">After-Hours Missed Rate</label>
                  <span className="font-mono text-amber-400 font-bold">{missedRatePercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={missedRatePercent}
                  onChange={(e) => setMissedRatePercent(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[11px] text-zinc-500 block">Calls received when frontdesk is closed</span>
              </div>
            </div>

            {/* Calculated Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-1">
                <span className="text-[11px] font-mono text-zinc-400 uppercase">Recovered Patients</span>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {recoveredCalls} <span className="text-xs text-zinc-400 font-sans font-normal">inquiries/mo</span>
                </div>
                <p className="text-[11px] text-zinc-500">Scheduled by Sara instead of being lost to competitors</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 space-y-1">
                <span className="text-[11px] font-mono text-emerald-300 uppercase">Monthly Recovered Revenue</span>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  ₹{monthlyRevenueRecovered.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-zinc-500">Incremental revenue generated on auto-pilot</p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-1">
                <span className="text-[11px] font-mono text-zinc-400 uppercase">Staff Hours Saved</span>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {staffHoursSaved} <span className="text-xs text-zinc-400 font-sans font-normal">hours/mo</span>
                </div>
                <p className="text-[11px] text-zinc-500">Saved in repetitive appointment coordination</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08]">
              <div className="text-xs text-zinc-400">
                Based on MEOW Business Plan at ₹4,999/month. Zero hardware required.
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPlan({ title: 'MEOW Business Plan (₹4,999/mo)', amount: 4999 })
                }
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Activate Business Plan (₹4,999/mo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ===================== ENTERPRISE & GOVERNANCE FAQ ===================== */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-left">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Clear answers on SLAs, data governance, Indian tax compliance, and deployment speed.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-semibold text-white text-sm">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-white/[0.04] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================== FOUNDER DIRECT REVIEW CARD ===================== */}
        <div className="max-w-4xl mx-auto px-4 mb-16 text-left">
          <div className="p-8 rounded-3xl border border-white/[0.1] bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 backdrop-blur-xl flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                FOUNDER ARCHITECTURE REVIEW
              </span>
              <h3 className="text-xl font-bold text-white">
                Planning a Multi-Location or Hospital Deployment?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect directly with our Founder &amp; Chief Architect,{' '}
                <strong className="text-white">Ram Nivas Attanti</strong> (Bengaluru, Karnataka), to review custom EHR/EMR integrations, on-premises security requirements, and tailored SLAs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                href="/contact?service=founder_review"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Schedule Founder Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://wa.me/919999999999?text=Hi%20Ram%20Nivas,%20I'd%20like%20to%20discuss%20an%20enterprise%20deployment%20of%20MEOW."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Founder</span>
              </a>
            </div>
          </div>
        </div>

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
