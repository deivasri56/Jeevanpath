import React, { useState } from 'react';
import { JobCardData, Language, ExtractedProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { generateSimplePDF } from '../services/pdfGenerator';
import {
  Download,
  Share2,
  Phone,
  PhoneCall,
  MapPin,
  Award,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { speakText } from '../services/bhashini';

interface Props {
  language: Language;
  profile: ExtractedProfile;
  selectedJobs: JobCardData[];
  onStartOver: () => void;
  userPhone: string;
  onUpdatePhone: (phone: string) => void;
}

export const ReportScreen: React.FC<Props> = ({
  language,
  profile,
  selectedJobs,
  onStartOver,
  userPhone,
  onUpdatePhone,
}) => {
  const t = TRANSLATIONS[language];
  const [phoneNumber, setPhoneNumber] = useState(userPhone || '');
  const [isSavedPhone, setIsSavedPhone] = useState(Boolean(userPhone));
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const primaryCentre = selectedJobs[0]?.nearest_centre || {
    name: 'District Skill Development & Training Centre (PMKK)',
    address: 'District Collectorate Complex, Near Industrial Area',
    contact_person: 'Shri K. Rajesh (Training Coordinator)',
    phone: '98401 23456',
    helpline: '1800-425-2424',
    stipend_info: 'Free training + Free Tool Kit + Daily Stipend',
  };

  const handlePhoneSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 10) {
      setIsSavedPhone(true);
      onUpdatePhone(phoneNumber.trim());
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Call backend report generation endpoint as well
      try {
        await fetch('/api/report/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: profile.user_id,
            phone: phoneNumber || 'Not provided',
            language,
            selected_jobs: selectedJobs.map((j) => j.id),
          }),
        });
      } catch (err) {
        console.warn('Backend report endpoint fallback:', err);
      }

      // Generate client 1-page PDF
      const doc = generateSimplePDF({
        uid: profile.user_id,
        phone: phoneNumber || 'Not provided',
        language,
        education: profile.education,
        currentWork: profile.current_work,
        selectedJobs,
      });

      doc.save(`JeevanPath_Livelihood_Report_${profile.user_id.slice(-6)}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToWhatsApp = () => {
    const jobListText = selectedJobs
      .map((j, i) => `${i + 1}. ${j.title_en} (${j.title}) - ${j.wage_estimate}`)
      .join('\n');

    const message = `*🏛️ ஜீவன்பாத் - வாழ்வாதார அறிக்கை (JeevanPath Report)*
-----------------------------------
*பயனாளர் எண் (Beneficiary ID):* ${profile.user_id}
*மொபைல் எண் (Phone):* ${phoneNumber || 'Not provided'}
*கல்வி (Education):* ${profile.education}

*தேர்ந்தெடுக்கப்பட்ட வேலைகள் (Selected Trades):*
${jobListText}

*அருகிலுள்ள அரசு பயிற்சி மையம் (Nearest Skill Centre):*
🏢 ${primaryCentre.name}
📍 ${primaryCentre.address}
📞 தொடர்பு: ${primaryCentre.contact_person} (${primaryCentre.phone})
☎️ இலவச உதவி எண் (Helpline): ${primaryCentre.helpline}

*அரசு சலுகைகள்:*
✅ 100% இலவச அரசு சான்றிதழ்
✅ இலவச உபகரணங்கள் (Tool Kit)
✅ தினசரி உதவித்தொகை

_இத்திட்டம் முற்றிலும் இலவசம் மற்றும் அரசு SC நலத்துறையால் அங்கீகரிக்கப்பட்டது._`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  };

  const readReportAloud = () => {
    const jobTitles = selectedJobs.map((j) => j.title).join(', ');
    const text = `${t.report_title}. நீங்கள் தேர்ந்தெடுத்த வேலைகள்: ${jobTitles}. அருகிலுள்ள பயிற்சி மையம்: ${primaryCentre.name}, தொடர்பு எண் ${primaryCentre.phone}. உதவி எண் ${primaryCentre.helpline}.`;
    speakText(text, language);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between max-w-md mx-auto p-4 sm:p-5 select-none pb-12">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            படி 4: இறுதி அறிக்கை
          </span>
        </div>
        <button
          type="button"
          onClick={readReportAloud}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-700 active:bg-slate-200 text-xs font-bold shadow-xs min-h-[44px]"
        >
          <Volume2 className="w-5 h-5 text-emerald-600" />
          <span>{t.listen_prompt}</span>
        </button>
      </header>

      {/* Main Card Header */}
      <div className="text-center my-3 bg-emerald-700 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="w-14 h-14 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-2">
          <Award className="w-8 h-8 text-amber-300" />
        </div>
        <h2 className="text-2xl font-black text-white">
          {t.report_title}
        </h2>
        <p className="text-xs text-emerald-100 mt-1 font-medium">
          {t.report_subtitle}
        </p>
        <p className="text-[11px] text-emerald-200 mt-2 font-mono">
          ID: {profile.user_id}
        </p>
      </div>

      {/* Beneficiary Phone Number Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>{t.phone_number_label}</span>
        </label>

        {isSavedPhone ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-3 rounded-xl">
            <span className="text-base font-black text-emerald-900 font-mono">
              +91 {phoneNumber}
            </span>
            <button
              type="button"
              onClick={() => setIsSavedPhone(false)}
              className="text-xs font-bold text-slate-600 underline"
            >
              மாற்று / Edit
            </button>
          </div>
        ) : (
          <form onSubmit={handlePhoneSave} className="flex gap-2">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder={t.phone_placeholder}
              className="flex-1 bg-slate-50 border-2 border-slate-300 rounded-xl px-3 py-2 text-base font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
              maxLength={10}
            />
            <button
              type="submit"
              className="min-h-[48px] px-4 bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-xl text-sm"
            >
              {t.save_phone_button}
            </button>
          </form>
        )}
      </div>

      {/* Selected Jobs Summary */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-3">
        <h3 className="text-xs font-black uppercase text-slate-600 tracking-wide mb-2.5 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>தேர்ந்தெடுக்கப்பட்ட தொழில்கள் ({selectedJobs.length}):</span>
        </h3>

        <div className="space-y-2">
          {selectedJobs.map((job, idx) => (
            <div
              key={job.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <div className="pr-2">
                <span className="text-sm font-black text-slate-900 block">
                  {idx + 1}. {job.title}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {job.wage_estimate} • {t.nsqf_badge} {job.nsqf_level}
                </span>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Nearest Training Centre Card */}
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl shadow-xs mb-4">
        <h3 className="text-xs font-black text-amber-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-amber-700" />
          <span>{t.nearest_training_centre}</span>
        </h3>

        <p className="text-base font-black text-slate-900 mt-1">
          {primaryCentre.name}
        </p>
        <p className="text-xs text-slate-700 mt-1 font-medium">
          {primaryCentre.address}
        </p>
        <p className="text-xs text-slate-700 mt-1">
          <b>ஒருங்கிணைப்பாளர்:</b> {primaryCentre.contact_person}
        </p>

        {/* Direct Phone Call Button */}
        <div className="mt-3 flex gap-2">
          <a
            href={`tel:${primaryCentre.phone}`}
            className="flex-1 min-h-[48px] bg-amber-600 active:bg-amber-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-sm touch-manipulation"
          >
            <PhoneCall className="w-4 h-4" />
            <span>அழைக்க: {primaryCentre.phone}</span>
          </a>

          <a
            href={`tel:${primaryCentre.helpline}`}
            className="min-h-[48px] px-3 bg-white border border-amber-400 text-amber-900 rounded-xl font-bold text-xs flex items-center justify-center text-center leading-tight active:bg-amber-100"
          >
            இலவச எண்<br />1800-425-2424
          </a>
        </div>
      </div>

      {/* Download Success Notice */}
      {downloadSuccess && (
        <div className="p-3 bg-emerald-100 text-emerald-900 text-sm font-bold rounded-xl border border-emerald-400 text-center mb-3">
          ✓ PDF வெற்றிகரமாக சேமிக்கப்பட்டது! (PDF Downloaded)
        </div>
      )}

      {/* 2 Primary Action Buttons: "Download PDF" and "Send to WhatsApp" */}
      <div className="space-y-3">
        {/* Option 1: Download PDF */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="w-full min-h-[56px] bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-transform active:scale-98 touch-manipulation cursor-pointer"
        >
          {isGenerating ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-6 h-6" />
          )}
          <span>{t.download_pdf}</span>
        </button>

        {/* Option 2: Send to WhatsApp */}
        <button
          type="button"
          onClick={handleSendToWhatsApp}
          className="w-full min-h-[56px] bg-[#25D366] active:bg-[#1EBE5D] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-transform active:scale-98 touch-manipulation cursor-pointer"
        >
          <Share2 className="w-6 h-6" />
          <span>{t.send_whatsapp}</span>
        </button>
      </div>

      {/* Restart / Start Over */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl active:bg-slate-200 min-h-[48px]"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>{t.start_over}</span>
        </button>
      </div>
    </div>
  );
};
