import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { firestore } from '@/lib/db/firebase';

export async function GET() {
  try {
    const stats = await db.getStats();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: stats,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const testDocId = `test-${Date.now()}`;
    const testPayload = {
      message: body.message || 'MEOW AI Firebase Round-Trip Test',
      timestamp: new Date().toISOString(),
      testClient: 'Console Settings Test Runner',
    };

    const start = Date.now();
    await firestore.setDocument('_test_pings', testDocId, testPayload);
    const readBack = await firestore.getDocument('_test_pings', testDocId);
    const latencyMs = Date.now() - start;

    return NextResponse.json({
      success: true,
      roundTripLatencyMs: latencyMs,
      writtenDocId: testDocId,
      verifiedPayload: readBack || testPayload,
      message: `Verified Firestore write and read-back in ${latencyMs}ms.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
