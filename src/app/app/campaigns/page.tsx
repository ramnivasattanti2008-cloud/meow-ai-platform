'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceLayout } from '@/components/app/WorkspaceLayout';
import {
  Zap,
  Plus,
  Trash2,
  Copy,
  Check,
  Share2,
  MessageSquare,
  Mail,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { Campaign } from '@/lib/types';

export default function WorkspaceCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Delete campaign error:', err);
    }
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Marketing Campaigns</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Structured marketing briefs and channel copy ready for deployment to WhatsApp, Meta, or email sequences.
            </p>
          </div>

          <Link
            href="/growth"
            className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate New Brief</span>
          </Link>
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-6 flex flex-col justify-between space-y-4 hover:border-white/15 transition-all text-left"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400">
                      {camp.businessType}
                    </span>
                    <h3 className="font-semibold text-white text-base mt-0.5">{camp.name}</h3>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0 uppercase">
                    {camp.status}
                  </span>
                </div>

                <div className="text-xs text-zinc-400">
                  <span className="font-mono text-[10px] text-zinc-500 block">AUDIENCE &amp; CHANNEL</span>
                  <div className="text-zinc-300 mt-0.5">
                    {camp.targetAudience} • <strong className="uppercase">{camp.primaryChannel}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/[0.06] text-xs text-zinc-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto font-sans">
                  {camp.draftContent}
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <button
                  onClick={() => handleCopy(camp.id, camp.draftContent)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                >
                  {copiedId === camp.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === camp.id ? 'Copied' : 'Copy Copy'}</span>
                </button>

                <button
                  onClick={() => handleDelete(camp.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Campaign"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
