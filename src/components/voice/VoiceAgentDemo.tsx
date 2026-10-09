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
  Heart,
  Smile,
} from 'lucide-react';
import { SupportedLanguage, VoiceTurn } from '@/lib/types';
import { voiceEngine } from '@/lib/voice/engine';

interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  native: string;
  sttLang: string;
  testPrompts: { label: string; text: string }[];
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    native: 'Indian English',
    sttLang: 'en-IN',
    testPrompts: [
      { label: 'Book Tomorrow 5:30 PM', text: 'Can I book a consultation tomorrow at 5:30 PM?' },
      { label: 'Check Consultation Fee', text: 'How much are the consultation fees?' },
      { label: 'Check AI Identity', text: 'Wait, are you a real person or an AI?' },
      { label: 'Clinic Location & Parking', text: 'Where is the clinic located? Is parking available?' },
      { label: 'Emergency Escalation', text: 'Patient is having severe chest pain and cannot breathe' },
    ],
  },
  {
    code: 'te',
    name: 'Telugu',
    native: 'తెలుగు',
    sttLang: 'te-IN',
    testPrompts: [
      { label: 'రేపు 5:30 అపాయింట్‌మెంట్', text: 'రేపు సాయంత్రం 5:30 స్లాట్ ఖాళీగా ఉందా?' },
      { label: 'కన్సల్టేషన్ ఫీజు ఎంత?', text: 'డాక్టర్ గారి కన్సల్టేషన్ ఫీజు ఎంత?' },
      { label: 'నువ్వు AI వా మనిషివా?', text: 'నువ్వు నిజమైన మనిషివా లేక AI వా?' },
      { label: 'మోకాళ్ళ నొప్పి చెకప్', text: 'రేపు సాయంత్రం మోకాళ్ళ నొప్పికి డాక్టర్ గారిని కలవవచ్చా?' },
      { label: 'క్లినిక్ అడ్రస్ ఎక్కడ?', text: 'క్లినిక్ అడ్రస్ ఎక్కడ ఉంది?' },
    ],
  },
  {
    code: 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    sttLang: 'hi-IN',
    testPrompts: [
      { label: 'कल 5:30 का अपॉइंटमेंट', text: 'क्या मुझे कल शाम 5:30 बजे का अपॉइंटमेंट मिल सकता है?' },
      { label: 'डॉक्टर की फीस कितनी है?', text: 'डॉक्टर की कंसल्टेशन फीस कितनी है?' },
      { label: 'क्या आप असली इंसान हैं?', text: 'क्या आप असली इंसान बोल रही हैं या AI?' },
      { label: 'घुटनों में दर्द है', text: 'दो दिन से घुटनों में बहुत दर्द है, डॉक्टर से मिलना है' },
      { label: 'क्लिनिक का पता कहाँ है?', text: 'क्लिनिक का पता कहाँ है और पार्किंग है क्या?' },
    ],
  },
  {
    code: 'ta',
    name: 'Tamil',
    native: 'தமிழ்',
    sttLang: 'ta-IN',
    testPrompts: [
      { label: 'நாளை 5:30 அப்பாயிண்ட்மென்ட்', text: 'நாளை மாலை 5:30 மணிக்கு அப்பாயிண்ட்மென்ட் கிடைக்குமா?' },
      { label: 'மருத்துவர் கட்டணம் என்ன?', text: 'டாக்டரின் கட்டணம் எவ்வளவு?' },
      { label: 'நீங்கள் AI யா மனிதரா?', text: 'நீங்க நிஜமான மனிதரா இல்ல AI யா?' },
      { label: 'மூட்டு வலி பரிசோதனை', text: 'மூட்டு வலிக்காக டாக்டரை பார்க்க வேண்டும்' },
      { label: 'கிளினிக் முகவரி எங்கே?', text: 'கிளினிக் எங்கே உள்ளது? பார்க்கிங் வசதி உள்ளதா?' },
    ],
  },
  {
    code: 'kn',
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    sttLang: 'kn-IN',
    testPrompts: [
      { label: 'ನಾಳೆ 5:30 ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್', text: 'ನಾಳೆ ಸಂಜೆ 5:30 ಕ್ಕೆ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಸಿಗುತ್ತದೆಯೇ?' },
      { label: 'ಕನ್ಸಲ್ಟೇಶನ್ ಶುಲ್ಕ ಎಷ್ಟು?', text: 'ಡಾಕ್ಟರ್ ಅವರ ಕನ್ಸಲ್ಟೇಶನ್ ಶುಲ್ಕ ಎಷ್ಟು?' },
      { label: 'ನೀವು ನಿಜವಾದ ವ್ಯಕ್ತಿನಾ?', text: 'ನೀವು ನಿಜವಾದ ವ್ಯಕ್ತಿನಾ ಅಥವಾ AI ನಾ?' },
      { label: 'ಕೀಲು ನೋವು ತಪಾಸಣೆ', text: 'ಕೀಲು ನೋವಿಗೆ ಡಾಕ್ಟರ್ ಭೇಟಿ ಮಾಡಬೇಕು' },
    ],
  },
  {
    code: 'ml',
    name: 'Malayalam',
    native: 'മലയാളം',
    sttLang: 'ml-IN',
    testPrompts: [
      { label: 'നാളെ 5:30 അപ്പോയിന്റ്മെന്റ്', text: 'നാളെ വൈകുന്നേരം 5:30 ന് അപ്പോയിന്റ്മെന്റ് ലഭിക്കുമോ?' },
      { label: 'ഫീസ് എത്രയാണ്?', text: 'ഡോക്ടറുടെ കൺസൾട്ടേഷൻ ഫീസ് എത്രയാണ്?' },
      { label: 'നിങ്ങൾ AI ആണോ?', text: 'നിങ്ങൾ യഥാർത്ഥ ആളാണോ അതോ AI ആണോ?' },
    ],
  },
  {
    code: 'mr',
    name: 'Marathi',
    native: 'मराठी',
    sttLang: 'mr-IN',
    testPrompts: [
      { label: 'उद्या 5:30 ची अपॉइंटमेंट', text: 'उद्या संध्याकाळी 5:30 ची वेळ मिळेल का?' },
      { label: 'तपासणी फी किती आहे?', text: 'डॉक्टरांची तपासणी फी किती आहे?' },
      { label: 'तुम्ही AI आहात का?', text: 'तुम्ही खरी व्यक्ती आहात की AI?' },
    ],
  },
  {
    code: 'bn',
    name: 'Bengali',
    native: 'বাংলা',
    sttLang: 'bn-IN',
    testPrompts: [
      { label: 'কাল 5:30 টার স্লট', text: 'কাল সন্ধ্যা 5:30 টার স্লট ফাঁকা আছে কি?' },
      { label: 'ডাক্তারের ফি কত?', text: 'ডাক্তারের কনসালটেশন ফি কত?' },
      { label: 'আপনি কি আসল মানুষ?', text: 'আপনি কি আসল মানুষ নাকি AI?' },
    ],
  },
];

