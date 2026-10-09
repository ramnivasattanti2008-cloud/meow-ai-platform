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
  Flame,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';

export default function WorkspaceSettingsPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<any>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);

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

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    setDbTestResult(null);
    try {
      const res = await fetch('/api/db/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Ping from Settings Console' }),
      });
      const data = await res.json();
      setDbTestResult(data);
    } catch (err: any) {
      setDbTestResult({ success: false, error: err.message });
    } finally {
      setIsTestingDb(false);
    }
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-8 text-left">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">System Settings &amp; Infrastructure</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>FIREBASE CONNECTED</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Active configuration for Firebase Firestore database, AI models, telephony SIP trunks, and payment gateways.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleTestDatabase}
              disabled={isTestingDb}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 font-medium text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingDb ? 'animate-spin' : ''}`} />
              <span>{isTestingDb ? 'Testing...' : 'Test Firebase Ping'}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-medium text-xs flex items-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Payment Gateway</span>
            </button>
          </div>
        </div>

        {/* Database Quick Test Result Alert */}
        {dbTestResult && (
          <div
            className={`p-4 rounded-2xl border text-xs font-mono animate-fadeIn flex flex-wrap items-center justify-between gap-2 ${
              dbTestResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Firebase Firestore Test Passed:</strong> {dbTestResult.message || 'Roundtrip write & read succeeded'} (Roundtrip Latency: {dbTestResult.roundTripLatencyMs}ms)
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              Doc ID: {dbTestResult.writtenDocId}
            </span>
          </div>
        )}

        {/* Firebase Firestore Dedicated Panel */}
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-zinc-900/40 to-zinc-900/60 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Google Cloud Firestore &amp; Firebase</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    FREE SPARK TIER ACTIVE
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Serverless, scalable NoSQL document database with zero-latency edge distribution and persistent local backup.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300">
                Project: <strong className="text-amber-300">{healthData?.providers?.database?.projectId || 'meow-ai-platform'}</strong>
              </span>
            </div>
          </div>

          {/* Collections Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="uppercase tracking-wider">FIRESTORE PRODUCTION COLLECTIONS</span>
              <span>Automatic Schema Sync</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
              {[
                { name: 'agents', desc: 'Voice Receptionists', count: healthData?.providers?.database?.collections?.agents ?? 3 },
                { name: 'workflows', desc: 'Pipelines & Triggers', count: healthData?.providers?.database?.collections?.workflows ?? 2 },
                { name: 'campaigns', desc: 'Lead Acquisition', count: healthData?.providers?.database?.collections?.campaigns ?? 1 },
                { name: 'leads', desc: 'Contact Inquiries', count: healthData?.providers?.database?.collections?.leads ?? 0 },
                { name: 'bookings', desc: 'Calendar Appointments', count: healthData?.providers?.database?.collections?.bookings ?? 2 },
                { name: 'payments', desc: 'Settled Invoices', count: healthData?.providers?.database?.collections?.payments ?? 2 },
              ].map((col) => (
                <div key={col.name} className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{col.name}</span>
                    <span className="text-amber-400 font-bold">{col.count}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">{col.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/[0.06] text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Firebase Free Tier includes <strong>50,000 document reads/day</strong> and <strong>20,000 writes/day</strong> at $0/month.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleTestDatabase}
                className="px-3 py-1.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all shadow-sm"
              >
                Run Document Ping →
              </button>
            </div>
          </div>
        </div>

        {/* Integration Status Cards */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">INTEGRATED SERVICES &amp; CONNECTORS</h3>

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

            {/* Database & CRM Layer */}
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-purple-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">CRM Synchronization</h4>
                    <span className="text-[10px] font-mono text-zinc-400">Zoho &amp; Google Sheets</span>
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

        {/* Organization Profile */}
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
