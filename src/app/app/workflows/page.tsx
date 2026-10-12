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
  Download,
  Eye,
  FileJson,
  Check,
  Cpu,
  Calendar,
  MessageSquare,
  Users,
  Code2,
  Activity,
  ChevronRight,
  RotateCcw,
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

// Mock realistic payload generator for step inspector
function getStepPayload(stepType: string, stepTitle: string, config: any) {
  switch (stepType) {
    case 'trigger_inbound_call':
      return {
        event: 'telephony.call_completed',
        callId: 'call_live_9832',
        caller: '+91 98490 12345',
        durationSec: 46,
        language: 'te-IN',
        recordingUrl: 'https://meowboxai.tech/audio/sara-call-9832.wav',
        receivedAt: new Date().toISOString(),
      };
    case 'ai_intent_extraction':
      return {
        input: { transcriptRef: 'call_live_9832' },
        model: config?.model || 'claude-3-haiku',
        output: {
          intent: 'doctor_consultation_booking',
          entities: {
            patientName: 'Ananya Sharma',
            department: 'Orthopedics',
            preferredDate: 'Tomorrow',
            preferredSlot: '17:30 IST',
            urgency: 'routine',
          },
          confidence: 0.985,
        },
      };
    case 'calendar_slot_reserve':
      return {
        action: 'calendar.insert_event',
        calendarId: config?.calendarId || 'primary',
        slot: '2026-10-13T17:30:00+05:30',
        durationMin: 30,
        eventTitle: 'MEOW Consultation: Ananya Sharma',
        conflictCheck: 'PASSED (0 overlapping slots)',
        reservationId: 'RES-OCT-9921',
        status: 'CONFIRMED',
      };
    case 'sms_whatsapp_notification':
      return {
        dispatchChannel: config?.channel || 'whatsapp',
        recipientPhone: '+91 98490 12345',
        template: 'appointment_confirmation_v2',
        parameters: {
          name: 'Ananya Sharma',
          time: '5:30 PM IST',
          mapsPin: 'https://maps.google.com/?q=12.9716,77.5946',
          invoicePdf: config?.format === 'pdf_receipt' ? 'https://meowboxai.tech/invoice/INV-9921.pdf' : null,
        },
        deliveryStatus: 'SENT (200 OK)',
        providerReceiptId: 'wa_msg_9841289',
      };
    case 'voice_call_initiation':
      return {
        telephonyChannel: 'SIP_TRUNK_IND_01',
        targetNumber: '+91 98490 12345',
        persona: config?.persona || 'sara_receptionist',
        ttsEngine: 'WebSpeech / Indian Vernacular',
        callStatus: 'CONNECTED',
        callDurationSec: 42,
      };
    case 'crm_contact_update':
      return {
        firestoreCollection: config?.collection || 'leads',
        contact: {
          phone: '+91 98490 12345',
          lifecycleStage: 'appointment_confirmed',
          status: config?.status || 'active',
          updatedAt: new Date().toISOString(),
        },
        syncResult: 'DOCUMENT_UPDATED',
      };
    default:
      return {
        step: stepTitle,
        type: stepType,
        config: config || {},
        executionTimestamp: new Date().toISOString(),
        status: 'COMPLETED_200_OK',
      };
  }
}

