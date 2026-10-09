import { NextRequest, NextResponse } from 'next/server';
import { voiceEngine } from '@/lib/voice/engine';
import { SupportedLanguage } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userInput, language, purpose, history } = body;

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json({ error: 'Valid userInput is required' }, { status: 400 });
    }

    const output = voiceEngine.processTurn({
      userInput,
      language: (language as SupportedLanguage) || 'en',
      purpose: purpose || 'appointment_booking',
      history: history || [],
    });

    return NextResponse.json(output);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process voice turn' }, { status: 500 });
  }
}

