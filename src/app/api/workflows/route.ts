import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { WorkflowSchema } from '@/lib/validation';

export async function GET() {
  const workflows = await db.getWorkflows();
  return NextResponse.json({ workflows });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = WorkflowSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid workflow configuration', issues: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newWorkflow = await db.addWorkflow(parseResult.data);
    return NextResponse.json({ workflow: newWorkflow }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}

