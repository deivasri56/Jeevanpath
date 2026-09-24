import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory mock database store for users & profiles (mirrors Firestore)
interface DBUser {
  uid: string;
  phone?: string;
  language: string;
  created_at: string;
}

interface DBProfile {
  user_id: string;
  transcript: string;
  education: string;
  current_work: string;
  interests: string;
  selected_jobs: string[];
  pdf_url?: string;
}

const usersDb: Record<string, DBUser> = {};
const profilesDb: Record<string, DBProfile> = {};

// Helper NLP extractor for server
function serverExtractProfile(transcript: string, language: string) {
  const lower = (transcript || '').toLowerCase();

  // Education
  let education = '10th Pass';
  if (lower.includes('10th') || lower.includes('10-ஆம்') || lower.includes('10वीं') || lower.includes('दसवीं')) {
    education = language === 'tamil' ? '10-ஆம் வகுப்பு (10th Pass)' : language === 'hindi' ? '10वीं पास (10th Pass)' : '10th Pass';
  } else if (lower.includes('8th') || lower.includes('8-ஆம்') || lower.includes('8वीं')) {
    education = language === 'tamil' ? '8-ஆம் வகுப்பு (8th Pass)' : language === 'hindi' ? '8वीं पास (8th Pass)' : '8th Pass';
  } else if (lower.includes('12th') || lower.includes('12-ஆம்') || lower.includes('12वीं')) {
    education = language === 'tamil' ? '12-ஆம் வகுப்பு (12th Pass)' : language === 'hindi' ? '12वीं पास (12th Pass)' : '12th Pass';
  } else if (lower.includes('no school') || lower.includes('பள்ளி செல்லவில்லை') || lower.includes('अनपढ़')) {
    education = language === 'tamil' ? 'அடிப்படை எழுத்தறிவு (பள்ளி செல்லவில்லை)' : language === 'hindi' ? 'बुनियादी साक्षर (स्कूल नहीं गए)' : 'Basic Literacy';
  }

  // Current work
  let current_work = 'Farm Laborer';
  if (lower.includes('farm') || lower.includes('வயல்') || lower.includes('விவசாய') || lower.includes('खेत') || lower.includes('खेती')) {
    current_work = language === 'tamil' ? 'விவசாயக் கூலி / பண்ணை வேலை' : language === 'hindi' ? 'कृषि मजदूर / खेत का काम' : 'Agricultural / Farm Laborer';
  } else if (lower.includes('daily') || lower.includes('கூலி') || lower.includes('मजदूर') || lower.includes('मजदूरी')) {
    current_work = language === 'tamil' ? 'தினக்கூலி தொழிலாளி' : language === 'hindi' ? 'दैनिक दिहाड़ी मजदूर' : 'Daily Wage Worker';
  } else if (lower.includes('tailor') || lower.includes('தையல்') || lower.includes('सिलाई')) {
    current_work = language === 'tamil' ? 'தையல் உதவியாளர்' : language === 'hindi' ? 'सिलाई सहायक' : 'Tailoring Assistant';
  }

  // Interests
  let interests = 'Electrical Wiring & Repair';
  if (lower.includes('electr') || lower.includes('மின்சார') || lower.includes('மின்சாரம்') || lower.includes('बिजली') || lower.includes('करंट')) {
    interests = language === 'tamil' ? 'மின்சார வேலை மற்றும் வயரிங் (Electrician)' : language === 'hindi' ? 'बिजली मिस्त्री एवं वायरिंग (Electrician)' : 'Electrical Wiring & Repair';
  } else if (lower.includes('tailor') || lower.includes('தையல்') || lower.includes('துணி') || lower.includes('सिलाई')) {
    interests = language === 'tamil' ? 'தையல் மற்றும் ஆடை வடிவமைப்பு (Tailoring)' : language === 'hindi' ? 'सिलाई एवं परिधान निर्माण (Tailoring)' : 'Tailoring & Garment Making';
  } else if (lower.includes('plumb') || lower.includes('குழாய்') || lower.includes('பைப்') || lower.includes('नल') || lower.includes('प्लंबर')) {
    interests = language === 'tamil' ? 'குழாய் பழுது மற்றும் பிளம்பிங் (Plumbing)' : language === 'hindi' ? 'प्लंबर एवं पाइप फिटिंग (Plumbing)' : 'Plumbing & Water Systems';
  } else if (lower.includes('bike') || lower.includes('பைக்') || lower.includes('வாகனம்') || lower.includes('बाइक')) {
    interests = language === 'tamil' ? 'இருசக்கர வாகன மெக்கானிக்' : language === 'hindi' ? 'बाइक मैकेनिक' : 'Two-Wheeler Mechanic';
  }

  return { education, current_work, interests };
}

