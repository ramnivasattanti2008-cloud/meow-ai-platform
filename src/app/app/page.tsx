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
  Calendar,
  Layers,
  Palette,
} from 'lucide-react';
import Link from 'next/link';
import { Agent, Workflow, Campaign } from '@/lib/types';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';
import { AppointmentsHub } from '@/components/dashboard/AppointmentsHub';
import { PaymentLinkGenerator } from '@/components/dashboard/PaymentLinkGenerator';
import { CustomAgentWizardModal } from '@/components/voice/CustomAgentWizardModal';
import { WebsiteStudioModal } from '@/components/services/WebsiteStudioModal';

export default function WorkspaceDashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [websiteStudioOpen, setWebsiteStudioOpen] = useState(false);

  // Active view tab in dashboard
  const [activeTab, setActiveTab] = useState<'appointments' | 'payments' | 'agents' | 'workflows'>('appointments');

  const loadData = async () => {
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
  };

  useEffect(() => {
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
                Enterprise Operations Command
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                FIREBASE SYNCED
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Live operational controls for patient bookings, phone receptionist calls, UPI payment collections, and web infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Action: Generate AI Receptionist */}
            <button
              type="button"
              onClick={() => setWizardModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Receptionist</span>
            </button>

            {/* Quick Action: Website Studio */}
            <button
              type="button"
              onClick={() => setWebsiteStudioOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-medium text-xs transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Website Studio</span>
            </button>

            {/* Quick Action: Payment Link */}
            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-medium text-xs transition-all flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Collect / Pay</span>
            </button>

            <Link
              href="/voice-ai"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-mono text-xs transition-all flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-violet-400" />
              <span>Sara Web Dialer</span>
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
              <span>APPOINTMENTS CONFIRMED</span>
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
              <span>REVENUE SETTLED</span>
              <CreditCard className="w-4 h-4 text-lime-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
              <span>₹3,42,600</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              100% UPI &amp; Card Success Rate • 42 GST Invoices
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-2 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>FIRESTORE CLUSTER</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              99.98%
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Google Cloud Edge • Sub-280ms Roundtrip
            </div>
          </div>
        </div>

        {/* Tab Switcher for Operational Workspaces */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/60 border border-white/[0.06] overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'appointments'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4 text-violet-400" />
            <span>Appointments &amp; Patients CRM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'payments'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>UPI &amp; Payment Links</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('agents')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'agents'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Voice Receptionists ({agents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workflows')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'workflows'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <WorkflowIcon className="w-4 h-4 text-lime-400" />
            <span>Workflows &amp; Pipelines ({workflows.length})</span>
          </button>
        </div>

        {/* Tab 1: Interactive Appointments & Patient CRM */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <AppointmentsHub />
          </div>
        )}

        {/* Tab 2: Dynamic Payment Links & UPI QR */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <PaymentLinkGenerator />
          </div>
        )}

        {/* Tab 3: Registered Voice Agents Table & Custom Generator */}
        {activeTab === 'agents' && (
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-violet-400" />
                  <span>Configured Voice Receptionists</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Multilingual AI agents ready to answer inbound calls and recover missed bookings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWizardModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate New Receptionist</span>
                </button>
                <Link
                  href="/app/agents"
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-mono text-xs transition-all"
                >
                  Manage All →
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.06] hover:border-white/15 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{agent.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-violet-950/60 border border-violet-500/20 text-[10px] font-mono text-violet-300 uppercase">
                        {agent.language}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs line-clamp-1">{agent.greeting}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/voice-ai"
                      className="px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-200 font-semibold text-xs flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-violet-400" />
                      <span>Test Call</span>
                    </Link>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        agent.enabled
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {agent.enabled ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Workflows & Automations */}
        {activeTab === 'workflows' && (
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/40 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <WorkflowIcon className="w-5 h-5 text-emerald-400" />
                  <span>Automation Pipelines</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Deterministic event triggers, Claude intent extraction, and CRM synchronization.
                </p>
              </div>

              <Link
                href="/platform"
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Open Visual Builder Canvas</span>
              </Link>
            </div>

            <div className="space-y-3">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.06] flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{wf.name}</div>
                    <div className="text-zinc-400 font-mono text-[11px] mt-0.5">
                      Trigger: {wf.trigger} • {wf.steps.length} Steps
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase font-bold">
                    {wf.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom AI Receptionist Wizard Modal */}
      <CustomAgentWizardModal
        isOpen={wizardModalOpen}
        onClose={() => setWizardModalOpen(false)}
        onAgentCreated={(newAgent) => {
          setAgents((prev) => [newAgent, ...prev]);
        }}
      />

      {/* Website & Tech Setup Studio Modal */}
      <WebsiteStudioModal
        isOpen={websiteStudioOpen}
        onClose={() => setWebsiteStudioOpen(false)}
      />

      {/* Payment Gateway Modal */}
      <EasyPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultPlan="Direct Consultation / Service Advance"
        defaultAmount={600}
      />
    </WorkspaceLayout>
  );
}
