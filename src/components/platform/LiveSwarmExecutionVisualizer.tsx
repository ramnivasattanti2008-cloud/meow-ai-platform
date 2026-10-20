'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Bot,
  Zap,
  Terminal,
  Cpu,
  Layers,
  Database,
  PhoneCall,
  Download,
} from 'lucide-react';

interface SwarmNode {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'idle' | 'running' | 'completed';
  latencyMs: number;
  outputSummary: string;
}

export const LiveSwarmExecutionVisualizer: React.FC = () => {
  const [goalPrompt, setGoalPrompt] = useState(
    'Weekend Orthopedic Clinic Campaign: Qualify 10 incoming patients, book consultation slots in Telugu, and issue ₹600 UPI invoices'
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const [nodes, setNodes] = useState<SwarmNode[]>([
    {
      id: 'agent-1',
      name: 'Triage Architect',
      role: 'Intent Classification & Guardrails',
      model: 'Claude 3.5 Sonnet',
      status: 'idle',
      latencyMs: 120,
      outputSummary: 'Awaiting dispatch...',
    },
    {
      id: 'agent-2',
      name: 'Claude Copywriter',
      role: 'Multilingual Copy Synthesis',
      model: 'Claude 3.5 Sonnet',
      status: 'idle',
      latencyMs: 340,
      outputSummary: 'Awaiting dispatch...',
    },
    {
      id: 'agent-3',
      name: 'Voice Agent Sara',
      role: 'Vernacular Telephony & STT',
      model: 'Sara Edge Engine (te-IN)',
      status: 'idle',
      latencyMs: 220,
      outputSummary: 'Awaiting dispatch...',
    },
    {
      id: 'agent-4',
      name: 'Ledger & CRM Sync',
      role: 'Firestore, UPI Invoicing & Webhook',
      model: 'Deterministic Engine',
      status: 'idle',
      latencyMs: 65,
      outputSummary: 'Awaiting dispatch...',
    },
  ]);

  const handleRunSwarm = async () => {
    setIsExecuting(true);
    setIsComplete(false);
    setActiveStep(0);
    setLogs(['[00:00.010] Swarm Orchestrator initialized. Goal ingested: "' + goalPrompt + '"']);

    // Step 1: Triage Architect
    setNodes((prev) => [
      { ...prev[0], status: 'running' },
      prev[1],
      prev[2],
      prev[3],
    ]);
    await new Promise((r) => setTimeout(r, 600));
    setNodes((prev) => [
      {
        ...prev[0],
        status: 'completed',
        outputSummary: 'Verified clinical domain. Detected target language: Telugu. Zero emergency distress flags.',
      },
      { ...prev[1], status: 'running' },
      prev[2],
      prev[3],
    ]);
    setLogs((l) => [
      ...l,
      '[00:00.610] Agent 1 (Triage Architect) completed in 120ms. Intent: CLINIC_CONSULTATION_SURGE.',
    ]);
    setActiveStep(1);

    // Step 2: Claude Copywriter
    await new Promise((r) => setTimeout(r, 700));
    setNodes((prev) => [
      prev[0],
      {
        ...prev[1],
        status: 'completed',
        outputSummary: 'Synthesized 3 Telugu promotional hooks & personalized follow-up SMS templates.',
      },
      { ...prev[2], status: 'running' },
      prev[3],
    ]);
    setLogs((l) => [
      ...l,
      '[00:01.310] Agent 2 (Claude Copywriter) completed in 340ms. Generated vernacular copy tokens.',
    ]);
    setActiveStep(2);

    // Step 3: Voice Agent Sara
    await new Promise((r) => setTimeout(r, 750));
    setNodes((prev) => [
      prev[0],
      prev[1],
      {
        ...prev[2],
        status: 'completed',
        outputSummary: 'Live telephony synthesized in Telugu. 10 patient confirmation turns completed with zero hold time.',
      },
      { ...prev[3], status: 'running' },
    ]);
    setLogs((l) => [
      ...l,
      '[00:02.060] Agent 3 (Voice Agent Sara) completed in 220ms. 10/10 slots verified.',
    ]);
    setActiveStep(3);

    // Step 4: Ledger & CRM Sync
    await new Promise((r) => setTimeout(r, 550));
    setNodes((prev) => [
      prev[0],
      prev[1],
      prev[2],
      {
        ...prev[3],
        status: 'completed',
        outputSummary: '10 calendar records locked. Dispatched 10 GST invoices (INV-01) & HMAC-signed Zapier webhook.',
      },
    ]);
    setLogs((l) => [
      ...l,
      '[00:02.610] Agent 4 (Ledger & CRM Sync) completed in 65ms. All transactions settled.',
      '[00:02.620] Swarm Execution finished with status SUCCESS in 2.61s.',
    ]);
    setActiveStep(4);
    setIsExecuting(false);
    setIsComplete(true);
  };

  const handleReset = () => {
    setActiveStep(-1);
    setIsComplete(false);
    setIsExecuting(false);
    setLogs([]);
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        status: 'idle',
        outputSummary: 'Awaiting dispatch...',
      }))
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-white/[0.08] shadow-glass flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Live Multi-Agent Swarm Execution</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Deterministic DAG Runner
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Watch specialized autonomous agents communicate in a topological dependency graph—transforming high-level business goals into verified outcomes without hallucination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isComplete && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Swarm</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRunSwarm}
            disabled={isExecuting}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-violet-600/20 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Swarm Executing...' : 'Run Autonomous Swarm'}</span>
          </button>
        </div>
      </div>

      {/* Goal Prompt Omnibar */}
      <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-2">
        <label className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-semibold">
          High-Level Business Instruction (Goal)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={goalPrompt}
            onChange={(e) => setGoalPrompt(e.target.value)}
            disabled={isExecuting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/60 font-medium"
          />
        </div>
      </div>

      {/* Swarm Graph Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {nodes.map((node, idx) => {
          const isActive = activeStep === idx;
          const isDone = node.status === 'completed';

          return (
            <div
              key={node.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 relative ${
                isActive
                  ? 'bg-violet-950/40 border-violet-500/60 shadow-lg shadow-violet-500/10 scale-[1.02]'
                  : isDone
                  ? 'bg-zinc-950/80 border-emerald-500/40'
                  : 'bg-zinc-950/50 border-white/[0.08] opacity-70'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Step 0{idx + 1}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : isActive
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 animate-pulse'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-white flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-violet-400" />
                    <span>{node.name}</span>
                  </h4>
                  <div className="text-[10px] text-zinc-400">{node.role}</div>
                </div>

                <div className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
                  <span>Engine: {node.model}</span>
                </div>

                <p className="text-[11px] text-zinc-300 leading-relaxed pt-1 border-t border-white/[0.04]">
                  {node.outputSummary}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
                <span>Latency</span>
                <span className={isDone ? 'text-emerald-400' : 'text-zinc-500'}>{node.latencyMs}ms</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Stream Console */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950 p-4 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-zinc-400 text-[11px]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-Time Swarm Execution Trace</span>
          </div>
          <span className="text-[10px] text-zinc-600">Zero-Latency State Machine</span>
        </div>

        <div className="space-y-1 max-h-40 overflow-y-auto text-[11px]">
          {logs.length === 0 ? (
            <div className="text-zinc-600 italic">Click &quot;Run Autonomous Swarm&quot; to inspect real-time execution trace...</div>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className={
                  log.includes('SUCCESS')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('Agent')
                    ? 'text-violet-300'
                    : 'text-zinc-400'
                }
              >
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
