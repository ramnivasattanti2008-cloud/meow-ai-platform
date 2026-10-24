'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Workflow as WorkflowIcon,
  Zap,
  Settings,
  ArrowLeft,
  ShieldCheck,
  Terminal,
  Globe,
  Bell,
  Menu,
  X,
  CreditCard,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { EasyPaymentModal } from '@/components/payment/EasyPaymentModal';
import { Logo } from '@/components/common/Logo';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/app', icon: LayoutDashboard },
    { name: 'Voice Telephony (Sara)', href: '/app/agents', icon: Bot },
    { name: 'Workflows & CRM', href: '/app/workflows', icon: WorkflowIcon },
    { name: 'Campaigns & WhatsApp', href: '/app/campaigns', icon: Zap },
    { name: 'Settings & Integrations', href: '/app/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row text-left font-sans antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between border-b border-white/[0.08] px-4 py-3 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={18} showWordmark={true} />
        </Link>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileNavOpen ? 'block' : 'hidden'
        } md:flex flex-col w-full md:w-64 border-r border-white/[0.08] bg-black/60 backdrop-blur-2xl p-4 sm:p-5 shrink-0 z-30`}
      >
        {/* Brand & Exit to Public Website */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={20} showWordmark={true} />
          </Link>

          <Link
            href="/"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Public Website"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-white/10 text-white shadow-sm border border-white/10 font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-zinc-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Operations Widget */}
        <div className="pt-4 border-t border-white/[0.08] mt-6 space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-zinc-300 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Engine Active</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">99.98%</span>
            </div>
            <div className="text-[11px] text-zinc-400 space-y-0.5 font-mono">
              <div>Sara Voice: 8 Languages</div>
              <div>Invoicing: UPI + Razorpay</div>
              <div>Region: ap-south-1</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPaymentModalOpen(true)}
            className="w-full py-2 px-3 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-xs flex items-center justify-center gap-2 transition-all"
          >
            <CreditCard className="w-3.5 h-3.5 text-zinc-300" />
            <span>Terminal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Sleek Executive Top Header Bar */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-white/[0.08] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-white">MEOW Workspace</span>
            </div>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-400 font-mono text-[11px]">Personal • Pro • Business</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/voice-ai"
              className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 font-mono text-[11px]"
            >
              <PhoneCall className="w-3 h-3 text-zinc-300" />
              <span>Voice Live</span>
            </Link>

            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all flex items-center gap-1.5 text-[11px]"
            >
              <CreditCard className="w-3 h-3 text-zinc-300" />
              <span>Collect</span>
            </button>
          </div>
        </div>

        {/* View Body */}
        <div className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

      <EasyPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        defaultPlan="Client Invoice / Consultation Collection"
        defaultAmount={600}
      />
    </div>
  );
};
