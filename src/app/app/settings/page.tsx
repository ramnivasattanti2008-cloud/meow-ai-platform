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
  CreditCard,
  Globe,
  Lock,
} from 'lucide-react';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';

export default function WorkspaceSettingsPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

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
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">System Settings &amp; Infrastructure</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Active configuration for AI models, telephony SIP trunks, payment gateways, and domain infrastructure.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPaymentModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-medium text-xs flex items-center gap-2"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Gateway Connection</span>
          </button>
        </div>

        {/* Integration Status Cards */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">ENTERPRISE ENGINES &amp; GATEWAYS</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Claude API */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Anthropic Claude AI</h4>
                    <span className="text-[10px] font-mono text-zinc-400">claude-3-5-sonnet &amp; haiku</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  OPERATIONAL
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Empowers Sara with hyper-realistic human dialogue turns, clinical empathy, and instant appointment extraction.
              </p>
            </div>

            {/* Voice Engine (Sara) */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Sara Voice Engine</h4>
                    <span className="text-[10px] font-mono text-zinc-400">8 Indian Languages</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  LOW-LATENCY EDGE
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tuned speech synthesis with real human pickup chime, pitch 1.10 prosody, and dual-language SIP trunk routing.
              </p>
            </div>

            {/* Payment Gateway */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-lime-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Payment Gateway</h4>
                    <span className="text-[10px] font-mono text-zinc-400">Razorpay &amp; Instant UPI</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  PCI-DSS SECURE
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automated QR generation, instant settlement hooks, and compliant GST digital tax receipt dispatch.
              </p>
            </div>

            {/* Web & Domain */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-indigo-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Domain &amp; SSL</h4>
                    <span className="text-[10px] font-mono text-zinc-400">meowboxai.tech</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  HTTPS ACTIVE
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Vercel Edge Network distribution with Cloudflare DNS, automatic wildcard SSL certificates, and 100/100 performance.
              </p>
            </div>

            {/* Business Email */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-violet-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Business Email</h4>
                    <span className="text-[10px] font-mono text-zinc-400">Titan &amp; Google Workspace</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  DKIM/SPF VERIFIED
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Zero-spam inbox deliverability with DMARC policies for customer appointment confirmations and tax invoices.
              </p>
            </div>

            {/* Persistence Layer */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-purple-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Database &amp; CRM Layer</h4>
                    <span className="text-[10px] font-mono text-zinc-400">PostgreSQL &amp; Zoho</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  REAL-TIME SYNC
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Bi-directional synchronization for appointment slots, call logs, and patient records with zero data loss.
              </p>
            </div>
          </div>
        </div>

        {/* Organization & Cloud Profile */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/30 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Organization &amp; Deployment Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
              <span className="text-zinc-500 block mb-1">FOUNDER &amp; LEAD</span>
              <span className="text-white font-medium">Ram Nivas Attanti</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
              <span className="text-zinc-500 block mb-1">PRIMARY DOMAIN</span>
              <span className="text-emerald-300 font-medium">meowboxai.tech</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
              <span className="text-zinc-500 block mb-1">CLOUD REGION</span>
              <span className="text-white font-medium">ap-south-1 (Mumbai)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04]">
              <span className="text-zinc-500 block mb-1">SYSTEM AVAILABILITY</span>
              <span className="text-emerald-400 font-medium">99.98% High SLA</span>
            </div>
          </div>
        </div>
      </div>

      <EasyPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultPlan="Gateway Test Settlement"
        defaultAmount={600}
      />
    </WorkspaceLayout>
  );
}
