'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Calendar,
  Layers,
  Bot,
  UserCheck,
  Send,
  Mic,
  MicOff,
  Briefcase,
  ChevronRight,
  RefreshCw,
  FolderKanban,
} from 'lucide-react';
import { ProjectRecord, ProjectStep, ProjectArtifact } from '@/lib/types';

export const GoalExecutionHub: React.FC = () => {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectRecord | null>(null);
  const [prompt, setPrompt] = useState('');
  const [executing, setExecuting] = useState(false);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.projects && data.projects.length > 0) {
        setProjects(data.projects);
        setActiveProject(data.projects[0]);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleExecuteGoal = async (targetPrompt?: string) => {
    const textToRun = (targetPrompt || prompt).trim();
    if (!textToRun || executing) return;

    setExecuting(true);
    try {
      const res = await fetch('/api/goals/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToRun }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setProjects((prev) => [data.project, ...prev]);
        setActiveProject(data.project);
        setPrompt('');
      } else {
        alert(data.error || 'Failed to execute goal.');
      }
    } catch (err: any) {
      alert('Error executing goal: ' + err.message);
    } finally {
      setExecuting(false);
    }
  };

  const handleApproveStep = async (stepId: string) => {
    if (!activeProject) return;
    try {
      const updatedSteps = activeProject.steps.map((s) =>
        s.id === stepId
          ? { ...s, status: 'completed' as const, outputSummary: 'Approved & verified by human review.' }
          : s
      );
      const isAllComplete = updatedSteps.every((s) => s.status === 'completed');
      const newStatus = isAllComplete ? ('completed' as const) : activeProject.status;

      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps: updatedSteps, status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setActiveProject(data.project);
        setProjects((prev) =>
          prev.map((p) => (p.id === activeProject.id ? data.project : p))
        );
      }
    } catch (err) {
      console.error('Failed to update step:', err);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please use keyboard input.');
      return;
    }

    if (listening) {
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setListening(false);
      };

      recognition.start();
    } catch (e) {
      setListening(false);
    }
  };

  const sampleChips = [
    {
      label: '🎓 Internships & Resume',
      query: 'Help me find internships, organize the application deadlines, and prepare my resume for the best opportunities.',
    },
    {
      label: '💼 Freelance SOW Proposal',
      query: 'Draft freelance client proposal for clinic website redesign with milestone deliverables',
    },
    {
      label: '🏥 Clinic Inquiries & Token UPI',
      query: 'Audit uncontacted clinic inquiries, draft Telugu WhatsApp followups & issue ₹500 token link',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Omnibar Spotlight Box: Apple Clean Minimalist Design */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-white/[0.08] backdrop-blur-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              The AI Action Omnibar
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Autonomous Action Ready
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          What do you want to accomplish today?
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
          Describe any outcome in ordinary language. MEOW decomposes the goal, selects the best agent, executes actions, and reports verified results.
        </p>

        {/* Input Bar */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-zinc-950/80 border border-white/10 focus-within:border-violet-500/50 transition-all">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleExecuteGoal();
            }}
            placeholder="e.g. Help me find internships, organize deadlines, and prepare my resume for top roles..."
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
          />

          <button
            type="button"
            onClick={handleVoiceInput}
            title={listening ? 'Listening...' : 'Voice input'}
            className={`p-2.5 rounded-xl border transition-all ${
              listening
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                : 'bg-zinc-900 hover:bg-zinc-800 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleExecuteGoal()}
            disabled={executing || !prompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-40 text-zinc-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
          >
            {executing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <span>Execute Goal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Instant Suggested Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-zinc-500">Quick Start:</span>
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPrompt(chip.query);
                handleExecuteGoal(chip.query);
              }}
              className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs transition-all flex items-center gap-1.5"
            >
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Project Pipeline View */}
      {activeProject && (
        <div className="space-y-6">
          {/* Project Switcher Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/40 border border-white/[0.06] text-xs">
            <div className="flex items-center gap-2 overflow-x-auto">
              <FolderKanban className="w-4 h-4 text-violet-400 shrink-0" />
              <span className="font-mono text-zinc-400 shrink-0">Projects:</span>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProject(p)}
                  className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
                    activeProject.id === p.id
                      ? 'bg-zinc-800 text-white font-bold border border-white/10'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {p.title.length > 28 ? `${p.title.slice(0, 26)}...` : p.title}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-zinc-500 uppercase shrink-0">
              {activeProject.segment} MODE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step-by-Step Execution Journey (2 Cols) */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {activeProject.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="text-violet-400 font-medium">Assigned Agent:</span>
                    <span>{activeProject.assignedEmployee.name} ({activeProject.assignedEmployee.role})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                      activeProject.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : activeProject.status === 'awaiting_review'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                    }`}
                  >
                    STATUS: {activeProject.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Steps timeline */}
              <div className="space-y-4">
                {activeProject.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-4 sm:p-5 rounded-2xl bg-zinc-950/60 border border-white/[0.06] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-mono text-zinc-300">
                          0{step.order}
                        </span>
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {step.status === 'completed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        )}
                        {step.status === 'requires_review' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> AWAITING HUMAN REVIEW
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>

                    {step.outputSummary && (
                      <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/[0.06] text-xs font-mono text-zinc-300">
                        {step.outputSummary}
                      </div>
                    )}

                    {/* Step-specific data display */}
                    {step.data?.opportunities && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {step.data.opportunities.map((opp: any, oIdx: number) => (
                          <div
                            key={oIdx}
                            className="p-3 rounded-xl bg-zinc-900/40 border border-white/[0.04] text-xs space-y-1"
                          >
                            <div className="font-bold text-white flex justify-between">
                              <span>{opp.company}</span>
                              <span className="text-[10px] text-emerald-400 font-mono">{opp.stipend}</span>
                            </div>
                            <div className="text-[11px] text-zinc-400">{opp.role}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">Deadline: {opp.deadline}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Human Approval Action */}
                    {step.status === 'requires_review' && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleApproveStep(step.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Approve &amp; Finalize Action</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Verifiable Artifacts & Outcomes (1 Col) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  <span>Verifiable Artifacts</span>
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  {activeProject.artifacts.length} FILES
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                MEOW outputs tangible, verifiable work — not ephemeral text. Inspect or download the deliverables below:
              </p>

              <div className="space-y-3">
                {activeProject.artifacts.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.06] space-y-2 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-white">{art.title}</span>
                      <span className="text-[10px] font-mono uppercase text-violet-400">
                        {art.type}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                      {art.content}
                    </p>

                    {art.downloadable && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const blob = new Blob([art.content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = art.downloadName || `${art.title}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-medium transition-all flex items-center gap-1.5 border border-white/10"
                        >
                          <Download className="w-3 h-3 text-zinc-400" />
                          <span>Download Deliverable</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

