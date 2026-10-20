'use client';

import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText,
  DollarSign,
  Calendar,
  AlertCircle,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { AgentKnowledgeDoc } from '@/lib/types';

export const AgentTrainingStudio: React.FC = () => {
  const [docs, setDocs] = useState<AgentKnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // New Training Document Form State
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'faq' | 'pricing' | 'policy' | 'roster' | 'general'>('faq');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');

  // Semantic Retrieval Testing
  const [testQuery, setTestQuery] = useState('What are the doctor consultation fees and insurance policies?');
  const [testResults, setTestResults] = useState<AgentKnowledgeDoc[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchKnowledgeDocs = async () => {
    try {
      const res = await fetch('/api/agents/agent-telugu-clinic/knowledge');
      const data = await res.json();
      setDocs(data.knowledgeDocs || []);
    } catch (e) {
      console.error('Error fetching knowledge:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeDocs();
  }, []);

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const kwArray = keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      const res = await fetch('/api/agents/agent-telugu-clinic/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          content,
          keywords: kwArray,
        }),
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setKeywords('');
        setIsAdding(false);
        fetchKnowledgeDocs();
      }
    } catch (e) {
      console.error('Error adding knowledge chunk:', e);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    try {
      const res = await fetch(`/api/agents/agent-telugu-clinic/knowledge?docId=${docId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchKnowledgeDocs();
      }
    } catch (e) {
      console.error('Error deleting doc:', e);
    }
  };

  const handleTestQuery = async () => {
    if (!testQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/agents/agent-telugu-clinic/knowledge', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery }),
      });
      const data = await res.json();
      setTestResults(data.matches || []);
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setIsSearching(false);
    }
  };

  const categoryIcons = {
    faq: HelpCircle,
    pricing: DollarSign,
    policy: BookOpen,
    roster: Calendar,
    general: FileText,
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900/60 border border-white/[0.08] shadow-glass">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Agent Knowledge Base &amp; Training Studio</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20">
              Grounded Retrieval RAG
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Train Sara with your company&apos;s real clinic timings, consultation pricing, doctor specialties, and emergency guidelines. Sara cites these facts directly during phone calls and chats.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Train New Knowledge</span>
        </button>
      </div>

      {/* Add Knowledge Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreateDoc}
          className="p-5 rounded-2xl bg-zinc-950/90 border border-violet-500/30 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h4 className="text-sm font-semibold text-white">Add Grounded Training Document / Policy</h4>
            <span className="text-[10px] font-mono text-zinc-500">Live RAG Injection</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-zinc-300 font-medium">Document / Policy Title</label>
              <input
                type="text"
                placeholder="e.g. Sunday Emergency Protocols & Ambulance Triage"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/60"
              >
                <option value="faq">FAQ / Q&amp;A</option>
                <option value="pricing">Pricing &amp; Insurance</option>
                <option value="policy">Policy &amp; Rules</option>
                <option value="roster">Doctor Roster &amp; Hours</option>
                <option value="general">General Knowledge</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-300 font-medium">Content / Policy Text (What Sara will quote to callers)</label>
            <textarea
              rows={4}
              placeholder="Paste exact clinic rules, fees, doctor timings, or instructions in English, Telugu, or Hindi..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/60 leading-relaxed font-sans"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-300 font-medium">Keywords / Synonyms (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. fee, cost, consultation, ortho, discount, timing"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/60 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Save Knowledge Chunk
            </button>
          </div>
        </form>
      )}

      {/* Semantic Retrieval Testing Omnibar */}
      <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono uppercase text-[10px] tracking-wider text-violet-400 font-semibold">
            Knowledge Retrieval Simulator
          </span>
          <span className="text-[10px] font-mono text-zinc-500">Test how Sara retrieves answers</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Ask a question (e.g. What is Dr. Rao's consultation fee?)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/60"
            />
          </div>
          <button
            type="button"
            onClick={handleTestQuery}
            disabled={isSearching}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-violet-400 ${isSearching ? 'animate-spin' : ''}`} />
            <span>Test Query</span>
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="pt-2 space-y-2 animate-in fade-in duration-200">
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Matched {testResults.length} Grounded Document(s):</span>
            </span>
            <div className="space-y-1.5">
              {testResults.map((match) => (
                <div
                  key={match.id}
                  className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/30 text-xs text-zinc-200 space-y-1"
                >
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>{match.title}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-violet-900/60 text-violet-300 uppercase">
                      {match.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 italic">&ldquo;{match.content}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trained Knowledge Chunks Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Active Trained Knowledge Documents ({docs.length})
          </h4>
          <button
            onClick={fetchKnowledgeDocs}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading knowledge chunks...</div>
        ) : docs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-zinc-900/40 border border-white/[0.06] text-center space-y-2">
            <p className="text-xs text-zinc-400">No knowledge chunks trained yet.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs text-violet-400 hover:underline font-mono"
            >
              + Train your first document / FAQ pair
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {docs.map((d) => {
              const Icon = categoryIcons[d.category] || FileText;
              return (
                <div
                  key={d.id}
                  className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-2.5 flex flex-col justify-between hover:border-white/15 transition-all shadow-subtle"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/[0.06] text-zinc-300 uppercase flex items-center gap-1">
                        <Icon className="w-2.5 h-2.5 text-violet-400" />
                        {d.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteDoc(d.id)}
                        className="text-zinc-600 hover:text-red-400 transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h5 className="font-semibold text-xs text-white leading-snug">{d.title}</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3">
                      {d.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.04] flex flex-wrap gap-1">
                    {d.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
