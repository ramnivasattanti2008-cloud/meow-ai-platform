import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const bookings = await db.getBookings();
    return NextResponse.json({ appointments: bookings });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.phone || !body.date) {
      return NextResponse.json({ error: 'Name, phone number, and appointment date are required' }, { status: 400 });
    }

    const newBooking = await db.addBooking({
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: (body.email || '').trim(),
      date: body.date,
      timeSlot: body.timeSlot || '05:30 PM IST',
      sessionType: body.sessionType || 'General Consultation',
      language: body.language || 'telugu',
      status: body.status || 'confirmed',
    });

    return NextResponse.json({ appointment: newBooking }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
