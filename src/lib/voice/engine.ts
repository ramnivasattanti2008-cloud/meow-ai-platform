import { SupportedLanguage, VoiceTurn } from '../types';

export interface VoiceDialogueTurnInput {
  userInput: string;
  language: SupportedLanguage;
  purpose: 'appointment_booking' | 'customer_support' | 'lead_qualification' | 'order_inquiries';
  history: VoiceTurn[];
  persona?: 'clinic_sara' | 'realestate_ananya' | 'support_rishi';
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
 * Multilingual Conversational Voice Dialogue Engine
 * Voiced by "Sara" — an empathetic, hyper-realistic, human front-desk concierge.
 * Supports all major Indian languages:
 * Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, and Indian English.
 */
export class VoiceEngine {
  public processTurn(input: VoiceDialogueTurnInput): VoiceDialogueTurnOutput {
    const raw = input.userInput.trim();
    const text = raw.toLowerCase();
    const lang = input.language || 'en';

    // ─────────────────────────────────────────────────────────────
    // 1. EMERGENCY MEDICAL ESCALATION (Strict Patient Safety First)
    // ─────────────────────────────────────────────────────────────
    const emergencyKeywords = [
      'emergency',
      'chest pain',
      'bleeding',
      'severe pain',
      'hospitalize',
      'heart attack',
      'unconscious',
      'cannot breathe',
      // Telugu
      'కంగారు',
      'గుండె నొప్పి',
      'ఎమర్జెన్సీ',
      'రక్తం',
      'డాక్టర్ అర్జెంట్',
      'ప్రాణాపాయం',
      // Hindi
      'सीने में दर्द',
      'इमरजेंसी',
      'खून बह रहा',
      'बेहोश',
      'सांस नहीं आ रही',
      // Tamil
      'நெஞ்சு வலி',
      'அவசரம்',
      'ரத்தம்',
      'மூச்சு திணறல்',
      // Kannada
      'ಎದೆ ನೋವು',
      'ತುರ್ತು',
      'ರಕ್ತಸ್ರಾವ',
      'ಉಸಿರಾಟ',
      // Malayalam
      'നെഞ്ചുവേദന',
      'അടിയന്തരം',
      'രക്തസ്രാവം',
      // Marathi
      'छातीत दुखणे',
      'इमर्जन्सी',
      'रक्तस्राव',
      // Bengali
      'বুকে ব্যথা',
      'জরুরি',
      'রক্তপাত',
    ];

    if (emergencyKeywords.some((kw) => text.includes(kw))) {
      const emergencyReplies: Record<SupportedLanguage, string> = {
        en: 'Notice: This appears to be an urgent medical concern. I am transferring your call immediately to our duty medical nurse at +91 80 4000 0001. Please hold the line.',
        te: 'గమనిక: ఇది అత్యవసర పరిస్థితి కావచ్చు. నేను వెంటనే మిమ్మల్ని మా డ్యూటీ మెడికల్ నర్స్‌కి (+91 80 4000 0001) కనెక్ట్ చేస్తున్నాను. దయచేసి లైన్‌లో ఉండండి.',
        hi: 'सावधानी: यह एक आपातकालीन स्थिति लग रही है। मैं आपकी कॉल तुरंत ड्यूटी मेडिकल नर्स (+91 80 4000 0001) को ट्रांसफर कर रही हूँ। कृपया लाइन पर बने रहें।',
        ta: 'கவனம்: இது அவசர மருத்துவ சூழலாக தெரிகிறது. உங்கள் அழைப்பை உடனே தலைமை செவிலியருக்கு (+91 80 4000 0001) இணைக்கிறேன். தயவுசெய்து இணைப்பில் இருங்கள்.',
        kn: 'ಗಮನಿಸಿ: ಇದು ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಂತೆ ಕಾಣುತ್ತಿದೆ. ನಾನು ತಕ್ಷಣ ನಿಮ್ಮ ಕರೆಯನ್ನು ಡ್ಯೂಟಿ ನರ್ಸ್‌ಗೆ (+91 80 4000 0001) ವರ್ಗಾಯಿಸುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಲೈನ್‌ನಲ್ಲಿರಿ.',
        ml: 'ശ്രദ്ധിക്കുക: ഇതൊരു അടിയന്തര സാഹചര്യമാണ്. ഞാൻ ഉടൻ തന്നെ നിങ്ങളുടെ കോൾ ഡ്യൂട്ടി നഴ്സിലേക്ക് (+91 80 4000 0001) കൈമാറുന്നു. ദയവായി ലൈനിൽ തുടരുക.',
        mr: 'सूचना: ही तातडीची वैद्यकीय परिस्थिती दिसतेय. मी आपला कॉल तात्काळ ड्युटी नर्सकडे (+91 80 4000 0001) ट्रान्सफर करत आहे. कृपया लाइनवर राहा.',
        bn: 'জরুরি সতর্কতা: এটি জরুরি পরিস্থিতি হতে পারে। আমি এখনই আপনার কলটি ডিউটি নার্সের (+91 80 4000 0001) সাথে কানেক্ট করছি। অনুগ্রহ করে লাইনে থাকুন।',
      };

      return {
        agentResponse: emergencyReplies[lang] || emergencyReplies.en,
        language: lang,
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
    // 2. "ARE YOU AN AI?" (Sara's Charming & Transparent Response)
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
      // Telugu
      'నువ్వు ai',
      'రోబోట్',
      'మనిషివా',
      // Hindi
      'क्या आप ai हैं',
      'रोबोट हो क्या',
      'असली इंसान हो',
      // Tamil
      'நீங்க ai யா',
      'ரோபோவா',
      'உண்மையான நபரா',
      // Kannada
      'ನೀವು ai ನಾ',
      'ರೋಬೋಟ್',
      'ನಿಜವಾದ ವ್ಯಕ್ತಿನಾ',
      // Malayalam
      'നിങ്ങൾ ai ആണോ',
      'റോബോട്ട് ആണോ',
      // Marathi
      'तुम्ही ai आहात का',
      'रोबोट आहात का',
      // Bengali
      'আপনি কি ai',
      'রোবট নাকি',
    ];

    if (aiCheckKeywords.some((kw) => text.includes(kw))) {
      const aiReplies: Record<SupportedLanguage, string> = {
        en: "Haha, caught me! Yes, I'm Sara, MEOW AI's conversational voice assistant, but I'm connected straight to Dr. Rao's front desk so you don't have to wait on hold. Pretty natural, right? How can I help you with your appointment today?",
        te: 'హాహా, కనిపెట్టేసారా! అవునండి, నేను సారా ని, MEOW AI వాయిస్ అసిస్టెంట్‌ని. కానీ క్లినిక్ ఫ్రంట్ డెస్క్ సిస్టమ్‌తో డైరెక్ట్‌గా కనెక్ట్ అయి ఉన్నాను, మీరు లైన్‌లో వెయిట్ చేయకుండా వెంటనే బుకింగ్ చేయడానికి హెల్ప్ చేస్తున్నాను. చెప్పండి, డాక్టర్ గారి స్లాట్ చూద్దామా?',
        hi: 'हाहा, आपने पकड़ लिया! हाँ जी, मैं सारा हूँ, MEOW AI की वॉइस असिस्टेंट। लेकिन मैं सीधे क्लिनिक के फ्रंट डेस्क से जुड़ी हूँ ताकि आपको इंतज़ार न करना पड़े। बताइए, आपके लिए कौन सा स्लॉट देखूँ?',
        ta: 'ஹாஹா, கண்டுபிடிச்சிட்டீங்களா! ஆமாங்க, நான் சாரா, MEOW AI குரல் உதவியாளர். கிளினிக் முன்பதிவை உடனே செய்ய உதவுகிறேன். சொல்லுங்க, எந்த நேரம் சரியா இருக்கும்?',
        kn: 'ಹಾಹಾ, ಕಂಡುಹಿಡಿದ್ರಾ! ಹೌದು, ನಾನು ಸಾರಾ, MEOW AI ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್. ನೀವು ಲೈನ್‌ನಲ್ಲಿ ಕಾಯದೆ ತಕ್ಷಣ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತಿದ್ದೇನೆ. ಹೇಳಿ, ಯಾವ ಸಮಯ ಬೇಕು?',
        ml: 'ഹാഹാ, കണ്ടുപിടിച്ചല്ലോ! അതെ, ഞാൻ സാറ ആണ്, MEOW AI വോയ്‌സ് അസിസ്റ്റന്റ്. നിങ്ങൾ കാത്തിരിക്കാതെ പെട്ടെന്ന് ബുക്കിംഗ് ചെയ്യാൻ സഹായിക്കുന്നു. പറയൂ, ഏത് സമയമാണ് സൗകര്യം?',
        mr: 'हाहा, बरोबर ओळखलंत! हो, मी सारा आहे, MEOW AI ची व्हॉइस असिस्टंट. क्लिनिकचे बुकिंग लगेच व्हावे यासाठी मी मदत करते. सांगा, कोणती वेळ सोयीची आहे?',
        bn: 'হাহা, ধরে ফেলেছেন! হ্যাঁ, আমি সারা, MEOW AI-এর ভয়েস অ্যাসিস্ট্যান্ট। ক্লিনিকে অপেক্ষা না করে সরাসরি বুকিং করতে সাহায্য করছি। বলুন, কোন সময়টি সুবিধা হবে?',
      };

      return {
        agentResponse: aiReplies[lang] || aiReplies.en,
        language: lang,
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
      // Vernacular phrases
      'మనిషితో మాట్లాడాలి',
      'आदमी से बात करनी है',
      'மனிதரிடம் பேச வேண்டும்',
      'ವ್ಯಕ್ತಿಯೊಂದಿಗೆ ಮಾತನಾಡಬೇಕು',
      'ആളോട് സംസാരിക്കണം',
      'माणसाशी बोलायचे आहे',
      'মানুষের সাথে কথা বলতে চাই',
    ];

    if (
      humanKeywords.some((kw) => text.includes(kw)) ||
      (text.includes('human') && !text.includes('are you'))
    ) {
      const handoffReplies: Record<SupportedLanguage, string> = {
        en: 'Understood. As an automated AI assistant, I am escalating this conversation to our senior coordinator right away. Please hold for just a moment.',
        te: 'ఖచ్చితంగా అండి. నేను ఒక AI అసిస్టెంట్‌ని. మిమ్మల్ని మా సీనియర్ క్లినిక్ కోఆర్డినేటర్‌కి కనెక్ట్ చేస్తున్నాను. ఒక్క క్షణం వేచి ఉండండి.',
        hi: 'बिल्कुल जी। एक AI असिस्टेंट होने के नाते, मैं आपकी कॉल तुरंत हमारे सीनियर को-ऑर्डिनेटर को ट्रांसफर कर रही हूँ। कृपया एक क्षण रुकें।',
        ta: 'நிச்சயமாக. நான் உடனடியாக எங்கள் மூத்த ஒருங்கிணைப்பாளருக்கு இணைக்கிறேன். தயவுசெய்து ஒரு கணம் காத்திருங்கள்.',
        kn: 'ಖಂಡಿತವಾಗಿಯೂ. ನಾನು ತಕ್ಷಣ ನಮ್ಮ ಹಿರಿಯ ಸಂಯೋಜಕರಿಗೆ ಕರೆಯನ್ನು ವರ್ಗಾಯಿಸುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಕ್ಷಣಕಾಲ ಕಾಯಿರಿ.',
        ml: 'തീർച്ചയായും. ഞാൻ ഉടൻ തന്നെ ഞങ്ങളുടെ സീനിയർ കോർഡിനേറ്ററിലേക്ക് കണക്ട് ചെയ്യുന്നു. ദയവായി ഒരു നിമിഷം കാത്തിരിക്കൂ.',
        mr: 'नक्कीच. मी आपला कॉल तात्काळ आमच्या वरिष्ठ समन्वयकांकडे हस्तांतरित करत आहे. कृपया एक क्षण थांबा.',
        bn: 'নিশ্চয়ই। আমি এখনই আমাদের সিনিয়র কোঅর্ডিনেটরের কাছে কলটি ট্রান্সফার করছি। অনুগ্রহ করে এক মুহূর্ত অপেক্ষা করুন।',
      };

      return {
        agentResponse: handoffReplies[lang] || handoffReplies.en,
        language: lang,
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
      'फीस',
      'चार्ज',
      'கட்டணம்',
      'விலை',
      'ಶುಲ್ಕ',
      'റേറ്റ്',
      'ফি',
    ];

    if (priceKeywords.some((kw) => text.includes(kw))) {
      const feeReplies: Record<SupportedLanguage, string> = {
        en: "Dr. Rao's consultation fee is ₹600, which includes a comprehensive physical evaluation and review of any past X-rays or MRI scans. Would you like me to reserve a 5:30 PM slot for tomorrow?",
        te: 'డాక్టర్ రావు గారి కన్సల్టేషన్ ఫీజు ₹600 అండి, ఇందులో ఫిజికల్ చెకప్ మరియు పాత రిపోర్టుల రివ్యూ ఉంటాయి. రేపు సాయంత్రం 5:30 PM కి స్లాట్ బుక్ చేయమంటారా?',
        hi: 'डॉक्टर राव की कंसल्टेशन फीस ₹600 है, जिसमें फिजिकल चेकअप और पुरानी रिपोर्ट्स की जांच शामिल है। क्या मैं कल शाम 5:30 बजे का स्लॉट आपके लिए बुक कर दूँ?',
        ta: 'டாக்டர் ராவின் கன்சல்டேஷன் கட்டணம் ₹600 ஆகும். இதில் விரிவான உடல் பரிசோதனை அடங்கும். நாளை மாலை 5:30 மணிக்கு அப்பாயிண்ட்மென்ட் புக் செய்யட்டுமா?',
        kn: 'ಡಾಕ್ಟರ್ ರಾವ್ ಅವರ ಕನ್ಸಲ್ಟೇಶನ್ ಶುಲ್ಕ ₹600 ಆಗಿದೆ. ಇದರಲ್ಲಿ ಪರೀಕ್ಷೆ ಮತ್ತು ಹಳೆಯ ವರದಿಗಳ ಪರಿಶೀಲನೆ ಇರುತ್ತದೆ. ನಾಳೆ ಸಂಜೆ 5:30 ಕ್ಕೆ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಲೇ?',
        ml: 'ഡോക്ടർ റാവുവിന്റെ കൺസൾട്ടേഷൻ ഫീസ് ₹600 ആണ്. ഇതിൽ പൂർണ്ണ പരിശോധന ഉൾപ്പെടുന്നു. നാളെ വൈകുന്നേരം 5:30 ന് സ്ലോട്ട് ബുക്ക് ചെയ്യട്ടെയോ?',
        mr: 'डॉक्टर राव यांची तपासणी फी ₹600 आहे. यामध्ये सर्व तपासणी आणि जुन्या रिपोर्ट्सचा आढावा समाविष्ट आहे. उद्या संध्याकाळी 5:30 ची वेळ निश्चित करू का?',
        bn: 'ডক্টর রাওয়ের কনসালটেশন ফি ₹600, যার মধ্যে শারীরিক পরীক্ষা ও পুরনো রিপোর্ট দেখা অন্তর্ভুক্ত। কাল সন্ধ্যা 5:30 টায় কি আপনার স্লট বুক করব?',
      };

      return {
        agentResponse: feeReplies[lang] || feeReplies.en,
        language: lang,
        intentDetected: 'inquire_consultation_fee',
        shouldEscalateToHuman: false,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 5. SYMPTOM EMPATHY & SPECIALIST INQUIRY (Sara's Empathetic Listening)
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
      'दर्द',
      'घुटने में दर्द',
      'पीठ दर्द',
      'வலி',
      'முழங்கால் வலி',
      'ನೋವು',
      'വേദന',
      'दुखणे',
      'ব্যথা',
    ];

    if (
      symptomKeywords.some((kw) => text.includes(kw)) &&
      !text.includes('confirm') &&
      !text.includes('5:30')
    ) {
      const symptomReplies: Record<SupportedLanguage, string> = {
        en: "Oh, I'm so sorry to hear that — joint and knee pain can be really uncomfortable. Dr. Rao is our senior orthopedic surgeon and treats this regularly. He has open consultation slots tomorrow at 5:30 PM and 6:30 PM. Would 5:30 PM suit you best?",
        te: 'అయ్యో, చాలా ఇబ్బందిగా ఉంటుంది అండి. డాక్టర్ రావు గారు ఆర్థోపెడిక్ మరియు జాయింట్ కేర్‌లో సీనియర్ స్పెషలిస్ట్. రేపు సాయంత్రం 5:30 PM మరియు 6:30 PM స్లాట్‌లు ఖాళీగా ఉన్నాయి. మీకు 5:30 PM అనుకూలంగా ఉంటుందా?',
        hi: 'ओह, यह सुनकर बुरा लगा — जोड़ों और घुटनों का दर्द बहुत तकलीफदेह होता है। डॉक्टर राव सीनियर ऑर्थोपेडिक सर्जन हैं। कल शाम 5:30 और 6:30 बजे के स्लॉट खाली हैं। क्या 5:30 बजे का समय आपके लिए ठीक रहेगा?',
        ta: 'ஐயோ, மூட்டு வலி மிகவும் சிரமமாக இருக்கும். டாக்டர் ராவ் மூட்டு சிகிச்சை நிபுணர். நாளை மாலை 5:30 மற்றும் 6:30 மணி காலியாக உள்ளது. 5:30 மணி உங்களுக்கு வசதியாக இருக்குமா?',
        kn: 'ಅಯ್ಯೋ, ಕೀಲು ನೋವು ತುಂಬಾ ತ್ರಾಸದಾಯಕ. ಡಾಕ್ಟರ್ ರಾವ್ ಮೂಳೆ ತಜ್ಞರು. ನಾಳೆ ಸಂಜೆ 5:30 ಮತ್ತು 6:30 ರ ಸ್ಲಾಟ್‌ಗಳು ಲಭ್ಯವಿವೆ. ನಿಮಗೆ 5:30 ಸರಿಹೊಂದುತ್ತದೆಯೇ?',
        ml: 'അയ്യോ, സന്ധി വേദന വളരെ ബുദ്ധിമുട്ടാണ്. ഡോക്ടർ റാവു സീനിയർ ഓർത്തോപീഡിക് സർജനാണ്. നാളെ വൈകുന്നേരം 5:30 നും 6:30 നും സ്ലോട്ടുകൾ ലഭ്യമാണ്. 5:30 സൗകര്യപ്രദമാണോ?',
        mr: 'अरेरे, सांधेदुखी खूप त्रासदायक असते. डॉक्टर राव सीनियर ऑर्थोपेडिक तज्ज्ञ आहेत. उद्या संध्याकाळी 5:30 आणि 6:30 चे स्लॉट उपलब्ध आहेत. 5:30 ची वेळ चालेल का?',
        bn: 'আহা, জয়েন্টের ব্যথা সত্যিই খুব কষ্টদায়ক। ডক্টর রাও সিনিয়র অর্থোপেডিক সার্জন। কাল সন্ধ্যা 5:30 এবং 6:30 টার স্লট ফাঁকা আছে। 5:30 টা কি আপনার জন্য ঠিক হবে?',
      };

      return {
        agentResponse: symptomReplies[lang] || symptomReplies.en,
        language: lang,
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
      'हाँ',
      'ठीक है',
      'कन्फर्म',
      'சரி',
      'உறுதி செய்',
      'ಸರಿ',
      'ശരി',
      'नक्की करा',
      'ঠিক আছে',
    ];

    if (
      confirmationKeywords.some((kw) => text.includes(kw)) &&
      (text.includes('5:30') ||
        text.includes('6:30') ||
        text.includes('yes') ||
        text.includes('ఓకే') ||
        text.includes('confirm') ||
        text.includes('works best') ||
        text.includes('సరిపోతుంది') ||
        text.includes('ठीक है') ||
        text.includes('कन्फर्म') ||
        text.includes('சரி'))
    ) {
      const confirmReplies: Record<SupportedLanguage, string> = {
        en: 'Your appointment for tomorrow at 5:30 PM is confirmed. A confirmation with the clinic map location has been sent to your WhatsApp. Thank you!',
        te: 'మీ అపాయింట్‌మెంట్ రేపు సాయంత్రం 5:30 PM కి బుక్ చేయబడింది. కన్ఫర్మేషన్ వివరాలు మీ ఫోన్ నంబర్‌కు WhatsApp ద్వారా పంపబడ్డాయి. ధన్యవాదాలు!',
        hi: 'कल शाम 5:30 बजे का आपका अपॉइंटमेंट पक्का हो गया है। क्लिनिक की लोकेशन और टोकन विवरण आपके व्हाट्सएप पर भेज दिए गए हैं। धन्यवाद!',
        ta: 'நாளை மாலை 5:30 மணிக்கு உங்கள் அப்பாயிண்ட்மென்ட் உறுதி செய்யப்பட்டது. விவரங்கள் உங்கள் வாட்ஸ்அப்பிற்கு அனுப்பப்பட்டுள்ளன. நன்றி!',
        kn: 'ನಾಳೆ ಸಂಜೆ 5:30 ಕ್ಕೆ ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದೃಢಪಟ್ಟಿದೆ. ವಿವರಗಳನ್ನು ನಿಮ್ಮ ವಾಟ್ಸಾಪ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಧನ್ಯವಾದಗಳು!',
        ml: 'നാളെ വൈകുന്നേരം 5:30 നുള്ള നിങ്ങളുടെ അപ്പോയിന്റ്മെന്റ് സ്ഥിരീകരിച്ചു. വിവരങ്ങൾ വാട്ട്സാപ്പിൽ അയച്ചിട്ടുണ്ട്. നന്ദി!',
        mr: 'उद्या संध्याकाळी 5:30 ची आपली अपॉइंटमेंट कन्फर्म झाली आहे. क्लिनिकचे पत्ते आणि डिटेल्स आपल्या व्हॉट्सॲपवर पाठवले आहेत. धन्यवाद!',
        bn: 'কাল সন্ধ্যা 5:30 টায় আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করা হয়েছে। লোকেশন ও কনফার্মেশন আপনার হোয়াটসঅ্যাপে পাঠানো হয়েছে। ধন্যবাদ!',
      };

      return {
        agentResponse: confirmReplies[lang] || confirmReplies.en,
        language: lang,
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
      'visit',
      'అపాయింట్మెంట్',
      'బుక్',
      'రేపు',
      'अपॉइंटमेंट',
      'बुक',
      'कल',
      'முன்பதிவு',
      'நாளை',
      'ಅಪಾಯಿಂಟ್ಮೆಂಟ್',
      'ನಾಳೆ',
      'അപ്പോയിന്റ്മെന്റ്',
      'नाळे',
      'অ্যাপয়েন্টমেন্ট',
      'কাল',
    ];

    if (bookingGeneralKeywords.some((kw) => text.includes(kw))) {
      const generalSlotReplies: Record<SupportedLanguage, string> = {
        en: 'Certainly! For tomorrow, we have slots available at 5:30 PM and 6:30 PM. Would 5:30 PM work best for you?',
        te: 'ఖచ్చితంగా అండి! రేపు సాయంత్రం 5:30 PM మరియు 6:30 PM స్లాట్‌లు ఖాళీగా ఉన్నాయి. మీకు 5:30 PM అనుకూలంగా ఉంటుందా?',
        hi: 'ज़रूर जी! कल शाम 5:30 और 6:30 बजे के स्लॉट उपलब्ध हैं। क्या 5:30 बजे का समय आपके लिए ठीक रहेगा?',
        ta: 'நிச்சயமாக! நாளை மாலை 5:30 மற்றும் 6:30 மணி நேரங்கள் உள்ளன. 5:30 மணி உங்களுக்கு சரியாக இருக்குமா?',
        kn: 'ಖಂಡಿತ! ನಾಳೆ ಸಂಜೆ 5:30 ಮತ್ತು 6:30 ರ ಸ್ಲಾಟ್‌ಗಳು ಲಭ್ಯವಿವೆ. ನಿಮಗೆ 5:30 ಸಮಯ ಅನುಕೂಲವೇ?',
        ml: 'തീർച്ചയായും! നാളെ വൈകുന്നേരം 5:30 നും 6:30 നും സ്ലോട്ടുകൾ ലഭ്യമാണ്. 5:30 സൗകര്യപ്രദമാണോ?',
        mr: 'नक्कीच! उद्या संध्याकाळी 5:30 आणि 6:30 चे स्लॉट मोकळे आहेत. 5:30 ची वेळ आपल्याला चालेल का?',
        bn: 'নিশ্চয়ই! কাল সন্ধ্যা 5:30 এবং 6:30 টার স্লট উপলব্ধ আছে। 5:30 টা কি আপনার জন্য সুবিধা হবে?',
      };

      return {
        agentResponse: generalSlotReplies[lang] || generalSlotReplies.en,
        language: lang,
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
      'parking',
      'అడ్రస్',
      'లొకేషన్',
      'पत्ता',
      'कहाँ है',
      'பார்த்திங்',
      'முகவரி',
      'ವಿಳಾಸ',
      'ಸ್ಥಳ',
      'വിലാസം',
      'पत्ता कुठे आहे',
      'ঠিকানা',
    ];

    if (locationKeywords.some((kw) => text.includes(kw))) {
      const locationReplies: Record<SupportedLanguage, string> = {
        en: 'We are located on Road Number 36, Jubilee Hills, Hyderabad, directly opposite Metro Pillar 1420. We have dedicated valet parking on-site. Should I ping the exact Google Maps location to your WhatsApp?',
        te: 'మా క్లినిక్ జూబ్లీహిల్స్ రోడ్ నంబర్ 36 లో ఉంది అండి, మెట్రో పిల్లర్ 1420 ఎదురుగా. పేషెంట్ల కోసం వ్యాలెట్ పార్కింగ్ అందుబాటులో ఉంది. మీకు గూగుల్ మ్యాప్స్ లొకేషన్ వాట్సాప్‌కి పంపించమంటారా?',
        hi: 'हमारा क्लिनिक रोड नंबर 36, जुबली हिल्स, हैदराबाद में मेट्रो पिलर 1420 के ठीक सामने स्थित है। यहाँ वैलेट पार्किंग भी है। क्या मैं लोकेशन आपके व्हाट्सएप पर भेज दूँ?',
        ta: 'எங்கள் கிளினிக் ஜூப்ளி ஹில்ஸ் ரோடு எண் 36, மெட்ரோ தூண் 1420 எதிரில் அமைந்துள்ளது. பார்க்கிங் வசதி உண்டு. லொகேஷனை வாட்ஸ்அப்பில் அனுப்பட்டுமா?',
        kn: 'ನಮ್ಮ ಕ್ಲಿನಿಕ್ ಜೂಬ್ಲಿ ಹಿಲ್ಸ್ ರಸ್ತೆ ಸಂಖ್ಯೆ 36, ಮೆಟ್ರೋ ಪಿಲ್ಲರ್ 1420 ಎದುರುಗಡೆ ಇದೆ. ಪಾರ್ಕಿಂಗ್ ಸೌಲಭ್ಯವಿದೆ. ಗೂಗಲ್ ಮ್ಯಾಪ್ ಲೊಕೇಶನ್ ವಾಟ್ಸಾಪ್‌ಗೆ ಕಳುಹಿಸಲೇ?',
        ml: 'ഞങ്ങളുടെ ക്ലിനിക്ക് ജൂബിലി ഹിൽസ് റോഡ് നമ്പർ 36, മെട്രോ പില്ലർ 1420 ന് എതിർവശത്താണ്. പാർക്കിംഗ് സൗകര്യമുണ്ട്. ലൊക്കേഷൻ വാട്ട്സാപ്പിൽ അയക്കട്ടെയോ?',
        mr: 'आमचे क्लिनिक रोड नंबर 36, जुबली हिल्स, हैदराबाद येथे मेट्रो पिलर 1420 समोर आहे. व्हॅलेट पार्किंग उपलब्ध आहे. लोकेशन व्हॉट्सॲपवर पाठवू का?',
        bn: 'আমাদের ক্লিনিক জুবিলি হিলস রোড নম্বর 36, মেট্রো পিলার 1420-এর ঠিক বিপরীতে। ভ্যালেট পার্কিং আছে। লোকেশন কি আপনার হোয়াটসঅ্যাপে পাঠাব?',
      };

      return {
        agentResponse: locationReplies[lang] || locationReplies.en,
        language: lang,
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
      text.includes('समय') ||
      text.includes('நேரம்') ||
      text.includes('ಸಮಯ')
    ) {
      const timingReplies: Record<SupportedLanguage, string> = {
        en: 'Our clinic operates Monday through Saturday, from 9:00 AM to 7:00 PM IST. We are closed on Sundays.',
        te: 'మా క్లినిక్ సోమవారం నుండి శనివారం వరకు ఉదయం 9:00 నుండి రాత్రి 7:00 వరకు తెరిచి ఉంటుంది. ఆదివారం సెలవు.',
        hi: 'हमारा क्लिनिक सोमवार से शनिवार सुबह 9:00 बजे से शाम 7:00 बजे तक खुला रहता है। रविवार को अवकाश रहता है।',
        ta: 'எங்கள் கிளினிக் திங்கள் முதல் சனிக்கிழமை வரை காலை 9:00 முதல் இரவு 7:00 வரை செயல்படுகிறது. ஞாயிறு விடுமுறை.',
        kn: 'ನಮ್ಮ ಕ್ಲಿನಿಕ್ ಸೋಮವಾರದಿಂದ ಶನಿವಾರದವರೆಗೆ ಬೆಳಿಗ್ಗೆ 9:00 ರಿಂದ ಸಂಜೆ 7:00 ರವರೆಗೆ ತೆರೆದಿರುತ್ತದೆ. ಭಾನುವಾರ ರಜೆ.',
        ml: 'തിങ്കൾ മുതൽ ശനി വരെ രാവിലെ 9:00 മുതൽ വൈകുന്നേരം 7:00 വരെയാണ് ക്ലിനിക്ക് പ്രവർത്തിക്കുന്നത്. ഞായറാഴ്ച അവധിയാണ്.',
        mr: 'आमचे क्लिनिक सोमवार ते शनिवार सकाळी 9:00 ते संध्याकाळी 7:00 पर्यंत सुरू असते. रविवारी सुट्टी असते.',
        bn: 'আমাদের ক্লিনিক সোমবার থেকে শনিবার সকাল 9:00 টা থেকে সন্ধ্যা 7:00 টা পর্যন্ত খোলা থাকে। রবিবার বন্ধ থাকে।',
      };

      return {
        agentResponse: timingReplies[lang] || timingReplies.en,
        language: lang,
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
      text.includes('धन्यवाद') ||
      text.includes('நன்றி') ||
      text.includes('ಧನ್ಯವಾದಗಳು')
    ) {
      const closingReplies: Record<SupportedLanguage, string> = {
        en: "You're so welcome! Have a restful day, and we look forward to seeing you at the clinic tomorrow. Take care!",
        te: 'చాలా థాంక్స్ అండి! రేపు క్లినిక్‌లో కలుద్దాం. ఆరోగ్యాన్ని జాగ్రత్తగా చూసుకోండి!',
        hi: 'बहुत-बहुत धन्यवाद जी! अपना ख्याल रखें और कल क्लिनिक में मिलते हैं। शुभ दिन!',
        ta: 'மிக்க நன்றி! உங்கள் உடம்பை கவனித்துக் கொள்ளுங்கள், நாளை கிளினிக்கில் சந்திப்போம்!',
        kn: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು! ನಾಳೆ ಕ್ಲಿನಿಕ್‌ನಲ್ಲಿ ಭೇಟಿಯಾಗೋಣ. ನಿಮ್ಮ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಕಾಳಜಿ ವಹಿಸಿ!',
        ml: 'വളരെ നന്ദി! നാളെ ക്ലിനിക്കിൽ കാണാം. ശ്രദ്ധയോടെ ഇരിക്കൂ!',
        mr: 'खूप खूप धन्यवाद! उद्या क्लिनिकमध्ये भेटूया, काळजी घ्या!',
        bn: 'অনেক ধন্যবাদ! নিজের যত্ন নেবেন, কাল ক্লিনিকে দেখা হবে!',
      };

      return {
        agentResponse: closingReplies[lang] || closingReplies.en,
        language: lang,
        intentDetected: 'polite_closing',
        shouldEscalateToHuman: false,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 11. CONTEXTUAL INTELLIGENT DEFAULT
    // ─────────────────────────────────────────────────────────────
    const defaultReplies: Record<SupportedLanguage, string> = {
      en: "I am Sara, the automated front-desk assistant for Dr. Rao Clinic. I can help you schedule appointments, check consultation timings, or connect you with clinic staff. How may I assist you today?",
      te: 'నేను సారా ని, డాక్టర్ రావు క్లినిక్ AI సహాయకురాలిని. నేను మీకు డాక్టర్ అపాయింట్‌మెంట్ బుకింగ్, క్లినిక్ వేళలు లేదా వైద్య పరీక్షల వివరాలలో సహాయం చేయగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?',
      hi: 'मैं सारा हूँ, डॉक्टर राव क्लिनिक की फ्रंट डेस्क असिस्टेंट। मैं अपॉइंटमेंट बुकिंग, क्लिनिक टाइमिंग या डॉक्टर से परामर्श में आपकी मदद कर सकती हूँ। बताइए, मैं क्या करूँ?',
      ta: 'நான் சாரா, டாக்டர் ராவ் கிளினிக்கின் முன் மேசை உதவியாளர். முன்பதிவு, நேரம் மற்றும் மருத்துவர் ஆலோசனையில் உதவ முடியும். நான் உங்களுக்கு எவ்வாறு உதவட்டும்?',
      kn: 'ನಾನು ಸಾರಾ, ಡಾಕ್ಟರ್ ರಾವ್ ಕ್ಲಿನಿಕ್‌ನ ಸಹಾಯಕೀ. ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕಿಂಗ್, ಸಮಯ ಮತ್ತು ಸಲಹೆಯಲ್ಲಿ ನಾನು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
      ml: 'ഞാൻ സാറ, ഡോക്ടർ റാവു ക്ലിനിക്കിന്റെ ഫ്രണ്ട് ഡെസ്ക് അസിസ്റ്റന്റ്. അപ്പോയിന്റ്മെന്റ് ബുക്കിംഗിലും വിവരങ്ങളിലും സഹായിക്കാം. എന്താണ് അറിയേണ്ടത്?',
      mr: 'मी सारा, डॉक्टर राव क्लिनिकची असिस्टंट. अपॉइंटमेंट बुकिंग आणि वेळेबाबत मी मदत करू शकते. मी आपल्याला कशी मदत करू?',
      bn: 'আমি সারা, ডক্টর রাও ক্লিনিকের ফ্রন্ট ডেস্ক সহকারী। অ্যাপয়েন্টমেন্ট বুকিং বা ক্লিনিকের সময় জানতে আমি সাহায্য করতে পারি। কীভাবে সাহায্য করব?',
    };

    return {
      agentResponse: defaultReplies[lang] || defaultReplies.en,
      language: lang,
      intentDetected: 'general_assistance',
      shouldEscalateToHuman: false,
    };
  }
}

export const voiceEngine = new VoiceEngine();
