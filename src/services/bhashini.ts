import { Language } from '../types';

export interface BhashiniASRResponse {
  transcript: string;
  source: 'web_speech' | 'bhashini_api' | 'audio_processor';
  confidence: number;
}

export interface ExtractedEntities {
  education: string;
  current_work: string;
  interests: string;
}

/**
 * Audio synthesis helper to speak text aloud in beneficiary's language
 */
export function speakText(text: string, lang: Language) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'tamil') {
      utterance.lang = 'ta-IN';
      utterance.rate = 0.9;
    } else if (lang === 'hindi') {
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
    } else {
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
    }
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis unavailable:', e);
  }
}

/**
 * Rule-based robust NLP extractor for Tamil, Hindi, and English beneficiary speech
 */
export function extractProfileNLP(transcript: string, lang: Language): ExtractedEntities {
  const lower = transcript.toLowerCase();

  // 1. Education extraction
  let education = '';
  if (
    lower.includes('10th') ||
    lower.includes('10-ஆம்') ||
    lower.includes('பத்தாம்') ||
    lower.includes('10वीं') ||
    lower.includes('दसवीं') ||
    lower.includes('tenth') ||
    lower.includes('sslc')
  ) {
    education = lang === 'tamil' ? '10-ஆம் வகுப்பு (10th Pass)' : lang === 'hindi' ? '10वीं पास (10th Pass)' : '10th Pass';
  } else if (
    lower.includes('12th') ||
    lower.includes('12-ஆம்') ||
    lower.includes('12वीं') ||
    lower.includes('பன்னிரண்டாம்') ||
    lower.includes('बारहवीं') ||
    lower.includes('twelfth') ||
    lower.includes('hsc')
  ) {
    education = lang === 'tamil' ? '12-ஆம் வகுப்பு (12th Pass)' : lang === 'hindi' ? '12वीं पास (12th Pass)' : '12th Pass';
  } else if (
    lower.includes('8th') ||
    lower.includes('8-ஆம்') ||
    lower.includes('8वीं') ||
    lower.includes('எட்டாம்') ||
    lower.includes('आठवीं') ||
    lower.includes('eighth')
  ) {
    education = lang === 'tamil' ? '8-ஆம் வகுப்பு (8th Pass)' : lang === 'hindi' ? '8वीं पास (8th Pass)' : '8th Pass';
  } else if (
    lower.includes('5th') ||
    lower.includes('5-ஆம்') ||
    lower.includes('5वीं') ||
    lower.includes('ஐந்தாம்') ||
    lower.includes('पांचवीं') ||
    lower.includes('fifth')
  ) {
    education = lang === 'tamil' ? '5-ஆம் வகுப்பு (5th Pass)' : lang === 'hindi' ? '5वीं पास (5th Pass)' : '5th Pass';
  } else if (
    lower.includes('degree') ||
    lower.includes('பட்டதாரி') ||
    lower.includes('ग्रेजुएट') ||
    lower.includes('college')
  ) {
    education = lang === 'tamil' ? 'கல்லூரி / பட்டதாரி' : lang === 'hindi' ? 'स्नातक / कॉलेज' : 'Graduate / College';
  } else if (
    lower.includes('படிப்பு இல்லை') ||
    lower.includes('அனபட்படித்த') ||
    lower.includes('अनपढ़') ||
    lower.includes('स्कूल नहीं') ||
    lower.includes('no school') ||
    lower.includes('illiterate')
  ) {
    education = lang === 'tamil' ? 'அடிப்படை எழுத்தறிவு (பள்ளி செல்லவில்லை)' : lang === 'hindi' ? 'बुनियादी साक्षर (स्कूल नहीं गए)' : 'Basic Literacy (No formal schooling)';
  } else {
    // Default sensible default for beneficiaries
    education = lang === 'tamil' ? '10-ஆம் வகுப்பு / அடிப்படை பள்ளிப்படிப்பு' : lang === 'hindi' ? '10वीं / प्राथमिक स्कूल स्तर' : 'Secondary School (8th - 10th Level)';
  }

  // 2. Current Work extraction
  let currentWork = '';
  if (
    lower.includes('farm') ||
    lower.includes('வயல்') ||
    lower.includes('விவசாய') ||
    lower.includes('உழவு') ||
    lower.includes('கால்நடை') ||
    lower.includes('खेत') ||
    lower.includes('खेती') ||
    lower.includes('कृषि') ||
    lower.includes('किसान')
  ) {
    currentWork = lang === 'tamil' ? 'விவசாயக் கூலி / பண்ணை வேலை' : lang === 'hindi' ? 'कृषि मजदूर / खेत का काम' : 'Agricultural / Farm Laborer';
  } else if (
    lower.includes('daily') ||
    lower.includes('கூலி') ||
    lower.includes('தினக்கூலி') ||
    lower.includes('மஜ்தூர்') ||
    lower.includes('मजदूरी') ||
    lower.includes('दिहाड़ी') ||
    lower.includes('wage')
  ) {
    currentWork = lang === 'tamil' ? 'தினக்கூலி தொழிலாளி' : lang === 'hindi' ? 'दैनिक दिहाड़ी मजदूर' : 'Daily Wage Worker';
  } else if (
    lower.includes('construction') ||
    lower.includes('கட்டிட') ||
    lower.includes('சிமெண்ட்') ||
    lower.includes('निर्माण') ||
    lower.includes('भवन')
  ) {
    currentWork = lang === 'tamil' ? 'கட்டிடத் தொழிலாளி (உதவியாளர்)' : lang === 'hindi' ? 'निर्माण सहायक मजदूर' : 'Construction Helper';
  } else if (
    lower.includes('tailor') ||
    lower.includes('தையல்') ||
    lower.includes('துணி') ||
    lower.includes('सिलाई') ||
    lower.includes('दर्जी')
  ) {
    currentWork = lang === 'tamil' ? 'தையல் உதவியாளர்' : lang === 'hindi' ? 'सिलाई सहायक' : 'Tailoring Assistant';
  } else if (
    lower.includes('shop') ||
    lower.includes('கடை') ||
    lower.includes('ஸ்டோர்') ||
    lower.includes('दुकान')
  ) {
    currentWork = lang === 'tamil' ? 'கடை உதவியாளர்' : lang === 'hindi' ? 'दुकान सहायक' : 'Shop Assistant / Helper';
  } else if (
    lower.includes('home') ||
    lower.includes('வீடு') ||
    lower.includes('இல்லத்தரசி') ||
    lower.includes('घर') ||
    lower.includes('गृहणी') ||
    lower.includes('housewife')
  ) {
    currentWork = lang === 'tamil' ? 'குடும்பப் பராமரிப்பு / இல்லத்தரசி' : lang === 'hindi' ? 'गृहणी / घर का कामकाज' : 'Homemaker / Family Care';
  } else {
    currentWork = lang === 'tamil' ? 'சுய வேலை / பண்ணை கூலி' : lang === 'hindi' ? 'स्वतंत्र मजदूर / ग्रामीण काम' : 'Informal / Agricultural Labor';
  }

  // 3. Interests extraction
  let interests = '';
  if (
    lower.includes('electr') ||
    lower.includes('மின்சார') ||
    lower.includes('மின்சாரம்') ||
    lower.includes('ஒயரிங்') ||
    lower.includes('வயரிங்') ||
    lower.includes('बिजली') ||
    lower.includes('वायरिंग') ||
    lower.includes('करंट')
  ) {
    interests = lang === 'tamil' ? 'மின்சார வேலை மற்றும் வயரிங் (Electrician)' : lang === 'hindi' ? 'बिजली मिस्त्री एवं वायरिंग (Electrician)' : 'Electrical Wiring & Equipment Repair';
  } else if (
    lower.includes('tailor') ||
    lower.includes('தையல்') ||
    lower.includes('சட்டை') ||
    lower.includes('சட்டைகள்') ||
    lower.includes('துணி') ||
    lower.includes('सिलाई') ||
    lower.includes('कपड़ा') ||
    lower.includes('सूट') ||
    lower.includes('dress')
  ) {
    interests = lang === 'tamil' ? 'தையல் மற்றும் ஆடை வடிவமைப்பு (Tailoring)' : lang === 'hindi' ? 'सिलाई एवं परिधान निर्माण (Tailoring)' : 'Garment Making & Electric Sewing';
  } else if (
    lower.includes('plumb') ||
    lower.includes('குழாய்') ||
    lower.includes('பைப்') ||
    lower.includes('தண்ணீர்') ||
    lower.includes('नल') ||
    lower.includes('प्लंबर') ||
    lower.includes('पाइप')
  ) {
    interests = lang === 'tamil' ? 'குழாய் பழுது மற்றும் பிளம்பிங் (Plumbing)' : lang === 'hindi' ? 'प्लंबर एवं पाइप फिटिंग (Plumbing)' : 'Plumbing & Water System Maintenance';
  } else if (
    lower.includes('bike') ||
    lower.includes('பைக்') ||
    lower.includes('வாகனம்') ||
    lower.includes('மோட்டார்சைக்கிள்') ||
    lower.includes('बाइक') ||
    lower.includes('स्कूटर') ||
    lower.includes('गाड़ी') ||
    lower.includes('mechanic')
  ) {
    interests = lang === 'tamil' ? 'இருசக்கர வாகன பழுதுபார்த்தல் (Bike Mechanic)' : lang === 'hindi' ? 'बाइक एवं दोपहिया मैकेनिक (Two-Wheeler Mechanic)' : 'Two-Wheeler Servicing & Engine Maintenance';
  } else if (
    lower.includes('solar') ||
    lower.includes('சூரிய') ||
    lower.includes('சோலார்') ||
    lower.includes('सौर') ||
    lower.includes('सोलर')
  ) {
    interests = lang === 'tamil' ? 'சூரிய மின்பலகை தொழில்நுட்பம் (Solar Tech)' : lang === 'hindi' ? 'सौर ऊर्जा एवं सोलर पैनल (Solar Tech)' : 'Solar Panel Installation & Clean Energy';
  } else if (
    lower.includes('farm') ||
    lower.includes('டிராக்டர்') ||
    lower.includes('விவசாய இயந்திரம்') ||
    lower.includes('பால்') ||
    lower.includes('कृषि मशीन') ||
    lower.includes('ट्रैक्टर') ||
    lower.includes('डेयरी')
  ) {
    interests = lang === 'tamil' ? 'விவசாய இயந்திரங்கள் மற்றும் நவீன பால்பண்ணை' : lang === 'hindi' ? 'कृषि उपकरण संचालन एवं आधुनिक डेयरी' : 'Farm Machinery Operation & Modern Dairy';
  } else {
    // Default aspiration
    interests = lang === 'tamil' ? 'மின்சார வேலை & தொழில்நுட்ப பயிற்சி' : lang === 'hindi' ? 'बिजली व तकनीकी कौशल कार्य' : 'Technical Trade & Skilled Self-Employment';
  }

  return { education, current_work: currentWork, interests };
}

