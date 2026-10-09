'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, ShieldAlert, AlertCircle, RefreshCw, Send, CheckCircle2, UserCheck, Sparkles, Globe, PhoneCall } from 'lucide-react';
import { SupportedLanguage, VoiceTurn } from '@/lib/types';
import { voiceEngine } from '@/lib/voice/engine';

export const VoiceAgentDemo: React.FC = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('te');
  const [purpose, setPurpose] = useState<'appointment_booking' | 'customer_support' | 'lead_qualification' | 'order_inquiries'>('appointment_booking');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [escalated, setEscalated] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');

  const [transcript, setTranscript] = useState<VoiceTurn[]>([
    {
      id: 'turn-init',
      speaker: 'agent',
      language: 'te',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: 'నమస్కారం! డాక్టర్ రావు క్లినిక్ AI సహాయకురాలిని. నేను ఒక ఆటోమేటెడ్ అసిస్టెంట్‌ని. మీకు ఏ సమయానికి అపాయింట్‌మెంట్ కావాలి? (Namaskaram! I am Dr. Rao Clinic AI assistant. At what time would you like your appointment?)',
      intent: 'initial_greeting',
    },
  ]);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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

  // Update initial greeting on language switch
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setEscalated(false);
    if (newLang === 'te') {
      setTranscript([
        {
          id: `turn-${Date.now()}`,
          speaker: 'agent',
          language: 'te',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'నమస్కారం! డాక్టర్ రావు క్లినిక్ AI సహాయకురాలిని. నేను ఒక ఆటోమేటెడ్ అసిస్టెంట్‌ని. మీకు ఏ సమయానికి అపాయింట్‌మెంట్ కావాలి?',
          intent: 'initial_greeting',
        },
      ]);
    } else {
      setTranscript([
        {
          id: `turn-${Date.now()}`,
          speaker: 'agent',
          language: 'en',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Hello! I am MEOW Voice AI for Dr. Rao Clinic, an automated voice assistant. Which day and time would you like to schedule your consultation?',
          intent: 'initial_greeting',
        },
      ]);
    }
  };

  const handleUserDialogue = (text: string) => {
    if (!text.trim()) return;

    const userTurn: VoiceTurn = {
      id: `turn-u-${Date.now()}`,
      speaker: 'user',
      language,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
    };

    setTranscript((prev) => [...prev, userTurn]);
    setInputMessage('');

    // Process through VoiceEngine
    setIsSpeaking(true);
    setTimeout(() => {
      const result = voiceEngine.processTurn({
        userInput: text,
        language,
        purpose,
        history: [...transcript, userTurn],
      });

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
      setIsSpeaking(false);

      if (result.shouldEscalateToHuman) {
        setEscalated(true);
        setEscalationReason(
          result.intentDetected === 'emergency_medical_escalation'
            ? 'Emergency medical priority detected. Call routed to on-duty nurse.'
            : 'Human coordinator requested by caller.'
        );
      }

      // Browser TTS synthesis if supported
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(result.agentResponse);
          utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
          utterance.rate = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch {
          // Non-blocking browser TTS fallback
        }
      }
    }, 600);
  };

  const toggleMic = () => {
    if (!consentGranted) {
      setShowConsentModal(true);
      return;
    }

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
        // Fallback simulation if speech recognition not allowed in current browser
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
    handleLanguageChange(language);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-2xl shadow-glass overflow-hidden text-left">
      {/* Voice Demo Top Bar */}
      <div className="border-b border-white/[0.08] px-5 sm:px-8 py-4 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">MEOW Multilingual Voice Sandbox</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                In-Browser Demo
              </span>
            </div>
            <p className="text-xs text-zinc-400">Authentic Vernacular Dialogue Engine • Not a Telephony Dialer</p>
          </div>
        </div>

        {/* Controls: Language and Purpose */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
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

      {/* AI Identity & Consent Disclosure Notice */}
      <div className="px-5 sm:px-8 py-2.5 bg-zinc-900/30 border-b border-white/[0.04] flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-violet-400" />
          <span>
            <strong>AI Identity Notice:</strong> This voice agent identifies as an automated AI assistant. Never misrepresents as human.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-zinc-500">
          STT/TTS: {speechSupported ? 'Native Web Speech API' : 'Deterministic Audio Model'}
        </div>
      </div>

      {/* Escalation Alert Banner */}
      {escalated && (
        <div className="px-5 sm:px-8 py-3 bg-red-950/40 border-b border-red-500/30 flex items-center justify-between gap-3 text-xs text-red-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <strong>HUMAN SUPERVISOR ESCALATION TRIGGERED:</strong> {escalationReason}
            </div>
          </div>
          <span className="font-mono text-[11px] bg-red-900/40 px-2 py-0.5 rounded border border-red-500/30">
            Duty Queue: Active
          </span>
        </div>
      )}

      {/* Transcript Area */}
      <div className="p-5 sm:p-8 h-[340px] overflow-y-auto space-y-4">
        {transcript.map((turn) => (
          <div
            key={turn.id}
            className={`flex flex-col ${turn.speaker === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-zinc-400">
              <span>{turn.speaker === 'user' ? 'YOU (CALLER)' : 'MEOW VOICE AGENT'}</span>
              <span>•</span>
              <span>{turn.timestamp}</span>
              {turn.intent && (
                <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-zinc-300">
                  {turn.intent}
                </span>
              )}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                turn.speaker === 'user'
                  ? 'bg-zinc-800 text-white border border-white/10 rounded-tr-sm'
                  : 'bg-zinc-900/80 text-zinc-200 border border-white/[0.06] rounded-tl-sm'
              }`}
            >
              {turn.text}

              {turn.toolCall && (
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Action: <strong>{turn.toolCall.toolName}</strong> ({turn.toolCall.result})
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={transcriptEndRef} />
      </div>

      {/* Interactive Controls & Microphone Area */}
      <div className="border-t border-white/[0.08] p-5 sm:p-6 bg-zinc-900/50 space-y-4">
        {/* Visualizer Status */}
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            {isListening && (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Listening to microphone ({language === 'te' ? 'Telugu' : 'English'})...
              </span>
            )}
            {isSpeaking && (
              <span className="flex items-center gap-1.5 text-violet-400">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                Agent formulating response...
              </span>
            )}
            {!isListening && !isSpeaking && <span>Ready. Speak or test sample prompts below.</span>}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
            <UserCheck className="w-3.5 h-3.5 text-violet-400" />
            <span>Consent: {consentGranted ? 'Granted' : 'Pending'}</span>
          </div>
        </div>

        {/* Action Input Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMic}
            className={`p-3 rounded-2xl border transition-all ${
              isListening
                ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
                : 'bg-zinc-800 hover:bg-zinc-700 border-white/15 text-white'
            }`}
            title={isListening ? 'Stop listening' : 'Start microphone'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserDialogue(inputMessage);
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                language === 'te'
                  ? 'మీ సందేశాన్ని టైప్ చేయండి లేదా మాట్లాడండి (ఉదా: రేపు సాయంత్రం 5:30 స్లాట్ ఖాళీగా ఉందా?)'
                  : 'Type or speak your enquiry (e.g., Do you have open slots tomorrow evening?)'
              }
              className="flex-1 px-4 py-3 rounded-2xl bg-zinc-950 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500/50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-3 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Test Prompt Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-zinc-400">QUICK TEST:</span>
          {language === 'te' ? (
            <>
              <button
                onClick={() => handleUserDialogue('రేపు సాయంత్రం డాక్టర్ గారిని కలవవచ్చా?')}
                className="px-2.5 py-1 rounded-lg text-xs bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;రేపు సాయంత్రం అపాయింట్‌మెంట్?&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('క్లినిక్ సమయాలు ఎప్పుడు?')}
                className="px-2.5 py-1 rounded-lg text-xs bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;క్లినిక్ సమయాలు?&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('నాకు తీవ్రమైన గుండె నొప్పి వస్తోంది')}
                className="px-2.5 py-1 rounded-lg text-xs bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors"
              >
                ⚠️ టెస్ట్: ఎమర్జెన్సీ ఎస్కలేషన్
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleUserDialogue('Can I book an appointment tomorrow evening?')}
                className="px-2.5 py-1 rounded-lg text-xs bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;Book appointment tomorrow?&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('What are your operating clinic hours?')}
                className="px-2.5 py-1 rounded-lg text-xs bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                &quot;Operating hours?&quot;
              </button>
              <button
                onClick={() => handleUserDialogue('Patient is having severe chest pain and breathlessness')}
                className="px-2.5 py-1 rounded-lg text-xs bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors"
              >
                ⚠️ Test: Emergency Escalation
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
                MEOW Voice processes your audio stream locally within your browser to simulate our multilingual conversational model. We do not store, retain, or monetize raw voice data from this demonstration.
              </p>
            </div>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Audio is converted to text inside your browser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Explicit AI disclosure on all conversation turns</span>
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
