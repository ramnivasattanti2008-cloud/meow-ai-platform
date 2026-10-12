import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const memories = await db.getMemories();
    return NextResponse.json({ success: true, memories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.key || !body.value) {
      return NextResponse.json(
        { success: false, error: 'Key and value are required.' },
        { status: 400 }
      );
    }

    const newMemory = await db.addMemory({
      key: body.key,
      value: body.value,
      category: body.category || 'preference',
    });

    return NextResponse.json({ success: true, memory: newMemory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