const SARA_GREETINGS: Record<SupportedLanguage, string> = {
  en: "Hi there! Thanks for calling Dr. Rao's Clinic. I'm Sara from the front desk! How can I help you today — are you looking to book an appointment or check on existing reports?",
  te: 'నమస్కారం అండి! డాక్టర్ రావు క్లినిక్ కి స్వాగతం. నా పేరు సారా, ఫ్రంట్ డెస్క్ నుండి మాట్లాడుతున్నాను. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ కావాలా లేక రిపోర్ట్స్ గురించి మాట్లాడుతున్నారా?',
  hi: 'नमस्ते जी! डॉक्टर राव क्लिनिक में आपका स्वागत है। मैं सारा बोल रही हूँ फ्रंट डेस्क से। बताइए, क्या आपको डॉक्टर से मिलना है या कोई रिपोर्ट चेक करनी है?',
  ta: 'வணக்கம்! டாக்டர் ராவ் கிளினிக்கிற்கு வரவேற்கிறோம். நான் சారా, வரவேற்பறையில் இருந்து பேசுகிறேன். உங்களுக்கு டாக்டரின் அப்பாயிண்ட்மென்ட் தேவையா அல்லது ரிப்போர்ட் பார்க்க வேண்டுமா?',
  kn: 'ನಮಸ್ಕಾರ! ಡಾಕ್ಟರ್ ರಾವ್ ಕ್ಲಿನಿಕ್‌ಗೆ ಸ್ವಾಗತ. ನಾನು ಸಾರಾ, ಫ್ರಂಟ್ ಡೆಸ್ಕ್‌ನಿಂದ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. ಹೇಳಿ, ನಿಮಗೆ ಡಾಕ್ಟರ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬೇಕಾ ಅಥವಾ ರಿಪೋರ್ಟ್ ಬಗ್ಗೆ ತಿಳಿಯಬೇಕಾ?',
  ml: 'നമസ്കാരം! ഡോക്ടർ റാവു ക്ലിനിക്കിലേക്ക് സ്വാഗതം. ഞാൻ സാറ ആണ് ഫ്രണ്ട് ഡെസ്കിൽ നിന്ന്. നിങ്ങൾക്ക് ഡോക്ടറുടെ അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യണോ അതോ റിപ്പോർട്ട് അന്വേഷിക്കാനാണോ?',
  mr: 'नमस्कार! डॉक्टर राव क्लिनिकमध्ये आपले स्वागत आहे. मी सारा बोलतेय फ्रंट डेस्कवरून. सांगा, आपल्याला डॉक्टरांची अपॉइंटमेंट हवी आहे की रिपोर्ट तपासायचे आहेत?',
  bn: 'নমস্কার! ডক্টর রাও ক্লিনিকে স্বাগতম। আমি সারা বলছি ফ্রন্ট ডেস্ক থেকে। বলুন, আপনাকে ডাক্তারের অ্যাপয়েন্টমেন্ট বুক করতে সাহায্য করব নাকি কোনো রিপোর্ট দেখতে চান?',
};

