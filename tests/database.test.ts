import { describe, it, expect } from 'vitest';
import { toFirestoreFields, fromFirestoreFields, firestore } from '@/lib/db/firebase';
import { db } from '@/lib/db';

describe('Google Cloud Firestore (Firebase) Database Engine', () => {
  it('correctly serializes JavaScript types to Firestore REST representation', () => {
    const rawData = {
      name: 'Sara Voice Concierge',
      age: 24,
      rating: 4.95,
      enabled: true,
      languages: ['te', 'hi', 'en'],
      meta: {
        provider: 'Firebase Firestore',
        active: true,
      },
    };

    const firestoreFields = toFirestoreFields(rawData);

    expect(firestoreFields.name).toEqual({ stringValue: 'Sara Voice Concierge' });
    expect(firestoreFields.age).toEqual({ integerValue: '24' });
    expect(firestoreFields.rating).toEqual({ doubleValue: 4.95 });
    expect(firestoreFields.enabled).toEqual({ booleanValue: true });
    expect(firestoreFields.languages.arrayValue.values).toHaveLength(3);
    expect(firestoreFields.meta.mapValue.fields.provider).toEqual({ stringValue: 'Firebase Firestore' });
  });

  it('correctly deserializes Firestore REST representation back to plain JavaScript objects', () => {
    const firestoreFields = {
      title: { stringValue: 'City Care Orthopedic Center' },
      fee: { integerValue: '600' },
      verified: { booleanValue: true },
      tags: {
        arrayValue: {
          values: [{ stringValue: 'ortho' }, { stringValue: 'telugu' }],
        },
      },
    };

    const decoded = fromFirestoreFields(firestoreFields);

    expect(decoded.title).toBe('City Care Orthopedic Center');
    expect(decoded.fee).toBe(600);
    expect(decoded.verified).toBe(true);
    expect(decoded.tags).toEqual(['ortho', 'telugu']);
  });

  it('provides unified database CRUD operations with zero loss fallback', async () => {
    const agents = await db.getAgents();
    expect(agents.length).toBeGreaterThanOrEqual(1);

    const bookings = await db.getBookings();
    expect(bookings.length).toBeGreaterThanOrEqual(1);

    const payments = await db.getPayments();
    expect(payments.length).toBeGreaterThanOrEqual(1);

    const stats = await db.getStats();
    expect(stats.provider).toContain('Firestore');
    expect(stats.status).toBe('healthy');
    expect(stats.collections.webhooks).toBeGreaterThanOrEqual(1);
    expect(stats.collections.telephonyCalls).toBeGreaterThanOrEqual(1);
  });

  it('manages external webhooks and delivery logs', async () => {
    const webhooks = await db.getWebhooks();
    expect(webhooks.length).toBeGreaterThanOrEqual(1);

    const newWh = await db.addWebhook({
      name: 'Test Webhook Endpoint',
      url: 'https://example.com/test-webhook',
      events: ['appointment.created'],
      enabled: true,
    });
    expect(newWh.id).toBeDefined();

    const logged = await db.logWebhookDelivery({
      webhookId: newWh.id,
      event: 'appointment.created',
      targetUrl: newWh.url,
      status: 'success',
      statusCode: 200,
      payload: { test: true },
      latencyMs: 45,
    });
    expect(logged.status).toBe('success');

    const logs = await db.getWebhookLogs(5);
    expect(logs.length).toBeGreaterThanOrEqual(1);
  });

  it('records and queries inbound telephony calls', async () => {
    const newCall = await db.addTelephonyCall({
      callSid: 'TEST_CALL_123',
      callerNumber: '+91 98480 12345',
      calledNumber: '+91 80 4000 0001',
      provider: 'exotel',
      regionDetected: 'Telangana & AP (Telugu)',
      languageSelected: 'te',
      transcript: 'నమస్కారం! డాక్టర్ అపాయింట్‌మెంట్ కావాలి.',
      intentDetected: 'appointment_booking',
      outcome: 'appointment_booked',
      durationSeconds: 120,
    });
    expect(newCall.id).toBeDefined();

    const calls = await db.getTelephonyCalls(5);
    expect(calls.length).toBeGreaterThanOrEqual(1);
    expect(calls.some((c) => c.callSid === 'TEST_CALL_123')).toBe(true);
  });

  it('manages and semantically queries agent knowledge base documents', async () => {
    const docs = await db.getKnowledgeDocs();
    expect(docs.length).toBeGreaterThanOrEqual(1);

    const newDoc = await db.addKnowledgeDoc({
      agentId: 'agent-telugu-clinic',
      title: 'Sunday Pediatric Clinic Schedule',
      category: 'roster',
      content: 'Dr. Anita Pediatrician is available on Sundays from 10 AM to 1 PM.',
      keywords: ['pediatric', 'sunday', 'children', 'dr anita'],
    });
    expect(newDoc.id).toBeDefined();

    const matches = await db.queryKnowledge('agent-telugu-clinic', 'pediatrician on sunday');
    expect(matches.length).toBeGreaterThanOrEqual(1);
    expect(matches[0].title).toContain('Pediatric');
  });

  it('executes database ping with valid roundtrip latency', async () => {
    const ping = await firestore.ping();
    expect(ping.connected).toBe(true);
    expect(ping.latencyMs).toBeGreaterThanOrEqual(0);
  });
});