export default function WorkspaceWorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<WorkflowRunResult | null>(null);

  // View Mode: 'canvas' or 'catalog'
  const [viewMode, setViewMode] = useState<'canvas' | 'catalog'>('canvas');
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);

  // Step payload inspector state
  const [inspectingStep, setInspectingStep] = useState<{ step: WorkflowStep; wfName: string } | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Simulation active step animation counter
  const [activeSimulatingStepIndex, setActiveSimulatingStepIndex] = useState<number | null>(null);

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
      const list = data.workflows || [];
      setWorkflows(list);
      if (list.length > 0 && !activeWorkflowId) {
        setActiveWorkflowId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId) || workflows[0];

  const handleRunWorkflow = async (id: string) => {
    setRunningId(id);
    setRunResult(null);
    setActiveSimulatingStepIndex(0);

    // Progressive visual simulation animation
    const targetWf = workflows.find((w) => w.id === id);
    const stepCount = targetWf?.steps?.length || 1;

    let stepCounter = 0;
    const interval = setInterval(() => {
      stepCounter++;
      if (stepCounter < stepCount) {
        setActiveSimulatingStepIndex(stepCounter);
      } else {
        clearInterval(interval);
      }
    }, 400);

    try {
      const res = await fetch(`/api/workflows/${id}/run`, { method: 'POST' });
      const data = await res.json();
      clearInterval(interval);
      setActiveSimulatingStepIndex(null);

      if (res.ok) {
        setRunResult(data.run);
      } else {
        alert(data.error || 'Workflow execution error');
      }
    } catch (err) {
      console.error('Run workflow error:', err);
      clearInterval(interval);
      setActiveSimulatingStepIndex(null);
    } finally {
      setRunningId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    try {
      const res = await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWorkflows((prev) => {
          const remaining = prev.filter((w) => w.id !== id);
          if (activeWorkflowId === id && remaining.length > 0) {
            setActiveWorkflowId(remaining[0].id);
          }
          return remaining;
        });
      }
    } catch (err) {
      console.error('Delete workflow error:', err);
    }
  };

  const handleExportBlueprint = (wf: Workflow) => {
    const blueprintData = {
      ...wf,
      exportedAt: new Date().toISOString(),
      schemaVersion: '1.0.0',
      platform: 'MEOW AI Workflows Engine',
    };
    const blob = new Blob([JSON.stringify(blueprintData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wf.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        setActiveWorkflowId(data.workflow.id);
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

  const copyPayloadJson = (content: any) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Automation Pipelines</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20">
                DAG ENGINE
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Deterministic multi-step pipelines linking phone intake, Claude reasoning, CRM updates, and WhatsApp dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Switcher Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-white/10 text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('canvas')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'canvas' ? 'bg-violet-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Flow Canvas</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('catalog')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'catalog' ? 'bg-violet-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Pipelines</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                handleApplyTemplate(PRESET_TEMPLATES[0]);
                setIsCreateOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Pipeline</span>
            </button>

            <Link
              href="/platform"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 font-medium text-xs transition-all flex items-center gap-1.5"
            >
              <span>Platform Vision</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>
          </div>
        </div>

        {/* ===================== VIEW MODE 1: INTERACTIVE FLOW CANVAS ===================== */}
        {viewMode === 'canvas' && (
          <div className="space-y-6">
            {/* Workflow Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.08]">
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
                  Active Flow:
                </span>
                {workflows.map((wf) => (
                  <button
                    key={wf.id}
                    type="button"
                    onClick={() => {
                      setActiveWorkflowId(wf.id);
                      setRunResult(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
                      activeWorkflow?.id === wf.id
                        ? 'bg-violet-600 text-white font-semibold shadow-sm'
                        : 'bg-zinc-950/80 border border-white/[0.08] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <WorkflowIcon className="w-3.5 h-3.5" />
                    <span>{wf.name}</span>
                  </button>
                ))}
              </div>

              {activeWorkflow && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleExportBlueprint(activeWorkflow)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 hover:bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                    title="Export JSON Blueprint"
                  >
                    <Download className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Export Blueprint</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRunWorkflow(activeWorkflow.id)}
                    disabled={runningId === activeWorkflow.id}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {runningId === activeWorkflow.id ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Simulating Flow...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Interactive Simulation</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Canvas Node Graph Container */}
            {activeWorkflow ? (
              <div className="rounded-3xl border border-white/[0.08] bg-zinc-950/80 p-6 sm:p-8 space-y-8 relative overflow-hidden">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Pipeline Title & Status */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>{activeWorkflow.name}</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">{activeWorkflow.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300">
                      STEPS: {activeWorkflow.steps.length}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>STATE: ACTIVE</span>
                    </span>
                  </div>
                </div>

                {/* Visual Flow Nodes Sequence */}
                <div className="relative z-10 space-y-6">
                  {/* NODE 0: TRIGGER NODE */}
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-xl p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-violet-500/30 shadow-lg shadow-violet-500/5 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 block">
                              PIPELINE TRIGGER EVENT
                            </span>
                            <span className="text-xs font-bold text-white">Event Listener</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {runningId === activeWorkflow.id ? 'EVENT INGESTED' : 'LISTENING'}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 pl-9 font-mono">{activeWorkflow.trigger}</p>
                    </div>

                    {/* Connecting Flow Arrow */}
                    <div className="flex flex-col items-center my-2">
                      <div className="w-0.5 h-6 bg-gradient-to-b from-violet-500/60 to-zinc-700" />
                      <div className="w-2 h-2 rotate-45 border-b-2 border-r-2 border-zinc-500 -mt-1" />
                    </div>
                  </div>

                  {/* SEQUENTIAL STEP NODES */}
                  {activeWorkflow.steps.map((step, idx) => {
                    const isStepRunning = runningId === activeWorkflow.id && activeSimulatingStepIndex === idx;
                    const isStepFinished =
                      runResult?.stepResults?.some((s) => s.stepId === step.id && s.status === 'success') ||
                      (runningId === activeWorkflow.id && (activeSimulatingStepIndex ?? -1) > idx);
                    const stepRunData = runResult?.stepResults?.find((s) => s.stepId === step.id);

                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div
                          className={`w-full max-w-xl p-5 rounded-2xl transition-all duration-300 text-left border ${
                            isStepRunning
                              ? 'bg-violet-950/40 border-violet-500 shadow-lg shadow-violet-500/20 scale-[1.01]'
                              : isStepFinished
                              ? 'bg-zinc-900/90 border-emerald-500/40'
                              : 'bg-zinc-900/60 border-white/[0.08] hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                                  isStepFinished
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : isStepRunning
                                    ? 'bg-violet-600 text-white animate-pulse'
                                    : 'bg-zinc-800 text-zinc-400 border border-white/10'
                                }`}
                              >
                                {isStepFinished ? <Check className="w-4 h-4" /> : `0${idx + 1}`}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-white text-sm">{step.title}</h4>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 border border-white/10 text-zinc-400 uppercase">
                                    {step.type.replace(/_/g, ' ')}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400 mt-0.5">{step.description}</p>
                              </div>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 uppercase ${
                                isStepRunning
                                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse'
                                  : isStepFinished
                                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {isStepRunning ? 'RUNNING...' : isStepFinished ? '200 OK' : 'READY'}
                            </span>
                          </div>

                          {/* Node Footer: Config & Inspect Button */}
                          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                            <div className="text-zinc-500 text-[11px] truncate max-w-[280px]">
                              CONFIG: <span className="text-zinc-300">{JSON.stringify(step.config || {})}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {stepRunData && (
                                <span className="text-emerald-400 text-[10px]">
                                  {stepRunData.latencyMs}ms
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => setInspectingStep({ step, wfName: activeWorkflow.name })}
                                className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-white/10 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] flex items-center gap-1.5 transition-colors"
                              >
                                <FileJson className="w-3 h-3 text-violet-400" />
                                <span>Inspect Payload</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Connecting Flow Arrow (between steps) */}
                        {idx < activeWorkflow.steps.length - 1 && (
                          <div className="flex flex-col items-center my-2">
                            <div
                              className={`w-0.5 h-6 transition-all duration-300 ${
                                isStepFinished ? 'bg-emerald-500/60' : 'bg-zinc-700'
                              }`}
                            />
                            <div
                              className={`w-2 h-2 rotate-45 border-b-2 border-r-2 -mt-1 transition-all duration-300 ${
                                isStepFinished ? 'border-emerald-400' : 'border-zinc-500'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-zinc-900/30 text-zinc-400">
                No active pipeline selected.
              </div>
            )}
          </div>
        )}

        {/* Execution Output (if run completed) */}
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
                  <div className="text-zinc-300 font-sans">{step.output}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== VIEW MODE 2: PIPELINE CATALOG ===================== */}
        {viewMode === 'catalog' && (
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
                      type="button"
                      onClick={() => handleExportBlueprint(wf)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Download JSON Blueprint"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

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
        )}

        {/* ===================== STEP PAYLOAD INSPECTOR MODAL ===================== */}
        {inspectingStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-xl w-full bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-violet-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Step Payload Inspector</h3>
                    <p className="text-[11px] text-zinc-400">
                      {inspectingStep.wfName} • Step #{inspectingStep.step.order}: {inspectingStep.step.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectingStep(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">Payload Data Flow:</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyPayloadJson(
                        getStepPayload(
                          inspectingStep.step.type,
                          inspectingStep.step.title,
                          inspectingStep.step.config
                        )
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-1.5"
                  >
                    {copiedPayload ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <FileJson className="w-3 h-3 text-zinc-400" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 text-xs font-mono text-violet-300 overflow-x-auto leading-relaxed max-h-72">
                  {JSON.stringify(
                    getStepPayload(
                      inspectingStep.step.type,
                      inspectingStep.step.title,
                      inspectingStep.step.config
                    ),
                    null,
                    2
                  )}
                </pre>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setInspectingStep(null)}
                  className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}

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
                          {step.type.replace(/_/g, ' ')}
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
