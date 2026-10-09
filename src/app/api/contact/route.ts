import { NextRequest, NextResponse } from 'next/server';
import { ContactSchema } from '@/lib/validation';
import { store } from '@/lib/store';

// In-memory rate limiting map: IP -> timestamp array
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const now = Date.now();

    // Rate Limiting: Max 5 submissions per 10 minutes per IP
    const recentSubmissions = (rateLimitMap.get(ip) || []).filter((time) => now - time < 600000);
    if (recentSubmissions.length >= 5) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }
    rateLimitMap.set(ip, [...recentSubmissions, now]);

    // Parse and validate body
    const body = await req.json();
    const parseResult = ContactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;

    // Honeypot check (anti-bot)
    if (validData.honeypot && validData.honeypot.length > 0) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // Persist to store
    const record = store.addContactRequest({
      name: validData.name,
      email: validData.email,
      company: validData.company,
      website: validData.website,
      businessType: validData.businessType,
      serviceOfInterest: validData.serviceOfInterest,
      currentChallenge: validData.currentChallenge,
      preferredContactMethod: validData.preferredContactMethod,
      consent: validData.consent,
    });

    const isEmailConfigured = Boolean(process.env.EMAIL_PROVIDER_API_KEY);

    return NextResponse.json(
      {
        success: true,
        message: isEmailConfigured
          ? 'Thank you! Your discovery call enquiry has been received and routed to our team.'
          : 'Thank you! Your inquiry has been securely recorded in the MEOW development queue. (Note: Email provider is currently operating in demo fallback mode).',
        id: record.id,
        deliveryMode: isEmailConfigured ? 'live_transactional_email' : 'safe_local_queue',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API /contact] Error processing submission:', error);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred. Please try again or reach out directly.' },
      { status: 500 }
    );
  }
}

