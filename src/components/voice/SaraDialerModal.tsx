'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Send,
  X,
  CheckCircle2,
  Clock,
  Radio,
  User,
} from 'lucide-react';
import { SupportedLanguage } from '@/lib/types';
import { voiceEngine, VoiceDialogueTurnOutput } from '@/lib/voice/engine';

interface SaraDialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguage?: SupportedLanguage;
  agentName?: string;
  businessName?: string;
}

const SUPPORTED_LANGS: { code: SupportedLanguage; label: string; native: string; sampleGreeting: string }[] = [
  {
    code: 'te',
    label: 'Telugu',
    native: 'తెలుగు',
    sampleGreeting:
      'నమస్కారం అండి! డాక్టర్ రావు క్లినిక్ కి స్వాగతం. నా పేరు సారా, ఫ్రంట్ డెస్క్ నుండి మాట్లాడుతున్నాను. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ కావాలా లేక రిపోర్ట్స్ గురించి మాట్లాడుతున్నారా?',
  },
  {
    code: 'en',
    label: 'English',
    native: 'Indian English',
    sampleGreeting:
      "Hi there! Thanks for calling Dr. Rao's Clinic. I'm Sara from the front desk! How can I help you today — are you looking to book an appointment or check on existing reports?",
  },
  {
    code: 'hi',
    label: 'Hindi',
    native: 'हिन्दी',
    sampleGreeting:
      'नमस्ते जी! डॉक्टर राव क्लिनिक में आपका स्वागत है। मैं सारा बोल रही हूँ फ्रंट डेस्क से। बताइए, क्या आपको डॉक्टर से मिलना है या कोई रिपोर्ट चेक करनी है?',
  },
  {
    code: 'ta',
    label: 'Tamil',
    native: 'தமிழ்',
    sampleGreeting:
      'வணக்கம்! டாக்டர் ராவ் கிளினிக்கிற்கு வரவேற்கிறோம். நான் சாரா, வரவேற்பறையில் இருந்து பேசுகிறேன். உங்களுக்கு டாக்டரின் அப்பாயிண்ட்மென்ட் தேவையா அல்லது ரிப்போர்ட் பார்க்க வேண்டுமா?',
  },
  {
    code: 'kn',
    label: 'Kannada',
    native: 'ಕನ್ನಡ',
    sampleGreeting:
      'ನಮಸ್ಕಾರ! ಡಾಕ್ಟರ್ ರಾವ್ ಕ್ಲಿನಿಕ್‌ಗೆ ಸ್ವಾಗತ. ನಾನು ಸಾರಾ, ಫ್ರಂಟ್ ಡೆಸ್ಕ್‌ನಿಂದ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. ಹೇಳಿ, ನಿಮಗೆ ಡಾಕ್ಟರ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬೇಕಾ లేదా ರಿಪೋರ್ಟ್ ಬಗ್ಗೆ ತಿಳಿಯಬೇಕಾ?',
  },
  {
    code: 'ml',
    label: 'Malayalam',
    native: 'മലയാളം',
    sampleGreeting:
      'നമസ്കാരം! ഡോക്ടർ റാവു ക്ലിനിക്കിലേക്ക് സ്വാഗതം. ഞാൻ സാറ ആണ് ഫ്രണ്ട് ഡെസ്കിൽ നിന്ന്. നിങ്ങൾക്ക് ഡോക്ടറുടെ അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യണോ അതോ റിപ്പോർട്ട് അന്വേഷിക്കാനാണോ?',
  },
  {
    code: 'mr',
    label: 'Marathi',
    native: 'मराठी',
    sampleGreeting:
      'नमस्कार! डॉक्टर राव क्लिनिकमध्ये आपले स्वागत आहे. मी सारा बोलतेय फ्रंट डेस्कवरून. सांगा, आपल्याला डॉक्टरांची अपॉइंटमेंट हवी आहे की रिपोर्ट तपासायचे आहेत?',
  },
  {
    code: 'bn',
    label: 'Bengali',
    native: 'বাংলা',
    sampleGreeting:
      'নমস্কার! ডক্টর রাও ক্লিনিকে স্বাগতম। আমি সারা বলছি ফ্রন্ট ডেস্ক থেকে। বলুন, আপনাকে ডাক্তারের অ্যাপয়েন্টমেন্ট বুক করতে সাহায্য করব নাকি কোনো রিপোর্ট দেখতে চান?',
  },
];

