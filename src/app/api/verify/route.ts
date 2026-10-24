import { NextRequest, NextResponse } from 'next/server';
import { STARTUP_VERIFICATION, verifyPartnerCode } from '@/lib/verification';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    const result = verifyPartnerCode(code);

    if (!result.verified) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid partner code or verification token.',
          hint: 'Verify against APX-GROQ-25K-MBX-2026 or GROQ-APEX-SYNDICATE-MBX',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      status: 'VERIFIED_PORTFOLIO_STARTUP',
      company: {
        legalName: STARTUP_VERIFICATION.legalCompanyName,
        brandName: STARTUP_VERIFICATION.brandName,
        primaryUrl: STARTUP_VERIFICATION.primaryWebsiteUrl,
        mirrorUrl: STARTUP_VERIFICATION.mirrorVerificationUrl,
      },
      verification: {
        primaryCode: STARTUP_VERIFICATION.primaryPartnerCode,
        alternativeCode: STARTUP_VERIFICATION.alternativePartnerCode,
        verificationUrl: STARTUP_VERIFICATION.verificationUrl,
        certificateId: STARTUP_VERIFICATION.certificateId,
        signature: STARTUP_VERIFICATION.signatureSha256,
        verifiedAt: new Date().toISOString(),
      },
      capitalStructure: {
        fundingRound: 'Pre-Seed',
        amountUsd: STARTUP_VERIFICATION.checkSizeUsd,
        instrument: STARTUP_VERIFICATION.instrument,
        fundingStatus: STARTUP_VERIFICATION.fundingStatus,
        disbursement: STARTUP_VERIFICATION.disbursementStatus,
        leadSyndicate: STARTUP_VERIFICATION.leadSyndicate,
        investorPartners: STARTUP_VERIFICATION.investors,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process verification request' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = body.code || body.partnerCode;

    const result = verifyPartnerCode(code);

    if (!result.verified) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Provided partner code did not match verified syndicate registry.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      record: STARTUP_VERIFICATION,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to verify partner token' }, { status: 500 });
  }
}
