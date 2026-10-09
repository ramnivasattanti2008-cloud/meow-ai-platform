import { SupportedLanguage, VoiceTurn } from '../types';

export interface VoiceDialogueTurnInput {
  userInput: string;
  language: SupportedLanguage;
  purpose: 'appointment_booking' | 'customer_support' | 'lead_qualification' | 'order_inquiries';
  history: VoiceTurn[];
  persona?: 'clinic_maya' | 'realestate_ananya' | 'support_rishi';
}

export interface VoiceDialogueTurnOutput {
  agentResponse: string;
  language: SupportedLanguage;
  intentDetected: string;
  shouldEscalateToHuman: boolean;
  actionExecuted?: {
    toolName: string;
    status: 'success' | 'pending_confirmation';
    details: string;
  };
}

/**
 * Hyper-Realistic Conversational Voice Dialogue Engine
 * Engineered to deliver natural, human-sounding telephony dialogue in Indian English
 * and vernacular Telugu (తెలుగు) with code-switching, prosodic discourse markers,
 * active listening empathy, and deterministic business safety guardrails.
 */
export class VoiceEngine {
  public processTurn(input: VoiceDialogueTurnInput): VoiceDialogueTurnOutput {
    const raw = input.userInput.trim();
    const text = raw.toLowerCase();
    const isTelugu = input.language === 'te';
    const persona = input.persona || 'clinic_maya';

    // ─────────────────────────────────────────────────────────────
    // 1. EMERGENCY & SEVERE MEDICAL ESCALATION (Strict Patient Safety)
    // ─────────────────────────────────────────────────────────────
    const emergencyKeywords = [
      'emergency',
      'chest pain',
      'bleeding',
      'severe pain',
      'hospitalize',
      'heart attack',
      'unconscious',
      'fracture',
      'accident',
      'cannot breathe',
      'కంగారు',
      'గుండె నొప్పి',
      'ఎమర్జెన్సీ',
      'రక్తం',
      'డాక్టర్ అర్జెంట్',
      'ప్రాణాపాయం',
      'స్పృహ లేదు',
    ];

    if (emergencyKeywords.some((kw) => text.includes(kw))) {
      return {
        agentResponse: isTelugu
          ? 'గమనిక: ఇది అత్యవసర పరిస్థితి కావచ్చు. నేను వెంటనే మిమ్మల్ని మా డ్యూటీ మెడికల్ నర్స్‌కి (+91 80 4000 0001) కనెక్ట్ చేస్తున్నాను. దయచేసి లైన్‌లో ఉండండి.'
          : 'Notice: This appears to be an urgent medical concern. I am transferring your call immediately to our duty medical nurse at +91 80 4000 0001. Please hold the line.',
        language: input.language,
        intentDetected: 'emergency_medical_escalation',
        shouldEscalateToHuman: true,
        actionExecuted: {
          toolName: 'transfer_to_duty_supervisor',
          status: 'success',
          details: 'Transferred caller to human duty staff due to emergency keywords.',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 2. "ARE YOU AN AI?" (Charming, Transparent, Realistic Response)
    // ─────────────────────────────────────────────────────────────
    const aiCheckKeywords = [
      'are you ai',
      'are you an ai',
      'are you a robot',
      'are you real',
      'are you a real person',
      'are you human',
      'bot aa',
      'robot aa',
      'నువ్వు ai',
      'రోబోట్',
      'మనిషివా',
      'ఎవరు మాట్లాడుతున్నారు',
    ];

    if (aiCheckKeywords.some((kw) => text.includes(kw))) {
      return {
        agentResponse: isTelugu
          ? 'హాహా, కనిపెట్టేసారా! అవునండి, నేను MEOW AI వాయిస్ అసిస్టెంట్‌ని. కానీ క్లినిక్ ఫ్రంట్ డెస్క్ సిస్టమ్‌తో డైరెక్ట్‌గా కనెక్ట్ అయి ఉన్నాను, మీరు లైన్‌లో వెయిట్ చేయకుండా వెంటనే బుకింగ్ చేయడానికి హెల్ప్ చేస్తున్నాను. చెప్పండి, డాక్టర్ గారి స్లాట్ చూద్దామా?'
          : "Haha, caught me! Yes, I'm MEOW AI's conversational voice assistant, but I'm connected straight to Dr. Rao's front desk so you don't have to wait on hold. Pretty natural, right? How can I help you with your appointment today?",
        language: input.language,
        intentDetected: 'ai_transparency_inquiry',
        shouldEscalateToHuman: false,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 3. HUMAN REPRESENTATIVE REQUEST
    // ─────────────────────────────────────────────────────────────
    const humanKeywords = [
      'speak to a human',
      'talk to a human',
      'human manager',
      'human agent',
      'human operator',
      'connect to human',
      'real person please',
      'talk to someone',
      'speak to operator',
      'మనిషితో మాట్లాడాలి',
      'ఆఫీసర్ తో మాట్లాడాలి',
      'రిప్రెజెంటేటివ్ కావాలి',
    ];

    if (
      humanKeywords.some((kw) => text.includes(kw)) ||
      (text.includes('human') && !text.includes('are you'))
    ) {
      return {
        agentResponse: isTelugu
          ? 'ఖచ్చితంగా అండి. నేను ఒక AI అసిస్టెంట్‌ని. మిమ్మల్ని మా సీనియర్ క్లినిక్ కోఆర్డినేటర్‌కి కనెక్ట్ చేస్తున్నాను. ఒక్క క్షణం వేచి ఉండండి.'
          : 'Understood. As an automated AI assistant, I am escalating this conversation to our senior coordinator right away. Please hold for just a moment.',
        language: input.language,
        intentDetected: 'request_human_handoff',
        shouldEscalateToHuman: true,
        actionExecuted: {
          toolName: 'route_to_human_queue',
          status: 'success',
          details: 'Caller explicitly requested a human staff member.',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 4. PRICING & CONSULTATION FEE INQUIRY
    // ─────────────────────────────────────────────────────────────
    const priceKeywords = [
      'fees',
      'fee',
      'cost',
      'price',
      'charge',
      'rate',
      'ఫీజు',
      'ఖర్చు',
      'ఎంత అవుతుంది',
      'ఛార్జ్',
    ];

    if (priceKeywords.some((kw) => text.includes(kw))) {
      return {
        agentResponse: isTelugu
          ? 'డాక్టర్ రావు గారి కన్సల్టేషన్ ఫీజు ₹600 అండి, ఇందులో ఫిజికల్ చెకప్ మరియు పాత రిపోర్టుల రివ్యూ ఉంటాయి. రేపు సాయంత్రం 5:30 PM కి స్లాట్ బుక్ చేయమంటారా?'
          : "Dr. Rao's consultation fee is ₹600, which includes a comprehensive physical evaluation and review of any past X-rays or MRI scans. Would you like me to reserve a 5:30 PM slot for tomorrow?",
        language: input.language,
        intentDetected: 'inquire_consultation_fee',
        shouldEscalateToHuman: false,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 5. SYMPTOM EMPATHY & SPECIALIST INQUIRY (Active Listening)
    // ─────────────────────────────────────────────────────────────
    const symptomKeywords = [
      'knee pain',
      'back pain',
      'joint pain',
      'swelling',
      'neck pain',
      'sprain',
      'నొప్పి',
      'మోకాలు',
      'మోకాళ్ళ',
      'వెన్ను నొప్పి',
      'కీళ్ల నొప్పి',
      'వాపు',
    ];

    if (
      symptomKeywords.some((kw) => text.includes(kw)) &&
      !text.includes('confirm') &&
      !text.includes('5:30')
    ) {
      return {
        agentResponse: isTelugu
          ? 'అయ్యో, చాలా ఇబ్బందిగా ఉంటుంది అండి. డాక్టర్ రావు గారు ఆర్థోపెడిక్ మరియు జాయింట్ కేర్‌లో సీనియర్ స్పెషలిస్ట్. రేపు సాయంత్రం 5:30 PM మరియు 6:30 PM స్లాట్‌లు ఖాళీగా ఉన్నాయి. మీకు 5:30 PM అనుకూలంగా ఉంటుందా?'
          : "Oh, I'm so sorry to hear that — joint and knee pain can be really uncomfortable. Dr. Rao is our senior orthopedic surgeon and treats this regularly. He has open consultation slots tomorrow at 5:30 PM and 6:30 PM. Would 5:30 PM suit you best?",
        language: input.language,
        intentDetected: 'schedule_appointment_slot_selection',
        shouldEscalateToHuman: false,
        actionExecuted: {
          toolName: 'query_calendar_availability',
          status: 'success',
          details: 'Queried open slots for orthopedic specialist Dr. Rao.',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 6. APPOINTMENT CONFIRMATION
    // ─────────────────────────────────────────────────────────────
    const confirmationKeywords = [
      '5:30',
      '6:30',
      'yes',
      'yeah',
      'sure',
      'works best',
      'perfect',
      'confirm',
      'lock it',
      'book it',
      'ఓకే',
      'అనుకూలం',
      'కన్ఫర్మ్',
      'సరిపోతుంది',
      'ఖరారు',
      'చేయండి',
    ];

    if (
      confirmationKeywords.some((kw) => text.includes(kw)) &&
      (text.includes('5:30') ||
        text.includes('6:30') ||
        text.includes('yes') ||
        text.includes('ఓకే') ||
        text.includes('confirm') ||
        text.includes('works best') ||
        text.includes('సరిపోతుంది'))
    ) {
      return {
        agentResponse: isTelugu
          ? 'మీ అపాయింట్‌మెంట్ రేపు సాయంత్రం 5:30 PM కి బుక్ చేయబడింది. కన్ఫర్మేషన్ వివరాలు మీ ఫోన్ నంబర్‌కు WhatsApp ద్వారా పంపబడ్డాయి. ధన్యవాదాలు!'
          : 'Your appointment for tomorrow at 5:30 PM is confirmed. A confirmation with the clinic map location has been sent to your WhatsApp. Thank you!',
        language: input.language,
        intentDetected: 'confirm_appointment',
        shouldEscalateToHuman: false,
        actionExecuted: {
          toolName: 'lock_calendar_booking',
          status: 'success',
          details: 'Confirmed slot reservation on clinic calendar.',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 7. GENERAL BOOKING INTENT / DATE SELECTION
    // ─────────────────────────────────────────────────────────────
    const bookingGeneralKeywords = [
      'appointment',
      'book',
      'slot',
      'tomorrow',
      'today',
      'consult',
      'see doctor',
      'visit',
      'అపాయింట్మెంట్',
      'బుక్',
      'సమయం',
      'రేపు',
      'ఈరోజు',
      'కలవవచ్చా',
      'డాక్టర్ గారిని',
    ];

    if (bookingGeneralKeywords.some((kw) => text.includes(kw))) {
      return {
        agentResponse: isTelugu
          ? 'ఖచ్చితంగా అండి! రేపు సాయంత్రం 5:30 PM మరియు 6:30 PM స్లాట్‌లు ఖాళీగా ఉన్నాయి. మీకు 5:30 PM అనుకూలంగా ఉంటుందా?'
          : 'Certainly! For tomorrow, we have slots available at 5:30 PM and 6:30 PM. Would 5:30 PM work best for you?',
        language: input.language,
        intentDetected: 'schedule_appointment_slot_selection',
        shouldEscalateToHuman: false,
        actionExecuted: {
          toolName: 'query_calendar_availability',
          status: 'success',
          details: 'Fetched next open slots for tomorrow.',
        },
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 8. CLINIC LOCATION, ADDRESS & PARKING
    // ─────────────────────────────────────────────────────────────
    const locationKeywords = [
      'location',
      'address',
      'where',
      'directions',
      'parking',
      'reach',
      'అడ్రస్',
      'లొకేషన్',
      'ఎక్కడ',
      'పార్కింగ్',
      'ఎలా రావాలి',
    ];

    if (locationKeywords.some((kw) => text.includes(kw))) {
      return {
        agentResponse: isTelugu
          ? 'మా క్లినిక్ జూబ్లీహిల్స్ రోడ్ నంబర్ 36 లో ఉంది అండి, మెట్రో పిల్లర్ 1420 ఎదురుగా. పేషెంట్ల కోసం వ్యాలెట్ పార్కింగ్ అందుబాటులో ఉంది. మీకు గూగుల్ మ్యాప్స్ లొకేషన్ వాట్సాప్‌కి పంపించమంటారా?'
          : 'We are located on Road Number 36, Jubilee Hills, Hyderabad, directly opposite Metro Pillar 1420. We have dedicated valet parking on-site. Should I ping the exact Google Maps location to your WhatsApp?',
        language: input.language,
        intentDetected: 'inquire_clinic_location',
        shouldEscalateToHuman: false,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 9. CLINIC TIMINGS & OPENING HOURS
    // ─────────────────────────────────────────────────────────────
    if (
      text.includes('hours') ||
      text.includes('timing') ||
      text.includes('open') ||
      text.includes('close') ||
      text.includes('సమయాలు') ||
      text.includes('ఎప్పుడు') ||
      text.includes('వేళలు')
    ) {
      return {
        agentResponse: isTelugu
          ? 'మా క్లినిక్ సోమవారం నుండి శనివారం వరకు ఉదయం 9:00 నుండి రాత్రి 7:00 వరకు తెరిచి ఉంటుంది. ఆదివారం సెలవు.'
          : 'Our clinic operates Monday through Saturday, from 9:00 AM to 7:00 PM IST. We are closed on Sundays.',
        language: input.language,
        intentDetected: 'inquire_business_hours',
        shouldEscalateToHuman: false,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 10. POLITE CLOSING & GRATITUDE
    // ─────────────────────────────────────────────────────────────
    if (
      text.includes('thank') ||
      text.includes('thanks') ||
      text.includes('ధన్యవాదాలు') ||
      text.includes('థాంక్స్')
    ) {
      return {
        agentResponse: isTelugu
          ? 'చాలా థాంక్స్ అండి! రేపు క్లినిక్‌లో కలుద్దాం. ఆరోగ్యాన్ని జాగ్రత్తగా చూసుకోండి!'
          : "You're so welcome! Have a restful day, and we look forward to seeing you at the clinic tomorrow. Take care!",
        language: input.language,
        intentDetected: 'polite_closing',
        shouldEscalateToHuman: false,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 11. REAL ESTATE SPECIFIC INTENTS
    // ─────────────────────────────────────────────────────────────
    if (
      persona === 'realestate_ananya' ||
      text.includes('bhk') ||
      text.includes('budget') ||
      text.includes('flat') ||
      text.includes('villa') ||
      text.includes('site visit')
    ) {
      if (
        text.includes('3 bhk') ||
        text.includes('2 bhk') ||
        text.includes('budget') ||
        text.includes('site visit')
      ) {
        return {
          agentResponse: isTelugu
            ? 'అద్భుతం అండి! ప్రెస్టీజ్ గ్రీన్‌వుడ్స్‌లో 3 BHK ప్రీమియం యూనిట్లు ₹1.85 కోట్ల నుండి ప్రారంభమవుతున్నాయి. ఈ శనివారం ఉదయం 11:00 గంటలకు సైట్ విజిట్ ప్లాన్ చేద్దామా?'
            : 'Wonderful! At Prestige Greenwoods, our 3 BHK luxury residences start at ₹1.85 Crore with lake-facing balconies. Would this Saturday at 11:00 AM work for your private site tour?',
          language: input.language,
          intentDetected: 'realestate_qualify_lead',
          shouldEscalateToHuman: false,
          actionExecuted: {
            toolName: 'log_crm_lead_qualification',
            status: 'success',
            details: 'Recorded budget interest and tentative site visit request.',
          },
        };
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 12. CONTEXTUAL INTELLIGENT DEFAULT
    // ─────────────────────────────────────────────────────────────
    return {
      agentResponse: isTelugu
        ? 'నేను డాక్టర్ రావు క్లినిక్ AI సహాయకురాలిని. నేను మీకు డాక్టర్ అపాయింట్‌మెంట్ బుకింగ్, క్లినిక్ వేళలు లేదా వైద్య పరీక్షల వివరాలలో సహాయం చేయగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?'
        : 'I am the automated AI assistant for Dr. Rao Clinic. I can help you schedule appointments, check consultation timings, or connect you with clinic staff. How may I assist you today?',
      language: input.language,
      intentDetected: 'general_assistance',
      shouldEscalateToHuman: false,
    };
  }
}

export const voiceEngine = new VoiceEngine();
