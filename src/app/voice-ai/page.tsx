import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { VoiceAgentDemo } from '@/components/voice/VoiceAgentDemo';
import { CallRecordingShowcase } from '@/components/voice/CallRecordingShowcase';
import {
  PhoneCall,
  CalendarCheck,
  UserCheck,
  Clock,
  ShieldAlert,
  Headphones,
  CheckCircle2,
  Terminal,
  Globe2,
  Server,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'MEOW Voice AI — Multilingual Inbound & Outbound Voice Agents',
  description:
    'Conversational voice agents speaking native Telugu and Indian English. Handles appointment bookings, lead qualification, and after-hours customer support with human handoffs.',
};

export default function VoiceAiPage() {
  const useCases = [
    {
      title: 'Inbound Customer Support & Triage',
      desc: 'Answers high-frequency questions on timings, pricing, location, and service availability without hold times.',
      icon: Headphones,
    },
    {
      title: 'Appointment & Consultation Scheduling',
      desc: 'Checks actual doctor or advisor calendar availability and locks slot reservations during the live call.',
      icon: CalendarCheck,
    },
    {
      title: 'High-Intent Lead Qualification',
      desc: 'Asks targeted questions (budget, location, timeline) for real estate or educational admissions.',
      icon: UserCheck,
    },
    {
      title: 'After-Hours Missed Call Recovery',
      desc: 'Automatically triggers an outbound callback within 60 seconds of a missed call after 7 PM.',
      icon: Clock,
    },
    {
      title: 'Order Status & Logistics Updates',
      desc: 'Retrieves tracking links and delivery status from database records to resolve customer status inquiries.',
      icon: Layers,
    },
    {
      title: 'Guaranteed Human Handoff Routing',
      desc: 'Detects frustration, medical emergencies, or explicit human requests and transfers immediately to staff.',
      icon: ShieldAlert,
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
            <span>VERNACULAR VOICE ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Voice Agents That Speak Your Customers’ Language.{' '}
            <span className="text-zinc-500">Naturally.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Engineered for India’s multilingual reality. Native dialogue in Telugu (తెలుగు) and English, backed by deterministic slot reservation and responsible human escalation.
          </p>
        </div>

        {/* Live Interactive Voice Agent Demo Sandbox */}
        <section id="voice-agent-sandbox" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-28">
          <VoiceAgentDemo />
        </section>

        {/* Live Call Transcripts & Recording Showcase */}
        <section id="call-recording-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 scroll-mt-28">
          <CallRecordingShowcase />
        </section>

        {/* Practical Applications Grid */}
        <section className="py-20 border-t border-white/[0.08] bg-zinc-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-2">
                PRACTICAL APPLICATIONS
              </h2>
              <h3 className="text-3xl font-bold text-white">Where MEOW Voice Delivers Tangible Value</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((uc, idx) => {
                const Icon = uc.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 transition-all space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-semibold text-white">{uc.title}</h4>
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{uc.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Production Telephony Architecture Guide */}
        <section className="py-20 border-t border-white/[0.08] bg-zinc-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-8 sm:p-10 space-y-6 text-left">
              <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Production Telephony Architecture</h3>
                  <p className="text-xs text-zinc-400">How our engine connects to real PSTN / SIP phone networks</p>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                The sandbox above runs directly inside your web browser. In commercial production deployments, MEOW connects via secure server-side SIP trunks to established telecom aggregators:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.06] space-y-1">
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-violet-400" />
                    Indian Operators (Exotel / Airtel)
                  </div>
                  <p className="text-zinc-400 font-sans text-xs">
                    Local 080 / 040 virtual numbers compliant with Department of Telecommunications (DoT) regulations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-white/[0.06] space-y-1">
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-violet-400" />
                    Global Gateways (Twilio / LiveKit)
                  </div>
                  <p className="text-zinc-400 font-sans text-xs">
                    Ultra-low-latency WebRTC and SIP routing for international inquiries.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <strong>Responsible Telephony Commitment:</strong> We never deploy automated predictive dialers, unsolicited cold callers, or deceptive bots. MEOW Voice is strictly configured for inbound customer inquiries and explicit double-opt-in follow-ups.
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-16 text-center max-w-3xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Deploy a dedicated voice agent for your business
          </h3>
          <p className="text-zinc-400 text-sm mb-8">
            Tell us about your call volume and language requirements. We will configure and test a pilot agent tailored to your clinic or service.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all"
            >
              Request Custom Voice Setup
            </Link>
            <Link
              href="/app/agents"
              className="px-6 py-3 rounded-full bg-zinc-800 text-white font-medium text-xs hover:bg-zinc-700 border border-white/10 transition-all"
            >
              Explore Agent Configs
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

