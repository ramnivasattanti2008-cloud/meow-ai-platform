'use client';

import React, { useState, useEffect } from 'react';
import { Phone, CheckCircle2, Clock, Zap, ArrowRight, UserCheck, Database, Calendar, MessageSquare, Play, RefreshCw } from 'lucide-react';

export const HeroVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'voice' | 'tools' | 'growth'>('voice');
  const [isSimulating, setIsSimulating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Auto-cycle through simulation steps when active
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= 3) {
            setIsSimulating(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const runSimulation = () => {
    setStepIndex(0);
    setIsSimulating(true);
  };

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-zinc-950/70 backdrop-blur-xl shadow-glass overflow-hidden text-left">
      {/* Control Navigation Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] px-4 py-3 sm:px-6 bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 text-xs font-mono text-zinc-400">meow-orchestrator.engine.v1</span>
        </div>

        {/* System Tabs */}
        <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/[0.06] mt-2 sm:mt-0">
          <button
            onClick={() => { setActiveTab('voice'); setStepIndex(0); setIsSimulating(false); }}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'voice'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            1. Multilingual Voice
          </button>
          <button
            onClick={() => { setActiveTab('tools'); setStepIndex(0); setIsSimulating(false); }}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'tools'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            2. Business Tools
          </button>
          <button
            onClick={() => { setActiveTab('growth'); setStepIndex(0); setIsSimulating(false); }}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'growth'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            3. Growth &amp; Lead Intake
          </button>
        </div>

        {/* Live Simulation Trigger */}
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="hidden md:flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 transition-all disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Simulating Event...</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>Simulate Pipeline</span>
            </>
          )}
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-5 sm:p-8 min-h-[340px] flex flex-col justify-between">
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Inbound Call: Dr. Rao Clinic</h4>
                  <p className="text-xs text-zinc-400 font-mono">Caller: Hyderabad (+91 98490 *****) • Telugu/English</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Session
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-3 font-sans text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-zinc-300">
                <span className="text-xs font-mono text-zinc-400 block mb-1">CALLER (AUDIO TRANSCRIPTION)</span>
                &quot;నమస్కారం అండి, రేపు సాయంత్రం డాక్టర్ రావు గారి కన్సల్టేషన్ దొరుకుతుందా?&quot;
                <div className="text-xs text-zinc-400 mt-1 italic">&quot;Namaskaram, is Dr. Rao consultation available tomorrow evening?&quot;</div>
              </div>

              <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 text-zinc-200">
                <span className="text-xs font-mono text-violet-400 block mb-1">MEOW VOICE AI (TELUGU DIALOGUE TURN)</span>
                &quot;నమస్కారం అండి! రేపు సాయంత్రం 5:30 PM మరియు 6:30 PM స్లాట్‌లు ఖాళీగా ఉన్నాయి. మీకు 5:30 PM అనుకూలమా?&quot;
                <div className="text-xs text-zinc-400 mt-1 italic">&quot;Namaskaram! Tomorrow 5:30 PM and 6:30 PM slots are open. Would 5:30 PM suit you?&quot;</div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/40 border border-white/[0.04]">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-zinc-300">Latency: 380ms STT → Claude Intent → 220ms Natural Telugu TTS</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-lime-500/20 border border-lime-400/30 flex items-center justify-center text-lime-300">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">System Orchestration &amp; Action Execution</h4>
                  <p className="text-xs text-zinc-400 font-mono">Real-time webhook sync across booking engine and CRM</p>
                </div>
              </div>
              <span className="text-xs font-mono text-zinc-400">Deterministic State</span>
            </div>

            {/* Stepper Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>STEP 1: REASON</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-sm font-medium text-white">Extract Intent &amp; Time</div>
                <p className="text-xs text-zinc-400">Validated 17:30 slot requirement via Claude function calling schema.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>STEP 2: LOCK</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-sm font-medium text-white">Calendar Synchronization</div>
                <p className="text-xs text-zinc-400">Locked Dr. Rao slot #9842 on Google Calendar with zero double-booking.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>STEP 3: GATE</span>
                  <UserCheck className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div className="text-sm font-medium text-white">Human Oversight Rule</div>
                <p className="text-xs text-zinc-400">Patient flagged with priority status; clinic frontdesk notified on dashboard.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-300">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Growth Automation &amp; Conversion Loop</h4>
                  <p className="text-xs text-zinc-400 font-mono">Turning verified inquiries into repeat customer relationships</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +100% Attribution
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Lead Engagement</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Automated bilingual appointment confirmation dispatched with clinic navigation link and prep guidelines.
                </p>
                <div className="text-[11px] font-mono text-zinc-500">Delivery status: Read (2s) • Zero human typing required</div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <Calendar className="w-3.5 h-3.5 text-violet-400" />
                  <span>Automated 24h Reminder Loop</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Voice bot triggers a 15-second confirmation call the morning of the appointment to reduce clinic no-show rates.
                </p>
                <div className="text-[11px] font-mono text-zinc-500">Measurable outcome: 92% slot retention rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Live System Indicator Footer */}
        <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span>Claude API Adapter Ready</span>
            <span className="text-zinc-600">|</span>
            <span>Telugu &amp; English Voice Engine v1</span>
          </div>
          <div className="text-zinc-400">
            Action: <span className="text-zinc-200">Production-Ready Architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
};
