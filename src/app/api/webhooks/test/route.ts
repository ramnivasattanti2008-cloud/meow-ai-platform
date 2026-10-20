import { NextRequest, NextResponse } from 'next/server';
import { dispatchWebhookEvent } from '@/lib/webhooks';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const event = body.event || 'appointment.created';

    const testPayload = {
      test: true,
      simulationMessage: 'Live webhook dispatch test from MEOW AI Command Center',
      sampleBooking: {
        id: `test_bk_${Date.now()}`,
        patientName: 'Arjun Verma (Test Lead)',
        phone: '+91 98480 99999',
        sessionType: 'Comprehensive Health & Orthopedic Checkup',
        timeSlot: 'Tomorrow 5:30 PM IST',
        language: 'te',
        clinic: 'City Care Super Specialty Clinic',
      },
      metadata: {
        source: 'meow_test_engine',
        agent: 'Sara (Front Desk Concierge)',
      },
    };

    const result = await dispatchWebhookEvent(event, testPayload);

    return NextResponse.json({
      success: true,
      message: 'Test event dispatched successfully to registered endpoints',
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to dispatch test webhook event' }, { status: 500 });
  }
}
