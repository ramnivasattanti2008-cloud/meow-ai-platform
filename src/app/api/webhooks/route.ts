import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { WebhookEventType } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeLogs = searchParams.get('logs') === 'true';

    const webhooks = await db.getWebhooks();
    const logs = includeLogs ? await db.getWebhookLogs(20) : [];

    return NextResponse.json({ webhooks, logs });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.url || !body.name) {
      return NextResponse.json({ error: 'URL and Name are required' }, { status: 400 });
    }

    // Default to all events if none provided
    const events: WebhookEventType[] = body.events && body.events.length > 0
      ? body.events
      : ['appointment.created', 'payment.settled', 'lead.qualified', 'call.completed'];

    const newWebhook = await db.addWebhook({
      name: body.name.trim(),
      url: body.url.trim(),
      secret: body.secret?.trim() || `whsec_${Math.random().toString(36).substring(2, 10)}`,
      events,
      enabled: body.enabled !== false,
    });

    return NextResponse.json({ webhook: newWebhook }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 });
    }

    const updated = await db.updateWebhook(body.id, {
      name: body.name,
      url: body.url,
      secret: body.secret,
      events: body.events,
      enabled: body.enabled,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json({ webhook: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update webhook' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 });
    }

    const success = await db.deleteWebhook(id);
    if (!success) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 });
  }
}
