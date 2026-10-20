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
        {/* HERO SECTION: Apple Clean Minimalist */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          {/* Subtle Ambient Illumination */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300 font-mono mb-8 backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>MEOW: The AI Command Center</span>
            </div>

            {/* Apple Minimalist Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.08] mb-6">
              One AI.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600">
                Every part of life and work.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
              MEOW combines an everyday conversational assistant, specialized AI employees, persistent personal memory, and voice phone agents into one unified platform that turns instructions into verified outcomes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16">
              <Link
                href="/app"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-subtle flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span>Launch Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setDialerOpen(true)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-zinc-900/90 text-zinc-300 hover:text-white border border-white/10 hover:border-violet-500/40 active:scale-[0.98] transition-all text-sm font-medium backdrop-blur-xl flex items-center justify-center gap-2 font-mono group shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Mic className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                <span>Call Sara (8 Languages)</span>
              </button>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-white/[0.06] active:scale-[0.98] transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>View Plans (From ₹0)</span>
              </Link>
            </div>

            {/* Interactive Hero Visual */}
            <div className="max-w-5xl mx-auto pt-2">
              <HeroVisual onCallSara={() => setDialerOpen(true)} />
            </div>
          </div>
        </section>

        {/* CUSTOMER SEGMENTS INTERACTIVE SHOWCASE */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950/70 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-3">
                BUILT FOR EVERY STAGE OF WORK
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Who MEOW Serves
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                One execution engine adapted for students, creators, local businesses, and modern enterprises.
              </p>

              {/* Segment Toggle Bar (Apple Style) */}
              <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-zinc-900/80 border border-white/[0.08] backdrop-blur-xl max-w-full overflow-x-auto">
                {segments.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSegment(s.id as any)}
                    className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
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
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
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
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
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
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-3">
                THE FLAGSHIP EXECUTION ENGINE
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                How MEOW Turns Instructions Into Outcomes
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Most AI merely generates text advice. MEOW breaks goals down, coordinates tools and specialized agents, and produces tangible, verified work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-3 text-left">
                <div className="font-mono text-xs text-violet-400 uppercase font-bold">Step 01</div>
                <h4 className="text-base font-bold text-white">Research &amp; Validate</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Scrapes and verifies external facts, active job openings, or inbound patient inquiries with zero hallucination.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-3 text-left">
                <div className="font-mono text-xs text-violet-400 uppercase font-bold">Step 02</div>
                <h4 className="text-base font-bold text-white">Prepare Deliverable</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tailors an ATS 95+ resume draft, generates commercial statement-of-work copy, or drafts localized WhatsApp tokens.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-3 text-left">
                <div className="font-mono text-xs text-violet-400 uppercase font-bold">Step 03</div>
                <h4 className="text-base font-bold text-white">Organize &amp; Track</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Assembles application deadlines, locks calendar slots to prevent double-bookings, and creates instant UPI links.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-3 text-left">
                <div className="font-mono text-xs text-violet-400 uppercase font-bold">Step 04</div>
                <h4 className="text-base font-bold text-white">Review and Approve</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Places human-in-the-loop review checkpoints before any consequential action, invoice dispatch, or export.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THREE CORE PRODUCT PILLARS */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-3">
                INTEGRATED SERVICE SUITE
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Three Connected Engines. One Resilient Foundation.
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Rather than disjointed point solutions, MEOW unifies conversational voice, automated backend execution, and marketing intelligence into an integrated operating system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 p-8 flex flex-col justify-between transition-all group backdrop-blur-xl">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-violet-500/40 transition-colors">
                    <Workflow className="w-6 h-6 text-violet-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">MEOW Automate</h4>
                  <p className="text-xs font-mono text-zinc-400 mb-4">Custom business workflow automation &amp; internal systems</p>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                    Bridge your fragmented software into self-operating pipelines. From document extraction to multi-step CRM updates, MEOW replaces manual spreadsheet copying with reliable event-driven systems.
                  </p>
                  <ul className="space-y-2.5 mb-8 text-xs text-zinc-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>Document intelligence (Invoices, records, PDFs)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>Custom internal copilots &amp; RAG assistants</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>CRM, Google Sheets, &amp; WhatsApp synchronizations</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>Human-in-the-loop approval thresholds</span></li>
                  </ul>
                </div>
                <Link href="/platform" className="inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-violet-300 transition-colors pt-4 border-t border-white/[0.06]">
                  <span>Explore MEOW Automate</span><ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 p-8 flex flex-col justify-between transition-all group backdrop-blur-xl">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-violet-500/40 transition-colors">
                    <Mic className="w-6 h-6 text-violet-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">MEOW Voice (Sara Concierge)</h4>
                  <p className="text-xs font-mono text-zinc-400 mb-4">Expressive conversational voice agent in 8 Indian languages</p>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                    Voiced by Sara — a natural, responsive voice receptionist speaking Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, and Indian English. Handles inquiries, checks doctor schedules, and resolves questions in real-time.
                  </p>
                  <ul className="space-y-2.5 mb-8 text-xs text-zinc-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>8 Indian languages (Telugu, Hindi, Tamil, Kannada +)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>Real calendar slot reservation &amp; double-booking protection</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>Emergency symptom detection &amp; immediate nurse transfer</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>Live in-browser web dialer with instant speech synthesis</span></li>
                  </ul>
                </div>
                <Link href="/voice-ai" className="inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-violet-300 transition-colors pt-4 border-t border-white/[0.06]">
                  <span>Explore MEOW Voice</span><ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 p-8 flex flex-col justify-between transition-all group backdrop-blur-xl">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-violet-500/40 transition-colors">
                    <Zap className="w-6 h-6 text-violet-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">MEOW Growth</h4>
                  <p className="text-xs font-mono text-zinc-400 mb-4">AI-assisted marketing operations &amp; campaign velocity</p>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                    Systematize your lead generation. Generate structured campaign briefs, localized WhatsApp &amp; Meta copy, and automated nurture sequences tailored specifically to your business archetype.
                  </p>
                  <ul className="space-y-2.5 mb-8 text-xs text-zinc-400">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>Deterministic &amp; Claude-powered campaign briefs</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>Channel-specific copy (WhatsApp, Meta, Email)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>Automated lead qualification checklists</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" /><span>Attribution tracking without spam tactics</span></li>
                  </ul>
                </div>
                <Link href="/growth" className="inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-violet-300 transition-colors pt-4 border-t border-white/[0.06]">
                  <span>Explore MEOW Growth</span><ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CALL RECORDING & VERNACULAR SHOWCASE */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-3">
                SARA CONCIERGE AUDIO
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Listen to Multilingual Voice Calls
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Natural speech synthesis across Telugu, Hindi, and Indian English with Web Audio dual-tone telephone simulation.
              </p>
            </div>

            <CallRecordingShowcase />
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-3">
                COMMON QUESTIONS
              </h2>
              <h3 className="text-3xl font-extrabold text-white">Honest Answers</h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/40 text-left space-y-2 backdrop-blur-xl"
                >
                  <h4 className="text-base font-semibold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-violet-400 shrink-0" />
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
              Ready to accomplish more with less work?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Open the AI Command Center to test the instruction-to-outcome pipeline, build your tailored resume, or test Sara Voice.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/app"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition-all shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Launch MEOW Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white transition-all text-sm font-medium"
              >
                Explore Pricing (From ₹0)
              </Link>
            </div>
          </div>
        </section>

        {/* Apple Minimalist Floating Voice Call Pill (Positioned above Text Concierge) */}
        <div className="fixed bottom-20 right-6 z-40">
          <button
            onClick={() => setDialerOpen(true)}
            className="px-4 py-2.5 rounded-full bg-zinc-950/90 hover:bg-zinc-900 text-white border border-white/15 hover:border-violet-500/50 shadow-2xl backdrop-blur-2xl transition-all flex items-center gap-2.5 group active:scale-95 text-xs font-medium"
            title="Talk to Sara (Live Multilingual Voice Receptionist)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-zinc-200 group-hover:text-white">Talk to Sara</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Live Voice
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
