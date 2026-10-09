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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Voice Agent Configurations</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Configure multilingual dialogue personas, system knowledge, and human escalation thresholds.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Agent</span>
          </button>
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
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-white/15 transition-all text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase">
                        {agent.purpose.replace('_', ' ')}
                      </span>
                    </div>

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

                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/[0.04] text-xs text-zinc-300 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-400 block">
                      GREETING ({agent.language === 'te' ? 'TELUGU' : 'ENGLISH'})
                    </span>
                    <p className="line-clamp-2">{agent.greeting}</p>
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

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setTestCallingAgent(agent)}
                    className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 font-mono text-[11px] flex items-center gap-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3 text-violet-400" />
                    <span>Test Voice Call</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-zinc-500 mr-1 uppercase">
                      {agent.language}
                    </span>
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
            ))}
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
                          ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI അസിസ്റ്റന്റാണ്. ഇന്ന് എങ്ങനെ സഹായിക്കണം?',
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

