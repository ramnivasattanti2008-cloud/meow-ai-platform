import { describe, it, expect } from 'vitest';
import {
  ContactSchema,
  AgentSchema,
  CampaignPromptSchema,
  WorkflowSchema,
} from '../src/lib/validation';

describe('Validation Schemas', () => {
  describe('ContactSchema', () => {
    it('accepts valid contact submission with consent', () => {
      const validData = {
        name: 'Dr. Suresh Reddy',
        email: 'suresh@apexclinic.com',
        company: 'Apex Health Clinic',
        website: 'https://apexclinic.com',
        businessType: 'clinic_healthcare',
        serviceOfInterest: 'voice_ai',
        currentChallenge: 'We miss 25 patient calls every evening and need automated Telugu and English booking.',
        preferredContactMethod: 'email',
        consent: true,
      };

      const result = ContactSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects contact submission when consent is false', () => {
      const invalidData = {
        name: 'Dr. Suresh Reddy',
        email: 'suresh@apexclinic.com',
        company: 'Apex Health Clinic',
        businessType: 'clinic_healthcare',
        serviceOfInterest: 'voice_ai',
        currentChallenge: 'Short enquiry',
        preferredContactMethod: 'email',
        consent: false,
      };

      const result = ContactSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects honeypot bot submissions', () => {
      const botData = {
        name: 'Spam Bot',
        email: 'spam@bot.com',
        company: 'Spam Corp',
        businessType: 'other',
        serviceOfInterest: 'automation',
        currentChallenge: 'Buy cheap watches online now!',
        preferredContactMethod: 'email',
        consent: true,
        honeypot: 'http://spam.link',
      };

      const result = ContactSchema.safeParse(botData);
      expect(result.success).toBe(false);
    });
  });

  describe('AgentSchema', () => {
    it('validates a correct Telugu appointment agent', () => {
      const agentData = {
        name: 'Dr. Rao Clinic Frontdesk AI',
        purpose: 'appointment_booking',
        language: 'te',
        greeting: 'నమస్కారం! డాక్టర్ రావు క్లినిక్ సహాయకురాలిని.',
        knowledgeInstructions: 'Handles clinic appointment scheduling for general medicine.',
        escalationRules: 'If caller reports chest pain, route to emergency nurse.',
        enabled: true,
      };

      const result = AgentSchema.safeParse(agentData);
      expect(result.success).toBe(true);
    });

    it('rejects agent with greeting shorter than 5 chars', () => {
      const agentData = {
        name: 'Bot',
        purpose: 'customer_support',
        language: 'en',
        greeting: 'Hi',
        knowledgeInstructions: 'Handles questions.',
        escalationRules: 'Route to supervisor.',
        enabled: true,
      };

      const result = AgentSchema.safeParse(agentData);
      expect(result.success).toBe(false);
    });
  });

  describe('CampaignPromptSchema', () => {
    it('validates a proper campaign brief request', () => {
      const promptData = {
        businessType: 'Dental Clinic',
        targetAudience: 'Families in Whitefield',
        offer: 'Complete oral checkup at 499 INR',
        primaryChannel: 'whatsapp',
      };

      const result = CampaignPromptSchema.safeParse(promptData);
      expect(result.success).toBe(true);
    });
  });
});

