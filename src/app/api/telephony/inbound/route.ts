import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SupportedLanguage } from '@/lib/types';
import { dispatchWebhookEvent } from '@/lib/webhooks';

interface RegionMapping {
  region: string;
  language: SupportedLanguage;
  greeting: string;
}

const REGION_ROUTING: Record<string, RegionMapping> = {
  // Andhra & Telangana Mobile & STD (Hyderabad, Vijayawada, Vizag)
  '40': {
    region: 'Telangana - Hyderabad (Telugu)',
    language: 'te',
    greeting: 'నమస్కారం! సిటీ కేర్ క్లినిక్ కు స్వాగతం. నా పేరు సారా. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ కావాలా?',
  },
  '9848': {
    region: 'Telangana & AP Mobile (Telugu)',
    language: 'te',
    greeting: 'నమస్కారం! సిటీ కేర్ క్లినిక్ కు స్వాగతం. నా పేరు సారా. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ కావాలా?',
  },
  '9849': {
    region: 'Telangana & AP Mobile (Telugu)',
    language: 'te',
    greeting: 'నమస్కారం! సిటీ కేర్ క్లినిక్ కు స్వాగతం. నా పేరు సారా. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ కావాలా?',
  },
  '9440': {
    region: 'Andhra & Telangana Mobile (Telugu)',
    language: 'te',
    greeting: 'నమస్కారం! సిటీ కేర్ క్లినిక్ కు స్వాగతం. నా పేరు సారా. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ కావాలా?',
  },
  '866': {
    region: 'Andhra Pradesh - Vijayawada (Telugu)',
    language: 'te',
    greeting: 'నమస్కారం! సిటీ కేర్ క్లినిక్ కు స్వాగతం. నా పేరు సారా. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ కావాలా?',
  },
  '891': {
    region: 'Andhra Pradesh - Vizag (Telugu)',
    language: 'te',
    greeting: 'నమస్కారం! సిటీ కేర్ క్లినిక్ కు స్వాగతం. నా పేరు సారా. చెప్పండి, డాక్టర్ గారి అపాయింట్‌మెంట్ కావాలా?',
  },
  // Karnataka (Bengaluru & Districts)
  '80': {
    region: 'Karnataka - Bengaluru (Kannada)',
    language: 'kn',
    greeting: 'ನಮಸ್ಕಾರ! ಸಿಟಿ ಕೇರ್ ಕ್ಲಿನಿಕ್‌ಗೆ ಸ್ವಾಗತ. ನಾನು ಸಾರಾ, ಫ್ರಂಟ್ ಡೆಸ್ಕ್‌ನಿಂದ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. ಹೇಳಿ, ನಿಮಗೆ ಡಾಕ್ಟರ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬೇಕಾ?',
  },
  '9844': {
    region: 'Karnataka Mobile (Kannada)',
    language: 'kn',
    greeting: 'ನಮಸ್ಕಾರ! ಸಿಟಿ ಕೇರ್ ಕ್ಲಿನಿಕ್‌ಗೆ ಸ್ವಾಗತ. ನಾನು ಸಾರಾ, ಫ್ರಂಟ್ ಡೆಸ್ಕ್‌ನಿಂದ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. ಹೇಳಿ, ನಿಮಗೆ ಡಾಕ್ಟರ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬೇಕಾ?',
  },
  '9845': {
    region: 'Karnataka Mobile (Kannada)',
    language: 'kn',
    greeting: 'ನಮಸ್ಕಾರ! ಸಿಟಿ ಕೇರ್ ಕ್ಲಿನಿಕ್‌ಗೆ ಸ್ವಾಗತ. ನಾನು ಸಾರಾ, ಫ್ರಂಟ್ ಡೆಸ್ಕ್‌ನಿಂದ ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ. ಹೇಳಿ, ನಿಮಗೆ ಡಾಕ್ಟರ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬೇಕಾ?',
  },
  // Maharashtra (Mumbai, Pune)
  '22': {
    region: 'Maharashtra - Mumbai (Marathi/Hindi)',
    language: 'mr',
    greeting: 'नमस्कार! सिटी केअर क्लिनिकमध्ये आपले स्वागत आहे. मी सारा बोलतेय. सांगा, आपल्याला डॉक्टरांची अपॉइंटमेंट हवी आहे का?',
  },
  '9820': {
    region: 'Mumbai Mobile (Marathi/Hindi)',
    language: 'mr',
    greeting: 'नमस्कार! सिटी केअर क्लिनिकमध्ये आपले स्वागत आहे. मी सारा बोलतेय. सांगा, आपल्याला डॉक्टरांची अपॉइंटमेंट हवी आहे का?',
  },
  // Tamil Nadu (Chennai)
  '44': {
    region: 'Tamil Nadu - Chennai (Tamil)',
    language: 'ta',
    greeting: 'வணக்கம்! சிட்டி கேர் கிளினிக்கிற்கு வரவேற்கிறோம். நான் சారా. உங்களுக்கு டாக்டரின் அப்பாயிண்ட்மென்ட் தேவையா?',
  },
  '9840': {
    region: 'Tamil Nadu Mobile (Tamil)',
    language: 'ta',
    greeting: 'வணக்கம்! சிட்டி கேர் கிளினிக்கிற்கு வரவேற்கிறோம். நான் சారా. உங்களுக்கு டாக்டரின் அப்பாயிண்ட்மென்ட் தேவையா?',
  },
  // Delhi NCR
  '11': {
    region: 'Delhi NCR (Hindi)',
    language: 'hi',
    greeting: 'नमस्ते जी! सिटी केयर क्लिनिक में आपका स्वागत है। मैं सारा बोल रही हूँ। बताइए, क्या आपको डॉक्टर से मिलना है?',
  },
  '9810': {
    region: 'Delhi NCR Mobile (Hindi)',
    language: 'hi',
    greeting: 'नमस्ते जी! सिटी केयर क्लिनिक में आपका स्वागत है। मैं सारा बोल रही हूँ। बताइए, क्या आपको डॉक्टर से मिलना है?',
  },
};

