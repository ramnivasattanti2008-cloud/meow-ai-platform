'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Zap,
  PhoneCall,
  Database,
  Calendar,
  MessageSquare,
  Bot,
  UserCheck,
} from 'lucide-react';
import { Workflow, WorkflowStep, WorkflowStepType, WorkflowRunResult } from '@/lib/types';
import { initialWorkflows } from '@/lib/store';
import { workflowExecutionEngine } from '@/lib/workflow/engine';

export const WorkflowBuilder: React.FC = () => {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>(JSON.parse(JSON.stringify(initialWorkflows[0])));
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<WorkflowRunResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [requireHumanApprovalPause, setRequireHumanApprovalPause] = useState(true);

  const supportedStepTypes: { type: WorkflowStepType; label: string; icon: any; defaultDesc: string }[] = [
    {
      type: 'trigger_inbound_call',
      label: 'Trigger: Inbound Phone Call',
      icon: PhoneCall,
      defaultDesc: 'Fires when customer places call to clinic or business number.',
    },
    {
      type: 'trigger_form_submit',
      label: 'Trigger: Form / Webhook Submit',
      icon: Zap,
      defaultDesc: 'Fires when customer submits discovery form on website.',
    },
    {
      type: 'ai_intent_extraction',
      label: 'AI: Claude Intent & Entity Parsing',
      icon: Bot,
      defaultDesc: 'Extracts service, language preference, and urgency.',
    },
    {
      type: 'voice_call_initiation',
      label: 'Voice: Multilingual Call Outbound',
      icon: PhoneCall,
      defaultDesc: 'Dispatches Telugu / English AI voice agent within 60s.',
    },
    {
      type: 'human_supervisor_approval',
      label: 'Security: Human Oversight Gate',
      icon: UserCheck,
      defaultDesc: 'Halts workflow for supervisor review on high-value actions.',
    },
    {
      type: 'calendar_slot_reserve',
      label: 'Tool: Calendar Slot Lock',
      icon: Calendar,
      defaultDesc: 'Reserves tentative consultation slot with zero double-booking.',
    },
    {
      type: 'crm_contact_update',
      label: 'Tool: CRM Record Sync',
      icon: Database,
      defaultDesc: 'Creates lead record in CRM with verified attributes.',
    },
    {
      type: 'sms_whatsapp_notification',
      label: 'Channel: WhatsApp / SMS Confirmation',
      icon: MessageSquare,
      defaultDesc: 'Sends instant bilingual confirmation with directions.',
    },
  ];

  const handleAddStep = (type: WorkflowStepType) => {
    const meta = supportedStepTypes.find((s) => s.type === type);
    if (!meta) return;

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type,
      title: meta.label,
      description: meta.defaultDesc,
      config: {},
      order: currentWorkflow.steps.length + 1,
    };

    setCurrentWorkflow((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
    setValidationErrors([]);
  };

  const handleRemoveStep = (stepId: string) => {
    setCurrentWorkflow((prev) => {
      const filtered = prev.steps.filter((s) => s.id !== stepId);
      const reordered = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
      return { ...prev, steps: reordered };
    });
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentWorkflow.steps.length) return;

    const newSteps = [...currentWorkflow.steps];
    const [moved] = newSteps.splice(index, 1);
    newSteps.splice(targetIndex, 0, moved);

    const reordered = newSteps.map((s, idx) => ({ ...s, order: idx + 1 }));
    setCurrentWorkflow((prev) => ({ ...prev, steps: reordered }));
  };

  const handleValidate = () => {
    const result = workflowExecutionEngine.validate(currentWorkflow);
    setValidationErrors(result.errors);
    return result.valid;
  };

  const handleRunWorkflow = async () => {
    if (!handleValidate()) return;

    setIsRunning(true);
    setExecutionResult(null);

    const run = await workflowExecutionEngine.execute(currentWorkflow, requireHumanApprovalPause);
    setExecutionResult(run);
    setIsRunning(false);
  };

  const handleReset = () => {
    setCurrentWorkflow(JSON.parse(JSON.stringify(initialWorkflows[0])));
    setExecutionResult(null);
    setValidationErrors([]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-2xl shadow-glass overflow-hidden text-left">
      {/* Header */}
      <div className="border-b border-white/[0.08] px-6 sm:px-8 py-5 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{currentWorkflow.name}</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Interactive Canvas
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">{currentWorkflow.description}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <label className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer mr-2 font-mono">
            <input
              type="checkbox"
              checked={requireHumanApprovalPause}
              onChange={(e) => setRequireHumanApprovalPause(e.target.checked)}
              className="rounded bg-zinc-800 border-white/20 text-violet-600 focus:ring-0"
            />
            <span>Pause at Human Gate</span>
          </label>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            title="Reset Workflow"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRunWorkflow}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Demonstration</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Validation Banner if errors */}
      {validationErrors.length > 0 && (
        <div className="px-6 sm:px-8 py-3 bg-red-950/40 border-b border-red-500/30 text-xs text-red-200 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Workflow Configuration Errors:</span>
          </div>
          <ul className="list-disc pl-6 space-y-0.5 font-mono">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
        {/* Left 2 Cols: Step Pipeline */}
        <div className="lg:col-span-2 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-white/[0.06]">
            <span>ORDERED EXECUTION PIPELINE ({currentWorkflow.steps.length} STEPS)</span>
            <span>Deterministic Runner</span>
          </div>

          <div className="space-y-3">
            {currentWorkflow.steps.map((step, idx) => {
              const meta = supportedStepTypes.find((s) => s.type === step.type);
              const Icon = meta?.icon || Zap;
              const stepRunOutput = executionResult?.stepResults.find((r) => r.stepId === step.id);

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    stepRunOutput?.status === 'requires_human_approval'
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : stepRunOutput?.status === 'success'
                      ? 'bg-zinc-900/90 border-emerald-500/30'
                      : 'bg-zinc-900/60 border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-400">#{step.order}</span>
                          <h4 className="text-sm font-medium text-white">{step.title}</h4>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{step.description}</p>
                      </div>
                    </div>

                    {/* Step Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveStep(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-20 hover:bg-white/5"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveStep(idx, 'down')}
                        disabled={idx === currentWorkflow.steps.length - 1}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white disabled:opacity-20 hover:bg-white/5"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveStep(step.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Execution Output (if executed) */}
                  {stepRunOutput && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs font-mono">
                      <div className="flex items-center justify-between text-zinc-400 mb-1">
                        <span className="flex items-center gap-1.5">
                          {stepRunOutput.status === 'success' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          {stepRunOutput.status === 'requires_human_approval' && (
                            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          Status: {stepRunOutput.status}
                        </span>
                        <span>Latency: {stepRunOutput.latencyMs}ms</span>
                      </div>
                      <div className="p-2 rounded-xl bg-zinc-950/80 text-zinc-300 border border-white/[0.04]">
                        {stepRunOutput.output}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Add Step Palette */}
        <div className="p-6 sm:p-8 space-y-4 bg-zinc-900/20">
          <div className="text-xs font-mono text-zinc-400 pb-2 border-b border-white/[0.06]">
            AVAILABLE MODULES (CLICK TO ADD)
          </div>

          <div className="space-y-2">
            {supportedStepTypes.map((stepDef) => {
              const Icon = stepDef.icon;
              return (
                <button
                  key={stepDef.type}
                  onClick={() => handleAddStep(stepDef.type)}
                  className="w-full text-left p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/[0.06] hover:border-violet-500/30 transition-all flex items-center gap-3 group"
                >
                  <div className="w-7 h-7 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-violet-300 shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">{stepDef.label}</div>
                    <div className="text-[11px] text-zinc-400 truncate">{stepDef.defaultDesc}</div>
                  </div>
                  <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Execution Summary Report */}
          {executionResult && (
            <div className="mt-6 p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-300 font-semibold">
                <span>EXECUTION RUN</span>
                <span
                  className={
                    executionResult.status === 'completed'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }
                >
                  {executionResult.status.toUpperCase()}
                </span>
              </div>
              <div className="text-zinc-400 text-[11px] space-y-1">
                <div>Run ID: {executionResult.runId}</div>
                <div>Completed Steps: {executionResult.stepResults.length} / {currentWorkflow.steps.length}</div>
                <div>Engine: Deterministic In-Browser Runner</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
