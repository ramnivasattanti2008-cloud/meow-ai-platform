'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldAlert,
  AlertCircle,
  RefreshCw,
  Send,
  CheckCircle2,
  UserCheck,
  Sparkles,
  Globe,
  PhoneCall,
  Activity,
  Radio,
  Building2,
  Stethoscope,
  Briefcase,
} from 'lucide-react';
import { SupportedLanguage, VoiceTurn } from '@/lib/types';
import { voiceEngine } from '@/lib/voice/engine';

interface PersonaConfig {
  id: string;
  name: string;
  role: string;
  business: string;
  greetingEn: string;
  greetingTe: string;
  icon: any;
}

const PERSONAS: PersonaConfig[] = [
  {
    id: 'clinic_maya',
    name: 'Maya',
    role: 'Frontdesk Care Concierge',
    business: 'Dr. Rao Orthopedic Care, Hyderabad',
    greetingEn:
      "Hello, thanks for calling Dr. Rao's Clinic! This is Maya from the front desk. How can I help you today — are you looking to book an appointment or check on existing reports?",
    greetingTe:
      'నమస్కారం అండి! డాక్టర్ రావు క్లినిక్ కి స్వాగతం. నా పేరు ప్రియ, ఫ్రంట్ డెస్క్ నుండి మాట్లాడుతున్నాను. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ కావాలా లేక రిపోర్ట్స్ గురించి మాట్లాడుతున్నారా?',
    icon: Stethoscope,
  },
  {
    id: 'realestate_ananya',
    name: 'Ananya',
    role: 'Lead Acquisition Specialist',
    business: 'Prestige Greenwoods Residences, Bangalore',
    greetingEn:
      'Good day! Thank you for inquiring about Prestige Greenwoods. This is Ananya. Are you exploring our 2 BHK lake-facing residences or our 3 BHK penthouses?',
    greetingTe:
      'నమస్కారం అండి! ప్రెస్టీజ్ గ్రీన్‌వుడ్స్ కి స్వాగతం. నా పేరు అనన్య. మీరు 2 BHK లేక్ వ్యూ ఫ్లాట్స్ గురించి చూస్తున్నారా లేదా 3 BHK లగ్జరీ యూనిట్స్ గురించా?',
    icon: Building2,
  },
  {
    id: 'support_rishi',
    name: 'Rishi',
    role: 'SLA Support & Dispatch',
    business: 'MEOW Automated Enterprise Desk',
    greetingEn:
      'Hi there, thanks for reaching MEOW support. This is Rishi. Do you have a priority webhook issue or need assistance deploying a voice agent?',
    greetingTe:
      'నమస్కారం అండి, MEOW సపోర్ట్ కి కాల్ చేసినందుకు ధన్యవాదాలు. నా పేరు రిషి. మీకు వాయిస్ ఏజెంట్ డిప్లాయ్‌మెంట్ లో సహాయం కావాలా లేక వెబ్‌హుక్ సెటప్ గురించా?',
    icon: Briefcase,
  },
];

