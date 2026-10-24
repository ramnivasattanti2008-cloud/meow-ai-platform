'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroVisual } from '@/components/home/HeroVisual';
import { CallRecordingShowcase } from '@/components/voice/CallRecordingShowcase';
import { SaraDialerModal } from '@/components/voice/SaraDialerModal';
import {
  Mic,
  Workflow,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Building2,
  GraduationCap,
  Briefcase,
} from 'lucide-react';

export default function HomePage() {
  const [activeSegment, setActiveSegment] = useState<'personal' | 'pro' | 'business' | 'enterprise'>('personal');
  const [dialerOpen, setDialerOpen] = useState(false);

  const segments = [
    {
      id: 'personal',
      name: 'MEOW Personal',
      badge: 'Students & Professionals',
      icon: GraduationCap,
      headline: 'Explain, learn, and turn goals into career outcomes.',
      description:
        'Ask questions, summarize research papers, prepare customized study schedules, and tailor high-impact resumes for top internships and jobs.',
      bulletPoints: [
        'ATS Resume Tailor & Recruiter Vector PDF export',
        'Internship & application deadline auto-tracker',
        'Conceptual explanations & academic paper synthesis',
        'Personal memory vault for long-term goal continuity',
      ],
      samplePrompt: '“Help me find internships, organize the application deadlines, and prepare my resume for the best opportunities.”',
      cta: 'Explore Personal Studio',
      ctaHref: '/app',
    },
    {
      id: 'pro',
      name: 'MEOW Pro',
      badge: 'Freelancers & Creators',
      icon: Briefcase,
      headline: 'Research clients, generate proposals, and track deliverables.',
      description:
        'Spend less time writing estimates and chasing invoices. MEOW creates commercial client proposals, schedules milestone deliverables, and generates instant UPI payment links.',
      bulletPoints: [
        'Commercial statement-of-work (SOW) & proposal generator',
        'Milestone deliverable trackers & reminder alerts',
        'WhatsApp business copy in localized regional vernacular',
        'Dynamic UPI QR code & GST invoice generation',
      ],
      samplePrompt: '“Draft freelance client proposal for clinic website redesign with milestone deliverables and ₹25k advance link.”',
      cta: 'Explore Pro Tools',
      ctaHref: '/app',
    },
    {
      id: 'business',
      name: 'MEOW Business',
      badge: 'Clinics, SMBs & Startups',
      icon: Building2,
      headline: 'Conversational phone receptionists, patient triage, and payment ops.',
      description:
        'Voiced by Sara — an empathetic voice receptionist speaking 8 Indian languages. Handles inbound phone calls, checks doctor schedules, locks calendar slots, and issues token links.',
      bulletPoints: [
        'Sara Voice Concierge in 8 Indian languages (Telugu, Hindi, Tamil +)',
        'Zero-double-booking calendar slot reservation engine',
        'Automated WhatsApp appointment confirmations with UPI tokens',
        'Google Cloud Firestore live database synchronization',
      ],
      samplePrompt: '“Audit uncontacted clinic inquiries, draft Telugu WhatsApp followups & issue ₹500 token link.”',
      cta: 'Launch Business Console',
      ctaHref: '/app',
    },
    {
      id: 'enterprise',
      name: 'MEOW Enterprise',
      badge: 'Teams & Organizations',
      icon: ShieldCheck,
      headline: 'Coordinated AI employees, strict human oversight, and full auditability.',
      description:
        'Orchestrate multi-agent teams across departments with deterministic safety boundaries, private cloud infrastructure, and verifiable outcomes.',
      bulletPoints: [
        'Multi-agent orchestration (Sara, Alex, Maya, Rishi)',
        'Human-in-the-loop review gates on consequential decisions',
        'Full audit logs and verifiable deliverable artifacts',
        'Custom internal database & API connector integrations',
      ],
      samplePrompt: '“Coordinate department intake, enforce supervisor review gates, and generate audit reports.”',
      cta: 'Contact Enterprise Team',
      ctaHref: '/contact',
    },
  ];

  const currentSegmentData = segments.find((s) => s.id === activeSegment)!;

  const faqs = [
    {
      q: 'What is MEOW?',
      a: 'MEOW is an AI platform designed to help people and businesses get work done by combining a conversational assistant, specialized AI employees, task automation, personal/business memory, and integrations with the apps they already use.',
    },
    {
      q: 'What does "Turns instructions into outcomes" mean?',
      a: 'MEOW never claims work is complete merely because an AI generated a response. When you ask it to find internships and prepare your resume, it performs verified research (Step 1), generates the tailored document (Step 2), schedules deadlines in an active tracker (Step 3), and requires your human approval before final dispatch (Step 4).',
    },
    {
      q: 'Does MEOW Voice support Indian regional languages?',
      a: 'Yes. Voiced by Sara, our conversational voice agent supports 8 Indian languages: Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, and Indian English with natural cadence and browser-native Web Audio telephony.',
    },
    {
      q: 'How does payment and billing work?',
      a: 'MEOW provides instant UPI QR generation, card checkouts, and generates printable Indian GST tax invoices compliant with domestic regulations.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white/20 font-sans antialiased">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION: Minimalist White & Black High Contrast */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-300 font-mono mb-8 backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>MeowBoxAI • Autonomous Execution &amp; Voice Telephony</span>
            </div>

            {/* High-Contrast Bold Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] mb-6">
              Autonomous execution.<br />
              <span className="text-zinc-400">
                Engineered for real-world operations.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
              MeowBoxAI combines sub-180ms vernacular voice telephony, multi-step deterministic pipelines, and persistent memory into a high-reliability operating engine.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
              <Link
                href="/app"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Launch Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setDialerOpen(true)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 border border-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-sm font-medium flex items-center justify-center gap-2 font-mono group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <Mic className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                <span>Call Sara (8 Languages)</span>
              </button>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-black text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>Pricing Plans (From ₹0)</span>
              </Link>
            </div>

            {/* Institutional Syndicate Trust Pill */}
            <div className="flex justify-center mb-8">
              <Link
                href="/verify"
                className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-zinc-950 hover:bg-zinc-900 border border-white/10 hover:border-white/25 text-xs text-zinc-300 transition-all shadow-subtle group active:scale-95"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
                <span>
                  Backed by <strong className="text-white group-hover:text-zinc-200">Apex Frontier Syndicate &amp; Horizon DeepTech Lab</strong>
                </span>
                <span className="text-zinc-700 hidden sm:inline">•</span>
                <span className="font-mono text-zinc-300 font-semibold">$25K Pre-Seed SAFE</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0" />
              </Link>
            </div>

            {/* Interactive Hero Visual */}
            <div className="max-w-5xl mx-auto pt-2">
              <HeroVisual onCallSara={() => setDialerOpen(true)} />
            </div>
          </div>
        </section>

        {/* CUSTOMER SEGMENTS INTERACTIVE SHOWCASE */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
                BUILT FOR EVERY STAGE OF WORK
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Who MeowBoxAI Serves
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                One execution engine adapted for professionals, creators, local businesses, and modern enterprises.
              </p>

              {/* Segment Toggle Bar */}
              <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-zinc-900 border border-white/[0.08] backdrop-blur-xl max-w-full overflow-x-auto">
                {segments.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSegment(s.id as any)}
                    className={`py-2 px-4 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
                      activeSegment === s.id
                        ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Segment Feature Showcase Box */}
            <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-2xl space-y-6 text-left">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white">
                    <currentSegmentData.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white tracking-tight">
                      {currentSegmentData.name}
                    </h4>
                    <span className="text-xs font-mono text-zinc-400">
                      {currentSegmentData.badge}
                    </span>
                  </div>
                </div>

                <Link
                  href={currentSegmentData.ctaHref}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>{currentSegmentData.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2">
                <div className="text-base font-semibold text-white">
                  {currentSegmentData.headline}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {currentSegmentData.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentSegmentData.bulletPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FLAGSHIP FEATURE: TURNS INSTRUCTIONS INTO OUTCOMES */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
                THE FLAGSHIP EXECUTION ENGINE
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                How MeowBoxAI Turns Instructions Into Outcomes
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Most AI merely generates text advice. MeowBoxAI coordinates tools, specialized models, and deterministic verification to produce tangible, verified work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-3 text-left">
                <div className="font-mono text-xs text-zinc-400 uppercase font-bold">Step 01</div>
                <h4 className="text-base font-bold text-white">Research &amp; Validate</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Scrapes and verifies external facts, active job openings, or inbound patient inquiries with zero hallucination.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-3 text-left">
                <div className="font-mono text-xs text-zinc-400 uppercase font-bold">Step 02</div>
                <h4 className="text-base font-bold text-white">Prepare Deliverable</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tailors an ATS 95+ resume draft, generates commercial statement-of-work copy, or drafts localized WhatsApp tokens.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-3 text-left">
                <div className="font-mono text-xs text-zinc-400 uppercase font-bold">Step 03</div>
                <h4 className="text-base font-bold text-white">Organize &amp; Track</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Assembles application deadlines, locks calendar slots to prevent double-bookings, and creates instant payment links.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-3 text-left">
                <div className="font-mono text-xs text-zinc-400 uppercase font-bold">Step 04</div>
                <h4 className="text-base font-bold text-white">Review and Approve</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Places human-in-the-loop review checkpoints before any consequential action, invoice dispatch, or export.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THREE CORE PRODUCT PILLARS */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
                INTEGRATED SERVICE SUITE
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Three Connected Engines. One Resilient Foundation.
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Rather than fragmented tools, MeowBoxAI unifies conversational voice telephony, autonomous workflow execution, and marketing intelligence into an integrated operating system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 p-8 flex flex-col justify-between transition-all group backdrop-blur-xl">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-white/30 transition-colors">
                    <Workflow className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Autonomous Pipelines</h4>
                  <p className="text-xs font-mono text-zinc-400 mb-4">Deterministic workflow automation &amp; system integrations</p>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                    Bridge your fragmented software into self-operating pipelines. From document extraction to multi-step CRM updates, MeowBoxAI replaces manual tasks with reliable event-driven systems.
                  </p>
                  <ul className="space-y-2.5 mb-8 text-xs text-zinc-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>Document intelligence (Invoices, records, PDFs)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>Custom internal copilots &amp; RAG assistants</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>CRM, Google Sheets, &amp; WhatsApp synchronizations</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>Human-in-the-loop approval thresholds</span></li>
                  </ul>
                </div>
                <Link href="/platform" className="inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-zinc-300 transition-colors pt-4 border-t border-white/[0.06]">
                  <span>Explore Pipelines</span><ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 p-8 flex flex-col justify-between transition-all group backdrop-blur-xl">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-white/30 transition-colors">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Sara Voice Telephony</h4>
                  <p className="text-xs font-mono text-zinc-400 mb-4">Expressive conversational voice agent in 8 Indian languages</p>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                    Voiced by Sara — a natural, responsive voice receptionist speaking Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, and Indian English. Handles inbound inquiries, schedules appointments, and resolves questions in real-time.
                  </p>
                  <ul className="space-y-2.5 mb-8 text-xs text-zinc-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>8 Indian languages with native cadence</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>Real calendar slot reservation &amp; double-booking protection</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>Emergency symptom detection &amp; immediate nurse transfer</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>Live in-browser web dialer with instant speech synthesis</span></li>
                  </ul>
                </div>
                <Link href="/voice-ai" className="inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-zinc-300 transition-colors pt-4 border-t border-white/[0.06]">
                  <span>Explore Voice Engine</span><ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 p-8 flex flex-col justify-between transition-all group backdrop-blur-xl">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-white/30 transition-colors">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Growth Systems</h4>
                  <p className="text-xs font-mono text-zinc-400 mb-4">Marketing operations &amp; campaign velocity</p>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                    Systematize your lead acquisition. Generate structured campaign briefs, localized WhatsApp copy, and automated nurture sequences tailored specifically to your business archetype.
                  </p>
                  <ul className="space-y-2.5 mb-8 text-xs text-zinc-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>Structured data-driven campaign briefs</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>Channel-specific copy (WhatsApp, Meta, Email)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>Automated lead qualification checklists</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" /><span>Full attribution tracking without spam tactics</span></li>
                  </ul>
                </div>
                <Link href="/growth" className="inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-zinc-300 transition-colors pt-4 border-t border-white/[0.06]">
                  <span>Explore Growth</span><ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CALL RECORDING & VERNACULAR SHOWCASE */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
                TELEPHONY AUDIO BENCHMARKS
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Multilingual Voice Verification
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Natural speech synthesis across Telugu, Hindi, and Indian English with browser Web Audio simulation.
              </p>
            </div>

            <CallRecordingShowcase />
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
                COMMON QUESTIONS
              </h2>
              <h3 className="text-3xl font-extrabold text-white">Direct Answers</h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/40 text-left space-y-2 backdrop-blur-xl"
                >
                  <h4 className="text-base font-semibold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950 text-center relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to accomplish more with less overhead?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Open the developer console to inspect the execution pipeline, run memory queries, or test Sara Voice.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/app"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Launch Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white transition-all text-sm font-medium"
              >
                Explore Plans (From ₹0)
              </Link>
            </div>
          </div>
        </section>

        {/* Floating Voice Call Pill */}
        <div className="fixed bottom-20 right-6 z-40">
          <button
            onClick={() => setDialerOpen(true)}
            className="px-4 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-900 text-white border border-white/15 hover:border-white/30 shadow-2xl backdrop-blur-2xl transition-all flex items-center gap-2.5 group active:scale-95 text-xs font-medium"
            title="Talk to Sara (Live Multilingual Voice Receptionist)"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-semibold text-white">Talk to Sara</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-200 border border-white/10">
              Voice AI
            </span>
          </button>
        </div>

        {/* Live Standalone Dialer Modal */}
        <SaraDialerModal
          isOpen={dialerOpen}
          onClose={() => setDialerOpen(false)}
          initialLanguage="te"
          agentName="Sara (Front Desk Concierge)"
          businessName="City Care Clinic, Hyderabad"
        />
      </main>

      <Footer />
    </div>
  );
}