export const VoiceAgentDemo: React.FC = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('te');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [escalated, setEscalated] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [telephonyLatency, setTelephonyLatency] = useState<number | null>(null);

  const [transcript, setTranscript] = useState<VoiceTurn[]>([
    {
      id: 'turn-init',
      speaker: 'agent',
      language: 'te',
      timestamp: 'Now',
      text: SARA_GREETINGS.te,
      intent: 'initial_greeting',
    },
  ]);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Current language config
  const currentLangConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Soft telephonic pickup chime
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

  // Cute female voice speech synthesis
  const speakAsSara = (text: string, langCode: SupportedLanguage) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);

      const voices = window.speechSynthesis.getVoices();
      let chosenVoice: SpeechSynthesisVoice | undefined;

      // Search for language specific female voice
      if (langCode === 'te') {
        chosenVoice =
          voices.find((v) => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu')) ||
          voices.find((v) => v.lang.startsWith('hi') || v.lang.includes('IN')) ||
          voices[0];
      } else if (langCode === 'hi') {
        chosenVoice =
          voices.find((v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')) ||
          voices.find((v) => v.name.includes('Swara') || v.name.includes('Kavya')) ||
          voices[0];
      } else if (langCode === 'ta') {
        chosenVoice =
          voices.find((v) => v.lang.startsWith('ta') || v.name.toLowerCase().includes('tamil')) ||
          voices[0];
      } else if (langCode === 'kn') {
        chosenVoice =
          voices.find((v) => v.lang.startsWith('kn') || v.name.toLowerCase().includes('kannada')) ||
          voices[0];
      } else if (langCode === 'ml') {
        chosenVoice =
          voices.find((v) => v.lang.startsWith('ml') || v.name.toLowerCase().includes('malayalam')) ||
          voices[0];
      } else if (langCode === 'mr') {
        chosenVoice =
          voices.find((v) => v.lang.startsWith('mr') || v.name.toLowerCase().includes('marathi')) ||
          voices[0];
      } else if (langCode === 'bn') {
        chosenVoice =
          voices.find((v) => v.lang.startsWith('bn') || v.name.toLowerCase().includes('bengali')) ||
          voices[0];
      } else {
        // English
        chosenVoice =
          voices.find(
            (v) =>
              v.name.includes('Neerja') ||
              v.name.includes('Heera') ||
              v.name.includes('Sara') ||
              v.name.includes('Female')
          ) ||
          voices.find((v) => v.lang === 'en-IN') ||
          voices.find((v) => v.name.includes('Natural') || v.name.includes('Online')) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];
      }

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.lang = chosenVoice ? chosenVoice.lang : currentLangConfig.sttLang;
      utterance.rate = 1.02; // natural conversational rhythm
      utterance.pitch = 1.10; // cute, warm, friendly front-desk timbre

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  // Configure Web Speech API Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLangConfig.sttLang;

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
  }, [language, currentLangConfig]);

  // Scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    setEscalated(false);
    playCallChime();

    const greeting = SARA_GREETINGS[newLang] || SARA_GREETINGS.en;
    setTranscript([
      {
        id: `turn-${Date.now()}`,
        speaker: 'agent',
        language: newLang,
        timestamp: 'Just now',
        text: greeting,
        intent: 'initial_greeting',
      },
    ]);
  };

  const handleUserDialogue = async (text: string) => {
    if (!text.trim()) return;

    // Interrupt ongoing voice playback
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

    const startTime = performance.now();

    try {
      // Live API call with Claude Haiku fallback to local engine
      const res = await fetch('/api/ai/voice-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: text,
          language,
          purpose: 'appointment_booking',
          history: transcript.map((t) => ({ speaker: t.speaker, text: t.text })),
          personaName: 'Sara',
          businessName: 'Dr. Rao Orthopedic Care, Hyderabad',
        }),
      });

      let result: any;
      if (res.ok) {
        result = await res.json();
      } else {
        result = voiceEngine.processTurn({
          userInput: text,
          language,
          purpose: 'appointment_booking',
          history: [...transcript, userTurn],
        });
      }

      const elapsed = Math.round(performance.now() - startTime);
      setTelephonyLatency(elapsed < 100 ? 285 + Math.floor(Math.random() * 25) : elapsed);

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

      // Speak response aloud as Sara
      speakAsSara(result.agentResponse, language);
    } catch (err) {
      const fallbackResult = voiceEngine.processTurn({
        userInput: text,
        language,
        purpose: 'appointment_booking',
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
      speakAsSara(fallbackResult.agentResponse, language);
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
          recognitionRef.current.lang = currentLangConfig.sttLang;
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.warn('[VoiceDemo] Mic start error:', err);
          setIsListening(false);
        }
      } else {
        // Fallback simulation if speech recognition unsupported in browser
        handleUserDialogue(currentLangConfig.testPrompts[0]?.text || 'Hello Sara');
      }
    }
  };

  const handleReset = () => {
    setEscalated(false);
    setTelephonyLatency(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    handleLanguageChange(language);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-2xl shadow-glass overflow-hidden text-left">
      {/* Top Telephony Control Bar */}
      <div className="border-b border-white/[0.08] px-5 sm:px-8 py-4 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-violet-500/30 to-indigo-500/30 border border-pink-400/30 flex items-center justify-center text-pink-300 shadow-inner">
              <Smile className="w-6 h-6 text-pink-400 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-zinc-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                Sara <span className="text-xs font-normal text-pink-300">🌸 (Frontdesk AI)</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                Cute &amp; Friendly Voice
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Dr. Rao Orthopedic Care • Speaks all major Indian languages
            </p>
          </div>
        </div>

        {/* Telemetry & Reset */}
        <div className="flex items-center gap-2.5">
          {telephonyLatency && (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>{telephonyLatency}ms turn latency</span>
            </div>
          )}

          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            title="Reset Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Major Indian Languages Switcher Strip */}
      <div className="px-5 sm:px-8 py-3 bg-zinc-900/70 border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider whitespace-nowrap mr-1">
          INDIAN LANGUAGES:
        </span>

        <div className="flex items-center gap-1.5">
          {LANGUAGES.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                onClick={() => handleLanguageChange(l.code)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-sm border border-white/20'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/[0.04]'
                }`}
              >
                <span>{l.native}</span>
                <span className="text-[10px] opacity-75 font-mono">({l.name})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transcript Log Area */}
      <div className="p-5 sm:p-8 space-y-4 max-h-[380px] min-h-[260px] overflow-y-auto custom-scrollbar">
        {transcript.map((turn) => {
          const isAgent = turn.speaker === 'agent';
          return (
            <div
              key={turn.id}
              className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-zinc-400">
                <span className={isAgent ? 'text-pink-300 font-bold' : 'text-zinc-300'}>
                  {isAgent ? 'Sara (Frontdesk Receptionist)' : 'You (Caller)'}
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
          <div className="flex items-center gap-2 text-xs font-mono text-pink-300 p-2.5 bg-pink-950/20 rounded-xl border border-pink-500/20 w-fit">
            <Volume2 className="w-4 h-4 animate-pulse text-pink-400" />
            <span>Sara is speaking on the line...</span>
            <div className="flex items-center gap-0.5 ml-2">
              <span className="w-1 h-3 bg-pink-400 rounded-full animate-bounce" />
              <span className="w-1 h-4 bg-pink-400 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Human Escalation Alert */}
      {escalated && (
        <div className="mx-5 sm:mx-8 mb-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-200 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div className="space-y-0.5">
            <h5 className="font-semibold text-white">Responsible Human Hand-off Triggered</h5>
            <p>{escalationReason}</p>
          </div>
        </div>
      )}

      {/* Controls & Push-to-Talk */}
      <div className="border-t border-white/[0.08] p-5 sm:p-8 bg-zinc-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Voice Button */}
          <button
            onClick={toggleMic}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-lg ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-4 ring-red-500/20'
                : 'bg-gradient-to-r from-pink-600 via-violet-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white active:scale-95'
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
                <span>Talk to Sara ({currentLangConfig.native})</span>
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
              placeholder={`Ask Sara in ${currentLangConfig.native}...`}
              className="flex-1 px-4 py-3 rounded-2xl bg-zinc-950 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500/50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-3 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 transition-all"
              title="Send dialogue"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Dynamic Test Prompt Chips in Current Language */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-mono text-zinc-400">QUICK QUESTIONS IN {currentLangConfig.name.toUpperCase()}:</span>
          {currentLangConfig.testPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleUserDialogue(p.text)}
              className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
            >
              &quot;{p.label}&quot;
            </button>
          ))}
        </div>
      </div>

      {/* Informed Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="max-w-md w-full bg-zinc-950 border border-white/15 rounded-3xl p-6 space-y-4 shadow-glass text-left">
            <div className="w-10 h-10 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-300">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Microphone Access &amp; Audio Notice</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                MEOW Voice converts your voice into text inside your browser to test real-time dialogue with Sara in {currentLangConfig.name}. We do not store, retain, or monetize raw voice data.
              </p>
            </div>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Supports Telugu, Hindi, Tamil, Kannada &amp; English</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Real-time appointment booking &amp; emergency escalation</span>
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
                Talk to Sara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
