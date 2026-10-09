import { Agent, Workflow, Campaign, ContactRequest } from './types';

export const initialAgents: Agent[] = [
  {
    id: 'agent-telugu-clinic',
    name: 'Dr. Rao Clinic Frontdesk AI',
    purpose: 'appointment_booking',
    language: 'te',
    greeting: 'నమస్కారం! డాక్టర్ రావు క్లినిక్ సహాయకురాలిని. మీకు ఏ సమయానికి అపాయింట్‌మెంట్ కావాలి? (Namaskaram! Welcome to Dr. Rao Clinic. How can I assist with your appointment?)',
    knowledgeInstructions: 'Handles clinic appointment scheduling for general medicine, cardiology, and pediatrics. Working hours: 9 AM to 7 PM IST, Monday to Saturday. Validates patient name, preferred doctor, and time slot. Escalates emergency medical queries immediately to on-call duty nurse.',
    escalationRules: 'If caller mentions chest pain, severe shortness of breath, acute trauma, or requests emergency care, immediately transfer to emergency duty nurse (+91 80 4000 0001).',
    enabled: true,
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-08T14:30:00.000Z',
  },
  {
    id: 'agent-realty-qualifier',
    name: 'Bengaluru Prime Realty Concierge',
    purpose: 'lead_qualification',
    language: 'en',
    greeting: 'Hello! Thank you for inquiring about Prime Bengaluru properties. Are you looking for a residential apartment or commercial office space?',
    knowledgeInstructions: 'Qualifies prospective buyers and tenants for gated communities in Whitefield, Sarjapur, and Indiranagar. Gathers budget bracket (₹75L - ₹3Cr+), configuration (2BHK, 3BHK, Penthouse), and intended move-in timeline.',
    escalationRules: 'When client has a confirmed budget exceeding ₹2.5 Crore and requests an on-site private viewing within 48 hours, route lead directly to Senior Relationship Manager.',
    enabled: true,
    createdAt: '2026-10-02T10:15:00.000Z',
    updatedAt: '2026-10-07T11:20:00.000Z',
  },
  {
    id: 'agent-edtech-admissions',
    name: 'Apex Academy Admissions Advisor',
    purpose: 'customer_support',
    language: 'en',
    greeting: 'Hi there! Welcome to Apex Academy. Are you inquiring about our JEE/NEET foundation batch or college preparatory coaching?',
    knowledgeInstructions: 'Answers course curriculum details, fee structures, weekend vs weekday batches, scholarship exams, and campus location in Jayanagar, Bengaluru.',
    escalationRules: 'If parent requests fee concessions or custom scholarship consideration, escalate to Admissions Director.',
    enabled: true,
    createdAt: '2026-10-03T11:00:00.000Z',
    updatedAt: '2026-10-06T16:45:00.000Z',
  },
];

