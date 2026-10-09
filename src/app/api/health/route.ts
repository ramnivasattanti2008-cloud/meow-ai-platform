import { NextResponse } from 'next/server';
import { claudeAdapter } from '@/lib/ai/claude-client';

export async function GET() {
  const claudeStatus = claudeAdapter.getStatus();

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'meow-ai-platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    providers: {
      ai: {
        provider: 'anthropic_claude',
        configured: claudeStatus.configured,
        mode: claudeStatus.mode,
        model: claudeStatus.model,
      },
      voice: {
        engine: 'meow_vernacular_v1',
        languagesSupported: ['en-IN', 'te-IN'],
        mode: 'browser_and_server_simulation',
      },
      storage: {
        type: 'memory_and_local_store',
        mode: 'demo_persistence',
      },
      email: {
        configured: Boolean(process.env.EMAIL_PROVIDER_API_KEY),
        mode: process.env.EMAIL_PROVIDER_API_KEY ? 'live' : 'safe_fallback',
      },
    },
  });
}

