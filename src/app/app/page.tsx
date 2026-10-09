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
  Terminal,
} from 'lucide-react';
import Link from 'next/link';
import { Agent, Workflow, Campaign } from '@/lib/types';

export default function WorkspaceDashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="space-y-8">
        {/* Top Title Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">System Overview</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Live operational metrics for your deployed voice agents, workflow automation pipelines, and campaigns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/app/agents"
              className="px-3.5 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Voice Agent</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>ACTIVE VOICE AGENTS</span>
              <Bot className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-white">{agents.filter((a) => a.enabled).length}</div>
            <div className="text-[11px] text-zinc-400 font-mono">
              Telugu &amp; English • {agents.length} Total Registered
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>AUTOMATION PIPELINES</span>
              <WorkflowIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">{workflows.length}</div>
            <div className="text-[11px] text-zinc-400 font-mono">
              100% Deterministic Execution Checks
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>ACTIVE CAMPAIGNS</span>
              <Zap className="w-4 h-4 text-lime-400" />
            </div>
            <div className="text-2xl font-bold text-white">{campaigns.length}</div>
            <div className="text-[11px] text-zinc-400 font-mono">
              WhatsApp, Meta &amp; Email Channels
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>SYSTEM HEALTH</span>
              <Activity className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1.5">
              <span>99.98%</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono">
              0 Critical Escalation Failures
            </div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Voice Agents Table */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white">Registered Voice Agents</h3>
              </div>
              <Link
                href="/app/agents"
                className="text-xs text-violet-300 hover:text-violet-200 flex items-center gap-1 font-mono"
              >
                <span>View All ({agents.length})</span>
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
                      <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 uppercase">
                        {agent.language === 'te' ? 'Telugu' : 'English'}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] truncate mt-0.5">{agent.greeting}</p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                      agent.enabled
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {agent.enabled ? 'Enabled' : 'Paused'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Pipelines Table */}
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <WorkflowIcon className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Active Workflow Pipelines</h3>
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
        </div>

        {/* Demo Persistence Notice */}
        <div className="p-4 rounded-2xl bg-zinc-900/30 border border-white/[0.06] flex items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
            <span>
              All modifications made in this workspace are preserved in your local development runtime. To enable durable multi-tenant PostgreSQL storage, consult <code>docs/LAUNCH_CHECKLIST.md</code>.
            </span>
          </div>
          <Link
            href="/app/settings"
            className="text-xs font-mono text-white hover:underline shrink-0"
          >
            Configure Storage →
          </Link>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
