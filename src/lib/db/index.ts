import { store } from '@/lib/store';
import { firestore } from './firebase';
import { Agent, Workflow, Campaign, ContactRequest, ProjectRecord, UserMemoryItem, CareerResume } from '@/lib/types';

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

  private localProjects: ProjectRecord[] = [
    {
      id: 'proj-1',
      title: 'Summer 2026 AI Internships & ATS Resume Tailoring',
      prompt: 'Help me find internships, organize the application deadlines, and prepare my resume for the best opportunities.',
      segment: 'personal',
      assignedEmployee: {
        name: 'Alex',
        role: 'Career Strategist & Research Copilot',
        avatar: 'Alex',
      },
      status: 'awaiting_review',
      steps: [
        {
          id: 'step-1',
          order: 1,
          title: 'Research Opportunities',
          description: 'Scan verified tech & AI internship openings across Bengaluru and remote hubs.',
          status: 'completed',
          outputSummary: 'Found 4 verified Tier-1 roles: Google Student Researcher, Microsoft Explore AI, Razorpay Tech Intern, Zepto AI Fellow.',
          data: {
            opportunities: [
              { company: 'Google', role: 'Student Researcher (GenAI / Agents)', stipend: '₹1,10,000/mo', deadline: 'Nov 15, 2026', location: 'Bengaluru / Hybrid' },
              { company: 'Microsoft', role: 'Explore Intern (AI & Cloud Platforms)', stipend: '₹1,00,000/mo', deadline: 'Nov 22, 2026', location: 'Hyderabad / Hybrid' },
              { company: 'Razorpay', role: 'Software Engineering Intern (Payments & Core)', stipend: '₹65,000/mo', deadline: 'Nov 28, 2026', location: 'Bengaluru' },
              { company: 'Zepto', role: 'Applied AI & Automation Fellow', stipend: '₹55,000/mo', deadline: 'Dec 05, 2026', location: 'Bengaluru' },
            ],
          },
        },
        {
          id: 'step-2',
          order: 2,
          title: 'Tailor Resume Draft',
          description: 'Extract target role keywords and tailor bullet points using user projects & technical competencies.',
          status: 'completed',
          outputSummary: 'ATS Compatibility Score: 94/100. Emphasized Next.js 14, Web Speech/Web Audio APIs, TypeScript, and Firestore pipelines.',
          data: {
            atsScore: 94,
            keyMatches: ['Next.js', 'TypeScript', 'Web Audio API', 'Firestore', 'Full Stack System Design'],
          },
        },
        {
          id: 'step-3',
          order: 3,
          title: 'Organize Tracker & Deadlines',
          description: 'Assemble an interactive calendar deadline tracker with follow-up milestones.',
          status: 'completed',
          outputSummary: 'Tracker created with 4 priority milestones and WhatsApp deadline notification alerts.',
          data: {
            totalApplications: 4,
            nextDeadline: 'Nov 15, 2026',
          },
        },
        {
          id: 'step-4',
          order: 4,
          title: 'Review and Approve',
          description: 'Verify customized resume draft, target application links, and approve dispatch.',
          status: 'requires_review',
          outputSummary: 'Awaiting your 1-click approval to generate the final high-res printable PDF & export links.',
        },
      ],
      artifacts: [
        {
          id: 'art-1',
          type: 'resume',
          title: 'ATS-Optimized AI Engineer Resume (Print & PDF ready)',
          content: 'Ram Nivas Attanti — Software & AI Systems Engineer. ATS Score: 94/100.',
          downloadable: true,
          downloadName: 'Ram_Nivas_Tailored_AI_Resume.pdf',
        },
        {
          id: 'art-2',
          type: 'task_list',
          title: 'Internship Deadlines & Follow-Up Calendar',
          content: 'Google: Nov 15 | Microsoft: Nov 22 | Razorpay: Nov 28 | Zepto: Dec 05',
          downloadable: true,
          downloadName: 'Internship_Deadlines_2026.csv',
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'proj-2',
      title: 'Clinic Front-Desk Patient Triage & Payment Recovery',
      prompt: 'Audit uncontacted clinic inquiries, draft Telugu WhatsApp followups & issue ₹500 token link',
      segment: 'business',
      assignedEmployee: {
        name: 'Sara & Rishi',
        role: 'Front-Desk Concierge + Ops Engine',
        avatar: 'Sara',
      },
      status: 'completed',
      steps: [
        {
          id: 'step-1',
          order: 1,
          title: 'Audit Inbound Inquiries',
          description: 'Scanned 14 missed calls & unconfirmed inquiries from after-hours window.',
          status: 'completed',
          outputSummary: 'Identified 9 high-intent patient consult requests needing follow-up.',
        },
        {
          id: 'step-2',
          order: 2,
          title: 'Draft Vernacular Messages & Tokens',
          description: 'Generated polite Telugu and English WhatsApp responses with token reservation links.',
          status: 'completed',
          outputSummary: 'Dispatched 9 WhatsApp tokens with instant UPI QR codes.',
        },
        {
          id: 'step-3',
          order: 3,
          title: 'Reconciliation & Invoicing',
          description: 'Sync booked slots into Clinic Calendar and verify token payments.',
          status: 'completed',
          outputSummary: '₹4,500 collected in token fees; 0 calendar double bookings.',
        },
      ],
      artifacts: [
        {
          id: 'art-3',
          type: 'appointments',
          title: 'Reconciled Patient Appointment Register',
          content: '9 patient slots locked with doctor schedule confirmation.',
        },
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  private localMemories: UserMemoryItem[] = [
    {
      id: 'mem-1',
      key: 'User Identity',
      value: 'Ram Nivas Attanti, Founder & AI Systems Engineer, Bengaluru, India.',
      category: 'profile',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mem-2',
      key: 'Target Career Roles',
      value: 'AI Software Engineer, Full Stack Systems Architect, Applied GenAI Fellow.',
      category: 'career',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mem-3',
      key: 'Core Tech Stack',
      value: 'Next.js 14, TypeScript, Tailwind CSS, Firestore, Web Speech/Web Audio API, Node.js.',
      category: 'career',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mem-4',
      key: 'Business Operations Context',
      value: 'MEOW AI: The AI Action Platform. Phone concierge in 8 Indian languages, UPI & GST billing, automated workflows.',
      category: 'business',
      updatedAt: new Date().toISOString(),
    },
  ];

  private localResumes: CareerResume[] = [
    {
      id: 'res-1',
      fullName: 'Ram Nivas Attanti',
      title: 'AI Systems Engineer & Full-Stack Architect',
      email: 'ramnivas@meowboxai.tech',
      phone: '+91 98480 12345',
      location: 'Bengaluru, Karnataka, India',
      linkedin: 'https://linkedin.com/in/ramnivasattanti',
      github: 'https://github.com/ramnivasattanti2008-cloud',
      summary:
        'Product-minded Full-Stack & AI Systems Engineer with proven experience designing real-time voice copilots, deterministic workflow automation engines, and high-concurrency cloud applications. Architect of MEOW AI, combining Web Speech/Web Audio telephony, multi-agent orchestration, and sub-second payment workflows.',
      targetRole: 'AI Software Engineer / Full-Stack Engineer',
      atsScore: 95,
      skills: [
        'TypeScript',
        'Next.js 14 (App Router)',
        'React',
        'Python',
        'Node.js',
        'Web Audio API',
        'Web Speech API',
        'Google Cloud Firestore',
        'REST APIs',
        'Tailwind CSS',
        'Vitest',
        'LLM Orchestration',
        'UPI & GST Billing Systems',
      ],
      experience: [
        {
          role: 'Founding Engineer & Architect',
          company: 'MEOW AI Command Platform',
          duration: '2025 - Present',
          bullets: [
            'Architected "MEOW — One AI for Life and Work", unifying conversational assistants, voice telephony in 8 Indian languages, and automated business workflows into a zero-latency web platform.',
            'Engineered browser-native Web Audio dual-frequency dialer (440Hz/480Hz) and bidirectional Speech Recognition without requiring paid external telephony bridges.',
            'Built unified Firestore REST data layer with fallback resilience, sub-300ms latency, and automated GST-compliant tax invoicing engine.',
            'Achieved 100% test coverage across core engines with Vitest and deterministic state machines.',
          ],
        },
        {
          role: 'AI Application Developer',
          company: 'Autonomous Systems & Cloud',
          duration: '2024 - 2025',
          bullets: [
            'Implemented multi-step deterministic workflow pipelines supporting human-in-the-loop review checkpoints and automated token recoveries.',
            'Built intelligent appointment scheduling systems with calendar clash prevention and WhatsApp dispatch.',
            'Integrated dynamic UPI payment intent generation with instant visual QR codes and automated status tracking.',
          ],
        },
      ],
      education: [
        {
          degree: 'Bachelor of Technology in Computer Science & Engineering',
          institution: 'Premier Institute of Technology, Bengaluru',
          year: '2022 - 2026',
          grade: '9.2 CGPA',
        },
      ],
      projects: [
        {
          name: 'MEOW AI Command Center',
          description: 'All-in-one AI action platform executing instructions into verified outcomes across personal, freelance, and business workflows.',
          technologies: ['Next.js 14', 'TypeScript', 'Tailwind', 'Firestore', 'Web Audio API'],
          link: 'https://meowboxai.tech',
        },
        {
          name: 'Sara Voice Concierge',
          description: 'Vernacular AI phone receptionist handling multilingual patient triage, appointment booking, and emergency escalation.',
          technologies: ['Web Speech API', 'AudioContext', 'React', 'TypeScript'],
          link: 'https://meowboxai.tech/voice-ai',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

  /* ---------------- PROJECTS (GOAL-TO-OUTCOME) ---------------- */
  async getProjects(): Promise<ProjectRecord[]> {
    if (firestore.isConfigured()) {
      const docs = await firestore.getDocuments<ProjectRecord>('projects');
      if (docs && docs.length > 0) return docs;
    }
    return this.localProjects;
  }

  async getProject(id: string): Promise<ProjectRecord | undefined> {
    if (firestore.isConfigured()) {
      const doc = await firestore.getDocument<ProjectRecord>('projects', id);
      if (doc) return doc;
    }
    return this.localProjects.find((p) => p.id === id);
  }

  async addProject(project: Omit<ProjectRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectRecord> {
    const newProj: ProjectRecord = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.localProjects.unshift(newProj);
    if (firestore.isConfigured()) {
      await firestore.setDocument('projects', newProj.id, newProj);
    }
    return newProj;
  }

  async updateProject(id: string, updates: Partial<ProjectRecord>): Promise<ProjectRecord | null> {
    const idx = this.localProjects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.localProjects[idx] = {
      ...this.localProjects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (firestore.isConfigured()) {
      await firestore.setDocument('projects', id, this.localProjects[idx]);
    }
    return this.localProjects[idx];
  }

  async deleteProject(id: string): Promise<boolean> {
    const initialLen = this.localProjects.length;
    this.localProjects = this.localProjects.filter((p) => p.id !== id);
    if (firestore.isConfigured()) {
      await firestore.deleteDocument('projects', id);
    }
    return this.localProjects.length < initialLen;
  }

  /* ---------------- USER MEMORY VAULT ---------------- */
  async getMemories(): Promise<UserMemoryItem[]> {
    if (firestore.isConfigured()) {
      const docs = await firestore.getDocuments<UserMemoryItem>('memories');
      if (docs && docs.length > 0) return docs;
    }
    return this.localMemories;
  }

  async addMemory(mem: Omit<UserMemoryItem, 'id' | 'updatedAt'>): Promise<UserMemoryItem> {
    const newMem: UserMemoryItem = {
      ...mem,
      id: `mem-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    this.localMemories.unshift(newMem);
    if (firestore.isConfigured()) {
      await firestore.setDocument('memories', newMem.id, newMem);
    }
    return newMem;
  }

  async updateMemory(id: string, updates: Partial<UserMemoryItem>): Promise<UserMemoryItem | null> {
    const idx = this.localMemories.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.localMemories[idx] = {
      ...this.localMemories[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (firestore.isConfigured()) {
      await firestore.setDocument('memories', id, this.localMemories[idx]);
    }
    return this.localMemories[idx];
  }

  async deleteMemory(id: string): Promise<boolean> {
    const initialLen = this.localMemories.length;
    this.localMemories = this.localMemories.filter((m) => m.id !== id);
    if (firestore.isConfigured()) {
      await firestore.deleteDocument('memories', id);
    }
    return this.localMemories.length < initialLen;
  }

  /* ---------------- RESUMES & CAREER ---------------- */
  async getResumes(): Promise<CareerResume[]> {
    if (firestore.isConfigured()) {
      const docs = await firestore.getDocuments<CareerResume>('resumes');
      if (docs && docs.length > 0) return docs;
    }
    return this.localResumes;
  }

  async getResume(id: string): Promise<CareerResume | undefined> {
    if (firestore.isConfigured()) {
      const doc = await firestore.getDocument<CareerResume>('resumes', id);
      if (doc) return doc;
    }
    return this.localResumes.find((r) => r.id === id);
  }

  async addResume(resume: Omit<CareerResume, 'id' | 'createdAt' | 'updatedAt'>): Promise<CareerResume> {
    const newResume: CareerResume = {
      ...resume,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.localResumes.unshift(newResume);
    if (firestore.isConfigured()) {
      await firestore.setDocument('resumes', newResume.id, newResume);
    }
    return newResume;
  }

  async updateResume(id: string, updates: Partial<CareerResume>): Promise<CareerResume | null> {
    const idx = this.localResumes.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.localResumes[idx] = {
      ...this.localResumes[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (firestore.isConfigured()) {
      await firestore.setDocument('resumes', id, this.localResumes[idx]);
    }
    return this.localResumes[idx];
  }

  /* ---------------- HEALTH & STATS ---------------- */
  async getStats() {
    const [agents, workflows, campaigns, leads, bookings, payments, projects, memories, resumes, ping] = await Promise.all([
      this.getAgents(),
      this.getWorkflows(),
      this.getCampaigns(),
      this.getContactRequests(),
      this.getBookings(),
      this.getPayments(),
      this.getProjects(),
      this.getMemories(),
      this.getResumes(),
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
        projects: projects.length,
        memories: memories.length,
        resumes: resumes.length,
      },
    };
  }
}

export const db = new UnifiedDatabase();