/**
 * Pre-defined voice samples for beneficiaries to test with one click
 */
export const SAMPLE_VOICE_PROMPTS: Record<Language, { label: string; text: string }[]> = {
  tamil: [
    {
      label: '⚡ மின்சார வேலை விருப்பம் (10-ஆம் வகுப்பு)',
      text: 'நான் 10-ஆம் வகுப்பு படித்துள்ளேன், தற்போது வயலில் கூலி வேலை செய்கிறேன், புதிய மின்சார வேலை மற்றும் வயரிங் கற்றுக்கொள்ள ஆசைப்படுகிறேன்.',
    },
    {
      label: '🧵 தையல் கலை விருப்பம் (8-ஆம் வகுப்பு)',
      text: 'நான் 8-ஆம் வகுப்பு வரை படித்துள்ளேன், வீட்டில் உள்ளேன், தையல் இயந்திரம் கற்றுக்கொண்டு சொந்தமாக துணி தைக்க விரும்புகிறேன்.',
    },
    {
      label: '🔧 பிளம்பிங் குழாய் வேலை விருப்பம் (பள்ளி செல்லவில்லை)',
      text: 'நான் பள்ளி செல்லவில்லை, தினக்கூலி வேலை செய்கிறேன், குழாய் பழுது பார்க்கும் பிளம்பிங் வேலை கற்றுக்கொள்ள விரும்புகிறேன்.',
    },
  ],
  hindi: [
    {
      label: '⚡ बिजली मिस्त्री काम (10वीं पास)',
      text: 'मैं 10वीं पास हूँ, अभी खेत में मजदूरी करता हूँ, बिजली की वायरिंग और मोटर का काम सीखना चाहता हूँ।',
    },
    {
      label: '🧵 सिलाई काम (8वीं पास)',
      text: 'मैं 8वीं पास हूँ, घर पर काम करती हूँ, सिलाई मशीन चलाना और कपड़े सिलना सीखना चाहती हूँ।',
    },
    {
      label: '🔧 प्लंबर व पाइप काम (बुनियादी साक्षर)',
      text: 'मैं स्कूल नहीं गया, दिहाड़ी मजदूरी करता हूँ, नल और पाइप फिटिंग का काम सीखकर अपनी कमाई बढ़ाना चाहता हूँ।',
    },
  ],
  english: [
    {
      label: '⚡ Electrician Trade (10th Pass)',
      text: 'I am 10th pass, I currently work in farm labor, and I want to learn electrical wiring and motor repair job.',
    },
    {
      label: '🧵 Tailoring & Garments (8th Pass)',
      text: 'I am 8th pass, working as a homemaker, and I want to learn electric sewing machine tailoring for stable earnings.',
    },
    {
      label: '🔧 Plumbing & Sanitary (Informal Work)',
      text: 'I have basic education, currently working as daily laborer, and I want to become a certified plumber.',
    },
  ],
};
