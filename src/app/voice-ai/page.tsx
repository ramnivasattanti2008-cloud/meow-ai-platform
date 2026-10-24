import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { VoiceAgentDemo } from '@/components/voice/VoiceAgentDemo';
import { CallRecordingShowcase } from '@/components/voice/CallRecordingShowcase';
import { EmbedWidgetSnippetCard } from '@/components/voice/EmbedWidgetSnippetCard';
import {
  PhoneCall,
  CalendarCheck,
  UserCheck,
  Clock,
  ShieldAlert,
  Headphones,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'MEOW Voice AI — Sara: Multilingual Inbound & Outbound Voice Receptionist',
  description:
    'Empathetic, hyper-realistic voice receptionist Sara speaking in 8 Indian languages (Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, English). Handles appointment bookings, lead qualification, and customer triage.',
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
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white/20">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>VERNACULAR VOICE ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
            Voice Agents That Speak Your Customers’ Language.{' '}
            <span className="text-zinc-500">Naturally.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Engineered for multilingual communication. Voiced by <strong>Sara</strong> — a responsive, natural voice agent speaking fluently in Telugu (తెలుగు), Hindi (हिन्दी), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Bengali (বাংলা), and Indian English. Backed by real calendar slot locking and safety escalation.
          </p>
        </div>

        {/* Live Interactive Voice Agent Demo Sandbox */}
        <section id="voice-agent-sandbox" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-28">
          <VoiceAgentDemo />
        </section>

        {/* Live Call Transcripts & Recording Showcase */}
        <section id="call-recording-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-28">
          <CallRecordingShowcase />
        </section>

        {/* 1-Click Embeddable Web Widget Studio */}
        <section id="embed-widget-studio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 scroll-mt-28">
          <EmbedWidgetSnippetCard />
        </section>

        {/* Practical Applications Grid */}
        <section className="py-20 border-t border-white/[0.08] bg-zinc-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
                PRACTICAL APPLICATIONS
              </h2>
              <h3 className="text-3xl font-bold text-white">Where Voice Telephony Delivers Value</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((uc, idx) => {
                const Icon = uc.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 transition-all space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white">
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

        {/* CTA */}
        <section className="pt-20 pb-12 text-center max-w-3xl mx-auto px-4 border-t border-white/[0.08]">
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

