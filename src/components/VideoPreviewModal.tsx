import React, { useState, useEffect } from 'react';
import { JobCardData, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { X, Play, Pause, Volume2, CheckCircle, Award, Wrench, IndianRupee, Clock } from 'lucide-react';
import { speakText } from '../services/bhashini';

interface Props {
  job: JobCardData;
  language: Language;
  onClose: () => void;
  onSelect: (jobId: string) => void;
  isSelected: boolean;
}

export const VideoPreviewModal: React.FC<Props> = ({
  job,
  language,
  onClose,
  onSelect,
  isSelected,
}) => {
  const t = TRANSLATIONS[language];
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  // 3 scenes over 30 seconds (10s per scene)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev - 1;
          if (next > 20) setCurrentSceneIndex(0);
          else if (next > 10) setCurrentSceneIndex(1);
          else setCurrentSceneIndex(2);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, secondsRemaining]);

  const readSceneAloud = () => {
    const textToSpeak = `${job.title}. ${job.summary}. ${job.duties[currentSceneIndex] || ''}. வருமானம் ${job.wage_estimate}.`;
    speakText(textToSpeak, language);
  };

  const getSceneIcon = (index: number) => {
    switch (index) {
      case 0:
        return '🛠️ உபகரணங்கள் மற்றும் பாதுகாப்பு (Tools & Safety)';
      case 1:
        return '⚡ நேரடி செயல்முறை (Hands-on Work)';
      default:
        return '💰 நிறைவு மற்றும் தினசரி வருமானம் (Customer Delivery & Income)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-emerald-500/50 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-lg font-black text-white truncate max-w-[240px]">
              {t.preview_title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-700 active:bg-slate-600 flex items-center justify-center text-slate-200"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video / Visual Simulation Canvas Area */}
        <div className="relative bg-black aspect-video flex flex-col items-center justify-between p-4 border-b border-slate-800 select-none">
          {/* Top Progress & Timer */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-xs font-black bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full">
              LIVE DEMO
            </span>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-black text-amber-300 font-mono">
                {secondsRemaining}s / 30s
              </span>
            </div>
          </div>

          {/* Animated Demonstration Scene Visuals */}
          <div className="flex flex-col items-center justify-center text-center my-auto py-2">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl mb-3 shadow-lg shadow-emerald-500/30 animate-bounce">
              {job.iconName === 'lightbulb' && '💡'}
              {job.iconName === 'scissors' && '✂️'}
              {job.iconName === 'wrench' && '🔧'}
              {job.iconName === 'bike' && '🏍️'}
              {job.iconName === 'sun' && '☀️'}
              {job.iconName === 'tractor' && '🚜'}
            </div>

            <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              {getSceneIcon(currentSceneIndex)}
            </p>
            <h4 className="text-xl font-black text-white mt-1">
              {job.title}
            </h4>
            <p className="text-sm text-slate-300 mt-1 max-w-xs leading-snug">
              {job.duties[currentSceneIndex] || job.summary}
            </p>
          </div>

          {/* Video Control Bar */}
          <div className="w-full flex items-center justify-between pt-2 z-10">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 active:bg-white/30 text-xs font-bold"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              type="button"
              onClick={readSceneAloud}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 active:bg-emerald-500 text-xs font-bold text-white shadow-sm"
            >
              <Volume2 className="w-4 h-4" />
              <span>கேளுங்கள் / Listen</span>
            </button>
          </div>

          {/* 30-Second Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-1000 ease-linear"
              style={{ width: `${((30 - secondsRemaining) / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Job Details & Benefits */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center gap-2">
              <IndianRupee className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">{t.daily_wage_label}</span>
                <span className="text-base font-black text-emerald-300">{job.wage_estimate}</span>
              </div>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">{t.nsqf_badge}</span>
                <span className="text-base font-black text-amber-300">Level {job.nsqf_level} Certified</span>
              </div>
            </div>
          </div>

          {/* Free Tools Provided */}
          <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm mb-1.5">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>இலவச அரசு உபகரணங்கள் (Free Tools Kit):</span>
            </div>
            <ul className="text-xs text-emerald-100 space-y-1 pl-5 list-disc font-medium">
              {job.tools_provided.map((tool, i) => (
                <li key={i}>{tool}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[48px] bg-slate-700 active:bg-slate-600 text-white font-bold rounded-xl text-sm"
          >
            {t.preview_close}
          </button>

          <button
            type="button"
            onClick={() => {
              onSelect(job.id);
              onClose();
            }}
            className={`flex-2 min-h-[48px] font-black rounded-xl text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 ${
              isSelected
                ? 'bg-amber-600 text-white active:bg-amber-700'
                : 'bg-emerald-600 text-white active:bg-emerald-700'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>{isSelected ? t.button_selected : t.button_select}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
