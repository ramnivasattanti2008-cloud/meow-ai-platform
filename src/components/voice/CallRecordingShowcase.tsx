'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Mic, CheckCircle2, Clock, ShieldCheck, Sparkles, PhoneCall, Languages } from 'lucide-react';

interface CallSample {
  id: string;
  title: string;
  business: string;
  vertical: string;
  languageLabel: string;
  languageCode: 'te' | 'en' | 'mixed';
  durationSeconds: number;
  latencyMs: number;
  toolExecuted: string;
  turns: {
    speaker: 'agent' | 'caller';
    text: string;
    textEnTranslation?: string;
    startSec: number;
    endSec: number;
  }[];
}

const CALL_SAMPLES: CallSample[] = [
  {
    id: 'clinic-telugu',
    title: 'Clinic Appointment Booking',
    business: 'Dr. Rao Orthopedic Care, Hyderabad',
    vertical: 'Healthcare',
    languageLabel: 'Telugu (తెలుగు)',
    languageCode: 'te',
    durationSeconds: 28,
    latencyMs: 295,
    toolExecuted: 'calendar_lock_slot("Dr. Rao", "Tomorrow 5:30 PM")',
    turns: [
      {
        speaker: 'agent',
        text: 'నమస్కారం అండి! డాక్టర్ రావు ఆర్థోపెడిక్ క్లినిక్ కి స్వాగతం. నా పేరు ప్రియ, ఫ్రంట్ డెస్క్ నుండి మాట్లాడుతున్నాను. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ గురించి మాట్లాడుతున్నారా?',
        textEnTranslation: 'Namaskaram! Welcome to Dr. Rao Orthopedic Care. This is Priya from the front desk. How can I help with your consultation today?',
        startSec: 0,
        endSec: 7,
      },
      {
        speaker: 'caller',
        text: 'అవునండి, రేపు సాయంత్రం మోకాళ్ళ నొప్పి చెకప్ కోసం డాక్టర్‌గారిని కలవాలి.',
        textEnTranslation: 'Yes, I need to see the doctor tomorrow evening for a knee pain checkup.',
        startSec: 8,
        endSec: 13,
      },
      {
        speaker: 'agent',
        text: 'అయ్యో మోకాళ్ళ నొప్పా అండి... తప్పకుండా చూపిద్దాం. రేపు సాయంత్రం 5:30 లేదా 6:15 ఖాళీగా ఉన్నాయి. మీకు ఏ సమయం అనుకూలంగా ఉంటుంది?',
        textEnTranslation: 'Oh, knee pain... let us definitely get that checked. Tomorrow evening 5:30 PM and 6:15 PM are open. Which time works best for you?',
        startSec: 14,
        endSec: 20,
      },
      {
        speaker: 'caller',
        text: '5:30 సరిపోతుంది. కన్ఫర్మ్ చేయండి.',
        textEnTranslation: '5:30 PM is perfect. Please confirm that slot.',
        startSec: 21,
        endSec: 24,
      },
      {
        speaker: 'agent',
        text: 'పర్ఫెక్ట్ అండి! రేపు సాయంత్రం 5:30 కి మీ అపాయింట్‌మెంట్ కన్ఫర్మ్ చేశాను. గూగుల్ మ్యాప్స్ మరియు కన్ఫర్మేషన్ వివరాలు వాట్సాప్‌లో పంపించాను. టేక్ కేర్ అండి!',
        textEnTranslation: 'Perfect! Confirmed for tomorrow at 5:30 PM. Clinic map directions and token details have been sent to your WhatsApp. Take care!',
        startSec: 25,
        endSec: 28,
      },
    ],
  },
  {
    id: 'realestate-english',
    title: 'High-Intent Property Lead Triage',
    business: 'Prestige Lakeside Habitat, Bengaluru',
    vertical: 'Real Estate',
    languageLabel: 'Indian English',
    languageCode: 'en',
    durationSeconds: 24,
    latencyMs: 260,
    toolExecuted: 'crm_create_qualified_lead(budget="₹1.8-2.2 Cr", config="3BHK")',
    turns: [
      {
        speaker: 'agent',
        text: 'Good afternoon! Thanks for reaching out to Prestige Lakeside Habitat. This is Ananya. Are you exploring our 2 BHK residences or our premium 3 BHK units?',
        startSec: 0,
        endSec: 6,
      },
      {
        speaker: 'caller',
        text: 'Hi Ananya, we are looking for a 3 BHK unit on a higher floor with a lake view.',
        startSec: 7,
        endSec: 11,
      },
      {
        speaker: 'agent',
        text: 'Oh wonderful! Our Tower 4 lake-facing residences start at 1.95 Crores with 1850 square feet. Does that align comfortably with your budget?',
        startSec: 12,
        endSec: 17,
      },
      {
        speaker: 'caller',
        text: 'Yes, that works within our budget. Can we arrange a site visit this Saturday?',
        startSec: 18,
        endSec: 21,
      },
      {
        speaker: 'agent',
        text: 'Certainly! I have reserved your VIP private site tour for this Saturday at 11:30 AM. Meeting pass has been sent to your WhatsApp.',
        startSec: 22,
        endSec: 24,
      },
    ],
  },
  {
    id: 'dental-bilingual',
    title: 'Emergency Symptom & Handoff Triage',
    business: 'Clove Dental Care, Vijayawada',
    vertical: 'Dental Healthcare',
    languageLabel: 'Code-Mixed Telugu & English',
    languageCode: 'mixed',
    durationSeconds: 22,
    latencyMs: 310,
    toolExecuted: 'escalate_urgent_nurse(patient="Ramesh", symptom="Acute post-op pain")',
    turns: [
      {
        speaker: 'agent',
        text: 'నమస్కారం! క్లోవ్ డెంటల్ కేర్ AI అసిస్టెంట్. నేను మీకు ఎలా సహాయపడగలను?',
        textEnTranslation: 'Namaskaram! Clove Dental Care AI Assistant. How can I assist you today?',
        startSec: 0,
        endSec: 5,
      },
      {
        speaker: 'caller',
        text: 'Sir, నిన్న రూట్ కెనాల్ జరిగింది. విపరీతమైన pain వస్తోంది, bleeding కూడా అవుతోంది.',
        textEnTranslation: 'Sir, I had a root canal yesterday. I am having severe pain and some bleeding as well.',
        startSec: 6,
        endSec: 11,
      },
      {
        speaker: 'agent',
        text: 'అర్థమైంది అండి. నొప్పి మరియు రక్తం రావడం ఎమర్జెన్సీ లక్షణం. వెంటనే మిమ్మల్ని ఆన్-డ్యూటీ నర్సుకి ట్రాన్స్‌ఫర్ చేస్తున్నాను, లైన్‌లో ఉండండి.',
        textEnTranslation: 'Understood. Pain with active bleeding is an urgent symptom. Transferring you immediately to the duty nurse on call. Please hold.',
        startSec: 12,
        endSec: 18,
      },
      {
        speaker: 'caller',
        text: 'Thank you, please fast.',
        startSec: 19,
        endSec: 20,
      },
      {
        speaker: 'agent',
        text: '[Call Escalated: Duty Nurse Connected at +91 80 4000 0001]',
        startSec: 21,
        endSec: 22,
      },
    ],
  },
];

