'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Layers,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock,
  Terminal,
  Download,
  Copy,
  Check,
  MessageSquare,
  Play,
  RefreshCw,
  UserCheck,
  FileText,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Send,
  Code2,
  PhoneCall,
  Activity,
} from 'lucide-react';

interface AgentProfile {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  borderColor: string;
  specialty: string;
  tools: string[];
  status: 'idle' | 'thinking' | 'acting' | 'completed';
}

interface SwarmLog {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  type: 'thought' | 'action' | 'handoff' | 'deliverable';
  message: string;
  targetAgent?: string;
  toolUsed?: string;
}

interface SwarmDeliverable {
  id: string;
  title: string;
  type: 'code' | 'document' | 'proposal' | 'message';
  author: string;
  preview: string;
  fullContent: string;
  actionLabel?: string;
  actionType?: 'whatsapp' | 'copy' | 'download';
}

const AGENTS: AgentProfile[] = [
  {
    id: 'sara',
    name: 'Sara',
    role: 'Frontdesk & Vernacular Voice Concierge',
    avatarColor: 'from-pink-500/20 via-rose-500/30 to-purple-500/30 text-pink-300',
    borderColor: 'border-pink-500/30',
    specialty: 'Multilingual Inbound Triage & Calendar Slot Locking',
    tools: ['vernacular_stt', 'calendar_lock', 'voice_synthesis_v2'],
    status: 'idle',
  },
  {
    id: 'alex',
    name: 'Alex',
    role: 'Career Strategist & Research Lead',
    avatarColor: 'from-cyan-500/20 via-blue-500/30 to-indigo-500/30 text-cyan-300',
    borderColor: 'border-cyan-500/30',
    specialty: 'Goal Decomposition, ATS Resume Tailoring & Research',
    tools: ['ats_scorer', 'market_crawler', 'proposal_architect'],
    status: 'idle',
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Growth, Marketing & Copy Lead',
    avatarColor: 'from-amber-500/20 via-orange-500/30 to-rose-500/30 text-amber-300',
    borderColor: 'border-amber-500/30',
    specialty: 'High-Converting Copy, Meta Ads & WhatsApp Campaigns',
    tools: ['ad_copywriter', 'whatsapp_drip', 'conversion_optimizer'],
    status: 'idle',
  },
  {
    id: 'rishi',
    name: 'Rishi',
    role: 'Systems Architect & Turnkey Invoicer',
    avatarColor: 'from-emerald-500/20 via-teal-500/30 to-green-500/30 text-emerald-300',
    borderColor: 'border-emerald-500/30',
    specialty: 'Turnkey Code Bundles, Webhooks & UPI QR Invoicing',
    tools: ['html_bundler', 'upi_qr_generator', 'webhook_dispatcher'],
    status: 'idle',
  },
];

const PRESET_GOALS = [
  {
    title: '🚀 Launch ₹0 Startup with Voice AI',
    prompt:
      'Launch an AI-powered appointment booking startup with multilingual voice receptionist, instant UPI token payments, and embeddable web widget.',
  },
  {
    title: '🏥 Clinic Intake & Telugu WhatsApp Passes',
    prompt:
      'Audit uncontacted clinic inquiries in Hyderabad, deploy Sara for Telugu phone triage, and issue ₹500 UPI consultation passes.',
  },
  {
    title: '💼 ATS Resume & Google/Zepto AI Internships',
    prompt:
      'Target Tier-1 AI & Full-Stack internship opportunities, tailor an ATS-optimized 95% score resume, and map application calendar.',
  },
  {
    title: '📈 B2B SaaS Growth & WhatsApp Followup',
    prompt:
      'Draft a high-conversion WhatsApp drip campaign for real estate leads and generate instant site visit passes with Google Maps pins.',
  },
];

