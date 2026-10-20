import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    const docs = await db.getKnowledgeDocs(agentId);
    return NextResponse.json({ knowledgeDocs: docs });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve knowledge docs' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Extract keywords automatically if none provided
    const keywords: string[] = body.keywords && body.keywords.length > 0
      ? body.keywords
      : body.title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);

    const newDoc = await db.addKnowledgeDoc({
      agentId,
      title: body.title.trim(),
      category: body.category || 'faq',
      content: body.content.trim(),
      keywords,
    });

    return NextResponse.json({ knowledgeDoc: newDoc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create knowledge doc' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    const body = await req.json();
    const query = body.query || '';

    const matches = await db.queryKnowledge(agentId, query);
    return NextResponse.json({ query, matches });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to query knowledge base' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get('docId');

    if (!docId) {
      return NextResponse.json({ error: 'docId is required' }, { status: 400 });
    }

    const success = await db.deleteKnowledgeDoc(docId);
    if (!success) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete knowledge doc' }, { status: 500 });
  }
}
