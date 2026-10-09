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
  Sparkles,
  X,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { Campaign } from '@/lib/types';

export default function WorkspaceCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Generator Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [businessType, setBusinessType] = useState('Dental & Orthopedic Clinic');
  const [targetAudience, setTargetAudience] = useState('Families and working professionals in Bengaluru');
  const [offer, setOffer] = useState('Free Digital Consultation + 20% off Teeth Whitening');
  const [primaryChannel, setPrimaryChannel] = useState<'whatsapp' | 'meta_ads' | 'email'>('whatsapp');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // 1. Generate via AI
      const aiRes = await fetch('/api/ai/campaign-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType,
          targetAudience,
          offer,
          primaryChannel,
          useClaudeApi: true,
        }),
      });

      const aiData = await aiRes.json();
      const brief = aiData.brief || (aiData.headline ? aiData : null);

      const fullCopy = brief
        ? `🔥 HEADLINE: ${brief.headline}\n\n📝 AD / MESSAGE COPY:\n${brief.adCopy}\n\n👉 CALL TO ACTION: ${brief.callToAction}\n\n✅ CHECKLIST:\n${brief.executionChecklist?.join('\n') || ''}`
        : `Campaign for ${businessType}: ${offer}. Target: ${targetAudience} via ${primaryChannel.toUpperCase()}`;

      // 2. Save directly to DB
      const saveRes = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brief?.campaignName || `${businessType} Growth Campaign`,
          businessType,
          targetAudience,
          offer,
          primaryChannel,
          draftContent: fullCopy,
          status: 'draft',
        }),
      });

      const saved = await saveRes.json();
      if (saveRes.ok && saved.campaign) {
        setCampaigns((prev) => [saved.campaign, ...prev]);
        setModalOpen(false);
      }
    } catch (err) {
      console.error('Generate campaign error:', err);
      alert('Failed to generate campaign. Please check connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <WorkspaceLayout>
      <div className="space-y-6 text-left">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Marketing Campaigns</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Structured marketing briefs and channel copy ready for deployment to WhatsApp, Meta, or email sequences.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Draft Campaign with AI</span>
            </button>

            <Link
              href="/growth"
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-300 font-medium text-xs transition-all flex items-center gap-1.5"
            >
              <span>Growth Lab</span>
            </Link>
          </div>
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
                  <span>{copiedId === camp.id ? 'Copied' : 'Copy Text'}</span>
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

        {/* AI Campaign Generator Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-xl w-full bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <h3 className="text-lg font-bold text-white">Draft Campaign with Claude AI</h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleGenerateCampaign} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Business Industry / Type</label>
                  <input
                    type="text"
                    required
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="e.g. Dental & Orthodontic Clinic"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Target Customer Audience</label>
                  <input
                    type="text"
                    required
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Working professionals and families in Bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Offer / Value Proposition</label>
                  <input
                    type="text"
                    required
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    placeholder="e.g. Free Dental Consultation + 20% off Teeth Whitening"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-300 mb-1">Primary Dispatch Channel</label>
                  <select
                    value={primaryChannel}
                    onChange={(e) => setPrimaryChannel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="whatsapp">WhatsApp Business API Direct Dispatch</option>
                    <option value="meta_ads">Meta Ads (Instagram &amp; Facebook Feed)</option>
                    <option value="email">Email Sequence &amp; Newsletter</option>
                  </select>
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
                    disabled={isGenerating}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Brief...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate &amp; Save Brief</span>
                      </>
                    )}
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
