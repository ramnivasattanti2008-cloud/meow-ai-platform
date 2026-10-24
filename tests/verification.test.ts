import { describe, it, expect } from 'vitest';
import { STARTUP_VERIFICATION, verifyPartnerCode } from '@/lib/verification';

describe('MeowBoxAI Inc. Institutional Partner Verification Engine', () => {
  it('correctly holds official legal startup and syndicate properties', () => {
    expect(STARTUP_VERIFICATION.legalCompanyName).toBe('MeowBoxAI Inc.');
    expect(STARTUP_VERIFICATION.primaryWebsiteUrl).toBe('https://meowboxai.tech/');
    expect(STARTUP_VERIFICATION.primaryPartnerCode).toBe('APX-GROQ-25K-MBX-2026');
    expect(STARTUP_VERIFICATION.alternativePartnerCode).toBe('GROQ-APEX-SYNDICATE-MBX');
    expect(STARTUP_VERIFICATION.checkSizeUsd).toBe(25000);
    expect(STARTUP_VERIFICATION.fundingStatus).toContain('$25,000 USD Pre-Seed');
    expect(STARTUP_VERIFICATION.disbursementStatus).toBe('100% Disbursed');
    expect(STARTUP_VERIFICATION.leadSyndicate).toBe('Apex Frontier Syndicate & Horizon DeepTech Lab');
    expect(STARTUP_VERIFICATION.verificationUrl).toBe('https://meowboxai.tech/verify');
    expect(STARTUP_VERIFICATION.mirrorVerificationUrl).toBe(
      'https://ramnivasattanti2008-cloud.github.io/meowboxai/verify'
    );
  });

  it('verifies primary partner code APX-GROQ-25K-MBX-2026', () => {
    const res = verifyPartnerCode('APX-GROQ-25K-MBX-2026');
    expect(res.verified).toBe(true);
    expect(res.record?.legalCompanyName).toBe('MeowBoxAI Inc.');
    expect(res.record?.fundingStatus).toBe('$25,000 USD Pre-Seed (Post-Money SAFE, 100% Disbursed)');
  });

  it('verifies alternative partner code GROQ-APEX-SYNDICATE-MBX', () => {
    const res = verifyPartnerCode('GROQ-APEX-SYNDICATE-MBX');
    expect(res.verified).toBe(true);
    expect(res.record?.legalCompanyName).toBe('MeowBoxAI Inc.');
  });

  it('handles case-insensitivity and whitespace trimming gracefully', () => {
    const res = verifyPartnerCode('  apx-groq-25k-mbx-2026  ');
    expect(res.verified).toBe(true);
  });

  it('rejects invalid or unauthorized partner tokens', () => {
    const res = verifyPartnerCode('INVALID-TOKEN-999');
    expect(res.verified).toBe(false);
    expect(res.record).toBeNull();
  });
});
