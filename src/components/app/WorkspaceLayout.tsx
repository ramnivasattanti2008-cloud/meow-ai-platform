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
} from 'lucide-react';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { name: 'Voice Agents', href: '/app/agents', icon: Bot },
    { name: 'Workflows', href: '/app/workflows', icon: WorkflowIcon },
    { name: 'Campaigns', href: '/app/campaigns', icon: Zap },
    { name: 'Settings', href: '/app/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row text-left font-sans antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between border-b border-white/[0.08] px-4 py-3 bg-zinc-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <span className="font-semibold text-sm">MEOW Workspace</span>
        </div>
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
        } md:flex flex-col w-full md:w-64 border-r border-white/[0.08] bg-zinc-950/80 backdrop-blur-2xl p-4 sm:p-5 shrink-0 z-30`}
      >
        {/* Brand & Exit to Public Website */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/15 flex items-center justify-center shadow-subtle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 17V8.5L8 12.5L12 7L16 12.5L20 8.5V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17Z"
                  fill="white"
                />
                <circle cx="8.5" cy="11.5" r="1" fill="#8b5cf6" />
                <circle cx="15.5" cy="11.5" r="1" fill="#8b5cf6" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
                MEOW AI
              </div>
              <div className="text-[10px] font-mono text-zinc-500">v1.0 Workspace</div>
            </div>
          </Link>

          <Link
            href="/"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Return to Public Website"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-violet-400' : 'text-zinc-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Demo Mode Badge in Sidebar */}
        <div className="pt-4 border-t border-white/[0.08] mt-6 space-y-3 text-xs">
          <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/[0.06] space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Demo Mode Active</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Safe local development store. Connect PostgreSQL / Prisma in production settings.
            </p>
          </div>
          <div className="text-[11px] font-mono text-zinc-400 px-1">
            Founder: Ram Nivas Attanti
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Global Demo Banner */}
        <div className="bg-zinc-900/50 border-b border-white/[0.06] px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>
              <strong>Demonstration Sandbox:</strong> All records are managed safely with persistent local state. No real telephony charges.
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
            <span>Server: Next.js App Router</span>
            <span>•</span>
            <span>Region: India</span>
          </div>
        </div>

        {/* Injected View Body */}
        <div className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

