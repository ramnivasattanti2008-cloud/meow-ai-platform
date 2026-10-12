export type SupportedLanguage = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'mr' | 'bn'; // Indian English, Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali

export interface Agent {
  id: string;
  name: string;
  purpose: 'appointment_booking' | 'customer_support' | 'lead_qualification' | 'order_inquiries';
  language: SupportedLanguage;
  greeting: string;
  knowledgeInstructions: string;
  escalationRules: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WorkflowStepType =
  | 'trigger_inbound_call'
  | 'trigger_form_submit'
  | 'ai_intent_extraction'
  | 'voice_call_initiation'
  | 'crm_contact_update'
  | 'calendar_slot_reserve'
  | 'human_supervisor_approval'
  | 'sms_whatsapp_notification';

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  title: string;
  description: string;
  config: Record<string, any>;
  order: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStep[];
  status: 'active' | 'draft' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStepExecutionResult {
  stepId: string;
  stepType: WorkflowStepType;
  status: 'pending' | 'running' | 'success' | 'failed' | 'requires_human_approval';
  output: string;
  timestamp: string;
  latencyMs: number;
}

export interface WorkflowRunResult {
  runId: string;
  workflowId: string;
  status: 'completed' | 'halted_at_human_review' | 'failed';
  startedAt: string;
  finishedAt: string;
  stepResults: WorkflowStepExecutionResult[];
}

export interface Campaign {
  id: string;
  name: string;
  businessType: string;
  targetAudience: string;
  offer: string;
  primaryChannel: 'meta_ads' | 'whatsapp' | 'email' | 'google_search' | 'linkedin';
  draftContent: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  company: string;
  website?: string;
  businessType: string;
  serviceOfInterest: 'voice_ai' | 'automation' | 'growth' | 'custom_consulting';
  currentChallenge: string;
  preferredContactMethod: 'email' | 'whatsapp' | 'phone';
  consent: boolean;
  createdAt: string;
}

export interface VoiceTurn {
  id: string;
  speaker: 'user' | 'agent' | 'system';
  text: string;
  language: SupportedLanguage;
  timestamp: string;
  intent?: string;
  toolCall?: {
    toolName: string;
    params: Record<string, any>;
    result?: string;
  };
}

export type ProjectSegment = 'personal' | 'pro' | 'business' | 'enterprise';

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'requires_review' | 'failed';

export interface ProjectStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: StepStatus;
  outputSummary?: string;
  data?: Record<string, any>;
}

export interface ProjectArtifact {
  id: string;
  type: 'resume' | 'proposal' | 'campaign' | 'appointments' | 'task_list' | 'report';
  title: string;
  content: string;
  downloadable?: boolean;
  downloadName?: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  prompt: string;
  segment: ProjectSegment;
  assignedEmployee: {
    name: string;
    role: string;
    avatar: string;
  };
  status: 'planning' | 'in_progress' | 'awaiting_review' | 'completed';
  steps: ProjectStep[];
  artifacts: ProjectArtifact[];
  createdAt: string;
  updatedAt: string;
}

export interface UserMemoryItem {
  id: string;
  key: string;
  value: string;
  category: 'profile' | 'career' | 'business' | 'preference';
  updatedAt: string;
}

export interface CareerResume {
  id: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  summary: string;
  targetRole: string;
  atsScore: number;
  skills: string[];
  experience: {
    role: string;
    company: string;
    duration: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    grade?: string;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

