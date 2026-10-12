'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/app/WorkspaceLayout';
import {
  Bot,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Search,
  Filter,
  ShieldAlert,
  PhoneCall,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Download,
  Mic,
  MessageSquare,
  Activity,
  Play,
  Square,
  Check,
} from 'lucide-react';
import { Agent, SupportedLanguage } from '@/lib/types';
import { AgentSchema } from '@/lib/validation';
import { SaraDialerModal } from '@/components/voice/SaraDialerModal';

export default function WorkspaceAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<'all' | SupportedLanguage>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [testCallingAgent, setTestCallingAgent] = useState<Agent | null>(null);

  // In-Card Audio Playing State
  const [playingAgentId, setPlayingAgentId] = useState<string | null>(null);

  // Quick Prompt Tester State
  const [promptTesterOpen, setPromptTesterOpen] = useState(false);
  const [selectedTestingAgent, setSelectedTestingAgent] = useState<Agent | null>(null);
  const [customTestInput, setCustomTestInput] = useState('');
  const [isTesterSpeaking, setIsTesterSpeaking] = useState(false);

  const [form, setForm] = useState({
    name: '',
    purpose: 'appointment_booking' as Agent['purpose'],
    language: 'te' as SupportedLanguage,
    greeting: '',
    knowledgeInstructions: '',
    escalationRules: '',
    enabled: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const loadAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const openCreateModal = () => {
    setEditingAgent(null);
    setForm({
      name: '',
      purpose: 'appointment_booking',
      language: 'te',
      greeting: 'నమస్కారం! నేను మీ AI అసిస్టెంట్‌ని. మీకు ఏ విధంగా సహాయపడగలను?',
      knowledgeInstructions: 'Handles clinic appointment scheduling. Validates caller name, doctor availability, and confirms bookings.',
      escalationRules: 'Transfer immediately to human supervisor if emergency medical keywords or explicit human request occurs.',
      enabled: true,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (agent: Agent) => {
    setEditingAgent(agent);
    setForm({
      name: agent.name,
      purpose: agent.purpose,
      language: agent.language,
      greeting: agent.greeting,
      knowledgeInstructions: agent.knowledgeInstructions,
      escalationRules: agent.escalationRules,
      enabled: agent.enabled,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSpeakGreeting = (agent: Agent) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (playingAgentId === agent.id) {
      window.speechSynthesis.cancel();
      setPlayingAgentId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setPlayingAgentId(agent.id);

    const utterance = new SpeechSynthesisUtterance(agent.greeting);
    const langMap: Record<SupportedLanguage, string> = {
      te: 'te-IN',
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
    };
    utterance.lang = langMap[agent.language] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      setPlayingAgentId(null);
    };

    utterance.onerror = () => {
      setPlayingAgentId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakCustomPrompt = (text: string, lang: SupportedLanguage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsTesterSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<SupportedLanguage, string> = {
      te: 'te-IN',
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
    };
    utterance.lang = langMap[lang] || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      setIsTesterSpeaking(false);
    };

    utterance.onerror = () => {
      setIsTesterSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleExportAgent = (agent: Agent) => {
    const exportData = {
      ...agent,
      exportedAt: new Date().toISOString(),
      schemaVersion: '1.0.0',
      platform: 'MEOW AI Voice Agents',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agent.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parse = AgentSchema.safeParse(form);
    if (!parse.success) {
      setFormErrors(parse.error.flatten().fieldErrors);
      return;
    }

    try {
      if (editingAgent) {
        // Update
        const res = await fetch(`/api/agents/${editingAgent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setModalOpen(false);
          loadAgents();
        }
      } else {
        // Create
        const res = await fetch('/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setModalOpen(false);
          loadAgents();
        }
      }
    } catch (err) {
      console.error('Save agent failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent configuration?')) return;
    try {
      const res = await fetch(`/api/agents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAgents((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('Delete agent failed:', err);
    }
  };

  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.greeting.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = languageFilter === 'all' || a.language === languageFilter;
    return matchesSearch && matchesLang;
  });

  return (
    <WorkspaceLayout>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Voice Agent Studio</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                8 INDIAN LANGUAGES
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Configure multilingual dialogue personas, custom system instructions, and human escalation thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                const target = agents[0] || null;
                setSelectedTestingAgent(target);
                setCustomTestInput(
                  target?.greeting || 'నమస్కారం! డాక్టర్ అపాయింట్‌మెంట్ బుక్ చేసుకోవడానికి నేను మీకు సహాయం చేయగలను.'
                );
                setPromptTesterOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 font-medium text-xs transition-all flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-violet-400" />
              <span>Vernacular Audio Lab</span>
            </button>

            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Agent</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents by name or greeting..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
              Language:
            </span>
            <div className="flex items-center gap-1 text-xs">
              {[
                { code: 'all', label: 'All' },
                { code: 'te', label: 'Telugu' },
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'Hindi' },
                { code: 'ta', label: 'Tamil' },
                { code: 'kn', label: 'Kannada' },
                { code: 'ml', label: 'Malayalam' },
                { code: 'mr', label: 'Marathi' },
                { code: 'bn', label: 'Bengali' },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguageFilter(item.code as any)}
                  className={`px-2.5 py-1 rounded-lg transition-all shrink-0 font-medium ${
                    languageFilter === item.code
                      ? 'bg-violet-600 text-white font-bold shadow-sm'
                      : 'bg-zinc-900 border border-white/[0.06] text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        {filteredAgents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-zinc-900/20 space-y-3">
            <Bot className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm text-zinc-400">No agents match your criteria.</p>
            <button
              onClick={openCreateModal}
              className="text-xs text-violet-400 hover:underline font-mono"
            >
              + Create First Agent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => {
              const isPlaying = playingAgentId === agent.id;

              return (
                <div
                  key={agent.id}
                  className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-white/15 transition-all text-left relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">
                          {agent.purpose.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                            agent.enabled
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {agent.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    {/* Greeting Box with Quick Voice Synth Playback */}
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-white/[0.04] text-xs text-zinc-300 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                        <span className="uppercase">
                          GREETING ({agent.language === 'te' ? 'TELUGU' : agent.language.toUpperCase()})
                        </span>

                        {/* Animated waveform when playing */}
                        {isPlaying && (
                          <div className="flex items-center gap-0.5 h-3">
                            <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                            <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2" />
                            <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3.5" />
                            <span className="w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.2s] h-2" />
                          </div>
                        )}
                      </div>

                      <p className="line-clamp-2 text-zinc-200">{agent.greeting}</p>

                      <div className="pt-1 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleSpeakGreeting(agent)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition-colors ${
                            isPlaying
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10'
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <Square className="w-2.5 h-2.5 fill-current" />
                              <span>Stop Speech</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-emerald-400" />
                              <span>Listen Voice</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTestingAgent(agent);
                            setCustomTestInput(agent.greeting);
                            setPromptTesterOpen(true);
                          }}
                          className="text-[11px] font-mono text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          Open Lab →
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-400 space-y-1.5">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 block">KNOWLEDGE INSTRUCTIONS</span>
                        <p className="line-clamp-2 text-zinc-300">{agent.knowledgeInstructions}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-red-400 block">ESCALATION RULE</span>
                        <p className="line-clamp-2 text-red-300/80">{agent.escalationRules}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setTestCallingAgent(agent)}
                      className="px-2.5 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
                    >
                      <PhoneCall className="w-3 h-3 text-violet-400" />
                      <span>Live Dialer</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleExportAgent(agent)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Download Agent JSON Configuration"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => openEditModal(agent)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Edit Agent"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Agent"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================== VERNACULAR AUDIO LAB DRAWER ===================== */}
        {promptTesterOpen && selectedTestingAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-xl w-full bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">Vernacular Audio Speech Lab</h3>
                    <p className="text-[11px] text-zinc-400">
                      Testing persona: <span className="text-white font-semibold">{selectedTestingAgent.name}</span> (
                      {selectedTestingAgent.language.toUpperCase()})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                    setIsTesterSpeaking(false);
                    setPromptTesterOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sample Quick Prompt Chips */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Quick Vernacular Phrases:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'నమస్కారం! డాక్టర్ అపాయింట్‌మెంట్ రేపు సాయంత్రం 5:30 కి ఖరారైంది.',
                    'नमस्ते! क्या आप डॉक्टर से कंसल्टेशन बुक करना चाहते हैं?',
                    'வணக்கம்! உங்கள் சந்திப்பு பதிவு செய்யப்பட்டது.',
                    'Thank you for calling. We have reserved your appointment slot.',
                  ].map((chip, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCustomTestInput(chip)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-[11px] text-zinc-300 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Custom Speech Input (Spoken aloud in real-time)
                </label>
                <textarea
                  rows={3}
                  value={customTestInput}
                  onChange={(e) => setCustomTestInput(e.target.value)}
                  placeholder="Enter any sentence in Telugu, Hindi, Tamil, or English..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                />
              </div>

              {/* Audio Equalizer Visualizer */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isTesterSpeaking
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {isTesterSpeaking ? 'Speaking in Vernacular...' : 'Speech Synthesizer Ready'}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Rate: 0.95x • Pitch: 1.05 • Cadence: Natural Voice
                    </span>
                  </div>
                </div>

                {isTesterSpeaking && (
                  <div className="flex items-center gap-1 h-5">
                    <span className="w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s] h-5" />
                    <span className="w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s] h-3" />
                    <span className="w-1.5 bg-emerald-400 rounded-full animate-bounce h-6" />
                    <span className="w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.2s] h-4" />
                    <span className="w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.1s] h-5" />
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                {isTesterSpeaking ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                      setIsTesterSpeaking(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Speech</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakCustomPrompt(customTestInput, selectedTestingAgent.language)
                    }
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Speak Aloud</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal for Create/Edit Agent */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="max-w-xl w-full bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-glass max-h-[90vh] overflow-y-auto text-left">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <h3 className="text-lg font-bold text-white">
                  {editingAgent ? 'Edit Voice Agent' : 'Create New Voice Agent'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Agent Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Dr. Rao Clinic Frontdesk AI"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                  {formErrors.name && <p className="text-red-400 mt-1">{formErrors.name[0]}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-zinc-300 mb-1">Purpose / Role</label>
                    <select
                      value={form.purpose}
                      onChange={(e) => setForm({ ...form, purpose: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500/50"
                    >
                      <option value="appointment_booking">Appointment Booking</option>
                      <option value="customer_support">Customer Support</option>
                      <option value="lead_qualification">Lead Qualification</option>
                      <option value="order_inquiries">Order Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-zinc-300 mb-1">Primary Language</label>
                    <select
                      value={form.language}
                      onChange={(e) => {
                        const newLang = e.target.value as SupportedLanguage;
                        const defaultGreetings: Record<SupportedLanguage, string> = {
                          te: 'నమస్కారం! నేను మీ AI అసిస్టెంట్‌ని. మీకు ఏ విధంగా సహాయపడగలను?',
                          en: 'Hi! I am your AI receptionist. How can I help you today?',
                          hi: 'नमस्ते! मैं आपकी AI रिसेप्शनिस्ट हूँ। आज आपकी क्या मदद कर सकती हूँ?',
                          ta: 'வணக்கம்! நான் உங்கள் AI வரவேற்பாளர். இன்று உங்களுக்கு எப்படி உதவ முடியும்?',
                          kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಸಹಾಯಕ. ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
                          ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI അസിസ്റ്റന്റാണ്. இன்று എങ്ങനെ സഹായിക്കണം?',
                          mr: 'नमस्कार! मी आपली AI रिसेप्शनिस्ट आहे. आज मी आपल्याला कशी मदत करू शकते?',
                          bn: 'নমস্কার! আমি আপনার AI অ্যাসিস্ট্যান্ট। আজ আপনাকে কীভাবে সাহায্য করতে পারি?',
                        };
                        setForm({
                          ...form,
                          language: newLang,
                          greeting: defaultGreetings[newLang] || form.greeting,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500/50"
                    >
                      <option value="te">తెలుగు (Telugu - te-IN)</option>
                      <option value="en">English (Indian - en-IN)</option>
                      <option value="hi">हिन्दी (Hindi - hi-IN)</option>
                      <option value="ta">தமிழ் (Tamil - ta-IN)</option>
                      <option value="kn">ಕನ್ನಡ (Kannada - kn-IN)</option>
                      <option value="ml">മലയാളം (Malayalam - ml-IN)</option>
                      <option value="mr">मराठी (Marathi - mr-IN)</option>
                      <option value="bn">বাংলা (Bengali - bn-IN)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Initial Greeting Message</label>
                  <textarea
                    rows={2}
                    required
                    value={form.greeting}
                    onChange={(e) => setForm({ ...form, greeting: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                  {formErrors.greeting && <p className="text-red-400 mt-1">{formErrors.greeting[0]}</p>}
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Knowledge &amp; Domain Instructions</label>
                  <textarea
                    rows={3}
                    required
                    value={form.knowledgeInstructions}
                    onChange={(e) => setForm({ ...form, knowledgeInstructions: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                  {formErrors.knowledgeInstructions && (
                    <p className="text-red-400 mt-1">{formErrors.knowledgeInstructions[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Escalation &amp; Safety Rule</label>
                  <textarea
                    rows={2}
                    required
                    value={form.escalationRules}
                    onChange={(e) => setForm({ ...form, escalationRules: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                  {formErrors.escalationRules && (
                    <p className="text-red-400 mt-1">{formErrors.escalationRules[0]}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enabled}
                      onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                      className="rounded bg-zinc-800 border-white/20 text-violet-600 focus:ring-0"
                    />
                    <span>Enable agent for live routing</span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-white text-zinc-950 font-semibold hover:bg-zinc-200"
                  >
                    {editingAgent ? 'Save Changes' : 'Create Agent'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Live In-App Voice Testing Dialer */}
        <SaraDialerModal
          isOpen={Boolean(testCallingAgent)}
          onClose={() => setTestCallingAgent(null)}
          initialLanguage={testCallingAgent?.language || 'te'}
          agentName={testCallingAgent?.name}
        />
      </div>
    </WorkspaceLayout>
  );
}