// 1. POST /api/language/select - saves user's language preference
app.post('/api/language/select', (req: Request, res: Response) => {
  const { uid, language, phone } = req.body;
  const safeUid = uid || 'jp_sc_' + Date.now();
  const safeLang = language || 'tamil';

  const user: DBUser = {
    uid: safeUid,
    phone: phone || '',
    language: safeLang,
    created_at: new Date().toISOString(),
  };

  usersDb[safeUid] = user;

  res.json({
    status: 'success',
    message: 'Language preference saved successfully',
    user,
  });
});

// 2. POST /api/voice/interview - receives audio/text, returns transcript + extracted profile
app.post('/api/voice/interview', (req: Request, res: Response) => {
  const { audio_text, language, uid } = req.body;
  const safeLang = language || 'tamil';

  const transcript =
    audio_text ||
    (safeLang === 'tamil'
      ? 'நான் 10-ஆம் வகுப்பு படித்துள்ளேன், வயலில் கூலி வேலை செய்கிறேன், மின்சார வேலை கற்றுக்கொள்ள விரும்புகிறேன்.'
      : safeLang === 'hindi'
      ? 'मैं 10वीं पास हूँ, खेत में काम करता हूँ, बिजली का काम सीखना चाहता हूँ।'
      : 'I am 10th pass, I work in farm, I want electrical job');

  const safeUid = uid || 'jp_sc_' + Date.now();
  const { education, current_work, interests } = serverExtractProfile(transcript, safeLang);

  const profile: DBProfile = {
    user_id: safeUid,
    transcript,
    education,
    current_work,
    interests,
    selected_jobs: [],
  };

  profilesDb[safeUid] = profile;

  res.json({
    status: 'success',
    transcript,
    education,
    current_work,
    interests,
    user_id: safeUid,
  });
});

// 3. GET /api/jobs/recommend - returns top 3 jobs based on profile
app.get('/api/jobs/recommend', (req: Request, res: Response) => {
  const uid = req.query.uid as string;
  const lang = (req.query.lang as string) || 'tamil';

  const profile = uid ? profilesDb[uid] : null;
  const interestText = profile ? profile.interests.toLowerCase() : '';

  // Return curated top 3 jobs based on interest
  let top3 = ['job_electrician', 'job_tailor', 'job_plumber'];
  if (interestText.includes('tailor') || interestText.includes('தையல்') || interestText.includes('सिलाई')) {
    top3 = ['job_tailor', 'job_electrician', 'job_plumber'];
  } else if (interestText.includes('plumb') || interestText.includes('குழாய்') || interestText.includes('प्लंबर')) {
    top3 = ['job_plumber', 'job_electrician', 'job_tailor'];
  } else if (interestText.includes('bike') || interestText.includes('பைக்') || interestText.includes('बाइक')) {
    top3 = ['job_twowheeler', 'job_electrician', 'job_solar'];
  }

  res.json({
    status: 'success',
    language: lang,
    recommended_job_ids: top3,
    total_count: 3,
  });
});

// 4. POST /api/report/generate - creates simple PDF reference, returns WhatsApp/download link
app.post('/api/report/generate', (req: Request, res: Response) => {
  const { uid, phone, selected_jobs, language } = req.body;
  const safeUid = uid || 'jp_sc_' + Date.now();

  const pdfUrl = `/reports/JeevanPath_Report_${safeUid}.pdf`;

  if (profilesDb[safeUid]) {
    profilesDb[safeUid].selected_jobs = selected_jobs || [];
    profilesDb[safeUid].pdf_url = pdfUrl;
  }

  const whatsappText = encodeURIComponent(
    `JeevanPath Livelihood Report for Beneficiary ${safeUid}. Selected jobs: ${(selected_jobs || []).join(', ')}. Training centre helpline: 1800-425-2424.`
  );

  res.json({
    status: 'success',
    pdf_url: pdfUrl,
    whatsapp_link: `https://api.whatsapp.com/send?text=${whatsappText}`,
    beneficiary_id: safeUid,
    timestamp: new Date().toISOString(),
  });
});

// Mount Vite in development mode
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`JeevanPath Server listening on port ${PORT}`);
  });
}

startServer();
