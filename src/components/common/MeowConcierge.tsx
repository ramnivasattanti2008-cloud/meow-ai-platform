'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
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
  CheckCircle2,
  Circle,
  HelpCircle,
  Compass,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  Workflow,
  Sparkle,
  FileDown,
  Building2,
  Check,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  links?: { label: string; href: string }[];
}

interface StepItem {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  targetId?: string;
  badge?: string;
}

interface PageGuideConfig {
  pageTitle: string;
  stageName: string;
  summary: string;
  steps: StepItem[];
}

const PAGE_GUIDES: Record<string, PageGuideConfig> = {
  '/': {
    pageTitle: 'Home Overview',
    stageName: 'Stage 1 • Platform Discovery',
    summary: 'Get started with MEOW AI across vernacular voice, automation workflows, and booking.',
    steps: [
      {
        id: 'home-voice',
        title: 'Step 1: Test Vernacular Voice AI',
        description: 'Listen to authentic Telugu & Indian English phone conversations with sub-300ms latency.',
        actionLabel: 'Open Voice AI Sandbox',
        actionHref: '/voice-ai',
        badge: 'Telugu & English',
      },
      {
        id: 'home-platform',
        title: 'Step 2: Explore Workflow Automation Canvas',
        description: 'See how deterministic triggers connect voice calls to Google Calendar and WhatsApp.',
        actionLabel: 'Launch Workflow Canvas',
        actionHref: '/platform',
        badge: 'Zero-Code Canvas',
      },
      {
        id: 'home-book',
        title: 'Step 3: Schedule Founder Discovery Session',
        description: 'Pick an IST slot with founder Ram Nivas Attanti and download a verified .ics calendar invite.',
        actionLabel: 'Book 30-Min Call',
        actionHref: '/book',
        badge: 'Free Architecture Call',
      },
    ],
  },
  '/voice-ai': {
    pageTitle: 'Vernacular Voice AI',
    stageName: 'Stage 2 • Voice Agent Configuration',
    summary: 'Test real-time telephone dialogue in native Telugu and Indian English.',
    steps: [
      {
        id: 'voice-sample',
        title: 'Step 1: Listen to Live Audio Call Sample',
        description: 'Play the 28-second Dr. Rao Clinic booking call with waveform audio & turn-by-turn Telugu transcript.',
        actionLabel: 'Listen to Sample Audio',
        targetId: 'call-recording-showcase',
        badge: 'Telugu Call Demo',
      },
      {
        id: 'voice-mic',
        title: 'Step 2: Test Browser Microphone Dialogue',
        description: 'Grant microphone consent and speak naturally in Telugu or English to test real-time intent parsing.',
        actionLabel: 'Test Microphone',
        targetId: 'voice-agent-sandbox',
        badge: 'Browser STT / TTS',
      },
      {
        id: 'voice-telemetry',
        title: 'Step 3: Inspect Latency & Tool Execution',
        description: 'Verify sub-300ms Claude Haiku first-token response times and slot-locking function calls.',
        actionLabel: 'View Telemetry Cards',
        targetId: 'call-recording-showcase',
        badge: '295ms Latency',
      },
      {
        id: 'voice-book',
        title: 'Step 4: Request Commercial SIP Deployment',
        description: 'Connect our voice pipeline to your existing phone numbers via Exotel or Twilio SIP trunking.',
        actionLabel: 'Book Telephony Consultation',
        actionHref: '/book',
        badge: 'Live Phone Line',
      },
    ],
  },
  '/platform': {
    pageTitle: 'Workflow Automation',
    stageName: 'Stage 3 • Deterministic Orchestration',
    summary: 'Design and simulate mission-critical triggers, CRM syncs, and human handoffs.',
    steps: [
      {
        id: 'platform-preset',
        title: 'Step 1: Load a Production Preset Blueprint',
        description: 'Choose between Clinic Inbound Booking, Real Estate Meta Lead Callout, or Emergency Medical Triage.',
        actionLabel: 'Choose Preset Blueprint',
        targetId: 'workflow-canvas-container',
        badge: '1-Click Template',
      },
      {
        id: 'platform-inspector',
        title: 'Step 2: Inspect Node Parameters Drawer',
        description: 'Click on any workflow node on the canvas to open the side drawer and view payload parameters.',
        actionLabel: 'Inspect Node Payloads',
        targetId: 'workflow-canvas-container',
        badge: 'Interactive Drawer',
      },
      {
        id: 'platform-simulate',
        title: 'Step 3: Run Deterministic Execution Simulation',
        description: 'Click "Run Simulation" to watch execution flow sequentially through each node state.',
        actionLabel: 'Run Simulation',
        targetId: 'workflow-canvas-container',
        badge: 'Dry Run',
      },
      {
        id: 'platform-export',
        title: 'Step 4: Export Production JSON Configuration',
        description: 'Click "Export JSON Config" to copy the production schema directly to your clipboard.',
        actionLabel: 'Export Config JSON',
        targetId: 'workflow-canvas-container',
        badge: 'JSON Export',
      },
    ],
  },
  '/growth': {
    pageTitle: 'Growth Engine',
    stageName: 'Stage 4 • Multi-Channel Acquisition',
    summary: 'Generate targeted marketing hooks and lead qualification matrices with Claude.',
    steps: [
      {
        id: 'growth-archetype',
        title: 'Step 1: Select Business Archetype',
        description: 'Pick your sector (Healthcare, Real Estate, Local Services) and target audience demographic.',
        actionLabel: 'Configure Archetype',
        targetId: 'campaign-generator-form',
        badge: 'Persona Setup',
      },
      {
        id: 'growth-channels',
        title: 'Step 2: Choose Advertising Channels',
        description: 'Select Meta Ads, WhatsApp Direct, or Google Search to customize the copy structure.',
        actionLabel: 'Select Channels',
        targetId: 'campaign-generator-form',
        badge: 'Multi-Channel',
      },
      {
        id: 'growth-generate',
        title: 'Step 3: Generate Campaign Matrix with Claude',
        description: 'Run generation to produce instant ad angles, Telugu hooks, and qualification question scripts.',
        actionLabel: 'Generate AI Brief',
        targetId: 'campaign-generator-form',
        badge: 'Claude 3.5 Sonnet',
      },
    ],
  },
  '/book': {
    pageTitle: 'Session Booking Engine',
    stageName: 'Stage 5 • Architecture Consultation',
    summary: 'Schedule a direct 30-minute discovery call with founder Ram Nivas Attanti.',
    steps: [
      {
        id: 'book-date',
        title: 'Step 1: Select Your Preferred Date',
        description: 'Choose tomorrow or an upcoming weekday from the interactive date carousel.',
        actionLabel: 'Select Date',
        targetId: 'booking-scheduler-container',
        badge: '6-Day Carousel',
      },
      {
        id: 'book-slot',
        title: 'Step 2: Choose IST Time Slot & Focus',
        description: 'Select 10:30 AM, 2:15 PM, or 5:15 PM IST along with your session topic (Voice, CRM, or General).',
        actionLabel: 'Choose IST Slot',
        targetId: 'booking-scheduler-container',
        badge: 'IST Timezone',
      },
      {
        id: 'book-language',
        title: 'Step 3: Pick Discussion Language',
        description: 'Opt for Telugu (తెలుగు), Indian English, or Bilingual technical dialogue.',
        actionLabel: 'Select Language',
        targetId: 'booking-scheduler-container',
        badge: 'Telugu / English',
      },
      {
        id: 'book-ics',
        title: 'Step 4: Download Calendar Invite (.ics)',
        description: 'Click the confirm button to immediately download a verified .ics file compatible with Google & Apple Calendar.',
        actionLabel: 'Download .ics Invite',
        targetId: 'booking-scheduler-container',
        badge: '1-Click Calendar Sync',
      },
    ],
  },
  '/pricing': {
    pageTitle: 'Pricing & Packages',
    stageName: 'Transparent Pricing Overview',
    summary: 'Simple pricing with zero hidden telephony markups or surprise fees.',
    steps: [
      {
        id: 'price-compare',
        title: 'Step 1: Compare Pilot vs Workflow Tiers',
        description: 'Review ₹25,000/mo Voice Pilot (1,200 min included) vs ₹45,000 one-off custom workflow builds.',
        actionLabel: 'Review Plans',
        actionHref: '/pricing',
        badge: '₹25,000 / mo',
      },
      {
        id: 'price-calc',
        title: 'Step 2: Estimate Monthly Call Volume',
        description: 'Typical clinics handle 40-70 calls daily (approx 800-1,200 minutes per month).',
        actionLabel: 'View Breakdown',
        actionHref: '/pricing',
        badge: 'Usage Estimator',
      },
      {
        id: 'price-book',
        title: 'Step 3: Lock 30-Day Pilot Agreement',
        description: 'Schedule an onboarding session to scope custom prompts, API keys, and test telephony numbers.',
        actionLabel: 'Initiate 30-Day Pilot',
        actionHref: '/book',
        badge: '30-Day Pilot',
      },
    ],
  },
  '/solutions': {
    pageTitle: 'Industry Solutions',
    stageName: 'Sector-Specific Blueprints',
    summary: 'Tailored AI workflows for Indian healthcare, real estate, and local commerce.',
    steps: [
      {
        id: 'sol-clinic',
        title: 'Step 1: Inspect Healthcare Clinic Blueprint',
        description: 'Automates patient appointment booking and triggers immediate emergency nurse transfers.',
        actionLabel: 'Explore Clinic Blueprint',
        actionHref: '/solutions',
        badge: 'Healthcare',
      },
      {
        id: 'sol-realestate',
        title: 'Step 2: Review Real Estate Lead Speed-to-Call',
        description: 'Calls Meta ad leads within 60 seconds to qualify budget, locality, and site visit timeline.',
        actionLabel: 'Real Estate Blueprint',
        actionHref: '/solutions',
        badge: 'Real Estate',
      },
      {
        id: 'sol-book',
        title: 'Step 3: Request Custom Implementation Plan',
        description: 'Meet our engineering team to design custom API connectors for your business stack.',
        actionLabel: 'Book Implementation Session',
        actionHref: '/book',
        badge: 'Custom Scope',
      },
    ],
  },
  '/app': {
    pageTitle: 'MEOW Workspace',
    stageName: 'Production Console',
    summary: 'Manage deployed voice agents, active workflows, and campaign execution records.',
    steps: [
      {
        id: 'app-agents',
        title: 'Step 1: Manage Voice Agents',
        description: 'Configure agent personas, system instructions, and fallback routing phone numbers.',
        actionLabel: 'Open Agents View',
        actionHref: '/app/agents',
        badge: 'Voice Agents',
      },
      {
        id: 'app-workflows',
        title: 'Step 2: Monitor Active Workflows',
        description: 'Inspect execution histories, CRM sync success rates, and pending human approvals.',
        actionLabel: 'Open Workflows View',
        actionHref: '/app/workflows',
        badge: 'Workflows',
      },
      {
        id: 'app-campaigns',
        title: 'Step 3: Review Marketing Drafts',
        description: 'Generate, edit, and export automated campaign drafts across social and direct channels.',
        actionLabel: 'Open Campaigns View',
        actionHref: '/app/campaigns',
        badge: 'Campaigns',
      },
    ],
  },
};

