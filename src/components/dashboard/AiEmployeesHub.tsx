'use client';

import React, { useState } from 'react';
import { Bot, Mic, FileText, Zap, Cpu, Sparkles, CheckCircle2, PhoneCall, ArrowRight } from 'lucide-react';
import { SaraDialerModal } from '@/components/voice/SaraDialerModal';

interface Employee {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatarBg: string;
  status: 'active' | 'busy' | 'standby';
  skills: string[];
  metrics: string;
  actionLabel: string;
  onAction?: () => void;
}

export const AiEmployeesHub: React.FC<{ onSelectTask?: (prompt: string) => void }> = ({ onSelectTask }) => {
  const [dialerOpen, setDialerOpen] = useState(false);

  const employees: Employee[] = [
    {
      id: 'sara',
      name: 'Sara',
      role: 'Voice Concierge & Front-Desk Receptionist',
      specialty: 'Bilingual patient triage, telephone scheduling, emergency escalations in 8 Indian languages.',
      avatarBg: 'from-violet-600 to-indigo-600',
      status: 'active',
      skills: ['8 Indian Languages', 'Web Audio Telephony', 'Google Calendar Lock', 'Emergency Triage'],
      metrics: '2,840 calls handled • 99.4% resolution rate',
      actionLabel: 'Launch Sara Dialer',
      onAction: () => setDialerOpen(true),
    },
    {
      id: 'alex',
      name: 'Alex',
      role: 'Career Strategist & Research Copilot',
      specialty: 'Job discovery, ATS resume tailoring, technical paper research, and study roadmaps.',
      avatarBg: 'from-blue-600 to-cyan-600',
      status: 'active',
      skills: ['ATS Optimization (95%)', 'Opportunity Scraper', 'Interview Preparation', 'Research Summaries'],
      metrics: '48 tailored resumes • 4 active trackers',
      actionLabel: 'Task Alex: Internships & Resume',
      onAction: () => onSelectTask?.('Help me find internships, organize the application deadlines, and prepare my resume for the best opportunities.'),
    },
    {
      id: 'maya',
      name: 'Maya',
      role: 'Growth & Client Proposal Lead',
      specialty: 'Freelance statements of work, WhatsApp marketing copy, and Meta ad briefs.',
      avatarBg: 'from-fuchsia-600 to-pink-600',
      status: 'active',
      skills: ['Commercial SOW Proposals', 'WhatsApp Vernacular Copy', 'Campaign Briefs', 'Lead Qualification'],
      metrics: '₹3.4L proposal volume • 24 active campaigns',
      actionLabel: 'Task Maya: Client Proposal',
      onAction: () => onSelectTask?.('Draft freelance client proposal for clinic website redesign with milestone deliverables'),
    },
    {
      id: 'rishi',
      name: 'Rishi',
      role: 'Business Operations & Automation Architect',
      specialty: 'Automated CRM sync, instant UPI QR links, Indian GST invoices, and pipeline execution.',
      avatarBg: 'from-emerald-600 to-teal-600',
      status: 'active',
      skills: ['Google Cloud Firestore', 'UPI Intent Generator', 'GST Tax Invoices', 'Pipeline Automation'],
      metrics: '482 bookings synced • 100% payment reconciliation',
      actionLabel: 'Task Rishi: Clinic Triage & Tokens',
      onAction: () => onSelectTask?.('Audit uncontacted clinic inquiries, draft Telugu WhatsApp followups & issue ₹500 token link'),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Specialized AI Employees
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              4 ACTIVE AGENTS
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Dedicated autonomous agents trained for specific domains — from vernacular phone reception to ATS resume tailoring and business ops.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="p-6 rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-xl space-y-4 hover:border-white/15 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${emp.avatarBg} flex items-center justify-center text-white font-bold text-lg shadow-md border border-white/20`}
                  >
                    {emp.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{emp.name}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h3>
                    <div className="text-xs text-zinc-400 font-medium">{emp.role}</div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5 uppercase">
                  {emp.status}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {emp.specialty}
              </p>

              <div className="space-y-2">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Specialized Competencies:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {emp.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-zinc-950/70 border border-white/[0.06] text-zinc-300 text-[11px] font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-3">
              <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                <span>Verified Activity:</span>
                <span className="text-zinc-300">{emp.metrics}</span>
              </div>

              <button
                type="button"
                onClick={emp.onAction}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] border border-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>{emp.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <SaraDialerModal isOpen={dialerOpen} onClose={() => setDialerOpen(false)} />
    </div>
  );
};

