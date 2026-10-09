import { describe, it, expect } from 'vitest';
import { store } from '../src/lib/store';

describe('DataStore Operations', () => {
  it('loads default agents and allows CRUD', () => {
    const initialCount = store.getAgents().length;
    expect(initialCount).toBeGreaterThan(0);

    const created = store.addAgent({
      name: 'Test Test Agent',
      purpose: 'customer_support',
      language: 'en',
      greeting: 'Hello test greeting',
      knowledgeInstructions: 'Test instructions',
      escalationRules: 'Test rules',
      enabled: true,
    });

    expect(created.id).toBeTruthy();
    expect(store.getAgents().length).toBe(initialCount + 1);

    const updated = store.updateAgent(created.id, { name: 'Renamed Test Agent' });
    expect(updated?.name).toBe('Renamed Test Agent');

    const deleted = store.deleteAgent(created.id);
    expect(deleted).toBe(true);
    expect(store.getAgents().length).toBe(initialCount);
  });

  it('records contact requests safely', () => {
    const lead = store.addContactRequest({
      name: 'Ananya Rao',
      email: 'ananya@example.com',
      company: 'Rao Enterprises',
      businessType: 'startup_tech',
      serviceOfInterest: 'voice_ai',
      currentChallenge: 'Testing lead intake persistence',
      preferredContactMethod: 'whatsapp',
      consent: true,
    });

    expect(lead.id).toContain('lead-');
    expect(store.getContactRequests().some((c: any) => c.id === lead.id)).toBe(true);
  });
});
