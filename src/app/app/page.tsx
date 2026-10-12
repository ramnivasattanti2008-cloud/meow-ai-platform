'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/app/WorkspaceLayout';
import {
  Bot,
  Zap,
  Activity,
  CheckCircle2,
  PhoneCall,
  TrendingUp,
  CreditCard,
  Globe,
  Sparkles,
  Calendar,
  Layers,
  Brain,
  FileText,
  UserCheck,
  FolderKanban,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import { Agent, Workflow, Campaign } from '@/lib/types';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';
import { AppointmentsHub } from '@/components/dashboard/AppointmentsHub';
import { PaymentLinkGenerator } from '@/components/dashboard/PaymentLinkGenerator';
import { CustomAgentWizardModal } from '@/components/voice/CustomAgentWizardModal';
import { WebsiteStudioModal } from '@/components/services/WebsiteStudioModal';
import { SaraDialerModal } from '@/components/voice/SaraDialerModal';
import { GoalExecutionHub } from '@/components/dashboard/GoalExecutionHub';
import { ResumeCareerStudio } from '@/components/career/ResumeCareerStudio';
import { MemoryVaultHub } from '@/components/dashboard/MemoryVaultHub';
import { AiEmployeesHub } from '@/components/dashboard/AiEmployeesHub';
import { UniversalAiCopilot } from '@/components/assistant/UniversalAiCopilot';

export default function WorkspaceDashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [websiteStudioOpen, setWebsiteStudioOpen] = useState(false);
  const [dialerOpen, setDialerOpen] = useState(false);

  // Active view tab in dashboard: Apple-style segmented navigation
  const [activeTab, setActiveTab] = useState<
    'goals' | 'copilot' | 'resume' | 'employees' | 'appointments' | 'payments' | 'memory'
  >('goals');

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
        {/* Top Title Banner: Apple Minimalist Aesthetic */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                MEOW Command Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-zinc-300 border border-white/[0.08] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              One execution engine for goals, voice agents, career deliverables, and client operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Action: Live Sara Dialer */}
            <button
              type="button"
              onClick={() => setDialerOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Sara Dialer</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Quick Action: Generate AI Receptionist */}
            <button
              type="button"
              onClick={() => setWizardModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-200 text-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>New Receptionist</span>
            </button>

            {/* Quick Action: Website Studio */}
            <button
              type="button"
              onClick={() => setWebsiteStudioOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-200 text-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>Website Studio</span>
            </button>

            {/* Quick Action: Payment Link */}
            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-200 text-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
              <span>Payment Link</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Stats Grid: Crisp Apple-style Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Goals Executed */}
          <div className="p-5 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-2 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>GOALS EXECUTED</span>
              <Target className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
              <span>100%</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> Outcomes Verified
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Research → Prepare → Organize → Review
            </div>
          </div>

          {/* Voice Calls Handled */}
          <div className="p-5 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-2 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>SARA VOICE CALLS</span>
              <PhoneCall className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
              <span>2,840</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +18.4%
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              8 Indian Languages • 99.4% Resolution
            </div>
          </div>

          {/* Appointments Booked */}
          <div className="p-5 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-2 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>APPOINTMENTS CONFIRMED</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
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
          <div className="p-5 rounded-3xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-xl space-y-2 hover:border-white/15 transition-all">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>SETTLED REVENUE</span>
              <CreditCard className="w-4 h-4 text-lime-400" />
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
              <span>₹3,42,600</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              100% UPI &amp; Card Rate • 42 GST Invoices
            </div>
          </div>
        </div>

        {/* Tab Switcher: Apple-style Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-900/70 border border-white/[0.08] backdrop-blur-2xl overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('goals')}
            className={`py-1.5 px-3.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'goals'
                ? 'bg-white/10 text-white shadow-sm border border-white/10 font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>Goal Engine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('copilot')}
            className={`py-1.5 px-3.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'copilot'
                ? 'bg-white/10 text-white shadow-sm border border-white/10 font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-zinc-300" />
            <span>AI Copilot</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('resume')}
            className={`py-1.5 px-3.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'resume'
                ? 'bg-white/10 text-white shadow-sm border border-white/10 font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-zinc-300" />
            <span>Resume Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('employees')}
            className={`py-1.5 px-3.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'employees'
                ? 'bg-white/10 text-white shadow-sm border border-white/10 font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-zinc-300" />
            <span>AI Employees</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`py-1.5 px-3.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'appointments'
                ? 'bg-white/10 text-white shadow-sm border border-white/10 font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-300" />
            <span>Appointments</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`py-1.5 px-3.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'payments'
                ? 'bg-white/10 text-white shadow-sm border border-white/10 font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-zinc-300" />
            <span>Invoicing &amp; UPI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('memory')}
            className={`py-1.5 px-3.5 rounded-full flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'memory'
                ? 'bg-white/10 text-white shadow-sm border border-white/10 font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-zinc-300" />
            <span>Memory Vault</span>
          </button>
        </div>

        {/* Tab 1: Goal-to-Outcome Omnibar & Project Pipeline */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <GoalExecutionHub />
          </div>
        )}

        {/* Tab: Universal AI Copilot & Real-Time Assistant */}
        {activeTab === 'copilot' && (
          <div className="space-y-6">
            <UniversalAiCopilot />
          </div>
        )}

        {/* Tab 2: Resume & Career Studio */}
        {activeTab === 'resume' && (
          <div className="space-y-6">
            <ResumeCareerStudio />
          </div>
        )}

        {/* Tab 3: Specialized AI Employees */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <AiEmployeesHub
              onSelectTask={(prompt) => {
                setActiveTab('goals');
              }}
            />
          </div>
        )}

        {/* Tab 4: Interactive Appointments & Patient CRM */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <AppointmentsHub />
          </div>
        )}

        {/* Tab 5: Dynamic Payment Links & UPI QR */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <PaymentLinkGenerator />
          </div>
        )}

        {/* Tab 6: User Memory & Business Rules Vault */}
        {activeTab === 'memory' && (
          <div className="space-y-6">
            <MemoryVaultHub />
          </div>
        )}
      </div>

      {/* Global Action Modals */}
      <EasyPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultPlan="Instant UPI Payment / Retainer Settlement"
        defaultAmount={600}
      />

      <CustomAgentWizardModal
        isOpen={wizardModalOpen}
        onClose={() => setWizardModalOpen(false)}
        onAgentCreated={() => loadData()}
      />

      <WebsiteStudioModal
        isOpen={websiteStudioOpen}
        onClose={() => setWebsiteStudioOpen(false)}
      />

      <SaraDialerModal
        isOpen={dialerOpen}
        onClose={() => setDialerOpen(false)}
      />
    </WorkspaceLayout>
  );
}
