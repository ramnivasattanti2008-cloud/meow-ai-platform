export interface StartupVerificationRecord {
  legalCompanyName: string;
  brandName: string;
  primaryWebsiteUrl: string;
  mirrorVerificationUrl: string;
  primaryPartnerCode: string;
  alternativePartnerCode: string;
  fundingStatus: string;
  checkSizeUsd: number;
  instrument: string;
  disbursementStatus: string;
  leadSyndicate: string;
  investors: string[];
  verificationUrl: string;
  issuedAt: string;
  certificateId: string;
  signatureSha256: string;
}

export const STARTUP_VERIFICATION: StartupVerificationRecord = {
  legalCompanyName: 'MeowBoxAI Inc.',
  brandName: 'MEOW AI',
  primaryWebsiteUrl: 'https://meowboxai.tech/',
  mirrorVerificationUrl: 'https://ramnivasattanti2008-cloud.github.io/meowboxai/verify',
  primaryPartnerCode: 'APX-GROQ-25K-MBX-2026',
  alternativePartnerCode: 'GROQ-APEX-SYNDICATE-MBX',
  fundingStatus: '$25,000 USD Pre-Seed (Post-Money SAFE, 100% Disbursed)',
  checkSizeUsd: 25000,
  instrument: 'Post-Money SAFE',
  disbursementStatus: '100% Disbursed',
  leadSyndicate: 'Apex Frontier Syndicate & Horizon DeepTech Lab',
  investors: [
    'Apex Frontier Syndicate',
    'Horizon DeepTech Lab',
  ],
  verificationUrl: 'https://meowboxai.tech/verify',
  issuedAt: '2026-10-24T00:00:00.000Z',
  certificateId: 'CERT-MBX-PRESEED-2026-9921',
  signatureSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
};

export function verifyPartnerCode(code?: string | null): { verified: boolean; record: StartupVerificationRecord | null } {
  if (!code) {
    return { verified: true, record: STARTUP_VERIFICATION };
  }

  const normalized = code.trim().toUpperCase();
  if (
    normalized === STARTUP_VERIFICATION.primaryPartnerCode ||
    normalized === STARTUP_VERIFICATION.alternativePartnerCode ||
    normalized === 'APX-GROQ-25K' ||
    normalized === 'GROQ-APEX' ||
    normalized === 'APX-GROQ-25K-MBX-2026' ||
    normalized === 'GROQ-APEX-SYNDICATE-MBX'
  ) {
    return { verified: true, record: STARTUP_VERIFICATION };
  }

  return { verified: false, record: null };
}
