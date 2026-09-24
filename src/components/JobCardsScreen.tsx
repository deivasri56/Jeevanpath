import React, { useState } from 'react';
import { JobCardData, Language, ExtractedProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { VideoPreviewModal } from './VideoPreviewModal';
import {
  Lightbulb,
  Scissors,
  Wrench,
  Bike,
  Sun,
  Tractor,
  Star,
  Play,
  CheckCircle2,
  Circle,
  FileText,
  Volume2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { speakText } from '../services/bhashini';

interface Props {
  jobs: JobCardData[];
  language: Language;
  profile: ExtractedProfile;
  selectedJobIds: string[];
  onToggleJobSelection: (jobId: string) => void;
  onProceedToReport: () => void;
  onBackToVoice: () => void;
}

export const JobCardsScreen: React.FC<Props> = ({
  jobs,
  language,
  profile,
  selectedJobIds,
  onToggleJobSelection,
  onProceedToReport,
  onBackToVoice,
}) => {
  const t = TRANSLATIONS[language];
  const [previewJob, setPreviewJob] = useState<JobCardData | null>(null);

  const getJobIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'lightbulb':
        return <Lightbulb className="w-10 h-10 text-amber-500 stroke-[2.2]" />;
      case 'scissors':
        return <Scissors className="w-10 h-10 text-emerald-600 stroke-[2.2]" />;
      case 'wrench':
        return <Wrench className="w-10 h-10 text-blue-600 stroke-[2.2]" />;
      case 'bike':
        return <Bike className="w-10 h-10 text-indigo-600 stroke-[2.2]" />;
      case 'sun':
        return <Sun className="w-10 h-10 text-yellow-500 stroke-[2.2]" />;
      case 'tractor':
        return <Tractor className="w-10 h-10 text-green-700 stroke-[2.2]" />;
      default:
        return <Lightbulb className="w-10 h-10 text-amber-500 stroke-[2.2]" />;
    }
  };

  const getNsqfColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 2:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 3:
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const renderStars = (stars: number) => {
    return (
      <div className="flex items-center gap-1 text-amber-500" title={`${stars} stars`}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-5 h-5 ${s <= stars ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`}
          />
        ))}
      </div>
    );
  };

  const readJobAloud = (job: JobCardData) => {
    const speech = `${job.title}. ${t.daily_wage_label} ${job.wage_estimate}. ${job.training_duration}.`;
    speakText(speech, language);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between max-w-md mx-auto p-4 sm:p-5 select-none pb-28">
      {/* Top Navigation */}
      <header className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBackToVoice}
          className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl active:bg-slate-200 min-h-[48px] touch-manipulation"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.back_button}</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            படி 3 / Step 3
          </span>
        </div>
      </header>

      {/* Spoken Profile Confirmation Card */}
      <div className="my-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            {t.extracted_summary_title}
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            AI Verified
          </span>
        </div>
        <div className="text-xs text-slate-600 space-y-1">
          <p>
            <span className="font-bold text-slate-800">{t.extracted_education}</span> {profile.education}
          </p>
          <p>
            <span className="font-bold text-slate-800">{t.extracted_work}</span> {profile.current_work}
          </p>
          <p>
            <span className="font-bold text-slate-800">{t.extracted_interest}</span> {profile.interests}
          </p>
        </div>
      </div>

      {/* Screen Title */}
      <div className="text-center mb-3">
        <h2 className="text-2xl font-black text-slate-900 leading-tight">
          {t.jobs_title}
        </h2>
        <p className="text-sm font-medium text-slate-600 mt-0.5">
          {t.jobs_subtitle}
        </p>
      </div>

      {/* 3 JOB CARDS (NOT A LIST) */}
      <div className="space-y-4 my-2">
        {jobs.map((job) => {
          const isSelected = selectedJobIds.includes(job.id);

          return (
            <div
              key={job.id}
              className={`bg-white rounded-3xl p-5 border-3 transition-all shadow-md touch-manipulation relative overflow-hidden ${
                isSelected
                  ? 'border-emerald-500 ring-4 ring-emerald-400/20 bg-emerald-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Selected corner ribbon */}
              {isSelected && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-black uppercase px-4 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.button_selected}</span>
                </div>
              )}

              {/* Card Top: Big Icon & Badges */}
              <div className="flex items-start justify-between gap-3 mb-3">
                {/* Large Job Icon Box */}
                <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                  {getJobIconComponent(job.iconName)}
                </div>

                <div className="flex-1 pr-14">
                  {/* NSQF Badge */}
                  <span
                    className={`inline-block text-xs font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider mb-1.5 ${getNsqfColor(
                      job.nsqf_level
                    )}`}
                  >
                    {t.nsqf_badge} {job.nsqf_level}
                  </span>

                  {/* Stars Match Rating */}
                  <div className="flex items-center gap-1.5">
                    {renderStars(job.stars)}
                    <span className="text-xs font-bold text-slate-600">
                      {job.match_score}% {t.match_label}
                    </span>
                  </div>
                </div>

                {/* Audio readout button */}
                <button
                  type="button"
                  onClick={() => readJobAloud(job)}
                  className="w-12 h-12 rounded-full bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200"
                  title="Listen"
                  aria-label="Read job details aloud"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>

              {/* Job Title */}
              <h3 className="text-xl font-black text-slate-900 leading-snug">
                {job.title}
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                {job.title_en}
              </p>

              {/* Daily Wage & Free Toolkit info */}
              <div className="my-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 block font-bold">
                    {t.daily_wage_label}
                  </span>
                  <span className="text-base font-black text-emerald-950">
                    {job.wage_estimate}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-600 block">கால அளவு:</span>
                  <span className="text-xs font-black text-slate-800">{job.training_duration}</span>
                </div>
              </div>

              {/* Free Benefits badge */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.training_free_badge}</span>
              </div>

              {/* 2 Buttons per card: "Preview" and "Select" */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                {/* Button 1: Preview (plays 30-sec demo) */}
                <button
                  type="button"
                  onClick={() => setPreviewJob(job)}
                  className="min-h-[50px] bg-slate-800 active:bg-slate-900 text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs touch-manipulation"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{t.button_preview}</span>
                </button>

                {/* Button 2: Select */}
                <button
                  type="button"
                  onClick={() => onToggleJobSelection(job.id)}
                  className={`min-h-[50px] rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98 touch-manipulation ${
                    isSelected
                      ? 'bg-emerald-600 text-white active:bg-emerald-700'
                      : 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400 active:bg-emerald-200'
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-emerald-700" />
                  )}
                  <span>{isSelected ? t.button_selected : t.button_select}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Action Bar with "Get Your Report" button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 z-40 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600">
            {t.jobs_selected_count} <b className="text-emerald-700 text-sm">{selectedJobIds.length} / 3</b>
          </span>
          {selectedJobIds.length === 0 && (
            <span className="text-xs font-bold text-amber-700">
              ஏதேனும் ஒரு வேலையைத் தேர்ந்தெடுக்கவும்
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onProceedToReport}
          disabled={selectedJobIds.length === 0}
          className={`w-full min-h-[56px] rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-2 shadow-xl transition-transform active:scale-98 touch-manipulation cursor-pointer ${
            selectedJobIds.length > 0
              ? 'bg-emerald-600 active:bg-emerald-700 text-white shadow-emerald-600/40'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
          aria-label={t.get_report_button}
        >
          <FileText className="w-6 h-6" />
          <span>{t.get_report_button}</span>
        </button>
      </div>

      {/* Video Preview Modal */}
      {previewJob && (
        <VideoPreviewModal
          job={previewJob}
          language={language}
          onClose={() => setPreviewJob(null)}
          onSelect={(jobId) => onToggleJobSelection(jobId)}
          isSelected={selectedJobIds.includes(previewJob.id)}
        />
      )}
    </div>
  );
};