function resolveRegionAndLanguage(phoneNumber: string): RegionMapping {
  const clean = phoneNumber.replace(/\D/g, '');
  const national = clean.startsWith('91') && clean.length > 10 ? clean.slice(2) : clean;

  for (const [prefix, mapping] of Object.entries(REGION_ROUTING)) {
    if (national.startsWith(prefix) || clean.startsWith(prefix)) {
      return mapping;
    }
  }

  // Fallback to Indian English
  return {
    region: 'All-India National Line (English)',
    language: 'en',
    greeting: 'Welcome to City Care Clinic front desk. My name is Sara. Are you looking to schedule a consultation with the doctor?',
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const calls = await db.getTelephonyCalls(25);
    return NextResponse.json({
      service: 'MEOW-Telephony-SIP-Gateway',
      status: 'active',
      inboundWebhookUrl: 'https://meowboxai.tech/api/telephony/inbound',
      supportedCarriers: ['Exotel', 'Twilio', 'Tata Tele Business', 'TeleCMO', 'Generic SIP Trunk'],
      recentCalls: calls,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve telephony data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let callerNumber = '+91 98480 12345';
    let calledNumber = '+91 80 4000 0001';
    let callSid = `CALL_${Date.now()}`;
    let provider: 'exotel' | 'twilio' | 'telecmo' | 'sip_trunk' = 'sip_trunk';
    let speechResult = '';
    let format = 'json';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      callerNumber = (formData.get('From') || formData.get('CallFrom') || callerNumber).toString();
      calledNumber = (formData.get('To') || formData.get('CallTo') || calledNumber).toString();
      callSid = (formData.get('CallSid') || callSid).toString();
      speechResult = (formData.get('SpeechResult') || formData.get('Digits') || '').toString();

      if (formData.has('CallFrom')) provider = 'exotel';
      else if (formData.has('CallSid')) provider = 'twilio';
    } else {
      const body = await req.json().catch(() => ({}));
      callerNumber = body.callerNumber || body.From || callerNumber;
      calledNumber = body.calledNumber || body.To || calledNumber;
      callSid = body.callSid || body.CallSid || callSid;
      provider = body.provider || 'exotel';
      speechResult = body.transcript || body.speechResult || '';
      format = body.format || 'json';
    }

    const { region, language, greeting } = resolveRegionAndLanguage(callerNumber);

    const intentDetected = speechResult.toLowerCase().includes('emergency')
      ? 'emergency_escalation'
      : speechResult.toLowerCase().includes('fee') || speechResult.toLowerCase().includes('cost')
      ? 'pricing_inquiry'
      : 'appointment_booking';

    const outcome = intentDetected === 'emergency_escalation'
      ? 'transferred_to_human'
      : 'appointment_booked';

    const recordedCall = await db.addTelephonyCall({
      callSid,
      callerNumber,
      calledNumber,
      provider,
      regionDetected: region,
      languageSelected: language,
      transcript: speechResult || greeting,
      intentDetected,
      outcome,
      durationSeconds: Math.floor(60 + Math.random() * 90),
    });

    // Fire webhook for call completion
    dispatchWebhookEvent('call.completed', {
      callId: recordedCall.id,
      callSid,
      caller: callerNumber,
      provider,
      region,
      language,
      intent: intentDetected,
      outcome,
    }).catch((e) => console.error('Telephony webhook dispatch error:', e));

    // Return TwiML XML if Twilio or requested
    if (format === 'xml' || provider === 'twilio') {
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="${language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'}">${greeting}</Say>
  <Gather input="speech" timeout="3" language="${language === 'te' ? 'te-IN' : 'en-IN'}">
    <Say>Please speak your preferred appointment time or request.</Say>
  </Gather>
</Response>`;
      return new NextResponse(twiml, {
        headers: { 'Content-Type': 'text/xml' },
        status: 200,
      });
    }

    // Standard JSON Response for modern carrier webhook gateways
    return NextResponse.json({
      status: 'call_processed',
      call: recordedCall,
      carrierAction: {
        action: 'play_and_record',
        promptText: greeting,
        language,
        forwardToAgent: outcome === 'transferred_to_human' ? '+91 80 4000 0002' : null,
      },
    });
  } catch (err: any) {
    console.error('Telephony Inbound Error:', err);
    return NextResponse.json({ error: 'Failed to process telephony webhook' }, { status: 500 });
  }
}