const QUICK_PROMPTS: Record<SupportedLanguage, string[]> = {
  te: [
    'రేపు సాయంత్రం 5:30 స్లాట్ ఖాళీగా ఉందా?',
    'డాక్టర్ గారి కన్సల్టేషన్ ఫీజు ఎంత?',
    'నువ్వు నిజమైన మనిషివా లేక AI వా?',
    'మోకాళ్ళ నొప్పి చెకప్ కావాలి',
  ],
  en: [
    'Can I book a consultation tomorrow at 5:30 PM?',
    'How much are the consultation fees?',
    'Wait, are you a real person or an AI?',
    'Where is the clinic located? Is parking available?',
  ],
  hi: [
    'क्या मुझे कल शाम 5:30 बजे का अपॉइंटमेंट मिल सकता है?',
    'डॉक्टर की कंसल्टेशन फीस कितनी है?',
    'क्या आप असली इंसान बोल रही हैं या AI?',
    'दो दिन से घुटनों में बहुत दर्द है',
  ],
  ta: [
    'நாளை மாலை 5:30 மணிக்கு அப்பாயிண்ட்மென்ட் கிடைக்குமா?',
    'டாக்டரின் கட்டணம் எவ்வளவு?',
    'நீங்க நிஜமான மனிதரா இல்ல AI யா?',
    'மூட்டு வலிக்காக டாக்டரை பார்க்க வேண்டும்',
  ],
  kn: [
    'ನಾಳೆ ಸಂಜೆ 5:30 ಕ್ಕೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಸಿಗುತ್ತದೆಯೇ?',
    'ಡಾಕ್ಟರ್ ಅವರ ಕನ್ಸಲ್ಟೇಶನ್ ಶುಲ್ಕ ಎಷ್ಟು?',
    'ನೀವು ನಿಜವಾದ ವ್ಯಕ್ತಿನಾ ಅಥವಾ AI ನಾ?',
    'ಕೀಲು ನೋವಿಗೆ ಡಾಕ್ಟರ್ ಭೇಟಿ ಮಾಡಬೇಕು',
  ],
  ml: [
    'നാളെ വൈകുന്നേരം 5:30 ന് അപ്പോയിന്റ്മെന്റ് ലഭിക്കുമോ?',
    'ഡോക്ടറുടെ കൺസൾട്ടേഷൻ ഫീസ് എത്രയാണ്?',
    'നിങ്ങൾ യഥാർത്ഥ ആളാണോ അതോ AI ആണോ?',
  ],
  mr: [
    'उद्या संध्याकाळी 5:30 ची वेळ मिळेल का?',
    'डॉक्टरांची तपासणी फी किती आहे?',
    'तुम्ही खरी व्यक्ती आहात की AI?',
  ],
  bn: [
    'কাল সন্ধ্যা 5:30 টার স্লট ফাঁকা আছে কি?',
    'ডাক্তারের কনসালটেশন ফি কত?',
    'আপনি কি আসল মানুষ নাকি AI?',
  ],
};