export const AgentSwarmStudio: React.FC = () => {
  const [agents, setAgents] = useState<AgentProfile[]>(AGENTS);
  const [prompt, setPrompt] = useState(PRESET_GOALS[0].prompt);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<SwarmLog[]>([]);
  const [deliverables, setDeliverables] = useState<SwarmDeliverable[]>([]);
  const [activeTab, setActiveTab] = useState<'topology' | 'stream' | 'deliverables'>('topology');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'stream') {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  const runSwarmSimulation = async (targetPrompt: string) => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setDeliverables([]);

    // Update statuses: Alex begins decomposition
    setAgents((prev) =>
      prev.map((a) => (a.id === 'alex' ? { ...a, status: 'thinking' } : { ...a, status: 'idle' }))
    );

    const addLog = (log: Omit<SwarmLog, 'id' | 'timestamp'>) => {
      setLogs((prev) => [
        ...prev,
        {
          ...log,
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ]);
    };

    // Phase 1: Alex Decomposes the Goal (0-600ms)
    addLog({
      agentId: 'alex',
      agentName: 'Alex (Career & Strategy)',
      type: 'thought',
      message: `Analyzing strategic intent for: "${targetPrompt.slice(0, 70)}..."`,
    });

    await new Promise((r) => setTimeout(r, 650));
    setAgents((prev) =>
      prev.map((a) => (a.id === 'alex' ? { ...a, status: 'acting' } : a))
    );

    addLog({
      agentId: 'alex',
      agentName: 'Alex (Career & Strategy)',
      type: 'action',
      toolUsed: 'proposal_architect',
      message: 'Decomposed goal into 3 parallel execution streams: (1) Voice intake triage, (2) Messaging & conversion copy, (3) Turnkey code & UPI gateway.',
    });

    // Phase 2: Handoff to Sara & Maya in parallel
    await new Promise((r) => setTimeout(r, 600));
    addLog({
      agentId: 'alex',
      agentName: 'Alex (Career & Strategy)',
      type: 'handoff',
      targetAgent: 'Sara',
      message: 'Delegating multilingual inbound telephony & customer dialogue rules to Sara.',
    });

    setAgents((prev) =>
      prev.map((a) =>
        a.id === 'sara'
          ? { ...a, status: 'acting' }
          : a.id === 'alex'
          ? { ...a, status: 'completed' }
          : a
      )
    );

    await new Promise((r) => setTimeout(r, 650));
    addLog({
      agentId: 'sara',
      agentName: 'Sara (Voice Concierge)',
      type: 'thought',
      message: 'Configured natural female voice prosody (210Hz) for Telugu, Hindi, and Indian English.',
    });

    addLog({
      agentId: 'sara',
      agentName: 'Sara (Voice Concierge)',
      type: 'action',
      toolUsed: 'calendar_lock',
      message: 'Synthesized zero-hold telephony routing script with automated emergency escalation to on-duty nurse.',
    });

    // Phase 3: Maya drafts campaign & copy
    await new Promise((r) => setTimeout(r, 600));
    setAgents((prev) =>
      prev.map((a) =>
        a.id === 'maya'
          ? { ...a, status: 'acting' }
          : a.id === 'sara'
          ? { ...a, status: 'completed' }
          : a
      )
    );

    addLog({
      agentId: 'maya',
      agentName: 'Maya (Growth & Copy)',
      type: 'thought',
      message: 'Drafting high-conversion WhatsApp appointment confirmation & follow-up sequence with Google Maps directions.',
    });

    await new Promise((r) => setTimeout(r, 600));
    addLog({
      agentId: 'maya',
      agentName: 'Maya (Growth & Copy)',
      type: 'action',
      toolUsed: 'whatsapp_drip',
      message: 'Produced 3-step high-converting customer touchpoint blueprint formatted for WhatsApp Business API.',
    });

    // Phase 4: Rishi builds turnkey deliverables & UPI link
    await new Promise((r) => setTimeout(r, 600));
    setAgents((prev) =>
      prev.map((a) =>
        a.id === 'rishi'
          ? { ...a, status: 'acting' }
          : a.id === 'maya'
          ? { ...a, status: 'completed' }
          : a
      )
    );

    addLog({
      agentId: 'rishi',
      agentName: 'Rishi (Systems & Invoicing)',
      type: 'thought',
      message: 'Compiling standalone embed widget (<script src="https://meowboxai.tech/widget.js">) & dynamic NPCI UPI QR matrix.',
    });

    await new Promise((r) => setTimeout(r, 650));
    addLog({
      agentId: 'rishi',
      agentName: 'Rishi (Systems & Invoicing)',
      type: 'deliverable',
      toolUsed: 'upi_qr_generator',
      message: 'Generated verified turn-key deliverables: SOW Blueprint, Vernacular Voice Script, WhatsApp Sequence, and Scannable UPI Payment Token.',
    });

    setAgents((prev) => prev.map((a) => ({ ...a, status: 'completed' })));

    // Generate Concrete Deliverables
    setDeliverables([
      {
        id: 'del-1',
        title: 'Turnkey Embed Script & HTML Template',
        type: 'code',
        author: 'Rishi (Systems Architect)',
        preview: '<script src="https://meowboxai.tech/widget.js" data-business="City Care Clinic" ...',
        fullContent: `<!-- 1-Click MEOW Voice AI Embeddable Web Widget -->
<script
  src="https://meowboxai.tech/widget.js"
  data-business="City Care Clinic"
  data-lang="te"
  data-color="#8b5cf6"
  defer
></script>

<!-- Ready for Next.js, WordPress, Webflow, Shopify, or Custom HTML -->`,
        actionLabel: 'Copy Script Tag',
        actionType: 'copy',
      },
      {
        id: 'del-2',
        title: 'Telugu & English Voice Receptionist Protocol',
        type: 'document',
        author: 'Sara (Voice Concierge)',
        preview: 'నమస్కారం అండి! సిటీ కేర్ క్లినిక్ కి స్వాగతం. నా పేరు సారా, ఫ్రంట్ డెస్క్ నుండి మాట్లాడుతున్నాను...',
        fullContent: `MEOW VOICE AI — MULTILINGUAL PROTOCOL (TELUGU & ENGLISH)
Caller Turn 1: "నమస్కారం అండి! సిటీ కేర్ క్లినిక్ కి స్వాగతం. నా పేరు సారా, ఫ్రంట్ డెస్క్ నుండి మాట్లాడుతున్నాను. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ కావాలా లేక రిపోర్ట్స్ గురించి మాట్లాడుతున్నారా?"
Caller Turn 2: "రేపు సాయంత్రం 5:30 స్లాట్ ఖాళీగా ఉందా?" -> calendar_lock_slot(Specialist, "Tomorrow 5:30 PM")
Confirmation: "పర్ఫెక్ట్ అండి! రేపు సాయంత్రం 5:30 కి మీ అపాయింట్‌మెంట్ కన్ఫర్మ్ చేశాను. గూగుల్ మ్యాప్స్ మరియు కన్ఫర్మేషన్ వివరాలు వాట్సాప్‌లో పంపించాను. టేక్ కేర్ అండి!"`,
        actionLabel: 'Download Protocol',
        actionType: 'download',
      },
      {
        id: 'del-3',
        title: 'High-Converting WhatsApp Token Pass Sequence',
        type: 'message',
        author: 'Maya (Growth Lead)',
        preview: 'Hello [Patient Name]! Confirming your appointment for Tomorrow at 5:30 PM IST...',
        fullContent: `Hello [Patient Name]! 👋
This is Sara from City Care Clinic. Your consultation is officially confirmed:

📅 Date: Tomorrow, 5:30 PM IST
👨‍⚕️ Specialist: Dr. Rao (Cardiology / Internal Medicine)
🏥 Location: Road No. 36, Jubilee Hills (Metro Pillar 1420), Hyderabad
📍 Map Directions: https://maps.google.com/?q=Jubilee+Hills+City+Care

To secure your token, pay ₹500 via zero-fee UPI:
UPI Link: upi://pay?pa=meowai@upi&pn=CityCareClinic&am=500&cu=INR

Need to reschedule or get directions? Reply directly to this WhatsApp message.`,
        actionLabel: 'Share via WhatsApp',
        actionType: 'whatsapp',
      },
      {
        id: 'del-4',
        title: 'Autonomous Multi-Agent SOW & Execution Blueprint',
        type: 'proposal',
        author: 'Alex (Strategy Lead)',
        preview: 'Comprehensive statement of work covering zero-cost architecture, sub-300ms SLA, and fallback redundancy...',
        fullContent: `PROJECT EXECUTION STATEMENT OF WORK (SOW)
Platform: MEOW AI Autonomous Fleet (v1.2)
Target SLA: 99.98% Uptime, <300ms First-Token Voice Synthesis
Cost Framework: ₹0 Infrastructure (Web Speech, Browser Audio, Cloud Firestore)
Security Guardrails: Server-Side Secret Isolation, 100% PII Minimization
Verification: Vitest 40/40 Passing, Deterministic Fallbacks Active`,
        actionLabel: 'Copy SOW Blueprint',
        actionType: 'copy',
      },
    ]);

    setIsRunning(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full rounded-3xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-2xl shadow-glass overflow-hidden text-left">
      {/* Top Banner & Omnibar */}
      <div className="p-6 sm:p-8 border-b border-white/[0.08] bg-zinc-900/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <Bot className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Autonomous Multi-Agent Swarm
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  Crew Mode
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                4 specialized agents collaborate in parallel to decompose, write, code, and execute your goals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>4 Agents Standing By</span>
            </span>
          </div>
        </div>

        {/* Omnibar Input */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <div className="w-full flex-1 flex items-center gap-2 p-2 rounded-2xl bg-zinc-950/80 border border-white/10 focus-within:border-violet-500/50 transition-all">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe any goal or business task for the agent swarm..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => runSwarmSimulation(prompt)}
            disabled={isRunning || !prompt.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-zinc-200 active:scale-95 disabled:opacity-40 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Swarm Collaborating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Deploy Agent Swarm</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] font-mono text-zinc-500">Instant Blueprints:</span>
          {PRESET_GOALS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p.prompt);
                runSwarmSimulation(p.prompt);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.06] transition-colors text-[11px]"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.08] px-6 bg-zinc-900/30 flex items-center gap-6 text-xs font-mono">
        <button
          onClick={() => setActiveTab('topology')}
          className={`py-3.5 border-b-2 font-medium flex items-center gap-1.5 transition-all ${
            activeTab === 'topology'
              ? 'border-violet-400 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Swarm Graph &amp; Fleet</span>
        </button>

        <button
          onClick={() => setActiveTab('stream')}
          className={`py-3.5 border-b-2 font-medium flex items-center gap-1.5 transition-all ${
            activeTab === 'stream'
              ? 'border-violet-400 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Live Swarm Stream ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deliverables')}
          className={`py-3.5 border-b-2 font-medium flex items-center gap-1.5 transition-all ${
            activeTab === 'deliverables'
              ? 'border-violet-400 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Generated Deliverables ({deliverables.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 sm:p-8">
        {/* Tab 1: Topology & Fleet Status */}
        {activeTab === 'topology' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {agents.map((agent) => {
                const isBusy = agent.status === 'thinking' || agent.status === 'acting';
                const isDone = agent.status === 'completed';

                return (
                  <div
                    key={agent.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      isBusy
                        ? 'bg-zinc-900/90 border-violet-500/50 shadow-lg scale-[1.02]'
                        : isDone
                        ? 'bg-zinc-900/60 border-emerald-500/30'
                        : 'bg-zinc-900/30 border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${agent.avatarColor} border ${agent.borderColor} flex items-center justify-center font-bold text-sm shadow-sm`}
                      >
                        {agent.name[0]}
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          isBusy
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse'
                            : isDone
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-white/10'
                        }`}
                      >
                        {agent.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-0.5">{agent.name}</h4>
                    <p className="text-xs text-zinc-400 mb-3">{agent.role}</p>

                    <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-[11px]">
                      <span className="text-zinc-500 font-mono block">SPECIALTY:</span>
                      <p className="text-zinc-300 leading-snug">{agent.specialty}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {agent.tools.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-white/[0.04]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Handoff Flow Diagram */}
            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/[0.06] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="font-semibold text-white flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-violet-400" />
                  <span>AUTONOMOUS SWARM COLLABORATION PIPELINE</span>
                </span>
                <span className="text-[11px] text-emerald-400">Deterministic Handoffs</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-300">
                <div className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Alex (Decomposition)</span>
                </div>
                <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />

                <div className="px-3 py-1.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-pink-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <span>Sara (Voice &amp; Intake)</span>
                </div>
                <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />

                <div className="px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Maya (WhatsApp Copy)</span>
                </div>
                <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />

                <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Rishi (Code &amp; UPI)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Swarm Stream */}
        {activeTab === 'stream' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar">
              {logs.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 space-y-2">
                  <Terminal className="w-8 h-8 mx-auto opacity-40 text-violet-400" />
                  <p>Click &quot;Deploy Agent Swarm&quot; to see real-time peer communication logs.</p>
                </div>
              ) : (
                logs.map((log) => {
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.04] space-y-1 text-left"
                    >
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="font-bold text-violet-300 flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5" />
                          <span>{log.agentName}</span>
                        </span>
                        <span className="text-zinc-600 text-[10px]">{log.timestamp}</span>
                      </div>

                      <p className="text-zinc-200 text-xs leading-relaxed font-sans">{log.message}</p>

                      {log.toolUsed && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Tool: {log.toolUsed}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        )}

        {/* Tab 3: Generated Deliverables */}
        {activeTab === 'deliverables' && (
          <div className="space-y-4">
            {deliverables.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 space-y-2 font-mono text-xs">
                <FileText className="w-8 h-8 mx-auto opacity-40 text-violet-400" />
                <p>No deliverables generated yet. Deploy the swarm to produce turnkey assets.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="p-5 rounded-2xl border border-white/[0.08] bg-zinc-900/40 hover:bg-zinc-900/70 transition-all space-y-3 flex flex-col justify-between text-left"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-[10px] text-violet-300 uppercase tracking-wider">
                          {del.author}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400">
                          {del.type.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2">{del.title}</h4>
                      <div className="p-3 rounded-xl bg-zinc-950 border border-white/[0.06] font-mono text-[11px] text-zinc-400 max-h-24 overflow-y-auto custom-scrollbar">
                        <pre className="whitespace-pre-wrap">{del.preview}</pre>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      {del.actionType === 'whatsapp' ? (
                        <button
                          onClick={() => {
                            const msg = encodeURIComponent(del.fullContent);
                            window.open(`https://wa.me/?text=${msg}`, '_blank');
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Dispatch to WhatsApp</span>
                        </button>
                      ) : del.actionType === 'download' ? (
                        <button
                          onClick={() => handleDownload(del.fullContent, `${del.title.toLowerCase().replace(/\s+/g, '_')}.txt`)}
                          className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Protocol</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCopy(del.fullContent, del.id)}
                          className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                        >
                          {copiedId === del.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{del.actionLabel || 'Copy Content'}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
