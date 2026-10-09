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
  X,
  Sparkles,
} from 'lucide-react';
import { Workflow, WorkflowRunResult, WorkflowStep } from '@/lib/types';
import Link from 'next/link';

const PRESET_TEMPLATES = [
  {
    name: 'Doctor Appointment & WhatsApp Intake',
    description:
      'Transcribes patient phone consultation requests, reserves doctor calendar slots, and dispatches WhatsApp location pin.',
    trigger: 'Inbound phone call completed with Sara receptionist',
    steps: [
      {
        id: 'st-1',
        type: 'ai_intent_extraction' as const,
        title: 'Extract Patient Details & Symptoms',
        description: 'Claude analyzes audio transcript to extract name, date, time slot, and reason for visit.',
        config: { model: 'claude-3-haiku' },
        order: 1,
      },
      {
        id: 'st-2',
        type: 'calendar_slot_reserve' as const,
        title: 'Lock Doctor Calendar Slot',
        description: 'Locks 30-min slot in Google Calendar and prevents conflicting bookings.',
        config: { calendarId: 'primary' },
        order: 2,
      },
      {
        id: 'st-3',
        type: 'sms_whatsapp_notification' as const,
        title: 'Dispatch WhatsApp Confirmation & Token',
        description: 'Sends patient confirmation message with appointment time, queue token, and Google Maps pin.',
        config: { channel: 'whatsapp' },
        order: 3,
      },
    ],
  },
  {
    name: 'Instant Missed Call Callback Engine',
    description:
      'Catches after-hours missed customer calls and triggers an automated AI voice callback within 90 seconds.',
    trigger: 'Missed inbound customer call detected after 7:00 PM IST',
    steps: [
      {
        id: 'st-1',
        type: 'voice_call_initiation' as const,
        title: 'Initiate Outbound Sara Voice Call',
        description: 'Dials caller back with polite vernacular greeting inquiring about their requirement.',
        config: { persona: 'sara_receptionist' },
        order: 1,
      },
      {
        id: 'st-2',
        type: 'crm_contact_update' as const,
        title: 'Sync Call Intent to CRM & Sheets',
        description: 'Logs caller requirements into Firestore database and duty manager dashboard.',
        config: { collection: 'leads' },
        order: 2,
      },
    ],
  },
  {
    name: 'Payment Settlement to GST Tax Invoice',
    description:
      'Detects incoming UPI / Card payment settlement and issues branded GST invoice via WhatsApp & Email.',
    trigger: 'Webhook: payment.settled from Razorpay / UPI Gateway',
    steps: [
      {
        id: 'st-1',
        type: 'crm_contact_update' as const,
        title: 'Record Payment in Firestore',
        description: 'Marks booking as paid and reconciles transaction ID in accounting ledger.',
        config: { status: 'settled' },
        order: 1,
      },
      {
        id: 'st-2',
        type: 'sms_whatsapp_notification' as const,
        title: 'Deliver Tax Invoice PDF',
        description: 'Generates GST invoice with HSN code and sends downloadable PDF to payer phone.',
        config: { format: 'pdf_receipt' },
        order: 2,
      },
    ],
  },
];

export default function WorkspaceWorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<WorkflowRunResult | null>(null);

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [pipelineName, setPipelineName] = useState('');
  const [pipelineDesc, setPipelineDesc] = useState('');
  const [pipelineTrigger, setPipelineTrigger] = useState('');
  const [selectedSteps, setSelectedSteps] = useState<WorkflowStep[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleApplyTemplate = (tmpl: (typeof PRESET_TEMPLATES)[0]) => {
    setPipelineName(tmpl.name);
    setPipelineDesc(tmpl.description);
    setPipelineTrigger(tmpl.trigger);
    setSelectedSteps(tmpl.steps);
  };

  const handleSavePipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pipelineName || !pipelineTrigger || selectedSteps.length === 0) {
      alert('Please provide pipeline name, trigger, and at least one step.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pipelineName.trim(),
          description: pipelineDesc.trim() || 'Deterministic multi-step workflow pipeline.',
          trigger: pipelineTrigger.trim(),
          steps: selectedSteps,
          status: 'active',
        }),
      });

      const data = await res.json();
      if (res.ok && data.workflow) {
        setWorkflows((prev) => [data.workflow, ...prev]);
        setIsCreateOpen(false);
        setPipelineName('');
        setPipelineDesc('');
        setPipelineTrigger('');
        setSelectedSteps([]);
      } else {
        alert(data.error || 'Failed to create workflow pipeline');
      }
    } catch (err) {
      console.error('Save workflow error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Automation Pipelines</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Deterministic multi-step workflows connecting phone intake, Claude reasoning, CRM synchronization, and supervisor gates.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                handleApplyTemplate(PRESET_TEMPLATES[0]);
                setIsCreateOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Pipeline</span>
            </button>

            <Link
              href="/platform"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 font-medium text-xs transition-all flex items-center gap-1.5"
            >
              <span>Canvas Visualizer</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>
          </div>
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
                    <span className="text-white font-semibold">
                      STEP {idx + 1}: {step.stepType}
                    </span>
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
                      {idx < wf.steps.length - 1 && <ArrowRight className="w-3 h-3 text-zinc-600" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Pipeline Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-xl w-full bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <WorkflowIcon className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Create Automation Pipeline</h3>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Template Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Quick-Load Templates:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TEMPLATES.map((tmpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 hover:text-white transition-colors"
                    >
                      {tmpl.name}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSavePipeline} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Pipeline Name</label>
                  <input
                    type="text"
                    required
                    value={pipelineName}
                    onChange={(e) => setPipelineName(e.target.value)}
                    placeholder="e.g. Inbound Patient Consultation & SMS Pin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Trigger Event</label>
                  <input
                    type="text"
                    required
                    value={pipelineTrigger}
                    onChange={(e) => setPipelineTrigger(e.target.value)}
                    placeholder="e.g. Inbound call completed with Sara receptionist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Description / Goal</label>
                  <textarea
                    rows={2}
                    value={pipelineDesc}
                    onChange={(e) => setPipelineDesc(e.target.value)}
                    placeholder="Brief description of business outcome..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                {/* Steps Configured */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-300">Pipeline Steps ({selectedSteps.length})</span>
                    <span className="text-[10px] font-mono text-emerald-400">Deterministic Order</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedSteps.map((step, idx) => (
                      <div
                        key={step.id}
                        className="p-3 rounded-xl bg-zinc-900/80 border border-white/[0.06] flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-semibold text-white">
                            {idx + 1}. {step.title}
                          </div>
                          <div className="text-[11px] text-zinc-400">{step.description}</div>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-950 uppercase shrink-0">
                          {step.type.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Saving Pipeline...' : 'Save & Activate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}