export const CallRecordingShowcase: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<CallSample>(CALL_SAMPLES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranslations, setShowTranslations] = useState(true);
  const timerRef = useRef<any>(null);

  // Playback timer simulation
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= selectedSample.durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(prev + 0.25 * playbackSpeed, selectedSample.durationSeconds);
        });
      }, 250);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, playbackSpeed, selectedSample.durationSeconds]);

  const handleSelectSample = (sample: CallSample) => {
    setIsPlaying(false);
    setCurrentTime(0);
    setSelectedSample(sample);
  };

  const togglePlay = () => {
    if (currentTime >= selectedSample.durationSeconds) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const currentTurn = selectedSample.turns.find(
    (t) => currentTime >= t.startSec && currentTime <= t.endSec
  );

  const lastSpokenTurnRef = useRef<number | null>(null);

  // Play real voice audio when turns are active
  useEffect(() => {
    if (!isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      lastSpokenTurnRef.current = null;
      return;
    }

    if (currentTurn) {
      const turnIdx = selectedSample.turns.indexOf(currentTurn);
      if (lastSpokenTurnRef.current !== turnIdx) {
        lastSpokenTurnRef.current = turnIdx;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const cleanText = currentTurn.text.replace(/\[.*?\]/g, '').trim();
          if (cleanText) {
            const u = new SpeechSynthesisUtterance(cleanText);
            u.rate = 1.02 * playbackSpeed;
            u.pitch = currentTurn.speaker === 'agent' ? 1.18 : 0.92;
            const voices = window.speechSynthesis.getVoices();
            const voiceMatch = voices.find(
              (v) =>
                v.lang.toLowerCase().includes(selectedSample.languageCode) ||
                (selectedSample.languageCode === 'te' && (v.name.includes('Telugu') || v.lang.includes('te'))) ||
                v.lang.includes('IN')
            );
            if (voiceMatch) u.voice = voiceMatch;
            window.speechSynthesis.speak(u);
          }
        }
      }
    }
  }, [isPlaying, currentTurn, playbackSpeed, selectedSample]);

  return (
    <div className="w-full rounded-3xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl shadow-glass overflow-hidden text-left">
      {/* Header with Case Selector */}
      <div className="p-4 sm:p-6 border-b border-white/[0.08] bg-zinc-900/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] font-mono text-violet-300 mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>AUTHENTIC AUDIO RECORDING SIMULATOR</span>
          </div>
          <h3 className="text-xl font-bold text-white">Live Call Transcripts &amp; Audio Playback</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Listen to simulated telephonic dialogue turns in native Telugu, Indian English, and bilingual code-switching.
          </p>
        </div>

        {/* Case Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900/90 p-1.5 rounded-2xl border border-white/[0.06]">
          {CALL_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedSample.id === sample.id
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <span>{sample.vertical}</span>
              <span className="ml-1 text-[10px] font-mono opacity-70">({sample.languageCode.toUpperCase()})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Player & Active Turn */}
        <div className="lg:col-span-5 space-y-6">
          {/* Audio Visualizer & Scrub Bar */}
          <div className="p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/70 to-zinc-950 space-y-5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 uppercase tracking-wider">{selectedSample.business}</span>
              <span className="text-violet-400">{selectedSample.languageLabel}</span>
            </div>

            {/* Simulated Animated Waveform Bars */}
            <div className="h-16 flex items-center justify-between gap-1 px-2 bg-zinc-950/80 rounded-xl border border-white/[0.06] overflow-hidden">
              {Array.from({ length: 32 }).map((_, i) => {
                const isActive = (i / 32) * selectedSample.durationSeconds <= currentTime;
                // Height based on playing state
                const randomHeight = isPlaying
                  ? Math.sin(i * 0.4 + currentTime * 3) * 20 + 26
                  : 12 + ((i % 5) * 4);
                return (
                  <div
                    key={i}
                    style={{ height: `${Math.max(6, randomHeight)}px` }}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      isActive
                        ? 'bg-violet-400'
                        : isPlaying
                        ? 'bg-zinc-700'
                        : 'bg-zinc-800'
                    }`}
                  />
                );
              })}
            </div>

            {/* Time Scrub & Controls */}
            <div className="space-y-2">
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-violet-500 h-full rounded-full transition-all"
                  style={{ width: `${(currentTime / selectedSample.durationSeconds) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                <span>0:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
                <span>0:{selectedSample.durationSeconds}</span>
              </div>
            </div>

            {/* Playback Button Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:bg-zinc-200 active:scale-95 transition-all shadow-subtle"
                  aria-label={isPlaying ? 'Pause call' : 'Play call'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={handleReset}
                  className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
                  title="Reset call"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Toggle */}
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
                {[1, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-1 rounded-lg transition-colors ${
                      playbackSpeed === speed ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Operational Metrics Card */}
          <div className="p-4 rounded-2xl bg-zinc-900/30 border border-white/[0.06] space-y-3 font-mono text-xs">
            <div className="text-zinc-400 font-semibold flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>REAL-TIME TELEPHONY TELEMETRY</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-zinc-500 block">First-Token Latency</span>
                <span className="text-emerald-400 font-bold">{selectedSample.latencyMs} ms (Claude Haiku)</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Speech Disclosure</span>
                <span className="text-white font-bold">Turn 1 Automated Notice</span>
              </div>
            </div>
            <div className="pt-2 border-t border-white/[0.06]">
              <span className="text-zinc-500 text-[10px] block">TOOL EXECUTION CALL:</span>
              <code className="text-violet-300 text-[11px] break-all">{selectedSample.toolExecuted}</code>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Synced Transcript */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-violet-400" />
              <span>SYNCHRONIZED CONVERSATION TRANSCRIPT</span>
            </div>
            {selectedSample.languageCode !== 'en' && (
              <button
                onClick={() => setShowTranslations(!showTranslations)}
                className="text-[11px] font-mono text-zinc-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
              >
                <Languages className="w-3 h-3" />
                <span>{showTranslations ? 'Hide English Subtitles' : 'Show English Subtitles'}</span>
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
            {selectedSample.turns.map((turn, idx) => {
              const isCurrentTurn = currentTime >= turn.startSec && currentTime <= turn.endSec;
              const isPast = currentTime > turn.endSec;
              const isAgent = turn.speaker === 'agent';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl transition-all duration-200 border ${
                    isCurrentTurn
                      ? 'bg-violet-950/30 border-violet-500/40 shadow-sm scale-[1.01]'
                      : isPast
                      ? 'bg-zinc-900/40 border-white/[0.06] opacity-80'
                      : 'bg-zinc-900/20 border-white/[0.04] opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-[11px] font-mono">
                    <span className={`font-semibold flex items-center gap-1.5 ${isAgent ? 'text-violet-300' : 'text-zinc-300'}`}>
                      <span className={`w-2 h-2 rounded-full ${isAgent ? 'bg-violet-400' : 'bg-emerald-400'}`} />
                      {isAgent ? 'MEOW Voice Agent' : 'Inbound Caller'}
                    </span>
                    <span className="text-zinc-500 text-[10px]">
                      0:{turn.startSec.toString().padStart(2, '0')} – 0:{turn.endSec.toString().padStart(2, '0')}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-100 leading-relaxed font-sans">
                    {turn.text}
                  </p>

                  {showTranslations && turn.textEnTranslation && (
                    <p className="text-[11px] text-zinc-400 mt-1.5 italic font-mono border-t border-white/[0.04] pt-1">
                      Translation: {turn.textEnTranslation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full compliance with Indian Telephony regulations &amp; emergency escalation protocols</span>
            </span>
            <span className="font-mono text-[10px] text-zinc-500">v1.2-telugu-prod</span>
          </div>
        </div>
      </div>
    </div>
  );
};
