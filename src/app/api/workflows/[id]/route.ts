import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const workflow = await db.getWorkflow(params.id);
  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }
  return NextResponse.json({ workflow });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await db.updateWorkflow(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }
    return NextResponse.json({ workflow: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = await db.deleteWorkflow(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Workflow deleted successfully' });
}

