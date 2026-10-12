'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Plus, Trash2, Edit3, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { UserMemoryItem } from '@/lib/types';

export const MemoryVaultHub: React.FC = () => {
  const [memories, setMemories] = useState<UserMemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<'profile' | 'career' | 'business' | 'preference'>('profile');
  const [adding, setAdding] = useState(false);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memory');
      const data = await res.json();
      if (data.memories) {
        setMemories(data.memories);
      }
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newKey.trim(),
          value: newValue.trim(),
          category: newCategory,
        }),
      });
      const data = await res.json();
      if (data.success && data.memory) {
        setMemories((prev) => [data.memory, ...prev]);
        setNewKey('');
        setNewValue('');
        setAdding(false);
      }
    } catch (err) {
      console.error('Failed to add memory:', err);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Personal &amp; Business Memory Vault
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Persistent context that empowers MEOW agents to remember your background, preferences, and approved guidelines without repetitive prompting.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAdding(!adding)}
          className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Memory Item</span>
        </button>
      </div>

      {adding && (
        <form
          onSubmit={handleAdd}
          className="p-6 rounded-3xl bg-zinc-900/60 border border-white/10 space-y-4"
        >
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Create Context Anchor
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Context Key
              </label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. Target Tech Stack, Clinic Operating Hours"
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="profile">Personal Profile</option>
                <option value="career">Career / Technical</option>
                <option value="business">Business Operations</option>
                <option value="preference">General Preference</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Context Details &amp; Directives
            </label>
            <textarea
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="e.g. Lead engineer specializing in Next.js 14 and Web Audio systems..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500 resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
            >
              Save Context
            </button>
          </div>
        </form>
      )}

      {/* Grid of Memory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="p-5 rounded-2xl bg-zinc-900/40 border border-white/[0.08] space-y-2 hover:border-white/15 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-tight">{mem.key}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-zinc-800 text-zinc-300 border border-white/5">
                {mem.category}
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              {mem.value}
            </p>
            <div className="text-[10px] font-mono text-zinc-500 pt-1">
              Synced to MEOW Cloud Knowledge Layer
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

