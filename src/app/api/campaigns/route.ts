import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const campaigns = await db.getCampaigns();
  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.offer) {
      return NextResponse.json({ error: 'Campaign name and offer are required' }, { status: 400 });
    }

    const newCampaign = await db.addCampaign({
      name: body.name,
      businessType: body.businessType || 'General SMB',
      targetAudience: body.targetAudience || 'Target Audience',
      offer: body.offer,
      primaryChannel: body.primaryChannel || 'whatsapp',
      draftContent: body.draftContent || body.offer,
      status: body.status || 'draft',
    });

    return NextResponse.json({ campaign: newCampaign }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

