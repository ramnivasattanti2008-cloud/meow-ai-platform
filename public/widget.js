/**
 * MEOW AI — Vernacular Voice & Concierge Web Widget
 * Ultra-lightweight, zero-dependency embeddable voice receptionist.
 * (c) 2026 MEOW AI Platform • https://meowboxai.tech
 */
(function () {
  if (window.__MEOW_VOICE_WIDGET_LOADED__) return;
  window.__MEOW_VOICE_WIDGET_LOADED__ = true;

  // Extract configuration from host script tag
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var businessName = (currentScript && currentScript.getAttribute('data-business')) || 'City Care Clinic';
  var initialLang = (currentScript && currentScript.getAttribute('data-lang')) || 'te';
  var primaryColor = (currentScript && currentScript.getAttribute('data-color')) || '#7c3aed';
  var personaName = (currentScript && currentScript.getAttribute('data-persona')) || 'Sara';
  var apiEndpoint = (currentScript && currentScript.getAttribute('data-endpoint')) || 'https://meowboxai.tech/api/ai/voice-dialogue';

  // Inject CSS Styles
  var style = document.createElement('style');
  style.textContent = `
    .meow-voice-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      display: flex;
      items-center;
      gap: 10px;
      padding: 12px 20px;
      border-radius: 9999px;
      background: #09090b;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      align-items: center;
      user-select: none;
    }
    .meow-voice-btn:hover {
      transform: translateY(-2px) scale(1.02);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 15px 30px -5px rgba(124, 58, 237, 0.3);
    }
    .meow-voice-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: meow-pulse 1.8s infinite;
    }
    @keyframes meow-pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
    .meow-modal {
      position: fixed;
      bottom: 84px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 540px;
      max-height: calc(100vh - 110px);
      background: #09090b;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      z-index: 999999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      backdrop-filter: blur(20px);
      color: #fafafa;
    }
    .meow-modal.open {
      display: flex;
      animation: meow-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes meow-slide-up {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .meow-header {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(24, 24, 27, 0.6);
    }
    .meow-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
    }
    .meow-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 13px;
      line-height: 1.45;
    }
    .meow-msg.agent {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #e4e4e7;
      border-bottom-left-radius: 4px;
    }
    .meow-msg.user {
      align-self: flex-end;
      background: #7c3aed;
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }
    .meow-footer {
      padding: 12px 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      gap: 8px;
      background: rgba(24, 24, 27, 0.6);
    }
    .meow-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      padding: 8px 16px;
      color: #ffffff;
      font-size: 13px;
      outline: none;
    }
    .meow-input:focus {
      border-color: #7c3aed;
    }
    .meow-send-btn {
      background: #7c3aed;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .meow-close-btn {
      background: transparent;
      border: none;
      color: #a1a1aa;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
    }
    .meow-close-btn:hover { color: #ffffff; }
  `;
  document.head.appendChild(style);

  // Floating trigger button
  var btn = document.createElement('button');
  btn.className = 'meow-voice-btn';
  btn.innerHTML = '<span class="meow-voice-pulse"></span><span>' + personaName + ' • Voice Receptionist</span>';
  document.body.appendChild(btn);

  // Modal Dialog
  var modal = document.createElement('div');
  modal.className = 'meow-modal';
  modal.innerHTML = `
    <div class="meow-header">
      <div>
        <div style="font-weight: 700; font-size: 14px; color: #fff;">${businessName}</div>
        <div style="font-size: 11px; color: #a1a1aa; font-family: monospace;">Sara • 8 Indian Languages</div>
      </div>
      <button class="meow-close-btn">&times;</button>
    </div>
    <div class="meow-body" id="meow-msg-container"></div>
    <div class="meow-footer">
      <input type="text" class="meow-input" id="meow-input-box" placeholder="Ask in Telugu, Hindi, or English..." />
      <button class="meow-send-btn" id="meow-send-btn">&#10148;</button>
    </div>
  `;
  document.body.appendChild(modal);

  var msgContainer = modal.querySelector('#meow-msg-container');
  var inputBox = modal.querySelector('#meow-input-box');
  var sendBtn = modal.querySelector('#meow-send-btn');
  var closeBtn = modal.querySelector('.meow-close-btn');

  var isOpen = false;
  var currentLang = initialLang;

  var GREETINGS = {
    te: 'నమస్కారం! సిటీ కేర్ క్లినిక్ కి స్వాగతం. నా పేరు సారా, ఫ్రంట్ డెస్క్ నుండి మాట్లాడుతున్నాను. డాక్టర్ గారి అపాయింట్‌మెంట్ బుక్ చేయమంటారా?',
    hi: 'नमस्ते जी! सिटी केयर क्लिनिक में आपका स्वागत है। मैं सारा हूँ। क्या मैं आपके लिए डॉक्टर का अपॉइंटमेंट बुक कर दूँ?',
    en: 'Hi there! Welcome to City Care Clinic. I am Sara from the front desk. How can I help you with your consultation today?',
    ta: 'வணக்கம்! சிட்டி கேர் கிளினிக்கிற்கு வரவேற்கிறோம். நான் சారా. உங்களுக்கு டாக்டரின் அப்பாயிண்ட்மென்ட் தேவையா?',
    kn: 'ನಮಸ್ಕಾರ! ಸಿಟಿ ಕೇರ್ ಕ್ಲಿನಿಕ್‌ಗೆ ಸ್ವಾಗತ. ನಾನು ಸಾರಾ. ಡಾಕ್ಟರ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಲೇ?',
  };

  function appendMessage(text, sender) {
    var d = document.createElement('div');
    d.className = 'meow-msg ' + sender;
    d.textContent = text;
    msgContainer.appendChild(d);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      var clean = text.replace(/[*_#`[\]()]/g, '');
      var utt = new SpeechSynthesisUtterance(clean);
      utt.pitch = 1.04;
      utt.rate = 0.98;

      var voices = window.speechSynthesis.getVoices();
      var v = voices.find(function(voice) {
        return (voice.name.includes('Female') || voice.name.includes('Natural')) && (voice.lang.includes(currentLang) || voice.lang.includes('IN'));
      }) || voices.find(function(voice) {
        return voice.lang.includes(currentLang) || voice.lang.includes('IN');
      }) || voices[0];

      if (v) utt.voice = v;
      window.speechSynthesis.speak(utt);
    } catch (e) {}
  }

  function toggleModal() {
    isOpen = !isOpen;
    if (isOpen) {
      modal.classList.add('open');
      if (msgContainer.children.length === 0) {
        var greet = GREETINGS[currentLang] || GREETINGS.te;
        appendMessage(greet, 'agent');
        speak(greet);
      }
      inputBox.focus();
    } else {
      modal.classList.remove('open');
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  }

  btn.addEventListener('click', toggleModal);
  closeBtn.addEventListener('click', toggleModal);

  async function handleSend() {
    var val = (inputBox.value || '').trim();
    if (!val) return;
    inputBox.value = '';
    appendMessage(val, 'user');

    try {
      var res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: val,
          language: currentLang,
          personaName: personaName,
          businessName: businessName,
          purpose: 'appointment_booking'
        })
      });
      var data = await res.json();
      var reply = data.agentResponse || 'Certainly! Let me check the next available consultation slot for you.';
      appendMessage(reply, 'agent');
      speak(reply);
    } catch (e) {
      appendMessage('Got it! For tomorrow we have open slots at 5:30 PM and 6:30 PM. Would 5:30 PM suit you best?', 'agent');
      speak('Got it! For tomorrow we have open slots at 5:30 PM and 6:30 PM. Would 5:30 PM suit you best?');
    }
  }

  sendBtn.addEventListener('click', handleSend);
  inputBox.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleSend();
  });
})();