const KNOWLEDGE_RESPONSES = [
  {
    keywords: ['telugu', 'language', 'vernacular', 'భారతీయ', 'తెలుగు', 'మాట్లాడగలరా'],
    answer:
      'నమస్కారం! MEOW Voice AI natively supports conversational Telugu (తెలుగు) and Indian English. We handle code-mixing, dialect nuances (Andhra & Telangana colloquialisms), and sub-300ms first-token latency using Claude 3 Haiku for real-time telephone calls.',
    links: [
      { label: 'Step 1: Try Telugu Audio Demo', href: '/voice-ai' },
      { label: 'Step 2: Book Telugu Discovery Call', href: '/book' },
    ],
  },
  {
    keywords: ['step', 'steps', 'guide', 'how to start', 'help me', 'start', 'where to begin'],
    answer:
      'Here is the standard 4-step path to deploy MEOW AI for your business:\n\n1. **Step 1: Test Vernacular Voice AI** (/voice-ai) — Listen to Telugu & English phone recordings with 295ms latency.\n2. **Step 2: Simulate Workflow Canvas** (/platform) — Choose a preset blueprint (Clinic / Real Estate) and inspect node parameters.\n3. **Step 3: Generate Growth Campaign** (/growth) — Draft targeted multi-channel ad copy.\n4. **Step 4: Book Architecture Session** (/book) — Pick a 30-min IST slot and download your .ics calendar invite.',
    links: [
      { label: 'Go to Step 1: Voice AI', href: '/voice-ai' },
      { label: 'Go to Step 2: Workflows', href: '/platform' },
      { label: 'Go to Step 4: Book Call', href: '/book' },
    ],
  },
  {
    keywords: ['price', 'pricing', 'cost', 'plans', 'rate', '₹', 'dollar'],
    answer:
      'We offer 4 transparent tiers:\n• **Voice AI Pilot:** ₹25,000/mo (Includes 1,200 calling minutes, Telugu + English, Claude 3 Haiku, CRM webhook).\n• **Custom Workflow Automation:** ₹45,000 one-off build (Custom multi-step connectors for WhatsApp, Sheets, Zoho).\n• **Growth Engine:** ₹35,000/mo (Automated campaign generation & lead qualification).\n• **Enterprise Retainer:** Custom (Dedicated SIP trunks, SLA, on-prem option).\n\nZero hidden telecom markups.',
    links: [{ label: 'Compare Pricing Plans', href: '/pricing' }],
  },
  {
    keywords: ['clinic', 'hospital', 'doctor', 'patient', 'appointment', 'healthcare'],
    answer:
      'For healthcare clinics, MEOW Voice handles after-hours patient calls, checks doctor slot availability, and locks reservations. In case of urgent symptoms (e.g. chest pain, active bleeding), it immediately triggers an emergency transfer to your duty nurse.',
    links: [
      { label: 'Step 1: Clinic Blueprint', href: '/solutions' },
      { label: 'Step 2: Test Live Audio Sample', href: '/voice-ai' },
      { label: 'Step 3: Book Discovery Call', href: '/book' },
    ],
  },
  {
    keywords: ['real estate', 'property', 'meta lead', 'speed to call', 'site visit'],
    answer:
      'For real estate agencies, MEOW triggers an automated voice call within 60 seconds of a Meta Lead Ad submission. It qualifies budget, desired BHK/locality, and confirms site visit availability, logging data directly to your CRM.',
    links: [
      { label: 'Real Estate Blueprint', href: '/solutions' },
      { label: 'Test Workflow Canvas', href: '/platform' },
    ],
  },
  {
    keywords: ['crm', 'whatsapp', 'tools', 'google', 'integration', 'sheets', 'export', 'json'],
    answer:
      'MEOW Automate connects to your existing stack via webhooks and REST APIs: WhatsApp Business API, Google Calendar, Google Sheets, HubSpot, Zoho CRM, and custom SQL databases. You can also export full JSON schemas directly from the Workflow Canvas.',
    links: [{ label: 'Explore Workflow Canvas', href: '/platform' }],
  },
  {
    keywords: ['founder', 'team', 'who', 'about', 'ram', 'ram nivas'],
    answer:
      'MEOW AI was founded by Ram Nivas Attanti, an AI engineer and Computer Science student at Jain University, Bengaluru. We operate with radical transparency: zero fabricated testimonials, zero fake client logos, and verifiable open software on GitHub.',
    links: [{ label: 'Founder Story & Background', href: '/about' }],
  },
  {
    keywords: ['book', 'schedule', 'demo', 'call', 'contact', 'calendar', 'ics'],
    answer:
      'You can schedule a direct 30-minute architecture discovery call with Founder Ram Nivas Attanti. We provide an instant downloadable .ics calendar invite for Google Calendar, Outlook, and Apple Calendar with Google Meet details.',
    links: [{ label: 'Schedule 30-Min Session', href: '/book' }],
  },
];

