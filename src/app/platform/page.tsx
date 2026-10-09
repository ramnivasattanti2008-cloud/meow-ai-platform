import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { WorkflowBuilder } from '@/components/platform/WorkflowBuilder';
import {
  Cpu,
  Layers,
  Database,
  UserCheck,
  Activity,
  Terminal,
  Shield,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Platform Architecture & Workflow Orchestration | MEOW AI',
  description:
    'Discover how MEOW AI integrates reasoning models, business software, vernacular voice pipelines, and human approval gates into deterministic automation.',
};

export default function PlatformPage() {
  const architecturalPillars = [
    {
      title: 'Multimodal AI Models',
      desc: 'Powered by Anthropic Claude for deep linguistic reasoning, entity extraction, and function calling, coupled with low-latency vernacular STT/TTS.',
      icon: Cpu,
    },
    {
      title: 'Business Tool Integrations',
      desc: 'Pre-built connectors for HubSpot, Zoho CRM, Google Workspace, PostgreSQL, and WhatsApp Business API.',
      icon: Database,
    },
    {
      title: 'Deterministic Orchestration',
      desc: 'Stateful workflow runner ensuring actions are verified, sequenced, idempotent, and backed with retry logic.',
      icon: Layers,
    },
    {
      title: 'Human-in-the-Loop Oversight',
      desc: 'Configurable decision gates that pause automated execution when risk thresholds or policy rules are triggered.',
      icon: UserCheck,
    },
    {
      title: 'Observability & Audit Trails',
      desc: 'End-to-end tracing of prompt inputs, tool invocations, execution latencies, and output verification.',
      icon: Activity,
    },
    {
      title: 'Enterprise Guardrails',
      desc: 'Strict PII minimization, server-side secret isolation, rate limiting, and zero model training on confidential customer data.',
      icon: Shield,
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
            <span>MEOW AUTOMATE ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Intelligent Orchestration.{' '}
            <span className="text-zinc-500">Without the Fragility.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Most automation fails when real-world edge cases occur. MEOW combines conversational intelligence with strict state machine validation and human supervision.
          </p>
        </div>

        {/* Interactive Workflow Builder Canvas */}
        <section id="workflow-canvas-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 scroll-mt-28">
          <WorkflowBuilder />
        </section>

        {/* System Architecture Grid */}
        <section className="py-20 border-t border-white/[0.08] bg-zinc-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-2">
                PLATFORM CAPABILITIES
              </h2>
              <h3 className="text-3xl font-bold text-white">How the Platform Works Together</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architecturalPillars.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 transition-all space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-semibold text-white">{p.title}</h4>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pt-20 text-center max-w-3xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Need a custom workflow built for your team?
          </h3>
          <p className="text-zinc-400 text-sm mb-8">
            Tell us about your existing tools and manual bottlenecks. We will map a deterministic automation blueprint for your business.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all"
            >
              Request Workflow Blueprint
            </Link>
            <Link
              href="/app/workflows"
              className="px-6 py-3 rounded-full bg-zinc-800 text-white font-medium text-xs hover:bg-zinc-700 border border-white/10 transition-all"
            >
              Manage in Workspace
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

