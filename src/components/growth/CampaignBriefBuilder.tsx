'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Send, RefreshCw, Layers, CheckCircle2, Bot, ArrowRight, Share2 } from 'lucide-react';
import { claudeAdapter, CampaignGenerationOutput } from '@/lib/ai/claude-client';

export const CampaignBriefBuilder: React.FC = () => {
  const [businessType, setBusinessType] = useState('Dental & Healthcare Clinic');
  const [targetAudience, setTargetAudience] = useState('Families and working tech professionals in Bengaluru (Ages 25-50)');
  const [offer, setOffer] = useState('Complete Oral Health Examination + Digital X-Ray at ₹499 (Save 60%)');
  const [primaryChannel, setPrimaryChannel] = useState<'whatsapp' | 'meta_ads' | 'email' | 'google_search' | 'linkedin'>('whatsapp');
  const [useClaudeApi, setUseClaudeApi] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<CampaignGenerationOutput | null>(
    claudeAdapter.generateDeterministicCampaign({
      businessType: 'Dental & Healthcare Clinic',
      targetAudience: 'Families and working tech professionals in Bengaluru (Ages 25-50)',
      offer: 'Complete Oral Health Examination + Digital X-Ray at ₹499 (Save 60%)',
      primaryChannel: 'whatsapp',
    })
  );

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      if (useClaudeApi) {
        const response = await fetch('/api/ai/campaign-draft', {
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
        if (response.ok) {
          const data = await response.json();
          setResult(data);
        } else {
          // Fallback
          setResult(
            claudeAdapter.generateDeterministicCampaign({
              businessType,
              targetAudience,
              offer,
              primaryChannel,
            })
          );
        }
      } else {
        // Deterministic instant client generation
        const generated = claudeAdapter.generateDeterministicCampaign({
          businessType,
          targetAudience,
          offer,
          primaryChannel,
        });
        setResult(generated);
      }
    } catch {
      setResult(
        claudeAdapter.generateDeterministicCampaign({
          businessType,
          targetAudience,
          offer,
          primaryChannel,
        })
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const textToCopy = `CAMPAIGN: ${result.campaignName}
HEADLINE: ${result.headline}
CHANNEL: ${primaryChannel}
CTA: ${result.callToAction}

AD COPY:
${result.adCopy}

EXECUTION CHECKLIST:
${result.executionChecklist.map((item) => `• ${item}`).join('\n')}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-2xl shadow-glass overflow-hidden text-left">
      {/* Top Header */}
      <div className="border-b border-white/[0.08] px-6 sm:px-8 py-5 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">MEOW Growth Campaign Architect</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
              Interactive Brief Engine
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Produces structured briefs, localized ad copy, and execution checklists for Indian SMBs.
          </p>
        </div>

        {/* Live Claude Toggle */}
        <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/10 cursor-pointer">
          <input
            type="checkbox"
            checked={useClaudeApi}
            onChange={(e) => setUseClaudeApi(e.target.checked)}
            className="rounded bg-zinc-800 border-white/20 text-violet-500 focus:ring-0"
          />
          <span>Use Anthropic Claude API</span>
          <span className="text-[10px] text-zinc-400 font-sans">(Falls back to demo if no key)</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
        {/* Input Form Column */}
        <form onSubmit={handleGenerate} className="lg:col-span-5 p-6 sm:p-8 space-y-4">
          <div className="text-xs font-mono text-zinc-400 pb-2 border-b border-white/[0.06]">
            CAMPAIGN PARAMETERS
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Business Archetype</label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/50"
            >
              <option value="Dental & Healthcare Clinic">Dental &amp; Healthcare Clinic</option>
              <option value="Real Estate Developer">Real Estate Developer / Builder</option>
              <option value="EdTech & Coaching Institute">EdTech &amp; Coaching Institute</option>
              <option value="E-Commerce & D2C Brand">E-Commerce &amp; D2C Brand</option>
              <option value="B2B Professional Services">B2B Professional Services</option>
              <option value="Local Service Business">Local Service Provider</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Target Audience</label>
            <textarea
              rows={2}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
              placeholder="e.g. Working professionals in Bengaluru seeking luxury villas"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Promotional Offer / Value Hook</label>
            <textarea
              rows={2}
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
              placeholder="e.g. 50% discount on first consultation this weekend"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Distribution Channel</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(
                [
                  { id: 'whatsapp', label: 'WhatsApp' },
                  { id: 'meta_ads', label: 'Meta Ads' },
                  { id: 'email', label: 'Email Newsletter' },
                  { id: 'google_search', label: 'Google Search' },
                  { id: 'linkedin', label: 'LinkedIn Post' },
                ] as const
              ).map((ch) => (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => setPrimaryChannel(ch.id)}
                  className={`px-3 py-2 rounded-xl text-left border transition-all ${
                    primaryChannel === ch.id
                      ? 'bg-zinc-800 border-violet-500/40 text-white font-medium'
                      : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Structured Brief...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span>Generate Campaign Brief</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Output Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 bg-zinc-900/20">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-xs font-mono text-zinc-400">
            <span>
              OUTPUT: {result?.providerUsed === 'anthropic_claude' ? 'ANTHROPIC CLAUDE' : 'DETERMINISTIC SIMULATION'}
            </span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>

          {result && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono text-zinc-400 mb-1">CAMPAIGN TITLE &amp; HOOK</div>
                <h4 className="text-base font-semibold text-white">{result.campaignName}</h4>
                <p className="text-xs text-violet-300 font-medium mt-0.5">{result.headline}</p>
              </div>

              <div>
                <div className="text-xs font-mono text-zinc-400 mb-1.5">OPTIMIZED CHANNEL COPY ({primaryChannel.toUpperCase()})</div>
                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/[0.08] text-xs text-zinc-200 whitespace-pre-line leading-relaxed font-sans">
                  {result.adCopy}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                  <span className="font-mono text-zinc-400 block mb-1">CALL TO ACTION (CTA)</span>
                  <span className="font-semibold text-white">{result.callToAction}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                  <span className="font-mono text-zinc-400 block mb-1">CHANNELS RECOMMENDED</span>
                  <span className="text-zinc-300">{result.suggestedChannels.join(', ')}</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-zinc-400 mb-1.5">EXECUTION CHECKLIST</div>
                <div className="space-y-1.5">
                  {result.executionChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
