'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/app/WorkspaceLayout';
import {
  Workflow as WorkflowIcon,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Workflow, WorkflowRunResult } from '@/lib/types';
import Link from 'next/link';

export default function WorkspaceWorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<WorkflowRunResult | null>(null);

  const loadWorkflows = async () => {
    try {
      const res = await fetch('/api/workflows');
      const data = await res.json();
      setWorkflows(data.workflows || []);
    } catch (err) {
      console.error('Failed to load workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const handleRunWorkflow = async (id: string) => {
    setRunningId(id);
    setRunResult(null);

    try {
      const res = await fetch(`/api/workflows/${id}/run`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setRunResult(data.run);
      } else {
        alert(data.error || 'Workflow execution error');
      }
    } catch (err) {
      console.error('Run workflow error:', err);
    } finally {
      setRunningId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    try {
      const res = await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWorkflows((prev) => prev.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.error('Delete workflow error:', err);
    }
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Automation Pipelines</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Deterministic multi-step workflows connecting phone intake, Claude reasoning, CRM synchronization, and supervisor gates.
            </p>
          </div>

          <Link
            href="/platform"
            className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Open Visual Builder Canvas</span>
          </Link>
        </div>

        {/* Execution Output (if recently run) */}
        {runResult && (
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-3 animate-in fade-in text-left font-mono text-xs">
            <div className="flex items-center justify-between text-emerald-300 font-semibold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                EXECUTION RUN: #{runResult.runId} ({runResult.status.toUpperCase()})
              </span>
              <span>Finished: {new Date(runResult.finishedAt).toLocaleTimeString()}</span>
            </div>

            <div className="space-y-2 pt-2">
              {runResult.stepResults.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-950/80 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                    <span className="text-white font-semibold">STEP {idx + 1}: {step.stepType}</span>
                    <span>{step.latencyMs}ms</span>
                  </div>
                  <div className="text-zinc-300">{step.output}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflows List */}
        <div className="space-y-4">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 space-y-4 hover:border-white/15 transition-all text-left"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-emerald-400">
                    <WorkflowIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">{wf.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{wf.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunWorkflow(wf.id)}
                    disabled={runningId === wf.id}
                    className="px-3.5 py-1.5 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 text-xs font-mono font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {runningId === wf.id ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Test</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(wf.id)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Workflow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Step Sequence Chips */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-zinc-500">
                  TRIGGER: <span className="text-zinc-300">{wf.trigger}</span> • {wf.steps.length} CONFIGURED STEPS
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {wf.steps.map((st, idx) => (
                    <React.Fragment key={st.id}>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-white/[0.06] text-zinc-300 text-xs font-mono">
                        {idx + 1}. {st.title}
                      </span>
                      {idx < wf.steps.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-zinc-600" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
