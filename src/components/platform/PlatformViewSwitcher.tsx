'use client';

import React, { useState } from 'react';
import { AgentSwarmStudio } from '@/components/platform/AgentSwarmStudio';
import { WorkflowBuilder } from '@/components/platform/WorkflowBuilder';
import { LiveSwarmExecutionVisualizer } from '@/components/platform/LiveSwarmExecutionVisualizer';
import { Bot, Layers, Cpu } from 'lucide-react';

export const PlatformViewSwitcher: React.FC = () => {
  const [activeView, setActiveView] = useState<'swarm' | 'trace' | 'workflow'>('swarm');

  return (
    <div className="space-y-8">
      {/* Apple Minimalist Segment Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl gap-1">
          <button
            type="button"
            onClick={() => setActiveView('swarm')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeView === 'swarm'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-violet-400" />
            <span>Autonomous Swarm Fleet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('trace')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeView === 'trace'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Live Swarm Execution Trace</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('workflow')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeView === 'workflow'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-violet-400" />
            <span>Deterministic Workflow Builder</span>
          </button>
        </div>
      </div>

      {/* Render Active Console */}
      <div className="transition-opacity duration-200">
        {activeView === 'swarm' ? (
          <AgentSwarmStudio />
        ) : activeView === 'trace' ? (
          <LiveSwarmExecutionVisualizer />
        ) : (
          <WorkflowBuilder />
        )}
      </div>
    </div>
  );
};
