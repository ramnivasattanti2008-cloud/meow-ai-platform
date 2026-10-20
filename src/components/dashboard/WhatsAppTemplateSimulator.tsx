'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCheck,
  Send,
  Phone,
  Video,
  MoreVertical,
  CheckCircle2,
  Calendar,
  CreditCard,
  MapPin,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { SupportedLanguage } from '@/lib/types';

export const WhatsAppTemplateSimulator: React.FC = () => {
  const [recipientPhone, setRecipientPhone] = useState('+91 98480 12345');
  const [recipientName, setRecipientName] = useState('Rajesh Kumar');
  const [template, setTemplate] = useState<'appointment' | 'invoice' | 'followup'>('appointment');
  const [language, setLanguage] = useState<SupportedLanguage>('te');
  const [dispatched, setDispatched] = useState(false);
  const [dispatching, setDispatching] = useState(false);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setDispatching(true);
    setDispatched(false);

    try {
      const res = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'appointment.created',
          channel: 'whatsapp_cloud_api',
          recipientPhone,
          recipientName,
        }),
      });

      if (res.ok) {
        setDispatched(true);
      }
    } catch (e) {
      console.error('WhatsApp dispatch error:', e);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900/60 border border-white/[0.08] shadow-glass">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Interactive WhatsApp Business Gateway</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Meta Cloud API Ready
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Preview and dispatch verified WhatsApp appointment tokens, instant UPI payment links, and diagnostic reports with interactive quick-reply buttons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400">
            Open Rates: <strong className="text-emerald-400">98.4%</strong> • Avg Response: <strong className="text-white">45s</strong>
          </span>
        </div>
      </div>

      {/* Simulator Grid: Form + Live Phone Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Dispatch Controls */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-zinc-950/80 border border-white/[0.08] space-y-4 shadow-subtle">
          <div className="border-b border-white/[0.06] pb-3">
            <h4 className="text-sm font-semibold text-white">Message Configuration</h4>
            <span className="text-[10px] font-mono text-zinc-500">Meta Verified Cloud Template</span>
          </div>

          <form onSubmit={handleDispatch} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-medium">Recipient Patient/Client Phone</label>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="+91 98480 12345"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-medium">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-medium">Template</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60"
                >
                  <option value="appointment">Appointment Token</option>
                  <option value="invoice">UPI Invoice / Receipt</option>
                  <option value="followup">Prescription Followup</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-medium">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60"
                >
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={dispatching}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-600/20"
            >
              <Send className={`w-3.5 h-3.5 ${dispatching ? 'animate-bounce' : ''}`} />
              <span>{dispatching ? 'Dispatching...' : 'Dispatch Live WhatsApp Message'}</span>
            </button>
          </form>

          {dispatched && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Dispatched successfully to <strong>{recipientPhone}</strong> via webhook event stream.
              </span>
            </div>
          )}
        </div>

        {/* Right Preview: Pixel-Perfect WhatsApp Mobile Shell */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-[360px] rounded-[36px] border-4 border-zinc-800 bg-[#0b141a] shadow-2xl overflow-hidden text-left flex flex-col h-[520px]">
            {/* Phone Top Notch Bar */}
            <div className="bg-[#1f2c34] px-4 py-2.5 flex items-center justify-between text-white border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                    CC
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#1f2c34]" />
                </div>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1">
                    <span>City Care Clinic</span>
                    <span className="text-[10px] text-emerald-400 font-bold" title="Verified Business">
                      ✓
                    </span>
                  </div>
                  <div className="text-[9px] text-zinc-400 font-mono">Official Business Account</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-zinc-400">
                <Video className="w-4 h-4 cursor-pointer hover:text-white" />
                <Phone className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                <MoreVertical className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
              </div>
            </div>

            {/* Chat Body with WhatsApp Pattern */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#0b141a] text-xs">
              <div className="text-center">
                <span className="px-2 py-0.5 rounded-md bg-[#182229] text-[9px] text-zinc-400 font-mono uppercase">
                  Today
                </span>
              </div>

              {/* Verified Automated Template Bubble */}
              <div className="max-w-[92%] ml-auto rounded-2xl rounded-tr-sm bg-[#005c4b] text-[#e9edef] p-3 shadow-md space-y-2 text-xs">
                {template === 'appointment' && (
                  <>
                    <div className="font-semibold text-emerald-200 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                      <span>
                        {language === 'te'
                          ? 'అపాయింట్‌మెంట్ ధృవీకరణ (City Care Clinic)'
                          : 'Appointment Confirmation (City Care Clinic)'}
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed">
                      {language === 'te' ? (
                        <>
                          నమస్కారం <strong>{recipientName}</strong> గారు! డాక్టర్ రాజేష్ రావు గారితో మీ
                          కన్సల్టేషన్ స్లాట్ రేపు సాయంత్రం <strong>5:30 PM</strong> కు నమోదు చేయబడింది.
                        </>
                      ) : (
                        <>
                          Hello <strong>{recipientName}</strong>, your orthopedic consultation with{' '}
                          <strong>Dr. Rajesh Rao</strong> is booked for tomorrow at <strong>5:30 PM IST</strong>.
                        </>
                      )}
                    </p>

                    <div className="p-2 rounded-lg bg-[#00473a] text-[10px] font-mono space-y-0.5 text-emerald-100">
                      <div>Token ID: CC-OPD-9182</div>
                      <div>Doctor: Dr. Rajesh Rao (Ortho)</div>
                      <div>Room: 104, First Floor</div>
                    </div>
                  </>
                )}

                {template === 'invoice' && (
                  <>
                    <div className="font-semibold text-emerald-200 flex items-center gap-1 text-[11px]">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Official Tax Invoice &amp; Payment Receipt</span>
                    </div>

                    <p className="text-[11px] leading-relaxed">
                      Dear <strong>{recipientName}</strong>, payment of <strong>₹600</strong> has been confirmed.
                      GST Tax Invoice (INV-01) is attached below.
                    </p>

                    <div className="p-2 rounded-lg bg-[#00473a] text-[10px] font-mono text-emerald-100 flex items-center justify-between">
                      <span>INV-2026-0912.pdf</span>
                      <span className="text-emerald-300 underline cursor-pointer">Download</span>
                    </div>
                  </>
                )}

                {template === 'followup' && (
                  <>
                    <div className="font-semibold text-emerald-200 flex items-center gap-1 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Post-Consultation Care &amp; Reports</span>
                    </div>

                    <p className="text-[11px] leading-relaxed">
                      {language === 'te' ? (
                        <>
                          హలో <strong>{recipientName}</strong> గారు, డాక్టర్ గారు సూచించిన మందుల చిట్టీ
                          మరియు రక్త పరీక్ష రిపోర్ట్స్ అప్‌లోడ్ చేయబడ్డాయి.
                        </>
                      ) : (
                        <>
                          Hello <strong>{recipientName}</strong>, your digital prescription and test report
                          are ready for review.
                        </>
                      )}
                    </p>
                  </>
                )}

                <div className="flex items-center justify-end gap-1 text-[9px] text-[#8696a0] font-mono pt-1">
                  <span>12:45 PM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>

              {/* Interactive Quick-Reply Buttons (Native WhatsApp Cloud API Layout) */}
              <div className="max-w-[92%] ml-auto space-y-1.5">
                <button
                  type="button"
                  className="w-full py-2 px-3 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-cyan-300 font-semibold text-[11px] text-center border border-white/[0.06] transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Slot</span>
                </button>

                <button
                  type="button"
                  className="w-full py-2 px-3 rounded-xl bg-[#202c33] hover:bg-[#2a3942] text-cyan-300 font-semibold text-[11px] text-center border border-white/[0.06] transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Get Directions (Google Maps)</span>
                </button>
              </div>
            </div>

            {/* Bottom Fake Input */}
            <div className="bg-[#1f2c34] p-2.5 flex items-center gap-2 border-t border-white/[0.06]">
              <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-zinc-400 text-[11px]">
                Type a message...
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs">
                <Send className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
