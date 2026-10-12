'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  PhoneCall,
  FileText,
  CreditCard,
  Globe,
  Bot,
  Calendar,
  Settings,
  Zap,
  Workflow,
  ArrowRight,
  X,
  Command,
} from 'lucide-react';
import { SaraDialerModal } from '@/components/voice/SaraDialerModal';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';
import { WebsiteStudioModal } from '@/components/services/WebsiteStudioModal';

export const CommandPaletteModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Modals triggered from command palette
  const [dialerOpen, setDialerOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [websiteStudioOpen, setWebsiteStudioOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const actions = [
    {
      id: 'goals',
      title: 'Execute Goal / Instruction-to-Outcome Omnibar',
      category: 'Autonomous Actions',
      icon: Sparkles,
      color: 'text-amber-400',
      action: () => {
        router.push('/app');
        setIsOpen(false);
      },
    },
    {
      id: 'dialer',
      title: 'Call Sara Voice Receptionist (8 Indian Languages)',
      category: 'Telephony & Voice',
      icon: PhoneCall,
      color: 'text-violet-400',
      action: () => {
        setIsOpen(false);
        setDialerOpen(true);
      },
    },
    {
      id: 'resume',
      title: 'Open Resume & Career Studio (ATS 95+ Score & PDF)',
      category: 'Career & Personal',
      icon: FileText,
      color: 'text-blue-400',
      action: () => {
        router.push('/app');
        setIsOpen(false);
      },
    },
    {
      id: 'payment',
      title: 'Collect Payment / Generate Instant UPI QR & GST Bill',
      category: 'Commerce & Billing',
      icon: CreditCard,
      color: 'text-emerald-400',
      action: () => {
        setIsOpen(false);
        setPaymentOpen(true);
      },
    },
    {
      id: 'website',
      title: 'Launch 48-Hour Website Studio & Source Code Exporter',
      category: 'Tech Infrastructure',
      icon: Globe,
      color: 'text-indigo-400',
      action: () => {
        setIsOpen(false);
        setWebsiteStudioOpen(true);
      },
    },
    {
      id: 'copilot',
      title: 'Talk to AI Copilot (Sara, Alex, Maya, Rishi)',
      category: 'Conversational Intelligence',
      icon: Bot,
      color: 'text-pink-400',
      action: () => {
        router.push('/app');
        setIsOpen(false);
      },
    },
    {
      id: 'appointments',
      title: 'Appointments CRM & Patient Queue',
      category: 'Healthcare & SMB',
      icon: Calendar,
      color: 'text-cyan-400',
      action: () => {
        router.push('/app');
        setIsOpen(false);
      },
    },
    {
      id: 'workflows',
      title: 'Workflow Automation Pipelines Canvas',
      category: 'Event-Driven Systems',
      icon: Workflow,
      color: 'text-lime-400',
      action: () => {
        router.push('/app/workflows');
        setIsOpen(false);
      },
    },
    {
      id: 'campaigns',
      title: 'Omnichannel Campaigns & WhatsApp Copy Studio',
      category: 'Growth Operations',
      icon: Zap,
      color: 'text-yellow-400',
      action: () => {
        router.push('/app/campaigns');
        setIsOpen(false);
      },
    },
    {
      id: 'settings',
      title: 'System Settings, Firestore Cluster & Credentials',
      category: 'Cloud Infrastructure',
      icon: Settings,
      color: 'text-zinc-400',
      action: () => {
        router.push('/app/settings');
        setIsOpen(false);
      },
    },
  ];

  const filtered = query.trim()
    ? actions.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase())
      )
    : actions;

  return (
    <>
      {/* Global Floating Pill to Trigger on Mobile or Desktop */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-3.5 py-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-violet-500/40 text-zinc-300 hover:text-white text-xs font-mono backdrop-blur-xl shadow-2xl flex items-center gap-2 transition-all group"
      >
        <Command className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Spotlight</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-zinc-400">⌘K</kbd>
      </button>

      {/* Spotlight Command Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left">
            {/* Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-zinc-900/50">
              <Search className="w-5 h-5 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, feature, agent name, or shortcut..."
                autoFocus
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-white/5">
                ESC
              </kbd>
            </div>

            {/* Actions List */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 text-xs">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                  No matching commands found for &quot;{query}&quot;.
                </div>
              ) : (
                filtered.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      className="w-full p-3 rounded-2xl hover:bg-zinc-900 text-left flex items-center justify-between gap-3 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-white/20">
                          <Icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-zinc-200 font-medium truncate group-hover:text-white">
                            {item.title}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            {item.category}
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-white/[0.08] bg-zinc-900/30 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-3">
                <span>Navigate: ↑ ↓</span>
                <span>Select: Enter</span>
              </div>
              <span className="text-violet-400">MEOW Command Hub</span>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals triggered from Command Palette */}
      <SaraDialerModal isOpen={dialerOpen} onClose={() => setDialerOpen(false)} />
      <EasyPaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        defaultPlan="Instant UPI Payment / Consultation Settlement"
        defaultAmount={600}
      />
      <WebsiteStudioModal
        isOpen={websiteStudioOpen}
        onClose={() => setWebsiteStudioOpen(false)}
      />
    </>
  );
};
