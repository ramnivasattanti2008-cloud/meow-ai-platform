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
      title: { stringValue: 'Dr. Rao Orthopedic Care' },
      fee: { integerValue: '600' },
      verified: { booleanValue: true },
      tags: {
        arrayValue: {
          values: [{ stringValue: 'ortho' }, { stringValue: 'telugu' }],
        },
      },
    };

    const decoded = fromFirestoreFields(firestoreFields);

    expect(decoded.title).toBe('Dr. Rao Orthopedic Care');
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
  });

  it('executes database ping with valid roundtrip latency', async () => {
    const ping = await firestore.ping();
    expect(ping.connected).toBe(true);
    expect(ping.latencyMs).toBeGreaterThanOrEqual(0);
  });
});
