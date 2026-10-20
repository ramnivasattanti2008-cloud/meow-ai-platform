'use client';

import React, { useState } from 'react';
import { AgentSwarmStudio } from '@/components/platform/AgentSwarmStudio';
import { WorkflowBuilder } from '@/components/platform/WorkflowBuilder';
import { Bot, Layers } from 'lucide-react';

export const PlatformViewSwitcher: React.FC = () => {
  const [activeView, setActiveView] = useState<'swarm' | 'workflow'>('swarm');

  return (
    <div className="space-y-8">
      {/* Apple Minimalist Segment Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveView('swarm')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeView === 'swarm'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-violet-400" />
            <span>Autonomous Agent Swarm</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('workflow')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
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
        {activeView === 'swarm' ? <AgentSwarmStudio /> : <WorkflowBuilder />}
      </div>
    </div>
  );
};
