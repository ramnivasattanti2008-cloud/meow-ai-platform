import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ProjectRecord } from '@/lib/types';

export async function GET() {
  try {
    const projects = await db.getProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.prompt) {
      return NextResponse.json(
        { success: false, error: 'Title and prompt are required.' },
        { status: 400 }
      );
    }

    const newProject = await db.addProject({
      title: body.title,
      prompt: body.prompt,
      segment: body.segment || 'personal',
      assignedEmployee: body.assignedEmployee || {
        name: 'Alex',
        role: 'Autonomous Action Specialist',
        avatar: 'Alex',
      },
      status: body.status || 'planning',
      steps: body.steps || [],
      artifacts: body.artifacts || [],
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

