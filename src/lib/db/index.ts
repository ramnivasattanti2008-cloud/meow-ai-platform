import { store } from '@/lib/store';
import { firestore } from './firebase';
import { Agent, Workflow, Campaign, ContactRequest } from '@/lib/types';

export interface BookingRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  sessionType: string;
  language: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  amount: number;
  planTitle: string;
  method: 'upi' | 'card' | 'netbanking';
  payerName: string;
  payerPhone: string;
  payerEmail: string;
  status: 'settled' | 'pending' | 'failed';
  timestamp: string;
}

class UnifiedDatabase {
  private localBookings: BookingRecord[] = [
    {
      id: 'bk-1',
      name: 'Rajesh K.',
      phone: '+91 98480 •••••',
      email: 'rajesh.k@example.com',
      date: 'Tomorrow',
      timeSlot: '5:30 PM IST',
      sessionType: 'Orthopedic Consultation',
      language: 'telugu',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'bk-2',
      name: 'Ananya S.',
      phone: '+91 94401 •••••',
      email: 'ananya.s@example.com',
      date: 'Oct 12, 2026',
      timeSlot: '11:45 AM IST',
      sessionType: 'Technical Discovery',
      language: 'english',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  ];

  private localPayments: PaymentRecord[] = [
    {
      id: 'pay-1',
      transactionId: 'MEOW_PAY_849201',
      amount: 600,
      planTitle: 'Consultation Advance',
      method: 'upi',
      payerName: 'Rajesh K.',
      payerPhone: '+91 98480 •••••',
      payerEmail: 'rajesh.k@example.com',
      status: 'settled',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'pay-2',
      transactionId: 'MEOW_PAY_902144',
      amount: 25000,
      planTitle: 'MEOW Voice Pilot (Sara)',
      method: 'card',
      payerName: 'Apex Health Systems',
      payerPhone: '+91 80 4000 0001',
      payerEmail: 'billing@apexhealth.in',
      status: 'settled',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  /* ---------------- AGENTS ---------------- */
  async getAgents(): Promise<Agent[]> {
    if (firestore.isConfigured()) {
      const docs = await firestore.getDocuments<Agent>('agents');
      if (docs && docs.length > 0) return docs;
    }
    return store.getAgents();
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    if (firestore.isConfigured()) {
      const doc = await firestore.getDocument<Agent>('agents', id);
      if (doc) return doc;
    }
    return store.getAgent(id);
  }

  async addAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent> {
    const saved = store.addAgent(agent);
    if (firestore.isConfigured()) {
      await firestore.setDocument('agents', saved.id, saved);
    }
    return saved;
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | null> {
    const updated = store.updateAgent(id, updates);
    if (updated && firestore.isConfigured()) {
      await firestore.setDocument('agents', id, updated);
    }
    return updated;
  }

  async deleteAgent(id: string): Promise<boolean> {
    const deleted = store.deleteAgent(id);
    if (deleted && firestore.isConfigured()) {
      await firestore.deleteDocument('agents', id);
    }
    return deleted;
  }

  /* ---------------- WORKFLOWS ---------------- */
  async getWorkflows(): Promise<Workflow[]> {
    if (firestore.isConfigured()) {
      const docs = await firestore.getDocuments<Workflow>('workflows');
      if (docs && docs.length > 0) return docs;
    }
    return store.getWorkflows();
  }

  async getWorkflow(id: string): Promise<Workflow | undefined> {
    if (firestore.isConfigured()) {
      const doc = await firestore.getDocument<Workflow>('workflows', id);
      if (doc) return doc;
    }
    return store.getWorkflow(id);
  }

  async addWorkflow(wf: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> {
    const saved = store.addWorkflow(wf);
    if (firestore.isConfigured()) {
      await firestore.setDocument('workflows', saved.id, saved);
    }
    return saved;
  }

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow | null> {
    const updated = store.updateWorkflow(id, updates);
    if (updated && firestore.isConfigured()) {
      await firestore.setDocument('workflows', id, updated);
    }
    return updated;
  }

  async deleteWorkflow(id: string): Promise<boolean> {
    const deleted = store.deleteWorkflow(id);
    if (deleted && firestore.isConfigured()) {
      await firestore.deleteDocument('workflows', id);
    }
    return deleted;
  }

  /* ---------------- CAMPAIGNS ---------------- */
  async getCampaigns(): Promise<Campaign[]> {
    if (firestore.isConfigured()) {
      const docs = await firestore.getDocuments<Campaign>('campaigns');
      if (docs && docs.length > 0) return docs;
    }
    return store.getCampaigns();
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    if (firestore.isConfigured()) {
      const doc = await firestore.getDocument<Campaign>('campaigns', id);
      if (doc) return doc;
    }
    return store.getCampaign(id);
  }

  async addCampaign(c: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    const saved = store.addCampaign(c);
    if (firestore.isConfigured()) {
      await firestore.setDocument('campaigns', saved.id, saved);
    }
    return saved;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const updated = store.updateCampaign(id, updates);
    if (updated && firestore.isConfigured()) {
      await firestore.setDocument('campaigns', id, updated);
    }
    return updated;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    const deleted = store.deleteCampaign(id);
    if (deleted && firestore.isConfigured()) {
      await firestore.deleteDocument('campaigns', id);
    }
    return deleted;
  }

  /* ---------------- CONTACT & LEADS ---------------- */
  async getContactRequests(): Promise<ContactRequest[]> {
    if (firestore.isConfigured()) {
      const docs = await firestore.getDocuments<ContactRequest>('leads');
      if (docs && docs.length > 0) return docs;
    }
    return store.getContactRequests();
  }

  async addContactRequest(req: Omit<ContactRequest, 'id' | 'createdAt'>): Promise<ContactRequest> {
    const saved = store.addContactRequest(req);
    if (firestore.isConfigured()) {
      await firestore.setDocument('leads', saved.id, saved);
    }
    return saved;
  }

  /* ---------------- BOOKINGS ---------------- */
  async getBookings(): Promise<BookingRecord[]> {
    if (firestore.isConfigured()) {
      const docs = await firestore.getDocuments<BookingRecord>('bookings');
      if (docs && docs.length > 0) return docs;
    }
    return this.localBookings;
  }

  async addBooking(booking: Omit<BookingRecord, 'id' | 'createdAt'>): Promise<BookingRecord> {
    const newBooking: BookingRecord = {
      ...booking,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.localBookings.unshift(newBooking);
    if (firestore.isConfigured()) {
      await firestore.setDocument('bookings', newBooking.id, newBooking);
    }
    return newBooking;
  }

  async updateBooking(id: string, updates: Partial<BookingRecord>): Promise<BookingRecord | null> {
    const idx = this.localBookings.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.localBookings[idx] = { ...this.localBookings[idx], ...updates };
    if (firestore.isConfigured()) {
      await firestore.setDocument('bookings', id, this.localBookings[idx]);
    }
    return this.localBookings[idx];
  }

  async deleteBooking(id: string): Promise<boolean> {
    const initialLen = this.localBookings.length;
    this.localBookings = this.localBookings.filter((b) => b.id !== id);
    if (firestore.isConfigured()) {
      await firestore.deleteDocument('bookings', id);
    }
    return this.localBookings.length < initialLen;
  }

  /* ---------------- PAYMENTS ---------------- */
  async getPayments(): Promise<PaymentRecord[]> {
    if (firestore.isConfigured()) {
      const docs = await firestore.getDocuments<PaymentRecord>('payments');
      if (docs && docs.length > 0) return docs;
    }
    return this.localPayments;
  }

  async addPayment(payment: Omit<PaymentRecord, 'id' | 'timestamp'>): Promise<PaymentRecord> {
    const newPayment: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.localPayments.unshift(newPayment);
    if (firestore.isConfigured()) {
      await firestore.setDocument('payments', newPayment.id, newPayment);
    }
    return newPayment;
  }

  /* ---------------- HEALTH & STATS ---------------- */
  async getStats() {
    const [agents, workflows, campaigns, leads, bookings, payments, ping] = await Promise.all([
      this.getAgents(),
      this.getWorkflows(),
      this.getCampaigns(),
      this.getContactRequests(),
      this.getBookings(),
      this.getPayments(),
      firestore.ping(),
    ]);

    return {
      provider: 'Google Cloud Firestore (Firebase)',
      status: ping.connected ? 'healthy' : 'degraded',
      latencyMs: ping.latencyMs,
      projectId: ping.projectId,
      mode: ping.mode,
      collections: {
        agents: agents.length,
        workflows: workflows.length,
        campaigns: campaigns.length,
        leads: leads.length,
        bookings: bookings.length,
        payments: payments.length,
      },
    };
  }
}

export const db = new UnifiedDatabase();

