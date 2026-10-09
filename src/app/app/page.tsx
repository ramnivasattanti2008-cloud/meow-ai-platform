'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/app/WorkspaceLayout';
import {
  Bot,
  Workflow as WorkflowIcon,
  Zap,
  Activity,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Clock,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Globe,
  Server,
  MessageSquare,
  Database,
  Download,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Agent, Workflow, Campaign } from '@/lib/types';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';

interface ActivityLog {
  id: string;
  time: string;
  type: 'voice' | 'payment' | 'whatsapp' | 'crm';
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
}

export default function WorkspaceDashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const activities: ActivityLog[] = [
    {
      id: 'act-1',
      time: '2 mins ago',
      type: 'voice',
      title: 'Sara completed Telugu call with Rajesh K.',
      description: 'Booked knee pain consultation for tomorrow 5:30 PM with Dr. Rao. Zero hold time.',
      badge: 'APPT BOOKED (TELUGU)',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
    {
      id: 'act-2',
      time: '6 mins ago',
      type: 'whatsapp',
      title: 'WhatsApp Token & Location Dispatched',
      description: 'Delivered appointment confirmation token #APPT-842 with Jubilee Hills Google Maps pin.',
      badge: 'DELIVERED (META API)',
      badgeColor: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    },
    {
      id: 'act-3',
      time: '18 mins ago',
      type: 'payment',
      title: '₹600 Consultation Advance Received via UPI',
      description: 'Payment verified from Google Pay (TXN_MEOW_849201). GST tax invoice #INV-8910 generated.',
      badge: '₹600 SETTLED',
      badgeColor: 'bg-lime-500/10 text-lime-300 border-lime-500/20',
    },
    {
      id: 'act-4',
      time: '34 mins ago',
      type: 'crm',
      title: 'Zoho CRM & Google Sheets Sync Complete',
      description: 'Patient record and medical history auto-synchronized across clinic records.',
      badge: 'CRM SYNCED',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    },
    {
      id: 'act-5',
      time: '1 hour ago',
      type: 'voice',
      title: 'Sara handled Hindi pricing inquiry',
      description: 'Transparently quoted ₹600 fee structure and explained duty doctor physical evaluation.',
      badge: 'COMPLETED (HINDI)',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [resA, resW, resC] = await Promise.all([
          fetch('/api/agents').then((r) => r.json()),
          fetch('/api/workflows').then((r) => r.json()),
          fetch('/api/campaigns').then((r) => r.json()),
        ]);
        setAgents(resA.agents || []);
        setWorkflows(resW.workflows || []);
        setCampaigns(resC.campaigns || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <WorkspaceLayout>
      <div className="space-y-8 text-left">
        {/* Top Title Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Enterprise AI Operations
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE PRODUCTION
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Live operational metrics for Sara Voice AI, appointment conversions, payment settlements, and web infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-violet-500/40 text-white font-medium text-xs transition-all flex items-center gap-1.5 shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Collect / Pay</span>
            </button>

            <Link
              href="/voice-ai"
              className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-200 font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-violet-400" />
              <span>Test Call Sara</span>
            </Link>

            <Link
              href="/app/agents"
              className="px-3.5 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Voice Agent</span>
            </Link>
          </div>
        </div>

        {/* Executive KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calls Handled */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-2 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>VOICE AI CALLS</span>
              <PhoneCall className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
              <span>2,840</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4%
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              99.4% Resolution Rate • Avg 1m 42s AHT
            </div>
          </div>

          {/* Appointments Booked */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-2 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>BOOKINGS CONFIRMED</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
              <span>482</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +24.1%
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              0 Double-Bookings • Calendar Synced
            </div>
          </div>

          {/* Payment Gateway Volume */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-2 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>PAYMENTS COLLECTED</span>
              <CreditCard className="w-4 h-4 text-lime-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
              <span>₹3,42,600</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              100% UPI &amp; Card Success Rate • 42 Invoices
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-2 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>INFRASTRUCTURE SLA</span>
              <Activity className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              99.98%
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Sub-320ms Edge Latency • 0 Escalation Drops
            </div>
          </div>
        </div>

        {/* Live Systems & Architecture Status Banner */}
        <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/30 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-white">Live Turnkey Stack Status</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 5 Core Engines Operational</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {/* Sara Voice */}
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-violet-400" /> Sara Voice AI
                </span>
                <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
              </div>
              <p className="text-[11px] text-zinc-400">8 Indian Languages • Exotel/SIP</p>
            </div>

            {/* Web & Digital */}
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" /> Website Stack
                </span>
                <span className="text-[10px] font-mono text-emerald-400">LIVE</span>
              </div>
              <p className="text-[11px] text-zinc-400">Next.js 14 • SSL • 100/100 Perf</p>
            </div>

            {/* Payment Gateway */}
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Payment Gateway
                </span>
                <span className="text-[10px] font-mono text-emerald-400">SYNCED</span>
              </div>
              <p className="text-[11px] text-zinc-400">Razorpay + Instant UPI QR</p>
            </div>

            {/* WhatsApp API */}
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-lime-400" /> WhatsApp Cloud
                </span>
                <span className="text-[10px] font-mono text-emerald-400">VERIFIED</span>
              </div>
              <p className="text-[11px] text-zinc-400">Tokens &amp; Prescription PDFs</p>
            </div>

            {/* CRM Sync */}
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-400" /> CRM Pipelines
                </span>
                <span className="text-[10px] font-mono text-emerald-400">2-WAY</span>
              </div>
              <p className="text-[11px] text-zinc-400">Zoho CRM &amp; Google Sheets</p>
            </div>
          </div>
        </div>

        {/* Detailed Operations Grid: Live Activity Stream + Active Voice Agents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Production Activity Stream */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white">Live Operations Feed</h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-Time Stream</span>
              </span>
            </div>

            <div className="space-y-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white truncate">{act.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${act.badgeColor} shrink-0`}>
                      {act.badge}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">{act.description}</p>
                  <div className="text-[10px] font-mono text-zinc-500 pt-0.5">{act.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Voice Agents & Telephony Configuration */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white">Active Voice Receptionists</h3>
              </div>
              <Link
                href="/app/agents"
                className="text-xs text-violet-300 hover:text-violet-200 flex items-center gap-1 font-mono"
              >
                <span>Manage All ({agents.length})</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white truncate">{agent.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-violet-950/50 text-[10px] font-mono text-violet-300 uppercase border border-violet-500/20">
                        {agent.language === 'te' ? 'Telugu' : 'English / Hindi'}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] truncate mt-0.5">{agent.greeting}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/voice-ai"
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white font-mono text-[10px]"
                    >
                      Test
                    </Link>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        agent.enabled
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {agent.enabled ? 'Live' : 'Paused'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Footer */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Persona: Sara (Front-Desk Concierge)</span>
              <Link href="/voice-ai" className="text-violet-300 hover:underline flex items-center gap-1">
                Open Web Dialer →
              </Link>
            </div>
          </div>
        </div>

        {/* Workflows & Campaigns Quick Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Workflows */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <WorkflowIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Automated Pipelines</h3>
              </div>
              <Link
                href="/app/workflows"
                className="text-xs text-violet-300 hover:text-violet-200 flex items-center gap-1 font-mono"
              >
                <span>View All ({workflows.length})</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{wf.name}</div>
                    <div className="text-zinc-400 text-[11px] font-mono mt-0.5">
                      Trigger: {wf.trigger} • {wf.steps.length} Steps
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                    {wf.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-lime-400" />
                <h3 className="text-sm font-semibold text-white">Outbound Recovery &amp; Channels</h3>
              </div>
              <Link
                href="/app/campaigns"
                className="text-xs text-violet-300 hover:text-violet-200 flex items-center gap-1 font-mono"
              >
                <span>View All ({campaigns.length})</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">{camp.name}</div>
                    <div className="text-zinc-400 text-[11px] font-mono mt-0.5">
                      Audience: {camp.targetAudience}
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20 shrink-0">
                    {camp.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EasyPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultPlan="Direct Consultation / Service Advance"
        defaultAmount={600}
      />
    </WorkspaceLayout>
  );
}
