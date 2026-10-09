import { describe, it, expect } from 'vitest';
import { claudeAdapter } from '../src/lib/ai/claude-client';

describe('ClaudeAdapter & Simulation Engine', () => {
  it('correctly reports configuration status without leaking keys', () => {
    const status = claudeAdapter.getStatus();
    expect(status.provider).toBe('anthropic');
    expect(typeof status.configured).toBe('boolean');
    expect(['live', 'demo_simulation']).toContain(status.mode);
  });

  it('generates high-fidelity deterministic campaign for healthcare clinic', () => {
    const output = claudeAdapter.generateDeterministicCampaign({
      businessType: 'Dental Clinic',
      targetAudience: 'Families in Whitefield',
      offer: 'Oral Health Examination at 499 INR',
      primaryChannel: 'whatsapp',
    });

    expect(output.campaignName).toContain('CareConnect');
    expect(output.headline).toBeTruthy();
    expect(output.callToAction).toContain('Appointment');
    expect(output.suggestedChannels).toContain('WhatsApp Business');
    expect(output.providerUsed).toBe('deterministic_demo_engine');
    expect(output.executionChecklist.length).toBeGreaterThanOrEqual(3);
  });

  it('generates tailored campaign copy for real estate builder', () => {
    const output = claudeAdapter.generateDeterministicCampaign({
      businessType: 'Real Estate Developer',
      targetAudience: 'Tech leads in Bellandur seeking luxury 3BHK villas',
      offer: 'Zero Pre-EMI for 12 months',
      primaryChannel: 'meta_ads',
    });

    expect(output.campaignName).toContain('Pre-Launch Privilege');
    expect(output.callToAction).toContain('Site Tour');
    expect(output.adCopy).toContain('Zero Pre-EMI');
  });
});
