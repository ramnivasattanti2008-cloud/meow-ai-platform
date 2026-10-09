import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AgentSchema } from '@/lib/validation';

export async function GET() {
  const agents = await db.getAgents();
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = AgentSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid agent configuration', issues: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newAgent = await db.addAgent(parseResult.data);
    return NextResponse.json({ agent: newAgent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}

