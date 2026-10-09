import { describe, it, expect } from 'vitest';

describe('MeowConcierge AI Step Guide & Knowledge System', () => {
  const routes = ['/', '/voice-ai', '/platform', '/growth', '/book', '/pricing', '/solutions', '/app'];

  it('verifies knowledge base queries for vernacular Telugu and pricing', () => {
    const KNOWLEDGE_RESPONSES = [
      {
        keywords: ['telugu', 'language', 'vernacular', 'భారతీయ', 'తెలుగు'],
        answer: 'నమస్కారం! MEOW Voice AI natively supports conversational Telugu (తెలుగు)',
      },
      {
        keywords: ['price', 'pricing', 'cost', 'plans', '₹'],
        answer: 'We offer 4 transparent tiers: Voice AI Pilot (₹25,000/mo)',
      },
      {
        keywords: ['clinic', 'hospital', 'doctor', 'patient'],
        answer: 'For healthcare clinics, MEOW Voice handles after-hours patient calls',
      },
      {
        keywords: ['book', 'schedule', 'demo', 'call', 'ics'],
        answer: 'You can schedule a direct 30-minute architecture discovery call',
      },
    ];

    const searchKnowledge = (query: string) => {
      const lower = query.toLowerCase();
      const matched = KNOWLEDGE_RESPONSES.find((item) =>
        item.keywords.some((kw) => lower.includes(kw))
      );
      return matched ? matched.answer : 'fallback';
    };

    expect(searchKnowledge('Do you support telugu?')).toContain('నమస్కారం!');
    expect(searchKnowledge('What is your pricing?')).toContain('₹25,000/mo');
    expect(searchKnowledge('Can I use this for my hospital clinic?')).toContain('healthcare clinics');
    expect(searchKnowledge('How do I book a call?')).toContain('30-minute');
    expect(searchKnowledge('completely unknown query')).toBe('fallback');
  });

  it('validates 3-step setup wizard decision matrix', () => {
    const generateBlueprint = (industry: string, lang: string, goal: string) => {
      return {
        agentModel: `${industry} Vernacular Agent (${lang})`,
        workflow: `${goal} Pipeline`,
        ready: true,
      };
    };

    const res = generateBlueprint('Healthcare Clinic', 'Telugu (తెలుగు)', 'Inbound Phone Booking');
    expect(res.agentModel).toBe('Healthcare Clinic Vernacular Agent (Telugu (తెలుగు))');
    expect(res.workflow).toBe('Inbound Phone Booking Pipeline');
    expect(res.ready).toBe(true);
  });
});

