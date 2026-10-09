import { NextRequest, NextResponse } from 'next/server';
import { CampaignPromptSchema } from '@/lib/validation';
import { claudeAdapter } from '@/lib/ai/claude-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = CampaignPromptSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid campaign generation parameters', issues: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { businessType, targetAudience, offer, primaryChannel, useClaudeApi } = parseResult.data;

    let result;
    if (useClaudeApi) {
      result = await claudeAdapter.generateCampaignBrief({
        businessType,
        targetAudience,
        offer,
        primaryChannel,
      });
    } else {
      result = claudeAdapter.generateDeterministicCampaign({
        businessType,
        targetAudience,
        offer,
        primaryChannel,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API /ai/campaign-draft] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate campaign draft' },
      { status: 500 }
    );
  }
}
