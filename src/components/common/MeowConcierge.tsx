'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  Minimize2,
  Calendar,
  Languages,
  PhoneCall,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  links?: { label: string; href: string }[];
}

const KNOWLEDGE_RESPONSES: { keywords: string[]; answer: string; links?: { label: string; href: string }[] }[] = [
  {
    keywords: ['telugu', 'language', 'vernacular', 'భారతీయ', 'తెలుగు'],
    answer:
      'MEOW Voice AI natively supports conversational Telugu (తెలుగు) and Indian English. We handle code-mixing, dialect nuances (Andhra & Telangana colloquialisms), and sub-300ms first-token latency using Claude 3 Haiku for real-time telephone calls.',
    links: [{ label: 'Try Telugu Voice Sandbox', href: '/voice-ai' }],
  },
  {
    keywords: ['price', 'pricing', 'cost', 'plans', 'rate', '₹', 'dollar'],
    answer:
      'We offer 4 transparent tiers: Voice AI Pilot (₹25,000/mo for 1,200 min), Custom Workflow Automation (₹45,000 one-off build), Growth Engine (₹35,000/mo), and Enterprise Retainer. All plans include zero hidden markups.',
    links: [{ label: 'View Pricing Breakdown', href: '/pricing' }],
  },
  {
    keywords: ['clinic', 'hospital', 'doctor', 'patient', 'appointment', 'healthcare'],
    answer:
      'For healthcare clinics, MEOW Voice answers after-hours patient calls, checks doctor slot availability, and locks reservations. In case of urgent symptoms (e.g. chest pain, active bleeding), it immediately triggers an emergency transfer to your duty nurse.',
    links: [
      { label: 'Clinic Blueprint', href: '/solutions' },
      { label: 'Book Discovery Call', href: '/book' },
    ],
  },
  {
    keywords: ['crm', 'whatsapp', 'tools', 'google', 'integration', 'sheets'],
    answer:
      'MEOW Automate connects to your existing stack via webhooks and REST APIs: WhatsApp Business API, Google Calendar, Google Sheets, HubSpot, Zoho CRM, and custom SQL databases. We keep humans in the loop for sensitive approvals.',
    links: [{ label: 'Explore Workflow Canvas', href: '/platform' }],
  },
  {
    keywords: ['founder', 'team', 'who', 'about', 'ram', 'ram nivas'],
    answer:
      'MEOW AI was founded by Ram Nivas Attanti, an AI engineer and Computer Science student at Jain University, Bengaluru. We operate with radical transparency: zero fabricated testimonials, zero fake client logos, and verifiable open software.',
    links: [{ label: 'Read Founder Story', href: '/about' }],
  },
  {
    keywords: ['book', 'schedule', 'demo', 'call', 'contact'],
    answer:
      'You can schedule a direct 30-minute architecture discovery call with Founder Ram Nivas Attanti. We provide an instant downloadable .ics calendar invite upon confirmation.',
    links: [{ label: 'Schedule 30-Min Session', href: '/book' }],
  },
];

export const MeowConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am MEOW Concierge. How can I help you explore our multilingual voice agents, workflow automation, or Telugu speech pipelines today?',
      timestamp: 'Now',
      links: [
        { label: 'Telugu Voice Demo', href: '/voice-ai' },
        { label: 'Book Discovery Call', href: '/book' },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Smart knowledge search
    setTimeout(() => {
      const lower = query.toLowerCase();
      const matched = KNOWLEDGE_RESPONSES.find((item) =>
        item.keywords.some((kw) => lower.includes(kw))
      );

      const replyText =
        matched?.answer ||
        `MEOW AI builds action-oriented automation and multilingual voice agents (Telugu & English) for Indian SMBs. Would you like to review our technical blueprints or schedule a 30-minute discovery call with our engineering team?`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: matched?.links || [{ label: 'Book Discovery Call', href: '/book' }, { label: 'Explore Platform', href: '/platform' }],
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-2xl active:scale-95 transition-all flex items-center gap-2 group border border-white/20 backdrop-blur-xl"
          aria-label="Open MEOW Concierge"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold pr-1 hidden sm:inline-block">Ask MEOW AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Modal Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] max-h-[620px] rounded-3xl border border-white/[0.12] bg-zinc-950/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 text-left">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">MEOW Concierge</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">Multilingual Assistant • Bengaluru</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-zinc-900/40 border-b border-white/[0.04] flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-[11px] font-mono">
            {[
              'Telugu Voice AI?',
              'Clinic Pricing?',
              'WhatsApp Integration?',
              'Book Call',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/[0.06] transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 space-y-3.5 overflow-y-auto max-h-[380px] custom-scrollbar text-xs">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      isAi
                        ? 'bg-zinc-900/90 text-zinc-100 border border-white/[0.08]'
                        : 'bg-violet-600 text-white font-medium'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Action Deep-Links */}
                    {isAi && msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                        {msg.links.map((link, lIdx) => (
                          <Link
                            key={lIdx}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-violet-300 border border-white/10 transition-colors"
                          >
                            <span>{link.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px] p-2">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                <span>MEOW Concierge is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-zinc-900/80 border-t border-white/[0.08] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Telugu voice, pricing, CRM..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 transition-all shadow-sm"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
