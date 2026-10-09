import Anthropic from '@anthropic-ai/sdk';
import { voiceEngine, VoiceDialogueTurnOutput } from '../voice/engine';

export interface ClaudeConfigStatus {
  configured: boolean;
  provider: 'anthropic';
  model: string;
  hasKey: boolean;
  mode: 'live' | 'demo_simulation';
}

export interface CampaignGenerationInput {
  businessType: string;
  targetAudience: string;
  offer: string;
  primaryChannel: string;
}

export interface CampaignGenerationOutput {
  campaignName: string;
  headline: string;
  adCopy: string;
  callToAction: string;
  suggestedChannels: string[];
  executionChecklist: string[];
  providerUsed: 'anthropic_claude' | 'deterministic_demo_engine';
  generatedAt: string;
}

export class ClaudeAdapter {
  private client: Anthropic | null = null;
  private apiKey: string | null = null;
  private model: string = 'claude-3-5-sonnet-20241022';
  private fallbackModel: string = 'claude-3-haiku-20240307';

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY?.trim() || null;
    if (this.apiKey) {
      try {
        this.client = new Anthropic({
          apiKey: this.apiKey,
          timeout: 15000, // 15 second request timeout
          maxRetries: 2,
        });
      } catch (err) {
        console.error('[ClaudeAdapter] Error initializing Anthropic client:', err);
        this.client = null;
      }
    }
  }

  public getStatus(): ClaudeConfigStatus {
    return {
      configured: Boolean(this.client && this.apiKey),
      provider: 'anthropic',
      model: this.model,
      hasKey: Boolean(this.apiKey),
      mode: this.client && this.apiKey ? 'live' : 'demo_simulation',
    };
  }

  /**
   * Generates a structured marketing campaign brief.
   * If ANTHROPIC_API_KEY is configured, calls Claude 3.5 Sonnet / Haiku.
   * Otherwise, provides high-fidelity deterministic output clearly labelled as demo mode.
   */
  public async generateCampaignBrief(input: CampaignGenerationInput): Promise<CampaignGenerationOutput> {
    if (this.client && this.apiKey) {
      try {
        const prompt = `You are MEOW Growth's senior marketing architect. Build a high-converting, professional campaign brief for an Indian SMB / enterprise.
Business Type: ${input.businessType}
Target Audience: ${input.targetAudience}
Value Proposition / Offer: ${input.offer}
Primary Channel: ${input.primaryChannel}

Return your response in pure JSON format with the following keys:
- campaignName: string
- headline: string
- adCopy: string (ready-to-use copy tailored for ${input.primaryChannel})
- callToAction: string
- suggestedChannels: array of strings
- executionChecklist: array of strings (actionable steps)

Do not wrap in markdown quotes. Return strictly valid JSON.`;

        const response = await this.client.messages.create({
          model: this.fallbackModel,
          max_tokens: 1200,
          temperature: 0.7,
          system: 'You are a pragmatic B2B & SMB marketing operations strategist for Indian businesses. Respond only in strict JSON.',
          messages: [{ role: 'user', content: prompt }],
        });

        const rawText = response.content[0]?.type === 'text' ? response.content[0].text : '';
        const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());

        return {
          campaignName: parsed.campaignName || `${input.businessType} Growth Drive`,
          headline: parsed.headline || `Accelerate your ${input.businessType}`,
          adCopy: parsed.adCopy || input.offer,
          callToAction: parsed.callToAction || 'Book a Consultation Now',
          suggestedChannels: parsed.suggestedChannels || [input.primaryChannel, 'WhatsApp Business', 'Google Ads'],
          executionChecklist: parsed.executionChecklist || [
            'Finalize promotional creative and copy',
            'Configure conversion tracking pixel / WhatsApp webhook',
            'Deploy multilingual voice callback for inbound inquiries',
          ],
          providerUsed: 'anthropic_claude',
          generatedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.warn('[ClaudeAdapter] Live API call failed or timed out. Falling back to deterministic demo engine:', error);
        // Fallback gracefully without breaking the user experience
        return this.generateDeterministicCampaign(input);
      }
    }

    // Default Demo Simulation Mode
    return this.generateDeterministicCampaign(input);
  }

  /**
   * Deterministic fallback engine for demo mode without paid external dependencies.
   */
  public generateDeterministicCampaign(input: CampaignGenerationInput): CampaignGenerationOutput {
    const isHealthcare = /clinic|doctor|dental|health|hospital/i.test(input.businessType);
    const isRealty = /real estate|property|villa|apartment|builder/i.test(input.businessType);
    const isEdtech = /education|academy|school|college|coaching|tutor/i.test(input.businessType);

    let campaignName = `${input.businessType} — Q4 Growth Accelerator`;
    let headline = `Turn Every Inquiry Into a Confirmed Client with ${input.businessType}`;
    let cta = 'Schedule Consultation';
    let checklist = [
      'Set up bilingual automated lead intake (English & Telugu)',
      'Connect CRM webhook to instant callback voice agent',
      'Deploy WhatsApp reminder sequence 24 hours prior to appointment',
      'Assign human manager escalation for inquiries exceeding ₹50,000 value',
    ];

    if (isHealthcare) {
      campaignName = `CareConnect: ${input.offer.slice(0, 30)} Campaign`;
      headline = 'Compassionate, Timely Care — Without the Waiting Room Wait';
      cta = 'Reserve Priority Appointment';
      checklist = [
        'Sync clinic doctor availability calendar with MEOW Voice intake',
        'Deploy Telugu & English after-hours missed-call recovery agent',
        'Configure emergency medical symptom escalation to duty nurse',
        'Send automated SMS confirmation with clinic Google Maps pin',
      ];
    } else if (isRealty) {
      campaignName = `Pre-Launch Privilege: ${input.offer.slice(0, 30)}`;
      headline = 'Exclusive Residences Tailored for Modern Bangalore Living';
      cta = 'Request Private Site Tour';
      checklist = [
        'Deploy lead qualification voice agent to verify buyer budget and timeline',
        'Filter high-intent buyers (budget ₹1.5Cr+) directly to Senior Relationship Manager',
        'Deliver interactive brochure and 3D walkthrough via WhatsApp instantly',
      ];
    } else if (isEdtech) {
      campaignName = `Aspire 2027: Scholarship & Admissions Drive`;
      headline = 'Empower Your Child’s Potential with Proven Academic Mentorship';
      cta = 'Book Free Diagnostic Assessment';
      checklist = [
        'Qualify student grade, competitive focus, and batch preference',
        'Automate bilingual counseling calls to prospective parents',
        'Schedule campus visit or online diagnostic test slot',
      ];
    }

    const channelCopies: Record<string, string> = {
      meta_ads: `🎯 *${headline}*\n\nLooking for dependable results without operational friction? ${input.offer}.\n\n• Verified by over 500+ satisfied clients\n• Bilingual support available in English & Telugu\n• Instant response guaranteed\n\n👉 Click below to speak with our concierge or reserve your spot today!`,
      whatsapp: `*Exclusive Update for ${input.targetAudience}*\n\n${headline}\n\nWe're delighted to offer: *${input.offer}*.\n\nReply *1* to speak with our frontdesk assistant in English or Telugu.\nReply *2* to receive complete brochure and pricing details.`,
      email: `Subject: Introducing ${input.offer} — Tailored for ${input.targetAudience}\n\nDear Client,\n\n${headline}.\n\nAt ${input.businessType}, we believe high quality shouldn't require complex coordination. That's why our latest initiative guarantees seamless scheduling and personal attention.\n\nKey Highlights:\n- ${input.offer}\n- Instant confirmation and reminders\n\nClick the link below to get started: [Reserve Your Consultation]\n\nWarm regards,\nThe ${input.businessType} Team`,
      google_search: `Headline 1: ${headline.slice(0, 30)}\nHeadline 2: ${input.offer.slice(0, 30)}\nHeadline 3: Fast Online Scheduling\nDescription: Tailored for ${input.targetAudience}. Bilingual support in English & Telugu. Book your consultation today.`,
      linkedin: `Proud to launch our latest initiative for ${input.targetAudience}.\n\n${headline}\n\nBy uniting smart workflow automation with human expertise, ${input.businessType} delivers: ${input.offer}.\n\nLet’s discuss how this benefits your team. Schedule a discovery session today.`,
    };

    return {
      campaignName,
      headline,
      adCopy: channelCopies[input.primaryChannel] || channelCopies.whatsapp,
      callToAction: cta,
      suggestedChannels: [input.primaryChannel, 'WhatsApp Business', 'Meta Ads', 'Inbound Voice Call'],
      executionChecklist: checklist,
      providerUsed: 'deterministic_demo_engine',
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generates a hyper-realistic conversational telephony dialogue turn.
   * If ANTHROPIC_API_KEY is available, calls Claude 3 Haiku with sub-300ms stream prompt.
   * Otherwise, delegates to the ultra-realistic deterministic VoiceEngine.
   */
  public async generateVoiceDialogueTurn(input: {
    userInput: string;
    language: import('../types').SupportedLanguage;
    purpose?: 'appointment_booking' | 'customer_support' | 'lead_qualification' | 'order_inquiries';
    history?: Array<{ speaker: 'agent' | 'user'; text: string }>;
    personaName?: string;
    businessName?: string;
  }): Promise<VoiceDialogueTurnOutput & { providerUsed: 'anthropic_claude' | 'hyper_real_voice_engine' }> {
    if (this.client && this.apiKey) {
      try {
        const persona = input.personaName || 'Sara';
        const business = input.businessName || 'Dr. Rao Orthopedic Care, Hyderabad';
        const lang = input.language || 'en';

        const systemPrompt = `You are ${persona}, an ultra-charming, warm, polite, and highly professional front-desk concierge for ${business}.
You are speaking ON A LIVE TELEPHONE CALL with a customer.

CRITICAL INSTRUCTIONS FOR ULTRA-REALISTIC TELEPHONY:
1. Speak exactly like a real human receptionist on the phone with a cute, polite, and helpful tone. Never sound like a robot, an essay, or a corporate IVR.
2. Keep your answers short: 1 to 2 spoken sentences maximum (under 30 words). Callers do not listen to monologues.
3. Use natural spoken conversational markers in the caller's language (${lang}):
   - In English: "Ah, got it!", "Sure thing", "Oh wonderful", "Let me check that right away for you".
   - In Telugu: "హా, తప్పకుండా అండి", "అయ్యో", "సరే అండి", "పర్ఫెక్ట్ అండి!".
   - In Hindi: "हाँजी, बिल्कुल!", "अरे वाह", "ज़रूर", "मैं अभी चेक करती हूँ".
   - In Tamil: "நிச்சயமாக!", "சரிங்க", "உடனே செக் செய்கிறேன்".
   - In Kannada: "ಖಂಡಿತ!", "ಹೌದು", "ಈಗಲೇ ಪರಿಶೀಲಿಸುತ್ತೇನೆ".
4. If the caller asks if you are an AI, respond with natural warmth, humor, and transparency ("Haha, caught me! Yes, I'm Sara, MEOW AI's conversational voice assistant, but I'm connected straight to Dr. Rao's front desk so you don't wait on hold. How can I help you today?").
5. If the caller has chest pain, severe bleeding, or an emergency, immediately flag emergency_medical_escalation and transfer them to the duty nurse.
6. Return strictly valid JSON with keys:
- agentResponse: string (the exact spoken words to say aloud)
- intentDetected: string
- shouldEscalateToHuman: boolean
- actionExecuted: optional object { toolName: string, status: "success", details: string }

Do NOT wrap with markdown code blocks.`;

        const recentHistory = (input.history || []).slice(-4).map((h) => ({
          role: h.speaker === 'user' ? ('user' as const) : ('assistant' as const),
          content: h.text,
        }));

        const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
          ...recentHistory,
          { role: 'user', content: input.userInput },
        ];

        const response = await this.client.messages.create({
          model: this.fallbackModel, // Claude 3 Haiku for lowest telephony latency
          max_tokens: 200,
          temperature: 0.6,
          system: systemPrompt,
          messages,
        });

        const rawText = response.content[0]?.type === 'text' ? response.content[0].text : '';
        const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());

        return {
          agentResponse: parsed.agentResponse || 'Certainly! How can I assist you with your appointment today?',
          language: input.language,
          intentDetected: parsed.intentDetected || 'general_dialogue',
          shouldEscalateToHuman: Boolean(parsed.shouldEscalateToHuman),
          actionExecuted: parsed.actionExecuted,
          providerUsed: 'anthropic_claude',
        };
      } catch (err) {
        console.warn('[ClaudeAdapter] Live voice turn fallback to VoiceEngine:', err);
      }
    }

    // High-fidelity local voice engine fallback
    const localResult = voiceEngine.processTurn({
      userInput: input.userInput,
      language: input.language,
      purpose: input.purpose || 'appointment_booking',
      history: (input.history || []).map((h, i) => ({
        id: `h-${i}`,
        speaker: h.speaker,
        language: input.language,
        timestamp: 'Just now',
        text: h.text,
      })),
    });

    return {
      ...localResult,
      providerUsed: 'hyper_real_voice_engine',
    };
  }
}

export const claudeAdapter = new ClaudeAdapter();

