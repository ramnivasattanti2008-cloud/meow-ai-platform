import { describe, it, expect } from 'vitest';
import { voiceEngine } from '../src/lib/voice/engine';

describe('VoiceEngine (Multilingual Telugu & English)', () => {
  it('correctly handles Telugu appointment inquiry', () => {
    const result = voiceEngine.processTurn({
      userInput: 'రేపు డాక్టర్ గారిని కలవవచ్చా?',
      language: 'te',
      purpose: 'appointment_booking',
      history: [],
    });

    expect(result.language).toBe('te');
    expect(result.intentDetected).toBe('schedule_appointment_slot_selection');
    expect(result.shouldEscalateToHuman).toBe(false);
    expect(result.agentResponse).toContain('5:30 PM');
  });

  it('correctly handles English appointment slot confirmation', () => {
    const result = voiceEngine.processTurn({
      userInput: 'Yes, 5:30 PM works best for me.',
      language: 'en',
      purpose: 'appointment_booking',
      history: [],
    });

    expect(result.language).toBe('en');
    expect(result.intentDetected).toBe('confirm_appointment');
    expect(result.actionExecuted?.toolName).toBe('lock_calendar_booking');
    expect(result.agentResponse).toContain('confirmed');
  });

  it('immediately triggers human nurse escalation on emergency symptoms (Telugu)', () => {
    const result = voiceEngine.processTurn({
      userInput: 'నాకు చాలా గుండె నొప్పి వస్తోంది అర్జెంట్',
      language: 'te',
      purpose: 'appointment_booking',
      history: [],
    });

    expect(result.shouldEscalateToHuman).toBe(true);
    expect(result.intentDetected).toBe('emergency_medical_escalation');
    expect(result.actionExecuted?.toolName).toBe('transfer_to_duty_supervisor');
    expect(result.agentResponse).toContain('అత్యవసర');
  });

  it('immediately triggers human escalation on emergency symptoms (English)', () => {
    const result = voiceEngine.processTurn({
      userInput: 'Patient is experiencing severe chest pain and cannot breathe',
      language: 'en',
      purpose: 'customer_support',
      history: [],
    });

    expect(result.shouldEscalateToHuman).toBe(true);
    expect(result.intentDetected).toBe('emergency_medical_escalation');
    expect(result.agentResponse).toContain('+91 80 4000 0001');
  });

  it('handles explicit caller request for human operator', () => {
    const result = voiceEngine.processTurn({
      userInput: 'Can I speak to a human manager please?',
      language: 'en',
      purpose: 'customer_support',
      history: [],
    });

    expect(result.shouldEscalateToHuman).toBe(true);
    expect(result.intentDetected).toBe('request_human_handoff');
    expect(result.agentResponse).toContain('automated AI assistant');
  });
});
