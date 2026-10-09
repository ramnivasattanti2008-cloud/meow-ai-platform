import { z } from 'zod';

export const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid work email address'),
  company: z.string().min(2, 'Company name is required').max(100),
  website: z.string().url('Please enter a valid URL (e.g. https://example.com)').optional().or(z.literal('')),
  businessType: z.enum([
    'clinic_healthcare',
    'real_estate',
    'ecommerce_retail',
    'education_coaching',
    'professional_services',
    'startup_tech',
    'local_services',
    'other',
  ]),
  serviceOfInterest: z.enum(['voice_ai', 'automation', 'growth', 'custom_consulting']),
  currentChallenge: z
    .string()
    .min(10, 'Please describe your business challenge in at least 10 characters')
    .max(1000),
  preferredContactMethod: z.enum(['email', 'whatsapp', 'phone']),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to MEOW contacting you about your enquiry' }),
  }),
  honeypot: z.string().max(0, 'Spam detected').optional(), // Anti-spam hidden field
});

export type ContactFormData = z.infer<typeof ContactSchema>;

export const AgentSchema = z.object({
  name: z.string().min(2, 'Agent name is required').max(60),
  purpose: z.enum(['appointment_booking', 'customer_support', 'lead_qualification', 'order_inquiries']),
  language: z.enum(['en', 'te']),
  greeting: z.string().min(5, 'Greeting message must be at least 5 characters').max(300),
  knowledgeInstructions: z.string().min(10, 'Knowledge instructions are required').max(2000),
  escalationRules: z.string().min(5, 'Escalation criteria are required').max(1000),
  enabled: z.boolean().default(true),
});

export type AgentFormData = z.infer<typeof AgentSchema>;

export const CampaignPromptSchema = z.object({
  businessType: z.string().min(2, 'Business type is required'),
  targetAudience: z.string().min(3, 'Target audience description is required'),
  offer: z.string().min(5, 'Specific promotional offer or value proposition is required'),
  primaryChannel: z.enum(['meta_ads', 'whatsapp', 'email', 'google_search', 'linkedin']),
  useClaudeApi: z.boolean().optional().default(false),
});

export type CampaignPromptData = z.infer<typeof CampaignPromptSchema>;

export const WorkflowStepSchema = z.object({
  id: z.string(),
  type: z.enum([
    'trigger_inbound_call',
    'trigger_form_submit',
    'ai_intent_extraction',
    'voice_call_initiation',
    'crm_contact_update',
    'calendar_slot_reserve',
    'human_supervisor_approval',
    'sms_whatsapp_notification',
  ]),
  title: z.string().min(2),
  description: z.string(),
  config: z.record(z.any()),
  order: z.number().int().nonnegative(),
});

export const WorkflowSchema = z.object({
  name: z.string().min(2, 'Workflow name is required').max(80),
  description: z.string().max(500),
  trigger: z.string().min(2, 'Trigger description is required'),
  steps: z.array(WorkflowStepSchema).min(1, 'At least one step is required'),
  status: z.enum(['active', 'draft', 'paused']).default('draft'),
});

