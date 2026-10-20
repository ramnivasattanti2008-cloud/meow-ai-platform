'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  PhoneForwarded,
  Radio,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Clock,
  Globe2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { TelephonyInboundCall } from '@/lib/types';

export const TelephonyHub: React.FC = () => {
  const [calls, setCalls] = useState<TelephonyInboundCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Simulator State
  const [simCallerNumber, setSimCallerNumber] = useState('+91 98480 12345');
  const [simProvider, setSimProvider] = useState<'exotel' | 'twilio' | 'telecmo' | 'sip_trunk'>('exotel');
  const [simTranscript, setSimTranscript] = useState('నాకు డాక్టర్ అపాయింట్‌మెంట్ కావాలి రేపు సాయంత్రం (Need doctor appointment tomorrow evening)');
  const [simulating, setSimulating] = useState(false);
  const [simulationResponse, setSimulationResponse] = useState<any>(null);

  const fetchTelephonyData = async () => {
    try {
      const res = await fetch('/api/telephony/inbound');
      const data = await res.json();
      setCalls(data.recentCalls || []);
    } catch (e) {
      console.error('Error fetching telephony calls:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelephonyData();
  }, []);

  const handleCopyWebhook = () => {
    navigator.clipboard?.writeText('https://meowboxai.tech/api/telephony/inbound');
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleSimulateCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    setSimulationResponse(null);

    try {
      const res = await fetch('/api/telephony/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callerNumber: simCallerNumber,
          calledNumber: '+91 80 4000 0001',
          provider: simProvider,
          transcript: simTranscript,
          format: 'json',
        }),
      });

      const data = await res.json();
      setSimulationResponse(data);
      fetchTelephonyData();
    } catch (e) {
      console.error('Simulate call error:', e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900/60 border border-white/[0.08] shadow-glass">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Inbound Phone & Carrier SIP Gateway</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              PSTN / GSM Ready
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Forward real cellular phone numbers and clinic landlines directly into Sara. Automatically detects caller language by STD area code (+91 40 Telugu, +91 80 Kannada, +91 22 Marathi).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyWebhook}
            className="px-4 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            {copiedWebhook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedWebhook ? 'Copied SIP Webhook!' : 'Copy Inbound Webhook'}</span>
          </button>
        </div>
      </div>

      {/* Turnkey Setup Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-2">
          <div className="text-[10px] font-mono uppercase text-violet-400 font-bold">Step 01 — Provider Setup</div>
          <h5 className="text-xs font-semibold text-white">Exotel, Twilio or Tata Tele</h5>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Acquire a virtual DID number or configure call forwarding on your existing Airtel / Jio business SIM to Exotel or Twilio.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-2">
          <div className="text-[10px] font-mono uppercase text-violet-400 font-bold">Step 02 — Webhook URL</div>
          <h5 className="text-xs font-semibold text-white">Point Voice Passthrough</h5>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            In Exotel Applet or Twilio Console, set Inbound Webhook to:
            <code className="block mt-1 p-1 rounded bg-zinc-900 text-[10px] text-zinc-300 font-mono truncate">
              https://meowboxai.tech/api/telephony/inbound
            </code>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-2">
          <div className="text-[10px] font-mono uppercase text-violet-400 font-bold">Step 03 — Autonomous Triage</div>
          <h5 className="text-xs font-semibold text-white">Multilingual Voice Reception</h5>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Sara answers inbound calls with zero latency, triages inquiries in the caller&apos;s mother tongue, and logs bookings directly to CRM.
          </p>
        </div>
      </div>

      {/* Live Inbound Call Simulator */}
      <div className="p-5 rounded-3xl bg-zinc-950/80 border border-white/[0.08] shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <PhoneForwarded className="w-4 h-4 text-violet-400" />
            <h4 className="text-sm font-semibold text-white">Interactive Inbound Call Simulator</h4>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">Simulate incoming GSM/Landline call</span>
        </div>

        <form onSubmit={handleSimulateCall} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-medium">Caller Phone Number (STD)</label>
              <input
                type="text"
                value={simCallerNumber}
                onChange={(e) => setSimCallerNumber(e.target.value)}
                placeholder="+91 98480 12345 or +91 80 4000 0001"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500/60"
              />
              <span className="text-[10px] text-zinc-500">Try +91 40 (Telugu), +91 80 (Kannada), +91 22 (Marathi)</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-300 font-medium">Carrier Protocol</label>
              <select
                value={simProvider}
                onChange={(e) => setSimProvider(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/60"
              >
                <option value="exotel">Exotel Indian Telephony</option>
                <option value="twilio">Twilio Programmable Voice</option>
                <option value="telecmo">TeleCMO Voice Bridge</option>
                <option value="sip_trunk">Enterprise SIP Trunk</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-1 flex items-end">
              <button
                type="submit"
                disabled={simulating}
                className="w-full px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Simulating Handshake...' : 'Simulate Call Inbound'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-300 font-medium">Caller Speech Utterance (Voice Recognition Input)</label>
            <input
              type="text"
              value={simTranscript}
              onChange={(e) => setSimTranscript(e.target.value)}
              placeholder="e.g. డాక్టర్ గారి ఫీజు ఎంత? or I need to book appointment for orthopedic consult"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500/60"
            />
          </div>
        </form>

        {/* Simulator Response Inspector */}
        {simulationResponse && (
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-violet-500/30 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-emerald-400 font-mono font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Telephony Call Handshake Processed</span>
              </div>
              <span className="text-[10px] text-zinc-400">Carrier: {simProvider.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-zinc-500 block text-[9px]">REGION DETECTED</span>
                <span className="text-zinc-200">{simulationResponse.call?.regionDetected}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-zinc-500 block text-[9px]">LANGUAGE</span>
                <span className="text-violet-300 uppercase">{simulationResponse.call?.languageSelected}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-zinc-500 block text-[9px]">INTENT PARSED</span>
                <span className="text-emerald-300">{simulationResponse.call?.intentDetected}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                <span className="text-zinc-500 block text-[9px]">DISPATCH OUTCOME</span>
                <span className="text-cyan-300">{simulationResponse.call?.outcome}</span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-mono text-zinc-400">Sara Synthesized Audio Prompt to Caller:</span>
              <p className="p-2.5 rounded-xl bg-black/50 text-xs text-zinc-200 border border-white/[0.06] italic">
                &ldquo;{simulationResponse.carrierAction?.promptText}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Telephony Inbound Calls Log */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Live Telephony Call Register ({calls.length})
          </h4>
          <button
            onClick={fetchTelephonyData}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-zinc-500 font-mono">Loading telephony call logs...</div>
        ) : calls.length === 0 ? (
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/[0.06] text-center text-xs text-zinc-500 font-mono">
            No incoming carrier calls recorded yet. Use the simulator above to test.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-zinc-950/70">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-[10px] font-mono uppercase text-zinc-500 bg-zinc-900/50">
                  <th className="py-2.5 px-4">Caller Number</th>
                  <th className="py-2.5 px-4">Provider</th>
                  <th className="py-2.5 px-4">Region & Language</th>
                  <th className="py-2.5 px-4">Intent</th>
                  <th className="py-2.5 px-4">Outcome</th>
                  <th className="py-2.5 px-4">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {calls.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-white">
                      {c.callerNumber}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 uppercase">
                        {c.provider}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-zinc-300">
                      <div>{c.regionDetected}</div>
                      <span className="text-[10px] font-mono text-violet-400 uppercase">
                        Lang: {c.languageSelected}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-zinc-300">
                      {c.intentDetected}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                          c.outcome === 'appointment_booked'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}
                      >
                        {c.outcome}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[10px] text-zinc-500">
                      {c.durationSeconds}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
