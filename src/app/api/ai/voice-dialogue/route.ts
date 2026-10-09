import { NextRequest, NextResponse } from 'next/server';
import { claudeAdapter } from '@/lib/ai/claude-client';
import { SupportedLanguage } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userInput, language, purpose, history, personaName, businessName } = body;

    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json({ error: 'Valid userInput is required' }, { status: 400 });
    }

    const output = await claudeAdapter.generateVoiceDialogueTurn({
      userInput: userInput.trim(),
      language: (language as 'te' | 'en') || 'en',
      purpose: purpose || 'appointment_booking',
      history: history || [],
      personaName: personaName || 'Maya',
      businessName: businessName || 'Dr. Rao Orthopedic Care, Hyderabad',
    });

    return NextResponse.json(output);
  } catch (error) {
    console.error('[VoiceDialogueAPI] Error processing dialogue turn:', error);
    return NextResponse.json({ error: 'Failed to process voice turn' }, { status: 500 });
  }
}