export const initialWorkflows: Workflow[] = [
  {
    id: 'wf-inbound-lead-triage',
    name: 'Omnichannel Lead Intake & Voice Verification',
    description: 'Captures website form submissions, extracts caller intent with AI, triggers an instant multilingual voice confirmation, and routes high-intent leads to CRM.',
    trigger: 'Inbound Website Form or WhatsApp Inquiry',
    status: 'active',
    createdAt: '2026-10-02T08:00:00.000Z',
    updatedAt: '2026-10-08T10:00:00.000Z',
    steps: [
      {
        id: 'step-1',
        type: 'trigger_form_submit',
        title: 'Form Submission Trigger',
        description: 'Receives structured inquiry payload (name, phone, interest).',
        config: { source: 'meow_discovery_form', rateLimit: '10_per_min' },
        order: 1,
      },
      {
        id: 'step-2',
        type: 'ai_intent_extraction',
        title: 'Claude AI Intent & Entity Parsing',
        description: 'Extracts service urgency, preferred language (English or Telugu), and budget classification.',
        config: { model: 'claude-3-haiku', timeoutMs: 3000 },
        order: 2,
      },
      {
        id: 'step-3',
        type: 'voice_call_initiation',
        title: 'Multilingual Voice Agent Verification',
        description: 'Places immediate automated call in Telugu or English to confirm appointment requirement.',
        config: { voiceEngine: 'meow_voice_v1', maxDurationSec: 180 },
        order: 3,
      },
      {
        id: 'step-4',
        type: 'human_supervisor_approval',
        title: 'Human Oversight Gate',
        description: 'Halts workflow if user requests custom discount or high-touch enterprise tier before CRM write.',
        config: { thresholdValue: 'enterprise_tier', escalationRole: 'Founder / Operations Lead' },
        order: 4,
      },
      {
        id: 'step-5',
        type: 'crm_contact_update',
        title: 'CRM Record & Booking Synchronization',
        description: 'Writes confirmed booking details into central CRM and Google Calendar.',
        config: { destination: 'HubSpot / Internal Database', deduplicate: true },
        order: 5,
      },
      {
        id: 'step-6',
        type: 'sms_whatsapp_notification',
        title: 'Instant WhatsApp & SMS Confirmation',
        description: 'Dispatches bilingual confirmation with calendar invite and direct support hotline.',
        config: { template: 'appointment_confirmed_bilingual', sender: 'MEOW AI' },
        order: 6,
      },
    ],
  },
  {
    id: 'wf-clinic-missed-call-recovery',
    name: 'Clinic After-Hours Missed Call Recovery',
    description: 'Instantly identifies after-hours patient calls, detects language preference, and dispatches a voice assistant to book consultations.',
    trigger: 'Inbound SIP Missed Call',
    status: 'active',
    createdAt: '2026-10-04T12:00:00.000Z',
    updatedAt: '2026-10-07T15:20:00.000Z',
    steps: [
      {
        id: 'step-10',
        type: 'trigger_inbound_call',
        title: 'Missed Call Event Hook',
        description: 'Captures caller number and timestamp outside 9 AM - 7 PM window.',
        config: { maxLatencyMs: 1500 },
        order: 1,
      },
      {
        id: 'step-11',
        type: 'voice_call_initiation',
        title: 'Telugu/English Outbound Call-Back',
        description: 'Calls back within 60 seconds with Dr. Rao Clinic Frontdesk AI.',
        config: { retryCount: 2, languagePriority: ['te', 'en'] },
        order: 2,
      },
      {
        id: 'step-12',
        type: 'calendar_slot_reserve',
        title: 'Clinic Calendar Slot Lock',
        description: 'Reserves tentative 15-minute consultation slot pending morning staff confirmation.',
        config: { calendar: 'Dr_Rao_General_Medicine', holdDurationHours: 12 },
        order: 3,
      },
    ],
  },
];

export const initialCampaigns: Campaign[] = [
  {
    id: 'camp-dental-festive',
    name: 'Bengaluru Smile Month — Preventive Care Drive',
    businessType: 'Dental & Healthcare Clinic',
    targetAudience: 'Families and working professionals in Whitefield & Bellandur (Ages 25-50)',
    offer: 'Comprehensive Smile Health Checkup + Digital X-Ray at ₹499 (Save 60%)',
    primaryChannel: 'whatsapp',
    draftContent: `*Bengaluru Smile Month at Dr. Rao Dental Clinic* ✨

Has it been more than 6 months since your last dental checkup? Don't wait for a toothache!

🦷 *What's included in your ₹499 Health Pass:*
• Complete Oral Health Examination
• Full Digital X-Ray & Cavity Scan
• 1-on-1 Consultation with Chief Dentist

📍 Location: Whitefield Main Road, Bengaluru
📅 Limited to 30 consultations this week.

Reply *BOOK* to speak with our AI assistant or reserve your preferred evening slot in English or Telugu!`,
    status: 'active',
    createdAt: '2026-10-05T09:30:00.000Z',
    updatedAt: '2026-10-08T16:00:00.000Z',
  },
  {
    id: 'camp-realty-bengaluru',
    name: 'Sarjapur Luxury 3BHK Pre-Launch Awareness',
    businessType: 'Real Estate Developer',
    targetAudience: 'Tech leads and entrepreneurs in Bellandur, Marathahalli, and ORR seeking luxury villas/3BHKs',
    offer: 'Zero Pre-EMI for 12 Months + Guaranteed Modular Kitchen Upgrade for Pre-Launch Registrations',
    primaryChannel: 'meta_ads',
    draftContent: `*Own Your Sanctuary in Sarjapur, Bengaluru.*

Escape the commute without leaving the city. Just 15 minutes from RGA Tech Park.

✨ Exclusive 3 & 4 BHK Garden Villas with 78% Open Greenery.
🔑 Pre-Launch Privileges:
• Zero Pre-EMI payment support for 12 months
• Complimentary designer modular kitchen
• High-speed EV charging bay equipped

Click below to request your private walkthrough dossier. Our concierge voice assistant can arrange site visits on Saturday and Sunday.`,
    status: 'draft',
    createdAt: '2026-10-06T14:00:00.000Z',
    updatedAt: '2026-10-08T12:00:00.000Z',
  },
];