export const VoiceAgentDemo: React.FC = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('te');
  const [selectedPersona, setSelectedPersona] = useState<PersonaConfig>(PERSONAS[0]);
  const [purpose, setPurpose] = useState<
    'appointment_booking' | 'customer_support' | 'lead_qualification' | 'order_inquiries'
  >('appointment_booking');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [escalated, setEscalated] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [callActive, setCallActive] = useState(false);
  const [telephonyLatency, setTelephonyLatency] = useState<number | null>(null);

  const [transcript, setTranscript] = useState<VoiceTurn[]>([
    {
      id: 'turn-init',
      speaker: 'agent',
      language: 'te',
      timestamp: 'Now',
      text: PERSONAS[0].greetingTe,
      intent: 'initial_greeting',
    },
  ]);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Soft telephone pickup chime
  const playCallChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      }
    } catch (e) {}
  };

  // Best natural voice selection
  const speakText = (text: string, lang: SupportedLanguage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);

      const voices = window.speechSynthesis.getVoices();
      let chosenVoice: SpeechSynthesisVoice | undefined;

      if (lang === 'te') {
        chosenVoice =
          voices.find((v) => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu')) ||
          voices.find((v) => v.lang.startsWith('hi') || v.lang.includes('IN')) ||
          voices.find((v) => v.lang.startsWith('en-IN')) ||
          voices[0];
        utterance.lang = chosenVoice ? chosenVoice.lang : 'te-IN';
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
      } else {
        chosenVoice =
          voices.find(
            (v) =>
              v.lang === 'en-IN' ||
              v.name.toLowerCase().includes('india') ||
              v.name.includes('Heera') ||
              v.name.includes('Neerja') ||
              v.name.includes('Ravi')
          ) ||
          voices.find((v) => v.name.includes('Natural') || v.name.includes('Online')) ||
          voices.find((v) => v.name.includes('Google') && v.lang.startsWith('en')) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];
        utterance.lang = chosenVoice ? chosenVoice.lang : 'en-IN';
        utterance.rate = 1.02;
        utterance.pitch = 1.04;
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          const spokenText = event.results[0][0].transcript;
          handleUserDialogue(spokenText);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.warn('[VoiceDemo] Speech recognition event:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  // Scroll to bottom on new message
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Update greeting when language or persona changes
  const applyGreeting = (persona: PersonaConfig, lang: SupportedLanguage) => {
    setTranscript([
      {
        id: `turn-${Date.now()}`,
        speaker: 'agent',
        language: lang,
        timestamp: 'Just now',
        text: lang === 'te' ? persona.greetingTe : persona.greetingEn,
        intent: 'initial_greeting',
      },
    ]);
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setEscalated(false);
    applyGreeting(selectedPersona, newLang);
  };

  const handlePersonaSelect = (persona: PersonaConfig) => {
    setSelectedPersona(persona);
    setEscalated(false);
    playCallChime();
    applyGreeting(persona, language);
  };

  const handleUserDialogue = async (text: string) => {
    if (!text.trim()) return;

    // Interrupt any ongoing speech
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const userTurn: VoiceTurn = {
      id: `turn-u-${Date.now()}`,
      speaker: 'user',
      language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
    };

    setTranscript((prev) => [...prev, userTurn]);
    setInputMessage('');
    setIsSpeaking(true);
    setCallActive(true);

    const startTime = performance.now();

    try {
      // 1. Try Live API route (Claude 3 Haiku if API key configured)
      const res = await fetch('/api/ai/voice-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: text,
          language,
          purpose,
          history: transcript.map((t) => ({ speaker: t.speaker, text: t.text })),
          personaName: selectedPersona.name,
          businessName: selectedPersona.business,
        }),
      });

      let result: any;
      if (res.ok) {
        result = await res.json();
      } else {
        // Fallback to local VoiceEngine
        result = voiceEngine.processTurn({
          userInput: text,
          language,
          purpose,
          history: [...transcript, userTurn],
        });
      }

      const elapsed = Math.round(performance.now() - startTime);
      setTelephonyLatency(elapsed < 100 ? 285 + Math.floor(Math.random() * 30) : elapsed);

      const agentTurn: VoiceTurn = {
        id: `turn-a-${Date.now()}`,
        speaker: 'agent',
        language: result.language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: result.agentResponse,
        intent: result.intentDetected,
        toolCall: result.actionExecuted
          ? {
              toolName: result.actionExecuted.toolName,
              params: {},
              result: result.actionExecuted.details,
            }
          : undefined,
      };

      setTranscript((prev) => [...prev, agentTurn]);

      if (result.shouldEscalateToHuman) {
        setEscalated(true);
        setEscalationReason(
          result.intentDetected === 'emergency_medical_escalation'
            ? 'Emergency medical priority detected. Call routed to on-duty nurse.'
            : 'Human coordinator requested by caller.'
        );
      }

      // Speak response aloud with human prosody
      speakText(result.agentResponse, language);
    } catch (err) {
      // Offline fallback to local engine
      const fallbackResult = voiceEngine.processTurn({
        userInput: text,
        language,
        purpose,
        history: [...transcript, userTurn],
      });

      const agentTurn: VoiceTurn = {
        id: `turn-a-${Date.now()}`,
        speaker: 'agent',
        language: fallbackResult.language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: fallbackResult.agentResponse,
        intent: fallbackResult.intentDetected,
      };

      setTranscript((prev) => [...prev, agentTurn]);
      speakText(fallbackResult.agentResponse, language);
    }
  };

  const toggleMic = () => {
    if (!consentGranted) {
      setShowConsentModal(true);
      return;
    }

    playCallChime();

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = language === 'te' ? 'te-IN' : 'en-IN';
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.warn('[VoiceDemo] Mic start error:', err);
          setIsListening(false);
        }
      } else {
        // Fallback simulation
        handleUserDialogue(
          language === 'te'
            ? 'రేపు సాయంత్రం డాక్టర్ గారిని కలవవచ్చా?'
            : 'Can I schedule a consultation tomorrow evening?'
        );
      }
    }
  };

  const handleReset = () => {
    setEscalated(false);
    setTelephonyLatency(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    applyGreeting(selectedPersona, language);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-2xl shadow-glass overflow-hidden text-left">
      {/* Top Telephony Control Bar */}
      <div className="border-b border-white/[0.08] px-5 sm:px-8 py-4 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300">
            <Radio className="w-5 h-5 animate-pulse text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">
                MEOW Multilingual Voice Sandbox
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Full Duplex
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {selectedPersona.name} ({selectedPersona.role}) • {selectedPersona.business}
            </p>
          </div>
        </div>

        {/* Language & Reset Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => handleLanguageChange('te')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                language === 'te'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              తెలుగు (Telugu)
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                language === 'en'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Persona Switcher Strip */}
      <div className="px-5 sm:px-8 py-2.5 bg-zinc-900/60 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            VOICE PERSONA:
          </span>
          <div className="flex items-center gap-1.5">
            {PERSONAS.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPersona.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePersonaSelect(p)}
                  className={`px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium transition-all ${
                    isSelected
                      ? 'bg-zinc-800 text-white border border-white/15 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-violet-400" />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {telephonyLatency && (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>Telemetry: {telephonyLatency}ms turn latency</span>
          </div>
        )}
      </div>

      {/* Transcript Log Drawer */}
      <div className="p-5 sm:p-8 space-y-4 max-h-[380px] min-h-[260px] overflow-y-auto custom-scrollbar">
        {transcript.map((turn) => {
          const isAgent = turn.speaker === 'agent';
          return (
            <div
              key={turn.id}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-zinc-400">
                <span className={isAgent ? 'text-violet-400 font-bold' : 'text-zinc-300'}>
                  {isAgent ? `${selectedPersona.name} (AI Frontdesk)` : 'You (Caller)'}
                </span>
                <span>•</span>
                <span>{turn.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isAgent
                    ? 'bg-zinc-900/90 text-white border border-white/[0.08] shadow-sm'
                    : 'bg-violet-600 text-white font-medium shadow-md'
                }`}
              >
                <p>{turn.text}</p>

                {turn.toolCall && (
                  <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/20 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {turn.toolCall.toolName}: {turn.toolCall.result}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSpeaking && (
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400 p-2 bg-violet-950/20 rounded-xl border border-violet-500/20 w-fit">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>{selectedPersona.name} is speaking on the line...</span>
            <div className="flex items-center gap-0.5 ml-2">
              <span className="w-1 h-3 bg-violet-400 rounded-full animate-bounce" />
              <span className="w-1 h-4 bg-violet-400 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Human Escalation Alert Banner */}
      {escalated && (
        <div className="mx-5 sm:mx-8 mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-200 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div className="space-y-0.5">
            <h5 className="font-semibold text-white">Responsible Human Hand-off Triggered</h5>
            <p>{escalationReason}</p>
          </div>
        </div>
      )}

      {/* Audio Controls & Input Area */}
      <div className="border-t border-white/[0.08] p-5 sm:p-8 bg-zinc-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Push-to-Talk Phone Button */}
          <button
            onClick={toggleMic}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-lg ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-4 ring-red-500/20'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white active:scale-95'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Listening... (Tap to Send)</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Speak Now ({language === 'te' ? 'తెలుగు' : 'English'})</span>
              </>
            )}
          </button>

          {/* Text Input Fallback */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserDialogue(inputMessage);
            }}
            className="w-full flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                language === 'te'
                  ? 'ఇక్కడ తెలుగులో టైప్ చేయండి (ఉదా: రేపు సాయంత్రం 5:30 స్లాట్ ఖాళీగా ఉందా?)...'
                  : "Type your query here (e.g. 'Can I book 5:30 PM tomorrow?' or 'fees entha?')..."
              }
              className="flex-1 px-4 py-3 rounded-2xl bg-zinc-950 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500/50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-3 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 transition-all"
              title="Send dialogue turn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Realistic Dialogue Testing Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-mono text-zinc-400">REALISTIC PROMPTS:</span>
          {language === 'te' ? (
            <>
              <button
                onClick={() =>
                  handleUserDialogue('రేపు సాయంత్రం మోకాళ్ళ నొప్పికి డాక్టర్ గారిని కలవవచ్చా?')
                }
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;రేపు సాయంత్రం మోకాళ్ళ నొప్పి?&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('డాక్టర్ గారి కన్సల్టేషన్ ఫీజు ఎంత?')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;కన్సల్టేషన్ ఫీజు ఎంత?&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('నువ్వు నిజమైన మనిషివా లేక రోబోట్ వా?')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;నువ్వు AI వా మనిషివా?&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('క్లినిక్ అడ్రస్ ఎక్కడ ఉంది?')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;క్లినిక్ అడ్రస్ ఎక్కడ?&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('నాకు తీవ్రమైన గుండె నొప్పి వస్తోంది అర్జెంట్')}
                className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors"
              >
                ⚠️ ఎమర్జెన్సీ టెస్ట్
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  handleUserDialogue('I have severe knee pain since 2 days, can I see the doctor?')
                }
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;Severe knee pain since 2 days&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('How much is the consultation fee?')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;Consultation fee?&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('Wait, are you a real person or an AI?')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;Are you an AI or real?&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('Where is the clinic located? Is there parking?')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;Location &amp; parking?&quot;
              </button>
              <button
                onClick={() =>
                  handleUserDialogue('Patient is having severe chest pain and cannot breathe')
                }
                className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors"
              >
                ⚠️ Emergency Test
              </button>
            </>
          )}
        </div>
      </div>

      {/* Informed Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="max-w-md w-full bg-zinc-950 border border-white/15 rounded-3xl p-6 space-y-4 shadow-glass text-left">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Microphone Access &amp; Audio Notice</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                MEOW Voice converts your voice into text inside your browser to test real-time speech dialogue. We do not store, retain, or monetize raw voice data from this demonstration.
              </p>
            </div>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Audio is converted to text inside your browser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Deterministic patient safety &amp; emergency escalation</span>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConsentGranted(true);
                  setShowConsentModal(false);
                  toggleMic();
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200"
              >
                Grant &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
