import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { CheckCircle2, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Transparent Pricing & Engagement Models | MEOW AI',
  description:
    'Proposed starting investment ranges and custom enterprise engineering quotes for voice AI, business automation, and marketing systems.',
};

export default function PricingPage() {
  const tiers = [
    {
      name: 'MEOW Voice Pilot',
      category: 'Inbound & Outbound Voice Agent',
      indicativeRange: 'Proposed starting from ₹25,000 / setup',
      badge: 'Pilot Engagement',
      description:
        'A dedicated vernacular voice agent configured for your clinic, coaching academy, or service business.',
      features: [
        'Custom Telugu & English dialogue flows',
        'Direct calendar slot locking & double-booking prevention',
        'Emergency symptom / keyword human escalation',
        'Browser & phone test sandbox',
        '2 weeks of post-deployment prompt optimization',
      ],
      ctaText: 'Inquire for Voice Pilot',
      ctaHref: '/contact?service=voice_ai',
    },
    {
      name: 'Custom Workflow Automation',
      category: 'MEOW Automate Core',
      indicativeRange: 'Proposed starting from ₹45,000 / project',
      badge: 'Popular for SMBs',
      description:
        'End-to-end integration connecting your forms, CRMs, WhatsApp Business API, and internal databases.',
      features: [
        'Document intelligence parser (Invoices/Forms)',
        'Bi-directional CRM & spreadsheet synchronization',
        'Human supervisor review gate configuration',
        'Audit logging & failure alert webhooks',
        'Full source code & deployment handover',
      ],
      ctaText: 'Scope Automation Project',
      ctaHref: '/contact?service=automation',
    },
    {
      name: 'Growth & Lead Engine',
      category: 'MEOW Growth Automation',
      indicativeRange: 'Proposed starting from ₹35,000 / setup',
      badge: 'High Conversion',
      description:
        'Systematized customer acquisition pipeline combining structured campaign briefs and automated qualification.',
      features: [
        'Multichannel ad copy & brief generator integration',
        'Instant WhatsApp lead intake & verification bot',
        'Lead scoring & high-value prospect routing',
        'Fast-loading Apple-grade landing page build',
        'Zero-spam opt-in compliance structure',
      ],
      ctaText: 'Build Growth Pipeline',
      ctaHref: '/contact?service=growth',
    },
    {
      name: 'Enterprise Retainer & Copilot',
      category: 'Bespoke AI Engineering',
      indicativeRange: 'Custom Quote',
      badge: 'Dedicated Team',
      description:
        'Ongoing dedicated architectural support, on-premise private LLM deployment, and custom internal copilots.',
      features: [
        'Dedicated senior AI engineer & full-stack architect',
        'Private RAG knowledge base for internal staff',
        'Continuous vernacular model tuning & latency reduction',
        'Priority 4-hour SLA support',
        'Custom security & enterprise compliance audit',
      ],
      ctaText: 'Request Enterprise Scoping',
      ctaHref: '/contact?service=custom_consulting',
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
            <span>TRANSPARENT COMMERCIALS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Clear Pricing.{' '}
            <span className="text-zinc-500">Measurable Deliverables.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Every business has unique call volumes, system software, and compliance needs. We believe in transparent, upfront estimates without hidden maintenance traps.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 p-6 flex flex-col justify-between transition-all text-left"
            >
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

              <Link
                href={tier.ctaHref}
                className="w-full text-center py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all shadow-sm"
              >
                {tier.ctaText}
              </Link>
            </div>
          ))}
        </div>

        {/* Disclosure Banner */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-6 rounded-3xl border border-white/[0.08] bg-zinc-900/30 text-xs text-zinc-400 space-y-2 text-left">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Pricing Transparency Notice</span>
            </div>
            <p className="leading-relaxed">
              *The investment tiers listed above represent proposed starting guidelines based on standard implementation complexity. Final fixed-price contracts are issued following an architectural discovery call to assess your specific API dependencies, telephony call minutes, and custom logic. Telephony carrier charges (e.g. Twilio or Exotel call rates) and direct LLM token costs are billed at actual cost without hidden markups.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

