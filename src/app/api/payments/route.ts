import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dispatchWebhookEvent } from '@/lib/webhooks';

export async function GET() {
  try {
    const payments = await db.getPayments();
    return NextResponse.json({ payments });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.amount || !body.payerName) {
      return NextResponse.json({ error: 'Amount and payerName are required' }, { status: 400 });
    }

    const transactionId = body.transactionId || `MEOW_PAY_${Math.floor(100000 + Math.random() * 900000)}`;

    const newPayment = await db.addPayment({
      transactionId,
      amount: Number(body.amount),
      planTitle: body.planTitle || 'Consultation / Service Invoice',
      method: body.method || 'upi',
      payerName: body.payerName.trim(),
      payerPhone: body.payerPhone || '+91 98480 •••••',
      payerEmail: body.payerEmail || 'billing@meowai.tech',
      status: body.status || 'settled',
    });

    // Fire asynchronous webhook dispatch (Accounting / CRM / WhatsApp Receipt)
    dispatchWebhookEvent('payment.settled', {
      transactionId: newPayment.transactionId,
      amount: newPayment.amount,
      planTitle: newPayment.planTitle,
      method: newPayment.method,
      payerName: newPayment.payerName,
      payerPhone: newPayment.payerPhone,
      payerEmail: newPayment.payerEmail,
      status: newPayment.status,
    }).catch((e) => console.error('Payment webhook trigger error:', e));

    return NextResponse.json({ payment: newPayment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}
