import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { workflowExecutionEngine } from '@/lib/workflow/engine';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const workflow = store.getWorkflow(params.id);
  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
  }

  const validation = workflowExecutionEngine.validate(workflow);
  if (!validation.valid) {
    return NextResponse.json(
      { error: 'Workflow validation failed before execution', issues: validation.errors },
      { status: 400 }
    );
  }

  const runResult = await workflowExecutionEngine.execute(workflow, false);
  return NextResponse.json({ run: runResult });
}
