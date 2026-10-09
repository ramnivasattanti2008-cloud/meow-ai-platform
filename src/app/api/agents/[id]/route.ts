import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const agent = await db.getAgent(params.id);
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }
  return NextResponse.json({ agent });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await db.updateAgent(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    return NextResponse.json({ agent: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = await db.deleteAgent(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Agent deleted successfully' });
}

