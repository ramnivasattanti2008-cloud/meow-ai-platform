'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  MessageSquare,
  Database,
  FileText,
  Bot,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Server,
  Calendar,
  Lock,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

interface AutomationModule {
  id: string;
  name: string;
  category: string;
  description: string;
  typicalRoi: string;
  icon: any;
}

const AUTOMATION_MODULES: AutomationModule[] = [
  {
    id: 'voice-sara',
    name: 'Voice AI Telephony (Sara Engine)',
    category: 'Conversational Telephony',
    description:
      '24/7 inbound clinic booking, after-hours missed call recovery in 60s, SIP trunking with Exotel/Twilio in Telugu, Hindi & English.',
    typicalRoi: 'Recovers 35-50 missed bookings monthly',
    icon: PhoneCall,
  },
  {
    id: 'whatsapp-meta',
    name: 'Meta WhatsApp Business API Automation',
    category: 'Direct Messaging',
    description:
      'Official Meta Cloud API integration. Instant appointment tokens, Google Maps location pins, PDF lab report dispatch, and catalog checkout.',
    typicalRoi: '98% open rate, cuts no-shows by 40%',
    icon: MessageSquare,
  },
  {
    id: 'crm-sync',
    name: 'CRM & Database Auto-Sync Pipelines',
    category: 'System Integration',
    description:
      'Zero-loss two-way webhooks connecting WhatsApp, inbound calls, and web forms directly into Zoho CRM, HubSpot, Google Sheets, or PostgreSQL.',
    typicalRoi: 'Saves 15 staff hours weekly in manual data entry',
    icon: Database,
  },
  {
    id: 'document-ocr',
    name: 'Multimodal Document & OCR Intelligence',
    category: 'Data Extraction',
    description:
      'Transforms unstructured patient doctor prescriptions, diagnostic lab reports, and vendor tax invoices into verified structured JSON records.',
    typicalRoi: 'Sub-second structured extraction with 99.4% precision',
    icon: FileText,
  },
  {
    id: 'reasoning-agents',
    name: 'Bespoke Multi-Step AI Agent Workflows',
    category: 'Autonomous Agents',
    description:
      'Stateful reasoning agents equipped with deterministic business rules and Slack/WhatsApp decision gates before executing sensitive updates.',
    typicalRoi: 'Eliminates repetitive escalation bottlenecks',
    icon: Bot,
  },
  {
    id: 'speed-to-lead',
    name: 'Omnichannel <60s Speed-to-Call Recovery',
    category: 'Lead Acceleration',
    description:
      'Instant voice callout triggered within 60 seconds of a Meta Lead ad or Google form submission to qualify budget and book private site visits.',
    typicalRoi: 'Increases conversion rate from lead to visit by 3.8x',
    icon: Zap,
  },
];

const LANGUAGES = [
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'hi', label: 'Hindi (हिन्दी)' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
  { code: 'en', label: 'Indian English' },
];

export const AutomationSuiteConfigurator: React.FC = () => {
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'voice-sara',
    'whatsapp-meta',
    'crm-sync',
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['te', 'en']);

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((m) => m !== id) : prev) : [...prev, id]
    );
  };

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code)
        ? prev.length > 1
          ? prev.filter((l) => l !== code)
          : prev
        : [...prev, code]
    );
  };

  return (
    <div className="w-full rounded-3xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-10 shadow-glass text-left space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-mono text-violet-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>INTERACTIVE ARCHITECTURE CONFIGURATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Assemble Your Custom AI Automation Stack
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Select the automation modules and vernacular languages required for your business operations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-zinc-900/90 px-3.5 py-2 rounded-2xl border border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-300">Turnaround: 3–5 Business Days</span>
        </div>
      </div>

      {/* Grid: Modules Selection */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          1. SELECT AUTOMATION MODULES ({selectedModules.length} selected)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AUTOMATION_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isSelected = selectedModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                  isSelected
                    ? 'border-violet-500 bg-violet-600/10 shadow-sm'
                    : 'border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                      isSelected
                        ? 'bg-violet-600 text-white border-violet-400/30'
                        : 'bg-zinc-800 text-zinc-400 border-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : 'border-zinc-700 bg-zinc-900'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider">
                    {mod.category}
                  </span>
                  <h5 className="text-sm font-bold text-white mt-0.5">{mod.name}</h5>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{mod.description}</p>
                </div>

                <div className="pt-2 border-t border-white/[0.04] text-[11px] font-mono text-emerald-400">
                  ⚡ {mod.typicalRoi}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Languages Selection */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          2. SELECT VERNACULAR DIALOGUE LANGUAGES ({selectedLanguages.length} selected)
        </h4>

        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => {
            const isSelected = selectedLanguages.includes(l.code);
            return (
              <button
                key={l.code}
                onClick={() => toggleLanguage(l.code)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm border border-white/20'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-white/[0.06]'
                }`}
              >
                <span>{l.label}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Architecture Pipeline Diagram */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-300 uppercase tracking-wider">
            YOUR CONFIGURED SYSTEM PIPELINE
          </span>
          <span className="text-violet-400">Zero-Loss Event Bus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Step 1: Ingestion</span>
            <div className="font-semibold text-white">Event Triggers</div>
            <p className="text-[11px] text-zinc-400">
              Inbound SIP Trunk / Meta Ads Webhook / Form Submit
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono text-violet-400 uppercase">
              Step 2: Sara AI Reasoning
            </span>
            <div className="font-semibold text-white">Multilingual Parsing</div>
            <p className="text-[11px] text-zinc-400">
              {selectedLanguages
                .map((code) => LANGUAGES.find((l) => l.code === code)?.label.split(' ')[0])
                .join(', ')}{' '}
              turn dialogue &amp; tool extraction
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 uppercase">
              Step 3: Business Sync
            </span>
            <div className="font-semibold text-white">Database &amp; WhatsApp</div>
            <p className="text-[11px] text-zinc-400">
              Slot Lock → Zoho/HubSpot Update → WhatsApp Dispatch
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase">
              Step 4: Guardrail
            </span>
            <div className="font-semibold text-white">Human Oversight</div>
            <p className="text-[11px] text-zinc-400">
              Deterministic escalation gates for emergencies &amp; high-value clients
            </p>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="text-xs font-mono text-zinc-400">
            Selected: <strong className="text-white">{selectedModules.length} Modules</strong> in{' '}
            <strong className="text-white">{selectedLanguages.length} Languages</strong>
          </div>
          <p className="text-xs text-zinc-500">
            Deployed directly on your cloud infrastructure with verified source code ownership.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg active:scale-95"
          >
            <span>Book 30-Min Architecture Session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

