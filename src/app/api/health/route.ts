import { NextResponse } from 'next/server';
import { claudeAdapter } from '@/lib/ai/claude-client';
import { db } from '@/lib/db';

export async function GET() {
  const claudeStatus = claudeAdapter.getStatus();
  const dbStats = await db.getStats();

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
        engine: 'sara_vernacular_v2',
        persona: 'Sara',
        languagesSupported: ['te', 'hi', 'ta', 'kn', 'ml', 'mr', 'bn', 'en'],
        mode: 'low_latency_edge_synthesis',
      },
      database: dbStats,
      storage: {
        type: 'google_cloud_firestore',
        provider: 'Firebase Cloud Firestore & Local Durable Store',
        status: dbStats.status,
        projectId: dbStats.projectId,
        mode: dbStats.mode,
      },
      email: {
        configured: Boolean(process.env.EMAIL_PROVIDER_API_KEY),
        mode: process.env.EMAIL_PROVIDER_API_KEY ? 'live' : 'safe_fallback',
      },
    },
  });
}