// In-memory runtime store for server-side demo execution
class DataStore {
  private agents: Agent[] = [...initialAgents];
  private workflows: Workflow[] = [...initialWorkflows];
  private campaigns: Campaign[] = [...initialCampaigns];
  private contactRequests: ContactRequest[] = [];

  getAgents(): Agent[] {
    return this.agents;
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.find((a) => a.id === id);
  }

  addAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Agent {
    const newAgent: Agent = {
      ...agent,
      id: `agent-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.agents.unshift(newAgent);
    return newAgent;
  }

  updateAgent(id: string, updates: Partial<Agent>): Agent | null {
    const index = this.agents.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.agents[index] = {
      ...this.agents[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.agents[index];
  }

  deleteAgent(id: string): boolean {
    const initialLen = this.agents.length;
    this.agents = this.agents.filter((a) => a.id !== id);
    return this.agents.length < initialLen;
  }

  getWorkflows(): Workflow[] {
    return this.workflows;
  }

  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.find((w) => w.id === id);
  }

  addWorkflow(wf: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Workflow {
    const newWorkflow: Workflow = {
      ...wf,
      id: `wf-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.workflows.unshift(newWorkflow);
    return newWorkflow;
  }

  updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | null {
    const index = this.workflows.findIndex((w) => w.id === id);
    if (index === -1) return null;
    this.workflows[index] = {
      ...this.workflows[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.workflows[index];
  }

  deleteWorkflow(id: string): boolean {
    const initialLen = this.workflows.length;
    this.workflows = this.workflows.filter((w) => w.id !== id);
    return this.workflows.length < initialLen;
  }

  getCampaigns(): Campaign[] {
    return this.campaigns;
  }

  getCampaign(id: string): Campaign | undefined {
    return this.campaigns.find((c) => c.id === id);
  }

  addCampaign(c: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Campaign {
    const newCamp: Campaign = {
      ...c,
      id: `camp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.campaigns.unshift(newCamp);
    return newCamp;
  }

  updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
    const index = this.campaigns.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.campaigns[index] = {
      ...this.campaigns[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.campaigns[index];
  }

  deleteCampaign(id: string): boolean {
    const initialLen = this.campaigns.length;
    this.campaigns = this.campaigns.filter((c) => c.id !== id);
    return this.campaigns.length < initialLen;
  }

  addContactRequest(req: Omit<ContactRequest, 'id' | 'createdAt'>): ContactRequest {
    const newReq: ContactRequest = {
      ...req,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.contactRequests.unshift(newReq);
    return newReq;
  }

  getContactRequests(): ContactRequest[] {
    return this.contactRequests;
  }
}

// Global singleton for server runtimes
const globalStore = (global as any).__MEOW_STORE__ || new DataStore();
if (process.env.NODE_ENV !== 'production') {
  (global as any).__MEOW_STORE__ = globalStore;
}

export const store = globalStore;
