'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  PhoneCall,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  Languages,
  ShieldCheck,
  Building,
  User,
  Clock,
  Send,
} from 'lucide-react';
import { Agent, SupportedLanguage } from '@/lib/types';
import { VoiceDialogueTurnOutput } from '@/lib/voice/engine';

type VoiceDialogueResponse = VoiceDialogueTurnOutput;

interface CustomAgentWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated?: (agent: Agent) => void;
}

export const CustomAgentWizardModal: React.FC<CustomAgentWizardModalProps> = ({
  isOpen,
  onClose,
  onAgentCreated,
}) => {
  const [step, setStep] = useState<'form' | 'test'>('form');

  // Business inputs
  const [businessName, setBusinessName] = useState('Dr. Ramesh Dental & Orthodontic Care');
  const [doctorName, setDoctorName] = useState('Dr. Ramesh Babu, MDS');
  const [workingHours, setWorkingHours] = useState('10:00 AM to 08:00 PM, Monday to Saturday');
  const [fee, setFee] = useState('₹500');
  const [services, setServices] = useState('Teeth Cleaning, Root Canal, Orthodontic Braces, Dental Implants');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98480 11223');
  const [language, setLanguage] = useState<SupportedLanguage>('te');

  // Generated Agent
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Live Test Chat / Speech
  const [testInput, setTestInput] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'sara'; text: string; intent?: string }[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const greetingTe = `నమస్కారం అండి! ${businessName} కి స్వాగతం. నేను సారా, ${doctorName} గారి ఫ్రంట్-డెస్క్ వాయిస్ అసిస్టెంట్‌ని. మీకు అపాయింట్‌మెంట్ బుకింగ్ కోసం సహాయపడనా?`;
    const greetingHi = `नमस्ते! ${businessName} में आपका स्वागत है। मैं सारा हूँ, ${doctorName} की फ्रंट-डेस्क असिस्टेंट। क्या मैं अपॉइंटमेंट बुक करने में आपकी मदद करूँ?`;
    const greetingEn = `Hello! Welcome to ${businessName}. I'm Sara, voice concierge for ${doctorName}. How can I assist you with your appointment or consultation today?`;

    const greeting = language === 'te' ? greetingTe : language === 'hi' ? greetingHi : greetingEn;

    const knowledgeInstructions = `You are Sara, the warm, polite, and charming female front-desk receptionist for ${businessName}.
Primary Doctor/Lead: ${doctorName}.
Working Timings: ${workingHours}.
Consultation Fee: ${fee} (covers comprehensive evaluation and physical inspection).
Services Available: ${services}.
Emergency Contact: ${emergencyPhone}.
Always speak warmly with natural conversational fillers (e.g. 'అండి' in Telugu, 'जी' in Hindi). Never give unsolicited prescriptions. For emergencies, direct to ${emergencyPhone}.`;

    const newAgentPayload = {
      name: `${businessName} (Sara)`,
      purpose: 'appointment_booking' as const,
      language,
      greeting,
      knowledgeInstructions,
      escalationRules: `Immediately transfer to duty staff at ${emergencyPhone} if acute emergency, severe bleeding, or trauma occurs.`,
      enabled: true,
    };

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgentPayload),
      });

      const data = await res.json();
      if (res.ok && data.agent) {
        setCreatedAgent(data.agent);
        if (onAgentCreated) onAgentCreated(data.agent);
        setChatLog([
          {
            sender: 'sara',
            text: greeting,
            intent: 'welcome_greeting',
          },
        ]);
        setStep('test');
      }
    } catch (err) {
      console.error('Error generating agent:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.1;
    utterance.rate = 1.02;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendDialogueTurn = async (messageToSend?: string) => {
    const text = (messageToSend || testInput).trim();
    if (!text || isProcessing) return;

    setTestInput('');
    setChatLog((prev) => [...prev, { sender: 'user', text }]);
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

      const data: VoiceDialogueResponse = await res.json();
      if (data && data.agentResponse) {
        setChatLog((prev) => [
          ...prev,
          {
            sender: 'sara',
            text: data.agentResponse,
            intent: data.intentDetected,
          },
        ]);
        speakText(data.agentResponse);
      }
    } catch (err) {
      console.error('Dialogue error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-left text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Instant AI Voice Receptionist Generator</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Sara Engine
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Setup a custom multilingual receptionist for your clinic or business in 30 seconds.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Form Configuration */}
        {step === 'form' ? (
          <form onSubmit={handleGenerate} className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Clinic / Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Multispeciality Hospital"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Doctor / Lead In-Charge *</label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Suresh Reddy, MBBS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Consultation Fee</label>
                <input
                  type="text"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="₹600"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Working Timings</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="10 AM to 7 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Emergency Contact</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+91 80 4000 0001"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Key Services / Treatments Offered</label>
              <textarea
                rows={2}
                value={services}
                onChange={(e) => setServices(e.target.value)}
                placeholder="List services comma separated..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white resize-none focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Primary Spoken Language</label>
              <div className="grid grid-cols-4 gap-2 font-mono">
                {[
                  { code: 'te', label: 'Telugu (తెలుగు)' },
                  { code: 'hi', label: 'Hindi (हिन्दी)' },
                  { code: 'en', label: 'English' },
                  { code: 'ta', label: 'Tamil (தமிழ்)' },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLanguage(l.code as any)}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      language === l.code
                        ? 'bg-violet-600/30 border-violet-500/50 text-white font-bold'
                        : 'bg-zinc-900 border-white/[0.06] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <span>Generating Custom AI Voice Receptionist...</span>
                ) : (
                  <>
                    <span>Generate AI Receptionist &amp; Start Live Call Test</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Live In-Console Interactive Voice Dialing Sandbox */
          <div className="space-y-4 flex-1 flex flex-col min-h-0 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">{createdAgent?.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">Live Call Connected • Sara Prosody 1.10</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const lastMsg = chatLog.filter((m) => m.sender === 'sara').slice(-1)[0]?.text;
                    if (lastMsg) speakText(lastMsg);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white font-mono text-[10px] flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3 text-violet-400" />
                  <span>Replay Voice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-[10px]"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Live Chat Log */}
            <div className="flex-1 overflow-y-auto space-y-2.5 p-3 rounded-2xl bg-zinc-950 border border-white/[0.06] min-h-[220px]">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-violet-600 text-white rounded-br-none'
                        : 'bg-zinc-900 border border-white/10 text-zinc-100 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.intent && (
                      <span className="text-[9px] font-mono text-zinc-400 mt-1 block">
                        Intent: {msg.intent}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px] p-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <span>Sara is listening &amp; generating speech...</span>
                </div>
              )}
            </div>

            {/* Quick Test Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono shrink-0">
              <span className="text-zinc-500 shrink-0">Ask:</span>
              {[
                'Doctor consultation fee entha untundhi?',
                'Are you a real human or an AI receptionist?',
                'I have severe pain, can I book a slot tomorrow?',
                'Where is the clinic located?',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendDialogueTurn(chip)}
                  className="px-2 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-white/[0.06] text-zinc-400 hover:text-white shrink-0"
                >
                  "{chip.slice(0, 30)}..."
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div className="flex items-center gap-2 pt-1 shrink-0">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendDialogueTurn()}
                placeholder="Type what a patient would say on the call..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={() => handleSendDialogueTurn()}
                disabled={!testInput.trim() || isProcessing}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Speak</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
