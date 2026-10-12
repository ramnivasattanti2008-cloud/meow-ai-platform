'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  User,
  Languages,
  PhoneCall,
  FileText,
  Zap,
  Cpu,
} from 'lucide-react';
import { SupportedLanguage } from '@/lib/types';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  agentName?: string;
  text: string;
  timestamp: string;
  language?: string;
}

export const UniversalAiCopilot: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<'sara' | 'alex' | 'maya' | 'rishi'>('sara');
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-initial',
      sender: 'agent',
      agentName: 'Sara',
      text: "Namaste! I'm Sara, your empathetic front-desk concierge. I speak Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, and Indian English. How can I help you or your clinic today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [voicePlaybackEnabled, setVoicePlaybackEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // When switching agent, update initial greeting
  const handleSelectAgent = (agent: 'sara' | 'alex' | 'maya' | 'rishi') => {
    setSelectedAgent(agent);
    let greeting = '';
    let name = 'Sara';
    if (agent === 'sara') {
      name = 'Sara';
      greeting = "Namaste! I'm Sara. You can speak with me in English, Telugu, Hindi, or any Indian language. Ask me about booking appointments, phone triage, or general assistance!";
    } else if (agent === 'alex') {
      name = 'Alex';
      greeting = "Hey! I'm Alex, your Career Strategist. I can analyze your resume for 95+ ATS readability, discover Tier-1 internships, or prepare technical interview questions!";
    } else if (agent === 'maya') {
      name = 'Maya';
      greeting = "Hi! I'm Maya, your Growth Lead. Need high-converting WhatsApp scripts, commercial freelance proposals, or Meta ad hooks? Let's craft them!";
    } else if (agent === 'rishi') {
      name = 'Rishi';
      greeting = "Hello! I'm Rishi, your Business Operations Architect. I ensure your calendar locks, UPI payment links, GST tax invoices, and cloud pipelines work smoothly.";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `greet-${Date.now()}`,
        sender: 'agent',
        agentName: name,
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Speak agent message using Web Speech Synthesis
  const speakText = (text: string, langCode: string) => {
    if (!voicePlaybackEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const langMap: Record<string, string> = {
        en: 'en-IN',
        te: 'te-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
      };
      utterance.lang = langMap[langCode] || 'en-IN';

      if (selectedAgent === 'sara') {
        utterance.pitch = 1.15; // cute, friendly, human tone
        utterance.rate = 1.0;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.05;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis playback error:', e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || sending) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          agentId: selectedAgent,
          language: selectedLang,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();
      const agentReply = data.reply || "I've processed your request. Let me know how else I can help!";
      const agentName = data.agent || (selectedAgent === 'sara' ? 'Sara' : selectedAgent === 'alex' ? 'Alex' : selectedAgent === 'maya' ? 'Maya' : 'Rishi');

      const agentMsg: Message = {
        id: `msg-${Date.now()}-reply`,
        sender: 'agent',
        agentName,
        text: agentReply,
        language: data.language || selectedLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);

      // Speak aloud if enabled
      speakText(agentReply, data.language || selectedLang);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'agent',
          agentName: 'System',
          text: 'Temporary network glitch. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleMicInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (listening) {
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langMap: Record<string, string> = {
        en: 'en-IN',
        te: 'te-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
      };
      recognition.lang = langMap[selectedLang] || 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setListening(false);
        handleSendMessage(transcript);
      };

      recognition.start();
    } catch (e) {
      setListening(false);
    }
  };

  const quickChips: Record<string, string[]> = {
    sara: [
      'Dr. Rao consultation fee entha?',
      'Book an appointment for tomorrow evening',
      'Are you an AI or a real person?',
      'నాకు తీవ్రమైన గుండె నొప్పి వస్తోంది (Emergency test)',
    ],
    alex: [
      'Find top Summer 2026 AI internships in Bengaluru',
      'How to optimize my resume for 95+ ATS score?',
      'Generate technical interview questions for AI engineer',
    ],
    maya: [
      'Draft a client proposal for website redesign',
      'Create high-converting WhatsApp lead nurture script',
      'Write Meta ad copy for healthcare clinic',
    ],
    rishi: [
      'How does instant UPI QR reconciliation work?',
      'Check clinic appointment double-booking rules',
      'Show Indian GST Form INV-01 tax invoice format',
    ],
  };

  const downloadTranscript = () => {
    const transcriptText = messages
      .map((m) => `[${m.timestamp}] ${m.sender === 'user' ? 'User' : m.agentName || 'Agent'}: ${m.text}`)
      .join('\n\n');
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MEOW_Copilot_Transcript_${selectedAgent}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              MEOW Universal AI Copilot &amp; Assistant
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE DIALOGUE
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time conversational assistant powered by specialized personas — with live voice speech synthesis and vernacular Indian dialogue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Speech Toggle */}
          <button
            type="button"
            onClick={() => {
              setVoicePlaybackEnabled(!voicePlaybackEnabled);
              if (voicePlaybackEnabled && typeof window !== 'undefined') {
                window.speechSynthesis?.cancel();
              }
            }}
            title={voicePlaybackEnabled ? 'Voice playback enabled' : 'Voice playback muted'}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              voicePlaybackEnabled
                ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                : 'bg-zinc-800 border-white/10 text-zinc-400'
            }`}
          >
            {voicePlaybackEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voicePlaybackEnabled ? 'Sara Voice ON' : 'Voice Muted'}</span>
          </button>

          <button
            type="button"
            onClick={downloadTranscript}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-white/10 text-zinc-300 hover:text-white transition-all text-xs"
            title="Download Transcript"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: 'reset',
                  sender: 'agent',
                  agentName: selectedAgent.toUpperCase(),
                  text: 'Session reset. What would you like to explore next?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-white/10 text-zinc-400 hover:text-white transition-all text-xs"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Agent Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-white/[0.06] text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-400">Agent:</span>
          {[
            { id: 'sara', name: 'Sara (Voice Concierge)', icon: PhoneCall, color: 'text-violet-400' },
            { id: 'alex', name: 'Alex (Career & Research)', icon: FileText, color: 'text-blue-400' },
            { id: 'maya', name: 'Maya (Growth & Proposals)', icon: Zap, color: 'text-pink-400' },
            { id: 'rishi', name: 'Rishi (Ops & Automations)', icon: Cpu, color: 'text-emerald-400' },
          ].map((ag) => (
            <button
              key={ag.id}
              type="button"
              onClick={() => handleSelectAgent(ag.id as any)}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                selectedAgent === ag.id
                  ? 'bg-zinc-800 text-white font-bold border border-white/10 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ag.icon className={`w-3.5 h-3.5 ${ag.color}`} />
              <span>{ag.name}</span>
            </button>
          ))}
        </div>

        {/* Vernacular Language Selector (for Sara) */}
        {selectedAgent === 'sara' && (
          <div className="flex items-center gap-2">
            <Languages className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage)}
              className="bg-zinc-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
            >
              <option value="en">English (Indian)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
        )}
      </div>

      {/* Chat Messages Frame: Apple Clean Minimalist */}
      <div className="rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 space-y-4 min-h-[420px] max-h-[560px] flex flex-col justify-between overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="space-y-4 overflow-y-auto pr-2 flex-1 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-zinc-500">
                <span>{msg.sender === 'user' ? 'You' : msg.agentName || 'Agent'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl max-w-xl leading-relaxed whitespace-pre-wrap transition-all shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-sm'
                    : 'bg-zinc-950/80 border border-white/[0.08] text-zinc-200 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'agent' && voicePlaybackEnabled && (
                <button
                  type="button"
                  onClick={() => speakText(msg.text, msg.language || selectedLang)}
                  className="mt-1 text-[10px] font-mono text-zinc-500 hover:text-violet-400 flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Replay Voice</span>
                </button>
              )}
            </div>
          ))}

          {sending && (
            <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>{selectedAgent.toUpperCase()} is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2 border-t border-white/[0.06] space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-500">Suggested:</span>
            {quickChips[selectedAgent]?.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-full bg-zinc-950 hover:bg-zinc-800 border border-white/[0.06] text-zinc-400 hover:text-white text-[11px] transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl bg-zinc-950/90 border border-white/10 focus-within:border-violet-500/50 transition-all">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder={`Ask ${selectedAgent.toUpperCase()} anything or speak in your language...`}
                className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={handleMicInput}
                title={listening ? 'Listening...' : 'Voice input'}
                className={`p-1.5 rounded-lg border transition-all ${
                  listening
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={sending || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-zinc-200 disabled:opacity-40 text-zinc-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

