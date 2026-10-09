import { SupportedLanguage, VoiceTurn } from '../types';

export interface VoiceDialogueTurnInput {
  userInput: string;
  language: SupportedLanguage;
  purpose: 'appointment_booking' | 'customer_support' | 'lead_qualification' | 'order_inquiries';
  history: VoiceTurn[];
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
 * Multilingual Voice Dialogue Engine (English and Telugu)
 * Provides deterministic and contextual dialogue turns with AI disclosure,
 * intent parsing, and safe human-in-the-loop escalation.
 */
export class VoiceEngine {
  public processTurn(input: VoiceDialogueTurnInput): VoiceDialogueTurnOutput {
    const text = input.userInput.toLowerCase().trim();
    const isTelugu = input.language === 'te';

    // 1. Emergency or High-Sensitivity Escalation Check
    const emergencyKeywords = [
      'emergency',
      'chest pain',
      'bleeding',
      'severe pain',
      'hospitalize',
      'కంగారు',
      'గుండె నొప్పి',
      'ఎమర్జెన్సీ',
      'రక్తం',
      'డాక్టర్ అర్జెంట్',
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

    // 2. Human Representative Request
    const humanKeywords = [
      'human',
      'agent',
      'operator',
      'manager',
      'person',
      'మాట్లాడాలి',
      'మనిషితో',
      'ఆఫీసర్',
      'రిప్రెజెంటేటివ్',
    ];

    if (humanKeywords.some((kw) => text.includes(kw))) {
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

    // 3. Appointment Booking Intent
    const bookingKeywords = [
      'appointment',
      'book',
      'slot',
      'tomorrow',
      'today',
      'time',
      'doctor',
      'consult',
      '5:30',
      '6:30',
      'pm',
      'am',
      'confirm',
      'yes',
      'works best',
      'అపాయింట్మెంట్',
      'బుక్',
      'సమయం',
      'రేపు',
      'ఈరోజు',
      'డాక్టర్ గారిని',
      'ఓకే',
      'ఖరారు',
    ];

    if (bookingKeywords.some((kw) => text.includes(kw))) {
      if (text.includes('tomorrow') || text.includes('రేపు')) {
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

      if (text.includes('5:30') || text.includes('yes') || text.includes('ఓకే') || text.includes('అనుకూలం') || text.includes('confirm')) {
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

      return {
        agentResponse: isTelugu
          ? 'డాక్టర్ రావు గారితో అపాయింట్‌మెంట్ తీసుకోవడానికి ఏ రోజు అనుకూలంగా ఉంటుంది? రేపు ఉదయం లేదా సాయంత్రమా?'
          : 'Which day would you prefer for your consultation with Dr. Rao? We have slots open tomorrow morning and evening.',
        language: input.language,
        intentDetected: 'inquire_booking_day',
        shouldEscalateToHuman: false,
      };
    }

    // 4. Timing & Hours Inquiry
    if (text.includes('hours') || text.includes('timing') || text.includes('open') || text.includes('సమయాలు') || text.includes('ఎప్పుడు')) {
      return {
        agentResponse: isTelugu
          ? 'మా క్లినిక్ సోమవారం నుండి శనివారం వరకు ఉదయం 9:00 నుండి రాత్రి 7:00 వరకు తెరిచి ఉంటుంది. ఆదివారం సెలవు.'
          : 'Our clinic operates Monday through Saturday, from 9:00 AM to 7:00 PM IST. We are closed on Sundays.',
        language: input.language,
        intentDetected: 'inquire_business_hours',
        shouldEscalateToHuman: false,
      };
    }

    // 5. Default Contextual Fallback
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
