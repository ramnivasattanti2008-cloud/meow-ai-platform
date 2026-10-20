'use client';

import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Sparkles,
  Globe,
  Languages,
  Play,
  Layers,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const EmbedWidgetSnippetCard: React.FC = () => {
  const [businessName, setBusinessName] = useState('City Care Clinic');
  const [selectedLang, setSelectedLang] = useState('te');
  const [primaryColor, setPrimaryColor] = useState('#7c3aed');
  const [copied, setCopied] = useState(false);

  const snippet = `<script 
  src="https://meowboxai.tech/widget.js" 
  data-business="${businessName}" 
  data-lang="${selectedLang}" 
  data-color="${primaryColor}">
</script>`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-3xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-10 space-y-8 text-left shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-2">
            <Code className="w-3.5 h-3.5 text-violet-400" />
            <span>1-CLICK EMBEDDABLE VOICE WIDGET</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Deploy Sara on Your Website in 30 Seconds
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Give your website visitors an authentic, multilingual AI receptionist. Zero npm dependencies, sub-8KB payload, responsive on every browser.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-semibold text-xs flex items-center gap-2 active:scale-95 shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Copied Embed Script!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Embed Code</span>
            </>
          )}
        </button>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        {/* Business Name */}
        <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06]">
          <label className="text-zinc-400 font-medium block">CLINIC / BUSINESS NAME</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            placeholder="e.g. City Care Clinic"
          />
        </div>

        {/* Default Language */}
        <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06]">
          <label className="text-zinc-400 font-medium block">DEFAULT GREETING LANGUAGE</label>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
          >
            <option value="te">Telugu (తెలుగు)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="en">Indian English</option>
            <option value="ta">Tamil (தமிழ்)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
            <option value="ml">Malayalam (മലയാളം)</option>
            <option value="mr">Marathi (मराठी)</option>
            <option value="bn">Bengali (বাংলা)</option>
          </select>
        </div>

        {/* Theme Color */}
        <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.06]">
          <label className="text-zinc-400 font-medium block">WIDGET ACCENT COLOR</label>
          <div className="flex items-center gap-2 pt-1">
            {[
              { label: 'Violet', hex: '#7c3aed' },
              { label: 'Emerald', hex: '#10b981' },
              { label: 'Indigo', hex: '#6366f1' },
              { label: 'Rose', hex: '#f43f5e' },
            ].map((col) => (
              <button
                key={col.hex}
                type="button"
                onClick={() => setPrimaryColor(col.hex)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  primaryColor === col.hex ? 'scale-110 border-white' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.label}
              />
            ))}
            <span className="text-zinc-400 text-[11px] ml-auto">{primaryColor}</span>
          </div>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative rounded-2xl bg-zinc-900 border border-white/10 p-4 font-mono text-xs overflow-x-auto text-zinc-300">
        <div className="flex items-center justify-between text-zinc-500 text-[10px] pb-2 border-b border-white/5 mb-3">
          <span>PASTE THIS CODE BEFORE &lt;/body&gt; ON YOUR WEBSITE</span>
          <span>HTML / JAVASCRIPT</span>
        </div>
        <pre className="text-violet-300 leading-relaxed whitespace-pre-wrap">{snippet}</pre>
      </div>

      {/* Enterprise Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>No cookies or third-party tracking</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-violet-400 shrink-0" />
          <span>Sub-8KB edge-cached from CDN</span>
        </div>
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Native TTS across 8 Indian languages</span>
        </div>
      </div>
    </div>
  );
};
