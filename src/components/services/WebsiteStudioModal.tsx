'use client';

import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Smartphone,
  Monitor,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Server,
  Mail,
  CreditCard,
  X,
  Palette,
  Layers,
  Download,
} from 'lucide-react';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';

interface WebsiteStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebsiteStudioModal: React.FC<WebsiteStudioModalProps> = ({ isOpen, onClose }) => {
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [brandName, setBrandName] = useState('City Care Clinic');
  const [tagline, setTagline] = useState('Modern Multispeciality & Wellness Center');
  const [niche, setNiche] = useState('Healthcare & Clinical Services');
  const [targetDomain, setTargetDomain] = useState('citycareclinic.in');
  const [emailRequirement, setEmailRequirement] = useState('reception@citycareclinic.in (2 Inboxes)');
  const [themeColor, setThemeColor] = useState<'violet' | 'emerald' | 'blue' | 'amber'>('violet');
  const [features, setFeatures] = useState<string[]>([
    'sara_voice_widget',
    'instant_booking_calendar',
    'upi_payment_qr',
    'whatsapp_floating_chat',
  ]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  if (!isOpen) return null;

  const toggleFeature = (feat: string) => {
    setFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleDownloadCode = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName} — ${tagline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #09090b; color: #ffffff; }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between">
  <header class="border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white">
        ${brandName.charAt(0)}
      </div>
      <span class="font-bold text-lg">${brandName}</span>
    </div>
    <div class="flex items-center gap-4">
      <a href="tel:+918040000001" class="text-xs text-zinc-400 hover:text-white font-mono">Sara Voice: +91 80 4000 0001</a>
      <a href="#book" class="px-4 py-2 rounded-full bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all">Book Online</a>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-6 py-20 text-center space-y-6 flex-1">
    <span class="px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-widest">${niche}</span>
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">${tagline}</h1>
    <p class="text-zinc-400 text-sm md:text-base max-w-xl mx-auto">Experience seamless consultation scheduling, bilingual phone reception, and automated WhatsApp tokens.</p>
    
    <div class="pt-4 flex flex-wrap items-center justify-center gap-3">
      <a href="#book" class="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition-all">Book Consultation (₹600)</a>
      <a href="https://wa.me/919848012345" class="px-6 py-3 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white text-sm transition-all">WhatsApp Direct</a>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left">
      <div class="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
        <div class="font-bold text-xs text-white">Sara Voice Receptionist</div>
        <div class="text-[11px] text-zinc-400">Telugu & English Call Handling</div>
      </div>
      <div class="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
        <div class="font-bold text-xs text-white">Instant Calendar Lock</div>
        <div class="text-[11px] text-zinc-400">Zero Double Bookings</div>
      </div>
      <div class="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
        <div class="font-bold text-xs text-white">Instant UPI Payments</div>
        <div class="text-[11px] text-zinc-400">Direct Bank Settlements</div>
      </div>
      <div class="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
        <div class="font-bold text-xs text-white">GST Invoicing</div>
        <div class="text-[11px] text-zinc-400">100% Tax Compliant</div>
      </div>
    </div>
  </main>

  <footer class="border-t border-white/10 px-6 py-6 text-center text-xs text-zinc-500 font-mono">
    © 2026 ${brandName}. Powered by MEOW AI Engine. Domain: ${targetDomain || 'yourdomain.in'}
  </footer>

  <!-- MEOW Live Vernacular Voice Concierge Widget -->
  <script src="https://meowboxai.tech/widget.js" data-business="${brandName}" data-lang="te"></script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_landing.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-left text-white shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Turnkey Website Designing &amp; Tech Setup Studio</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  48-Hour Launch
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Design your custom high-converting web app, domain DNS, and business email infrastructure.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column: Studio Configurator & Live Responsive Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-y-auto pr-1 items-start text-xs">
          {/* Configurator Left Column */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Business / Clinic Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Tagline / Core Proposition</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Target Domain Name</label>
                <input
                  type="text"
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  placeholder="yourclinic.in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Color Palette</label>
                <div className="flex items-center gap-2 pt-1">
                  {(['violet', 'emerald', 'blue', 'amber'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setThemeColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        themeColor === c ? 'scale-110 border-white' : 'border-transparent opacity-60'
                      } ${
                        c === 'violet'
                          ? 'bg-violet-600'
                          : c === 'emerald'
                          ? 'bg-emerald-600'
                          : c === 'blue'
                          ? 'bg-blue-600'
                          : 'bg-amber-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Business Emails &amp; Deliverability</label>
              <input
                type="text"
                value={emailRequirement}
                onChange={(e) => setEmailRequirement(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Feature Modules */}
            <div className="space-y-2">
              <label className="text-zinc-400 font-medium">Included High-Converting Modules</label>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                {[
                  { id: 'sara_voice_widget', label: 'Sara Voice AI Caller' },
                  { id: 'instant_booking_calendar', label: 'Slot Booking Calendar' },
                  { id: 'upi_payment_qr', label: 'Instant UPI Checkout' },
                  { id: 'whatsapp_floating_chat', label: 'WhatsApp Direct Pin' },
                ].map((feat) => (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => toggleFeature(feat.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      features.includes(feat.id)
                        ? 'bg-indigo-600/20 border-indigo-500/40 text-white font-semibold'
                        : 'bg-zinc-900 border-white/[0.04] text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{feat.label}</span>
                    {features.includes(feat.id) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Submit 48-Hour Turnkey Launch (₹19,999)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDownloadCode}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Website Source Code (.html)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Responsive Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-zinc-400 uppercase text-[10px]">LIVE MOCKUP PREVIEW</span>
              <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setDevicePreview('desktop')}
                  className={`p-1 rounded ${devicePreview === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePreview('mobile')}
                  className={`p-1 rounded ${devicePreview === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Preview Frame */}
            <div
              className={`mx-auto rounded-2xl bg-zinc-950 border border-white/15 p-4 shadow-2xl transition-all overflow-hidden ${
                devicePreview === 'mobile' ? 'max-w-[280px] min-h-[420px]' : 'w-full min-h-[400px]'
              }`}
            >
              {/* Fake Browser Top */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 font-mono text-[9px] text-zinc-400">
                  https://{targetDomain || 'yourdomain.com'}
                </div>
              </div>

              {/* Website Content Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-black text-xs tracking-tight text-white">{brandName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10">Book Slot</span>
                </div>

                <div className="space-y-1 py-4 text-center">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                    {niche}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-tight">{tagline}</h4>
                  <p className="text-[10px] text-zinc-400 max-w-xs mx-auto">
                    Modern high-converting experience with Sara multilingual voice booking and instant WhatsApp token delivery.
                  </p>
                </div>

                {/* Mock Modules */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {features.includes('sara_voice_widget') && (
                    <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 flex items-center gap-1.5 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Sara Voice Caller</span>
                    </div>
                  )}
                  {features.includes('instant_booking_calendar') && (
                    <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 flex items-center gap-1.5 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      <span>Calendar Lock</span>
                    </div>
                  )}
                  {features.includes('upi_payment_qr') && (
                    <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 flex items-center gap-1.5 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                      <span>Instant UPI Pay</span>
                    </div>
                  )}
                  {features.includes('whatsapp_floating_chat') && (
                    <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 flex items-center gap-1.5 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>WhatsApp Direct</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 text-center">
                  <div className="inline-block px-3 py-1.5 rounded-full bg-white text-zinc-950 font-bold text-[10px]">
                    Book Consultation (₹600)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EasyPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultPlan={`Website & Full Tech Setup (${brandName})`}
        defaultAmount={19999}
      />
    </div>
  );
};
