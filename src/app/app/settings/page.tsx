'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/app/WorkspaceLayout';
import {
  Settings,
  ShieldCheck,
  Key,
  Server,
  Database,
  Mail,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  UserCheck,
} from 'lucide-react';

export default function WorkspaceSettingsPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHealth() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setHealthData(data);
      } catch (err) {
        console.error('Health load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHealth();
  }, []);

  return (
    <WorkspaceLayout>
      <div className="space-y-8 text-left">
        {/* Header */}
        <div className="pb-6 border-b border-white/[0.08]">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">System Settings &amp; Integrations</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time status of server-side AI provider keys, telephony gateways, and persistence engines.
          </p>
        </div>

        {/* Integration Status Cards */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">PROVIDER HEALTH &amp; MODES</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Claude API */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Anthropic Claude API</h4>
                    <span className="text-[10px] font-mono text-zinc-400">claude-3-5-sonnet &amp; haiku</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    healthData?.providers?.ai?.configured
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-300 border border-white/10'
                  }`}
                >
                  {healthData?.providers?.ai?.configured ? 'LIVE API READY' : 'SIMULATION MODE'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {healthData?.providers?.ai?.configured
                  ? 'Active. Live prompts route to Anthropic API via secure server proxy.'
                  : 'Operating in High-Fidelity Simulation Mode. No credentials are leaked to browser bundles. To connect your live key, add ANTHROPIC_API_KEY in your hosting dashboard or .env.local.'}
              </p>
            </div>

            {/* Voice Provider */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Multilingual Voice Engine</h4>
                    <span className="text-[10px] font-mono text-zinc-400">Telugu &amp; English</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  BROWSER &amp; SERVER READY
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Processes speech turns using browser Web Speech API with dual-language fallback. Telephony adapter interfaces ready for Twilio/Exotel SIP gateways.
              </p>
            </div>

            {/* Email Provider */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-lime-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Transactional Email</h4>
                    <span className="text-[10px] font-mono text-zinc-400">Contact Form Inquiries</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-white/10">
                  {healthData?.providers?.email?.configured ? 'LIVE DISPATCH' : 'LOCAL STORE QUEUE'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Contact submissions are securely retained in local storage. Connect Resend or Zoho SMTP for production delivery.
              </p>
            </div>

            {/* Storage Engine */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Persistence Layer</h4>
                    <span className="text-[10px] font-mono text-zinc-400">Development Store</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  DEVELOPMENT STORAGE
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                In-memory and browser-session persistence active. Clean separation from production PostgreSQL to prevent test data pollution.
              </p>
            </div>
          </div>
        </div>

        {/* Startup & Organization Profile */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/30 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Organization Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
              <span className="text-zinc-500 block mb-1">FOUNDER</span>
              <span className="text-white font-medium">Ram Nivas Attanti</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
              <span className="text-zinc-500 block mb-1">ACADEMIC AFFILIATION</span>
              <span className="text-white font-medium">Jain University, Bengaluru</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
              <span className="text-zinc-500 block mb-1">PROGRAM READINESS</span>
              <span className="text-violet-300 font-medium">Claude Startups Dossier Ready</span>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

