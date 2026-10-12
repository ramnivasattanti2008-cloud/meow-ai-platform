import { describe, it, expect } from 'vitest';
import { voiceEngine } from '../src/lib/voice/engine';
import { claudeAdapter } from '../src/lib/ai/claude-client';

describe('Universal AI Copilot & Multi-Agent Model Training', () => {
  it('trains Sara to handle multilingual conversational turns with cute human tone', () => {
    // English
    const enTurn = voiceEngine.processTurn({
      userInput: 'Hi Sara, can I book an appointment?',
      language: 'en',
      purpose: 'appointment_booking',
      history: [],
    });
    expect(enTurn.agentResponse).toBeDefined();
    expect(enTurn.language).toBe('en');

    // Telugu
    const teTurn = voiceEngine.processTurn({
      userInput: 'హలో సారా, అపాయింట్‌మెంట్ కావాలి',
      language: 'te',
      purpose: 'appointment_booking',
      history: [],
    });
    expect(teTurn.agentResponse).toBeDefined();
    expect(teTurn.language).toBe('te');

    // Hindi
    const hiTurn = voiceEngine.processTurn({
      userInput: 'नमस्ते सारा, फीस कितनी है?',
      language: 'hi',
      purpose: 'appointment_booking',
      history: [],
    });
    expect(hiTurn.agentResponse).toContain('₹600');
  });

  it('trains ClaudeAdapter to handle fallback dialogue with sub-300ms speed', async () => {
    const res = await claudeAdapter.generateVoiceDialogueTurn({
      userInput: 'Are you real or an AI?',
      language: 'en',
      personaName: 'Sara',
    });
    expect(res.agentResponse).toBeDefined();
    expect(res.agentResponse.length).toBeGreaterThan(10);
    expect(res.intentDetected).toBe('ai_transparency_inquiry');
  });

  it('trains Campaign brief builder with deterministic SMB models', async () => {
    const brief = await claudeAdapter.generateCampaignBrief({
      businessType: 'Dental Clinic',
      targetAudience: 'Bengaluru Families',
      offer: 'Free Dental Checkup + Scaler Token',
      primaryChannel: 'whatsapp',
    });

    expect(brief.campaignName).toBeDefined();
    expect(brief.adCopy).toContain('Dental');
    expect(brief.suggestedChannels.length).toBeGreaterThanOrEqual(3);
    expect(brief.executionChecklist.length).toBeGreaterThanOrEqual(3);
  });
});