export const MeowConcierge: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'chat' | 'wizard'>('guide');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHintBadge, setShowHintBadge] = useState(true);

  // 3-Step Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardIndustry, setWizardIndustry] = useState('Healthcare Clinic');
  const [wizardLanguage, setWizardLanguage] = useState('Telugu (తెలుగు)');
  const [wizardGoal, setWizardGoal] = useState('Inbound Phone Booking');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am MEOW Concierge, your AI guide. I will help you through every step of exploring and setting up our multilingual voice agents, workflow automation, and calendar bookings.',
      timestamp: 'Now',
      links: [
        { label: '🎯 Follow Step Guide', href: '/voice-ai' },
        { label: '🎙️ Test Telugu Audio', href: '/voice-ai' },
        { label: '📅 Book Discovery Call', href: '/book' },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load completed steps from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('meow_completed_steps');
        if (saved) {
          setCompletedSteps(JSON.parse(saved));
        }
      } catch (e) {
        // ignore storage errors
      }
    }
  }, []);

  // Save completed steps
  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => {
      const updated = { ...prev, [stepId]: !prev[stepId] };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('meow_completed_steps', JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  };

  // Identify current page guide
  const currentGuide = useMemo<PageGuideConfig>(() => {
    if (pathname && PAGE_GUIDES[pathname]) {
      return PAGE_GUIDES[pathname];
    }
    // Check partial matches
    if (pathname.startsWith('/app')) return PAGE_GUIDES['/app'];
    return PAGE_GUIDES['/'];
  }, [pathname]);

  // Calculate current page progress
  const progressPercent = useMemo(() => {
    if (!currentGuide || !currentGuide.steps.length) return 0;
    const completedCount = currentGuide.steps.filter((s) => completedSteps[s.id]).length;
    return Math.round((completedCount / currentGuide.steps.length) * 100);
  }, [currentGuide, completedSteps]);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  // Non-intrusive tooltip auto dismiss after 8s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHintBadge(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleActionClick = (step: StepItem) => {
    // If targetId is provided, try to scroll to element
    if (step.targetId && typeof document !== 'undefined') {
      const el = document.getElementById(step.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toggleStep(step.id);
        return;
      }
    }
    // Mark as completed
    toggleStep(step.id);
  };

  const handleSpeechSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

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

    // Knowledge search
    setTimeout(() => {
      const lower = query.toLowerCase();
      const matched = KNOWLEDGE_RESPONSES.find((item) =>
        item.keywords.some((kw) => lower.includes(kw))
      );

      const replyText =
        matched?.answer ||
        `MEOW AI builds action-oriented automation and multilingual voice agents (Telugu & English) for Indian SMBs.\n\nTo help you with this step, would you like to:\n• Review our step-by-step setup guide (/voice-ai)\n• Inspect deterministic workflow blueprints (/platform)\n• Download an instant .ics calendar invite for an architecture call (/book)?`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: matched?.links || [
          { label: 'Step 1: Test Voice AI', href: '/voice-ai' },
          { label: 'Step 2: Build Workflow', href: '/platform' },
          { label: 'Step 4: Book Architecture Call', href: '/book' },
        ],
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger Button with Smart Step Badge */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {showHintBadge && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 text-zinc-200 border border-violet-500/30 text-xs font-mono shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>
                {currentGuide.pageTitle}: {currentGuide.steps.length} interactive steps
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHintBadge(false);
                }}
                className="text-zinc-500 hover:text-white ml-1"
                aria-label="Dismiss hint"
              >
                ×
              </button>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="p-3.5 sm:px-4 sm:py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-2xl active:scale-95 transition-all flex items-center gap-2.5 group border border-white/20 backdrop-blur-xl"
            aria-label="Open MEOW AI Step Guide"
          >
            <div className="relative">
              <Bot className="w-5 h-5 group-hover:rotate-6 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold leading-tight flex items-center gap-1.5">
                AI Step Guide
                <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-mono">
                  {progressPercent}%
                </span>
              </span>
              <span className="text-[10px] text-violet-200 leading-tight">
                {currentGuide.steps.filter((s) => completedSteps[s.id]).length}/
                {currentGuide.steps.length} completed
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Floating AI Assistant Drawer Modal */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-2 sm:right-6 z-50 w-[96vw] sm:w-[460px] max-h-[85vh] h-[640px] rounded-3xl border border-white/[0.12] bg-zinc-950/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 text-left">
          {/* Header */}
          <div className="p-4 border-b border-white/[0.08] bg-zinc-900/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">MEOW AI Step Guide</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate max-w-[220px]">
                  {currentGuide.stageName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  handleSpeechSpeak(
                    activeTab === 'guide'
                      ? `You are on ${currentGuide.pageTitle}. There are ${currentGuide.steps.length} steps to complete.`
                      : 'MEOW AI concierge is ready to assist.'
                  )
                }
                className="p-1.5 rounded-xl text-zinc-400 hover:text-violet-300 hover:bg-white/10 transition-colors"
                title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <VolumeX className="w-4 h-4 text-violet-400 animate-pulse" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="grid grid-cols-3 border-b border-white/[0.08] bg-zinc-900/40 text-xs font-medium">
            <button
              onClick={() => setActiveTab('guide')}
              className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'guide'
                  ? 'border-violet-500 text-white bg-zinc-800/40 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-violet-400" />
              <span>Step Guide</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                {progressPercent}%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wizard')}
              className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'wizard'
                  ? 'border-violet-500 text-white bg-zinc-800/40 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Setup Wizard</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2.5 px-3 flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'chat'
                  ? 'border-violet-500 text-white bg-zinc-800/40 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ask AI</span>
            </button>
          </div>

          {/* Tab 1: Step Guide & Roadmap */}
          {activeTab === 'guide' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {/* Progress Bar Card */}
              <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-zinc-900/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                    {currentGuide.pageTitle} Roadmap
                  </span>
                  <span className="text-zinc-400 font-mono">
                    {currentGuide.steps.filter((s) => completedSteps[s.id]).length} /{' '}
                    {currentGuide.steps.length} Steps
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{currentGuide.summary}</p>
              </div>

              {/* Step Checklist Items */}
              <div className="space-y-3">
                {currentGuide.steps.map((step, idx) => {
                  const isDone = !!completedSteps[step.id];
                  return (
                    <div
                      key={step.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-950/10'
                          : 'border-white/[0.08] bg-zinc-900/30 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          onClick={() => toggleStep(step.id)}
                          className="mt-0.5 text-zinc-400 hover:text-emerald-400 transition-colors"
                          title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-600 hover:text-zinc-400" />
                          )}
                        </button>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5
                              className={`text-xs font-bold ${
                                isDone ? 'text-zinc-300 line-through' : 'text-white'
                              }`}
                            >
                              {step.title}
                            </h5>
                            {step.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                                {step.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            {step.description}
                          </p>

                          {/* Action Button */}
                          <div className="pt-2 flex items-center gap-2">
                            {step.actionHref ? (
                              <Link
                                href={step.actionHref}
                                onClick={() => {
                                  toggleStep(step.id);
                                  setIsOpen(false);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium transition-all shadow-sm"
                              >
                                <span>{step.actionLabel}</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleActionClick(step)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-[11px] font-medium transition-all"
                              >
                                <span>{step.actionLabel}</span>
                                <ChevronRight className="w-3 h-3 text-violet-400" />
                              </button>
                            )}

                            {isDone && (
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Jump Stage Cards */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Explore Other Stages
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <Link
                    href="/voice-ai"
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/[0.06] flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-violet-400" />
                    <span>Stage 1: Voice AI</span>
                  </Link>
                  <Link
                    href="/platform"
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/[0.06] flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                  >
                    <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Stage 2: Workflows</span>
                  </Link>
                  <Link
                    href="/growth"
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/[0.06] flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Stage 3: Growth</span>
                  </Link>
                  <Link
                    href="/book"
                    onClick={() => setIsOpen(false)}
                    className="p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/[0.06] flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Stage 4: Book Call</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Interactive 3-Step Setup Wizard */}
          {activeTab === 'wizard' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <div className="p-3.5 rounded-2xl border border-violet-500/20 bg-violet-950/20 space-y-1">
                <div className="flex items-center gap-2 text-violet-300 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>Interactive Setup Wizard (3 Quick Steps)</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Answer 3 quick questions to receive a tailored automation blueprint with direct
                  tool presets.
                </p>
              </div>

              {wizardStep === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Question 1 of 3</span>
                    <span className="text-violet-400">Industry Profile</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">What is your primary industry?</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        label: 'Healthcare / Clinic',
                        desc: 'Doctor appointments, after-hours triage, nurse handoff',
                      },
                      {
                        label: 'Real Estate Agency',
                        desc: 'Speed-to-lead callback, budget & locality qualification',
                      },
                      {
                        label: 'Local Services / Retail',
                        desc: 'Inbound price quotes, opening hours, WhatsApp orders',
                      },
                      {
                        label: 'Education / Coaching',
                        desc: 'Admissions qualification, demo scheduling, fee inquiries',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setWizardIndustry(opt.label);
                          setWizardStep(2);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          wizardIndustry === opt.label
                            ? 'border-violet-500 bg-violet-600/10'
                            : 'border-white/[0.08] bg-zinc-900/50 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{opt.label}</div>
                        <div className="text-[11px] text-zinc-400">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Question 2 of 3</span>
                    <span className="text-violet-400">Language Reality</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    What language do your customers speak on calls?
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        label: 'Telugu (తెలుగు)',
                        desc: 'Native conversational Telugu for Andhra & Telangana callers',
                      },
                      {
                        label: 'Indian English',
                        desc: 'Clear pan-India accent understanding with colloquialisms',
                      },
                      {
                        label: 'Bilingual (Telugu + English Code-Mixed)',
                        desc: 'Natural code-switching between vernacular Telugu and English',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setWizardLanguage(opt.label);
                          setWizardStep(3);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          wizardLanguage === opt.label
                            ? 'border-violet-500 bg-violet-600/10'
                            : 'border-white/[0.08] bg-zinc-900/50 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{opt.label}</div>
                        <div className="text-[11px] text-zinc-400">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setWizardStep(1)}
                    className="text-xs text-zinc-400 hover:text-white pt-2 flex items-center gap-1"
                  >
                    ← Back to Question 1
                  </button>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Question 3 of 3</span>
                    <span className="text-violet-400">Operational Priority</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    What is your highest priority bottleneck?
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        label: 'Inbound Phone Booking',
                        desc: 'Missed calls after 7 PM & weekend reservation friction',
                      },
                      {
                        label: 'CRM & WhatsApp Automation',
                        desc: 'Manual data entry and delayed confirmation messages',
                      },
                      {
                        label: 'Lead Follow-Up Speed',
                        desc: 'Slow follow-up on incoming Meta / web form leads',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setWizardGoal(opt.label);
                          setWizardStep(4);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          wizardGoal === opt.label
                            ? 'border-violet-500 bg-violet-600/10'
                            : 'border-white/[0.08] bg-zinc-900/50 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{opt.label}</div>
                        <div className="text-[11px] text-zinc-400">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setWizardStep(2)}
                    className="text-xs text-zinc-400 hover:text-white pt-2 flex items-center gap-1"
                  >
                    ← Back to Question 2
                  </button>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your Tailored 3-Step Action Plan Ready!</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/[0.08] space-y-1">
                      <span className="text-[10px] font-mono text-violet-400 uppercase">
                        Step 1: Recommended Voice Agent
                      </span>
                      <p className="text-white font-medium">
                        {wizardIndustry} Vernacular Agent ({wizardLanguage})
                      </p>
                      <p className="text-zinc-400 text-[11px]">
                        Utilizes Claude 3 Haiku for 295ms turn response and deterministic slot lock.
                      </p>
                      <Link
                        href="/voice-ai"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] text-violet-300 font-mono hover:underline pt-1"
                      >
                        <span>Test Voice Sandbox</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/[0.08] space-y-1">
                      <span className="text-[10px] font-mono text-indigo-400 uppercase">
                        Step 2: Recommended Workflow Blueprint
                      </span>
                      <p className="text-white font-medium">{wizardGoal} Pipeline</p>
                      <p className="text-zinc-400 text-[11px]">
                        Pre-configured trigger with WhatsApp Business API confirmation and human
                        escalation rules.
                      </p>
                      <Link
                        href="/platform"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-300 font-mono hover:underline pt-1"
                      >
                        <span>Open Workflow Canvas</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/[0.08] space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">
                        Step 3: Free Architecture & Telephony Call
                      </span>
                      <p className="text-white font-medium">30-Min Engineering Consultation</p>
                      <p className="text-zinc-400 text-[11px]">
                        Connect with Founder Ram Nivas Attanti and receive an instant .ics calendar
                        invitation.
                      </p>
                      <Link
                        href="/book"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 text-white text-[11px] font-medium hover:bg-violet-500 transition-colors mt-1"
                      >
                        <span>Book 30-Min Slot</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  <button
                    onClick={() => setWizardStep(1)}
                    className="text-xs text-zinc-400 hover:text-white pt-2 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Wizard</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Freeform Conversational AI Co-Pilot */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Quick Prompt Chips */}
              <div className="p-2.5 bg-zinc-900/50 border-b border-white/[0.04] flex items-center gap-1.5 overflow-x-auto custom-scrollbar text-[11px] font-mono">
                {[
                  'Show all steps',
                  'Telugu Voice AI?',
                  'Clinic Blueprint?',
                  'How to export JSON?',
                  'Download .ics invite?',
                  'Pricing tiers?',
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

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar text-xs">
                {messages.map((msg) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                          isAi
                            ? 'bg-zinc-900/90 text-zinc-100 border border-white/[0.08]'
                            : 'bg-violet-600 text-white font-medium'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>

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

              {/* Chat Input */}
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
                  placeholder="Ask any question in English or Telugu..."
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
        </div>
      )}
    </>
  );
};