export const SaraDialerModal: React.FC<SaraDialerModalProps> = ({
  isOpen,
  onClose,
  initialLanguage = 'te',
  agentName = 'Sara (Front Desk Concierge)',
  businessName = 'Dr. Rao Orthopedic Care, Hyderabad',
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);

  const [messages, setMessages] = useState<
    Array<{
      sender: 'sara' | 'user';
      text: string;
      intent?: string;
      escalated?: boolean;
      timestamp: string;
    }>
  >([]);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isSpeaking, isProcessing]);

  // Duration timer
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // TTS Speech Synthesis
  const speakUtterance = (text: string) => {
    if (audioMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.15; // cute, friendly, natural tone
    utterance.rate = 1.02;

    const voices = window.speechSynthesis.getVoices();
    // Match best Indian language voice if available
    const voiceMatch = voices.find(
      (v) =>
        v.lang.toLowerCase().includes(language) ||
        (language === 'te' && (v.name.includes('Telugu') || v.lang.includes('te'))) ||
        (language === 'hi' && (v.name.includes('Hindi') || v.lang.includes('hi'))) ||
        v.lang.includes('IN')
    );
    if (voiceMatch) utterance.voice = voiceMatch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Web Audio API Ringing Tone
  const playPhoneRingTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(480, ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime + 0.85);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.85);
      osc2.stop(ctx.currentTime + 0.85);
    } catch {}
  };

  const playPickupBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  const handleStartCall = () => {
    setCallState('ringing');
    setMessages([]);
    window.speechSynthesis?.cancel();

    // Audible phone ringing tone
    playPhoneRingTone();

    // Ringing chime simulation to pickup
    setTimeout(() => {
      playPickupBeep();
      setCallState('connected');
      const langConfig = SUPPORTED_LANGS.find((l) => l.code === language) || SUPPORTED_LANGS[0];
      const greeting = langConfig.sampleGreeting;

      setMessages([
        {
          sender: 'sara',
          text: greeting,
          intent: 'initial_greeting',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speakUtterance(greeting);
    }, 1200);
  };

  const handleEndCall = () => {
    window.speechSynthesis?.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setCallState('ended');
    setIsSpeaking(false);
    setIsListening(false);
  };

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text || isProcessing || callState !== 'connected') return;

    setInputText('');
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text,
        timestamp: userTimestamp,
      },
    ]);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/ai/voice-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: text,
          language,
          personaName: 'Sara',
          businessName,
          purpose: 'appointment_booking',
        }),
      });

      const data: VoiceDialogueTurnOutput = await res.json();
      if (data && data.agentResponse) {
        const saraTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [
          ...prev,
          {
            sender: 'sara',
            text: data.agentResponse,
            intent: data.intentDetected,
            escalated: data.shouldEscalateToHuman,
            timestamp: saraTimestamp,
          },
        ]);
        speakUtterance(data.agentResponse);
      }
    } catch (err) {
      // Local zero-dependency fallback
      const localTurn = voiceEngine.processTurn({
        userInput: text,
        language,
        purpose: 'appointment_booking',
        history: [],
      });
      setMessages((prev) => [
        ...prev,
        {
          sender: 'sara',
          text: localTurn.agentResponse,
          intent: localTurn.intentDetected,
          escalated: localTurn.shouldEscalateToHuman,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speakUtterance(localTurn.agentResponse);
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle Web Speech recognition microphone
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or type your message below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        language === 'te'
          ? 'te-IN'
          : language === 'hi'
          ? 'hi-IN'
          : language === 'ta'
          ? 'ta-IN'
          : language === 'kn'
          ? 'kn-IN'
          : language === 'ml'
          ? 'ml-IN'
          : language === 'mr'
          ? 'mr-IN'
          : language === 'bn'
          ? 'bn-IN'
          : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start error:', err);
      setIsListening(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="max-w-2xl w-full bg-zinc-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-violet-200" />
              </div>
              {callState === 'connected' && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">{agentName}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  SARA VERNACULAR
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">{businessName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {callState === 'connected' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 font-mono text-xs text-emerald-400">
                <Clock className="w-3 h-3 animate-spin" />
                <span>{formatTimer(callDuration)}</span>
              </div>
            )}

            <button
              onClick={() => {
                handleEndCall();
                onClose();
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Language Selection Chips */}
        <div className="px-6 py-2.5 bg-zinc-900/40 border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
            Language:
          </span>
          {SUPPORTED_LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                if (callState === 'connected') {
                  const greeting = l.sampleGreeting;
                  setMessages((prev) => [
                    ...prev,
                    {
                      sender: 'sara',
                      text: `[Switched to ${l.label}] ${greeting}`,
                      intent: 'language_switch',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                  speakUtterance(greeting);
                }
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                language === l.code
                  ? 'bg-violet-600 text-white font-bold shadow-sm'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {l.label} <span className="opacity-70 text-[10px]">({l.native})</span>
            </button>
          ))}
        </div>

        {/* Central Call Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-left" ref={chatScrollRef}>
          {callState === 'idle' && (
            <div className="py-12 text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600/30 to-indigo-600/30 border border-violet-500/30 mx-auto flex items-center justify-center">
                <PhoneCall className="w-9 h-9 text-violet-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Call Sara Front Desk</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Experience natural human conversation in {SUPPORTED_LANGS.find((l) => l.code === language)?.label}. Sara answers questions, checks doctor schedules, and confirms appointments.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartCall}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 transition-all transform active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Start Inbound Call</span>
              </button>
            </div>
          )}

          {callState === 'ringing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center animate-ping">
                <Radio className="w-7 h-7 text-amber-400" />
              </div>
              <p className="text-sm font-mono text-amber-300">Ringing front desk concierge...</p>
            </div>
          )}

          {(callState === 'connected' || callState === 'ended') && (
            <div className="space-y-3.5">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-1.5 shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-violet-600 text-white rounded-br-none'
                        : 'bg-zinc-900 border border-white/10 text-zinc-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-mono opacity-70">
                      <span>{m.sender === 'user' ? 'YOU (CALLER)' : 'SARA (FRONT DESK)'}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    {m.intent && (
                      <div className="pt-1 flex items-center gap-1.5 text-[9px] font-mono text-violet-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        <span>INTENT: {m.intent}</span>
                        {m.escalated && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                            ESCALATED TO DUTY NURSE
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 text-xs font-mono text-violet-400 pl-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                  <span>Sara is thinking and consulting calendar...</span>
                </div>
              )}

              {isSpeaking && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-violet-950/40 border border-violet-500/20 text-violet-300 text-[11px] font-mono">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-violet-400" />
                  <span>Sara speaking (natural voice synthesis active)...</span>
                  <div className="ml-auto flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-violet-400 animate-bounce" />
                    <span className="w-1 h-4 bg-violet-400 animate-bounce delay-75" />
                    <span className="w-1 h-2 bg-violet-400 animate-bounce delay-150" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Test Chips (When Connected) */}
        {callState === 'connected' && (
          <div className="px-6 py-2 bg-zinc-900/60 border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-[10px] font-mono text-zinc-500 shrink-0 uppercase">Quick Say:</span>
            {(QUICK_PROMPTS[language] || QUICK_PROMPTS.en).map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isProcessing}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/[0.04] whitespace-nowrap shrink-0 transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Call Controls & Input Bar */}
        <div className="p-4 sm:p-5 bg-zinc-900/80 border-t border-white/[0.08]">
          {callState === 'connected' ? (
            <div className="space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isListening
                      ? 'bg-red-500 text-white border-red-400 animate-pulse'
                      : 'bg-zinc-800 text-zinc-300 hover:text-white border-white/10'
                  }`}
                  title={isListening ? 'Stop Mic' : 'Speak via Microphone'}
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Speak or type in ${SUPPORTED_LANGS.find((l) => l.code === language)?.label}...`}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing}
                  className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setAudioMuted(!audioMuted)}
                  className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                  title={audioMuted ? 'Unmute Audio' : 'Mute Voice Audio'}
                >
                  {audioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={handleEndCall}
                  className="px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End</span>
                </button>
              </form>

              {isListening && (
                <div className="text-[10px] font-mono text-red-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Listening to your voice in {SUPPORTED_LANGS.find((l) => l.code === language)?.label}... Speak now!</span>
                </div>
              )}
            </div>
          ) : callState === 'ended' ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono">Call ended. Summary logged to CRM.</span>
              <button
                type="button"
                onClick={handleStartCall}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-500 transition-colors"
              >
                Call Again
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Ready for live Vernacular dialogue in 8 languages.</span>
              <span>Zero-latency edge synthesis</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

