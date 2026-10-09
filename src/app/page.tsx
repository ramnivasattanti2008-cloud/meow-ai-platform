import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroVisual } from '@/components/home/HeroVisual';
import { CallRecordingShowcase } from '@/components/voice/CallRecordingShowcase';
import {
  Mic,
  Workflow,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Headphones,
  FileSpreadsheet,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  Building2,
  Stethoscope,
  GraduationCap,
  Store,
  Terminal,
} from 'lucide-react';

export default function HomePage() {
  const pillars = [
    {
      id: 'automate',
      title: 'MEOW Automate',
      tagline: 'Custom business workflow automation & internal systems',
      description:
        'Bridge your fragmented software into self-operating pipelines. From document extraction to multi-step CRM updates, MEOW replaces manual spreadsheet copying with reliable event-driven systems.',
      icon: Workflow,
      href: '/platform',
      features: [
        'Document intelligence (Invoices, records, PDFs)',
        'Custom internal copilots & RAG assistants',
        'CRM, Google Sheets, & WhatsApp synchronizations',
        'Human-in-the-loop approval thresholds',
      ],
    },
    {
      id: 'voice',
      title: 'MEOW Voice',
      tagline: 'Multilingual inbound & outbound voice agents',
      description:
        'Conversational phone agents that speak natural English and Telugu (తెలుగు). Designed for Indian commercial realities—answering after-hours inquiries, qualifying leads, and locking appointment slots.',
      icon: Mic,
      href: '/voice-ai',
      features: [
        'Telugu & Indian English vernacular support',
        'Direct calendar slot reservation & locking',
        'Emergency symptom detection & immediate nurse transfer',
        'Strict AI disclosure—never pretends to be human',
      ],
    },
    {
      id: 'growth',
      title: 'MEOW Growth',
      tagline: 'AI-assisted marketing operations & campaign velocity',
      description:
        'Systematize your lead generation. Generate structured campaign briefs, localized WhatsApp & Meta copy, and automated nurture sequences tailored specifically to your business archetype.',
      icon: Zap,
      href: '/growth',
      features: [
        'Deterministic & Claude-powered campaign briefs',
        'Channel-specific copy (WhatsApp, Meta, Email)',
        'Automated lead qualification checklists',
        'Attribution tracking without spam tactics',
      ],
    },
  ];

  const processSteps = [
    {
      step: '01',
      name: 'Discover & Map',
      description:
        'We audit your current inquiry flow, identify where manual repetitive friction occurs, and isolate high-ROI automation targets.',
    },
    {
      step: '02',
      name: 'Architect & Guardrail',
      description:
        'We configure prompt instructions, connect your CRM/calendar tools, and set deterministic human-in-the-loop escalation gates.',
    },
    {
      step: '03',
      name: 'Deploy & Test',
      description:
        'The system is deployed into staging. We test vernacular speech latency, verify booking locks, and run edge-case scenarios.',
    },
    {
      step: '04',
      name: 'Supervise & Optimize',
      description:
        'Your team receives unified logs, supervisor alerts, and ongoing tuning to ensure accuracy improves as inquiry volume grows.',
    },
  ];

  const faqs = [
    {
      q: 'Does MEOW Voice replace our human receptionists or frontdesk team?',
      a: 'No. MEOW Voice acts as an indefatigable frontline assistant. It handles repetitive calls during peak rush hours or after 7 PM, captures inquiries, and immediately escalates complex or urgent matters to your human staff.',
    },
    {
      q: 'Which languages are supported right now?',
      a: 'We currently provide native conversational agents in Telugu (తెలుగు) and English (Indian context). Our modular voice adapter is architected to roll out Hindi, Kannada, and Tamil in upcoming releases.',
    },
    {
      q: 'Can the AI voice agent make unauthorized bookings or financial commitments?',
      a: 'Never. Our system follows strict deterministic rules. It checks actual calendar availability before confirming appointments, and any action involving payments, refunds, or medical decisions requires human supervisor approval.',
    },
    {
      q: 'How does MEOW integrate with our existing tools?',
      a: 'We integrate via standard REST webhooks and secure API connectors with Google Calendar, WhatsApp Business API, HubSpot, Zoho CRM, Google Sheets, and custom internal SQL databases.',
    },
    {
      q: 'Do you fabricate case studies or customer counts?',
      a: 'No. MEOW AI is an early-stage startup founded in Bengaluru. We do not display fake logos, made-up metrics, or invented testimonials. We let our working product demonstrations speak for themselves.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-violet-600/30">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          {/* Subtle Apple-style background illumination */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-600/10 via-zinc-800/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Mission Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 font-mono mb-8 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <span>AI that does the work, not just talks about the work.</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
              Your business.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-500">
                Reimagined with AI.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
              From multilingual voice agents to intelligent workflows and AI-powered growth, MEOW helps businesses turn repetitive work into reliable systems.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Build with MEOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/platform"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900/80 text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-sm font-medium backdrop-blur-md flex items-center justify-center gap-2"
              >
                <span>Explore What We Do</span>
              </Link>
            </div>

            {/* Hero Interactive Visualization */}
            <div className="max-w-5xl mx-auto pt-4">
              <HeroVisual />
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
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Three Connected Engines. One Resilient Foundation.
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base mt-4 leading-relaxed">
                Rather than disjointed point solutions, MEOW unifies conversational voice, automated backend execution, and marketing intelligence into an integrated operating system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.id}
                    className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 p-8 flex flex-col justify-between transition-all group backdrop-blur-sm"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-violet-500/40 transition-colors">
                        <Icon className="w-6 h-6 text-violet-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{pillar.title}</h4>
                      <p className="text-xs font-mono text-zinc-400 mb-4">{pillar.tagline}</p>
                      <p className="text-zinc-300 text-sm leading-relaxed mb-6">{pillar.description}</p>

                      <ul className="space-y-2.5 mb-8 text-xs text-zinc-400">
                        {pillar.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={pillar.href}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-white group-hover:text-violet-300 transition-colors pt-4 border-t border-white/[0.06]"
                    >
                      <span>Explore {pillar.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WORKFLOW DEMO CALLOUT */}
        <section className="py-20 border-t border-white/[0.08] bg-zinc-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/60 to-zinc-950 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono mb-4">
                  <Terminal className="w-3 h-3" />
                  <span>Real Interactive Sandbox</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Test the MEOW Voice AI &amp; Workflow Builders Live
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Experience how our Telugu and English dialogue engines respond in real time, or test custom workflow step reordering and validation without needing an enterprise sales call.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/voice-ai"
                  className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all shadow-sm"
                >
                  Test Voice Sandbox
                </Link>
                <Link
                  href="/platform"
                  className="px-6 py-3 rounded-full bg-zinc-800 text-white font-medium text-xs hover:bg-zinc-700 border border-white/10 transition-all"
                >
                  Open Workflow Canvas
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
                AUTHENTIC AUDIO DEMONSTRATIONS
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Hear Multilingual AI in Genuine Indian SMB Contexts
              </h3>
              <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
                Experience actual conversational turns in Telugu and English. No robotic cadence—natural pacing, sub-300ms response times, and deterministic slot locking.
              </p>
            </div>

            <CallRecordingShowcase />
          </div>
        </section>

        {/* IMPLEMENTATION PROCESS */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-3">
                PRAGMATIC DELIVERY
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                How We Build and Ship Systems
              </h3>
              <p className="text-zinc-400 text-sm mt-3">
                No endless slide decks or multi-year contracts. We deliver verifiable automation in tight sprints.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step) => (
                <div
                  key={step.step}
                  className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/30 space-y-3"
                >
                  <div className="font-mono text-2xl font-bold text-violet-400/80">{step.step}</div>
                  <h4 className="text-base font-semibold text-white">{step.name}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY & HUMAN OVERSIGHT */}
        <section className="py-20 border-t border-white/[0.08] bg-zinc-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 mx-auto flex items-center justify-center text-violet-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Engineered with Guardrails &amp; Human Supervision
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Autonomous AI is only as useful as its safety boundaries. MEOW enforces strict protocol checks: voice agents disclose their automated identity on turn one, emergency medical keywords transfer to human duty nurses, and financial commitments require supervisor confirmation.
              </p>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-24 border-t border-white/[0.08] bg-zinc-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-3">
                COMMON QUESTIONS
              </h2>
              <h3 className="text-3xl font-bold text-white">Honest Answers Before You Begin</h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/40 text-left space-y-2"
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
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Ready to automate the work that matters?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Schedule a 30-minute discovery session with our engineering team in Bengaluru to explore a tailor-made deployment for your business.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all shadow-subtle"
              >
                Book a Discovery Call
              </Link>
              <Link
                href="/app"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white transition-all text-sm font-medium"
              >
                Launch Workspace Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

