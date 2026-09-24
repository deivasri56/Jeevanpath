import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Volume2 } from 'lucide-react';
import { speakText } from '../services/bhashini';

interface Props {
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageScreen: React.FC<Props> = ({ onSelectLanguage }) => {
  const playAudioCue = (e: React.MouseEvent, lang: Language) => {
    e.stopPropagation();
    if (lang === 'tamil') {
      speakText('தமிழ் மொழியைத் தேர்ந்தெடுக்க இங்கே தொடவும்.', 'tamil');
    } else if (lang === 'hindi') {
      speakText('हिंदी भाषा चुनने के लिए यहाँ दबाएं।', 'hindi');
    } else {
      speakText('Press here to choose English language.', 'english');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto select-none">
      {/* Top Welcome & Identity */}
      <header className="pt-6 pb-2 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-3 border-2 border-emerald-400/40 shadow-lg">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
          JeevanPath
        </h1>
        <p className="text-base text-emerald-300 font-semibold">
          ஜீவன்பாத் • जीवनपथ • Livelihood Guide
        </p>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
          SC Beneficiary Skill & Employment Mission
        </p>
      </header>

      {/* Main Instruction */}
      <div className="text-center my-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shadow-md">
        <p className="text-xl font-bold text-amber-300">
          மொழியைத் தேர்ந்தெடுக்கவும் / भाषा चुनें
        </p>
        <p className="text-sm text-slate-300 mt-1">
          Select your language to continue
        </p>
      </div>

      {/* 3 Large Full-Screen Language Selection Buttons */}
      <div className="space-y-4 my-auto">
        {/* 1. Tamil Button with Tamil Nadu Map Icon */}
        <button
          type="button"
          onClick={() => onSelectLanguage('tamil')}
          className="w-full min-h-[96px] bg-gradient-to-r from-amber-600 to-amber-700 active:scale-98 active:from-amber-700 active:to-amber-800 rounded-2xl p-4 flex items-center justify-between shadow-xl border-2 border-amber-400/50 text-left transition-transform touch-manipulation"
          aria-label="Select Tamil language"
        >
          <div className="flex items-center space-x-4">
            {/* Tamil Nadu Map Emblem Icon */}
            <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center p-2 border border-white/30 shrink-0">
              <svg viewBox="0 0 64 64" className="w-10 h-10 fill-amber-200 stroke-amber-900" strokeWidth="2">
                {/* Simplified Tamil Nadu Geographical Shape */}
                <path d="M 28 6 C 36 8, 44 14, 46 22 C 48 30, 44 38, 38 46 C 34 52, 28 58, 22 58 C 18 54, 18 42, 22 34 C 20 28, 22 18, 28 6 Z" />
                <circle cx="34" cy="30" r="3" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <span className="block text-2xl font-black text-white">தமிழ்</span>
              <span className="block text-sm text-amber-100 font-medium">Tamil Nadu (தமிழ்நாடு)</span>
            </div>
          </div>

          {/* Audio Speaker Prompt Button */}
          <button
            type="button"
            onClick={(e) => playAudioCue(e, 'tamil')}
            className="w-12 h-12 rounded-full bg-white/20 active:bg-white/40 flex items-center justify-center text-white shrink-0 border border-white/30"
            title="Listen in Tamil"
            aria-label="Listen audio prompt for Tamil"
          >
            <Volume2 className="w-6 h-6 text-amber-200" />
          </button>
        </button>

        {/* 2. Hindi Button with India Map Icon */}
        <button
          type="button"
          onClick={() => onSelectLanguage('hindi')}
          className="w-full min-h-[96px] bg-gradient-to-r from-emerald-600 to-emerald-700 active:scale-98 active:from-emerald-700 active:to-emerald-800 rounded-2xl p-4 flex items-center justify-between shadow-xl border-2 border-emerald-400/50 text-left transition-transform touch-manipulation"
          aria-label="Select Hindi language"
        >
          <div className="flex items-center space-x-4">
            {/* India Map Outline Icon */}
            <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center p-2 border border-white/30 shrink-0">
              <svg viewBox="0 0 64 64" className="w-10 h-10 fill-emerald-200 stroke-emerald-900" strokeWidth="2">
                {/* Simplified India Outline representation */}
                <path d="M 30 6 C 35 12, 44 14, 46 22 C 48 30, 52 38, 42 46 C 36 52, 34 58, 32 60 C 28 54, 22 46, 18 36 C 14 26, 20 16, 30 6 Z" />
                <circle cx="32" cy="30" r="3" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <span className="block text-2xl font-black text-white">हिंदी</span>
              <span className="block text-sm text-emerald-100 font-medium">India (भारत)</span>
            </div>
          </div>

          {/* Audio Speaker Prompt Button */}
          <button
            type="button"
            onClick={(e) => playAudioCue(e, 'hindi')}
            className="w-12 h-12 rounded-full bg-white/20 active:bg-white/40 flex items-center justify-center text-white shrink-0 border border-white/30"
            title="Listen in Hindi"
            aria-label="Listen audio prompt for Hindi"
          >
            <Volume2 className="w-6 h-6 text-emerald-200" />
          </button>
        </button>

        {/* 3. English Button with Globe Icon */}
        <button
          type="button"
          onClick={() => onSelectLanguage('english')}
          className="w-full min-h-[96px] bg-gradient-to-r from-blue-600 to-blue-700 active:scale-98 active:from-blue-700 active:to-blue-800 rounded-2xl p-4 flex items-center justify-between shadow-xl border-2 border-blue-400/50 text-left transition-transform touch-manipulation"
          aria-label="Select English language"
        >
          <div className="flex items-center space-x-4">
            {/* Globe Icon */}
            <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center p-2 border border-white/30 shrink-0">
              <svg viewBox="0 0 24 24" className="w-10 h-10 stroke-blue-200 fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <span className="block text-2xl font-black text-white">English</span>
              <span className="block text-sm text-blue-100 font-medium">Global / India</span>
            </div>
          </div>

          {/* Audio Speaker Prompt Button */}
          <button
            type="button"
            onClick={(e) => playAudioCue(e, 'english')}
            className="w-12 h-12 rounded-full bg-white/20 active:bg-white/40 flex items-center justify-center text-white shrink-0 border border-white/30"
            title="Listen in English"
            aria-label="Listen audio prompt for English"
          >
            <Volume2 className="w-6 h-6 text-blue-200" />
          </button>
        </button>
      </div>

      {/* Footer reassurance */}
      <footer className="pt-4 pb-2 text-center text-xs text-slate-400">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          100% Free Govt SC Welfare Initiative • No Typing Required
        </p>
      </footer>
    </div>
  );
};
