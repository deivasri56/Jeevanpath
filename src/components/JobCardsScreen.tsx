import React, { useState } from 'react';
import { JobCardData, Language, ExtractedProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { VideoPreviewModal } from './VideoPreviewModal';
import { SkillGaps } from './SkillGaps';
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
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Zap,
  XCircle,
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

// ── Helper: localised job title ───────────────────────────────────────────────
function getLocalTitle(job: JobCardData, language: Language): string {
  if (language === 'tamil' && job.title_ta) return job.title_ta;
  if (language === 'hindi' && job.title_hi) return job.title_hi;
  return job.title_en || job.title;
}

// ── Helper: icon component ────────────────────────────────────────────────────
function JobIcon({ iconName }: { iconName: string }) {
  const cls = 'w-10 h-10 stroke-[2.2]';
  switch (iconName) {
    case 'lightbulb': return <Lightbulb className={`${cls} text-slate-500`} />;
    case 'scissors':  return <Scissors  className={`${cls} text-indigo-600`} />;
    case 'wrench':    return <Wrench    className={`${cls} text-blue-600`} />;
    case 'bike':      return <Bike      className={`${cls} text-indigo-600`} />;
    case 'sun':       return <Sun       className={`${cls} text-yellow-500`} />;
    case 'tractor':   return <Tractor   className={`${cls} text-green-700`} />;
    default:          return <Lightbulb className={`${cls} text-slate-500`} />;
  }
}

// ── Helper: NSQF badge colour ─────────────────────────────────────────────────
function nsqfStyle(level: number) {
  switch (level) {
    case 1: return { pill: 'bg-blue-100 text-blue-900 border-blue-300',    dot: 'bg-blue-500',    label: 'Entry' };
    case 2: return { pill: 'bg-indigo-50 text-indigo-900 border-indigo-200', dot: 'bg-indigo-50/500', label: 'Skilled' };
    case 3: return { pill: 'bg-slate-100 text-slate-900 border-slate-300', dot: 'bg-slate-500',   label: 'Advanced' };
    default: return { pill: 'bg-slate-100 text-slate-800 border-slate-300', dot: 'bg-slate-500',  label: '' };
  }
}

// ── Helper: match score → star count ─────────────────────────────────────────
function scoreToStars(score: number): number {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 55) return 3;
  if (score >= 35) return 2;
  return 1;
}

// ── Helper: match score → colour class ───────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return { bar: 'from-indigo-400 to-indigo-600', text: 'text-indigo-700', bg: 'bg-indigo-50/50' };
  if (score >= 60) return { bar: 'from-slate-400 to-orange-500',   text: 'text-slate-700',   bg: 'bg-slate-50'   };
  return               { bar: 'from-rose-300 to-rose-500',          text: 'text-rose-500',     bg: 'bg-rose-50/50'     };
}

// ── Star renderer ─────────────────────────────────────────────────────────────
function StarRow({ score }: { score: number }) {
  const stars = scoreToStars(score);
  return (
    <div className="flex items-center gap-0.5" title={`${stars} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 transition-colors ${
            s <= stars ? 'fill-slate-400 text-slate-400' : 'fill-slate-200 text-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

// ── Match progress bar ────────────────────────────────────────────────────────
function MatchBar({ score, label }: { score: number; label: string }) {
  const c = scoreColor(score);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <span className={`text-sm font-bold ${c.text}`}>{score}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${c.bar} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ── Mini skill pill ───────────────────────────────────────────────────────────
function SkillPill({ text, type }: { text: string; type: 'have' | 'gap' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border ${
        type === 'have'
          ? 'bg-indigo-50/50 text-indigo-800 border-indigo-100'
          : 'bg-rose-50/50 text-rose-700 border-rose-100'
      }`}
    >
      {type === 'have'
        ? <CheckCircle2 className="w-3 h-3 shrink-0" />
        : <XCircle className="w-3 h-3 shrink-0" />}
      <span className="truncate max-w-[150px]">{text}</span>
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
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
  const [previewJob, setPreviewJob]   = useState<JobCardData | null>(null);
  const [gapJob, setGapJob]           = useState<JobCardData | null>(null);
  const [expandedId, setExpandedId]   = useState<string | null>(null);

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const readJobAloud = (job: JobCardData) => {
    const localTitle = getLocalTitle(job, language);
    const speech = `${localTitle}. ${t.daily_wage_label} ${job.wage_estimate}. ${job.training_duration}.`;
    speakText(speech, language);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col max-w-md mx-auto p-4 sm:p-5 select-none pb-32">

      {/* ── Top Navigation ── */}
      <header className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={onBackToVoice}
          className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl active:bg-slate-200 min-h-[48px] touch-manipulation"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.back_button}</span>
        </button>

        <span className="text-xs font-bold uppercase text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          படி 3 / Step 3
        </span>
      </header>

      {/* ── Profile Summary Card ── */}
      <div className="my-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            {t.extracted_summary_title}
          </span>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50/50 px-2 py-0.5 rounded-md border border-indigo-100">
            AI Verified
          </span>
        </div>
        <div className="text-xs text-slate-600 space-y-1">
          <p><span className="font-bold text-slate-800">{t.extracted_education}</span> {profile.education}</p>
          <p><span className="font-bold text-slate-800">{t.extracted_work}</span> {profile.current_work}</p>
          <p><span className="font-bold text-slate-800">{t.extracted_interest}</span> {profile.interests}</p>
        </div>
      </div>

      {/* ── Screen Title ── */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{t.jobs_title}</h2>
        <p className="text-sm font-medium text-slate-600 mt-0.5">{t.jobs_subtitle}</p>
      </div>

      {/* ══ JOB CARDS ══ */}
      <div className="space-y-5">
        {jobs.map((job) => {
          const isSelected = selectedJobIds.includes(job.id);
          const isExpanded = expandedId === job.id;
          const nsqf       = nsqfStyle(job.nsqf_level);
          const sc         = scoreColor(job.match_score);
          const localTitle = getLocalTitle(job, language);
          const hasGaps    = job.skill_gaps && job.skill_gaps.length > 0;
          // Show up to 2 competencies as "have" pills; remaining gaps as "gap" pills
          const havePills  = (job.qp_competencies || job.duties || []).slice(0, 2);
          const gapPills   = (job.skill_gaps || []).slice(0, 2);

          return (
            <div
              key={job.id}
              className={`bg-white rounded-3xl border shadow-sm transition-all duration-300 overflow-hidden touch-manipulation relative ${
                isSelected
                  ? 'border-indigo-50/500 ring-4 ring-indigo-400/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Selected ribbon */}
              {isSelected && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-bold uppercase px-4 py-1 rounded-bl-2xl flex items-center gap-1 z-10">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.button_selected}</span>
                </div>
              )}

              <div className="p-5">
                {/* ── Card Top Row ── */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Icon box */}
                  <div className={`w-[72px] h-[72px] rounded-2xl ${sc.bg} border border-slate-200 flex items-center justify-center shrink-0 shadow-sm`}>
                    <JobIcon iconName={job.iconName} />
                  </div>

                  <div className="flex-1 min-w-0 pr-10">
                    {/* NSQF Level Badge — color-coded */}
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider mb-1.5 ${nsqf.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${nsqf.dot}`} />
                      {t.nsqf_badge} {job.nsqf_level}
                      <span className="opacity-60">· {nsqf.label}</span>
                    </span>

                    {/* QP code if available */}
                    {job.qp_code && (
                      <div className="flex items-center gap-1 mb-1.5">
                        <BadgeCheck className="w-3 h-3 text-blue-500 shrink-0" />
                        <span className="text-[10px] font-bold text-blue-700">{job.qp_code}</span>
                      </div>
                    )}

                    {/* Stars + score */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <StarRow score={job.match_score} />
                      <span className={`text-xs font-bold ${sc.text}`}>
                        {job.match_score}% {t.match_label}
                      </span>
                    </div>
                  </div>

                  {/* Audio button */}
                  <button
                    type="button"
                    onClick={() => readJobAloud(job)}
                    className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200"
                    aria-label="Read job details aloud"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* ── Job Title (localised) ── */}
                <h3 className="text-[19px] font-bold text-slate-900 leading-snug mb-0.5">
                  {localTitle}
                </h3>
                {language !== 'english' && (
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    {job.title_en}
                  </p>
                )}

                {/* ── Match progress bar ── */}
                <div className="mb-4">
                  <MatchBar score={job.match_score} label={t.match_progress_label} />
                </div>

                {/* ── Wage + Duration pill row ── */}
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide block mb-0.5">
                      {t.daily_wage_label}
                    </span>
                    <span className="text-sm font-bold text-indigo-950">{job.wage_estimate}</span>
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-0.5">
                      {language === 'tamil' ? 'கால அளவு' : language === 'hindi' ? 'अवधि' : 'Duration'}
                    </span>
                    <span className="text-sm font-bold text-slate-800">{job.training_duration}</span>
                  </div>
                </div>

                {/* ── Mini skills preview ── */}
                {(havePills.length > 0 || gapPills.length > 0) && (
                  <div className="mb-4">
                    {/* Your skills */}
                    {havePills.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-700 mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {t.your_skills_label.replace(/^✅\s*/, '')}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {havePills.map((s, i) => (
                            <SkillPill key={i} text={s} type="have" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing skills */}
                    {gapPills.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-rose-500 mb-1.5 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {t.missing_skills_label.replace(/^❌\s*/, '')}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {gapPills.map((s, i) => (
                            <SkillPill key={i} text={s} type="gap" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Expandable detail section ── */}
                <button
                  type="button"
                  onClick={() => toggleExpand(job.id)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-500 py-2 border-t border-slate-100 mb-3 touch-manipulation"
                >
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-slate-500" />
                    {isExpanded
                      ? language === 'tamil' ? 'குறைவாக பார்' : language === 'hindi' ? 'कम देखें' : 'Show less'
                      : language === 'tamil' ? 'முழு விவரம் பார்' : language === 'hindi' ? 'पूरी जानकारी देखें' : 'See full details'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="space-y-3 mb-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Summary */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-xs text-slate-700 leading-relaxed">{job.summary}</p>
                    </div>

                    {/* Full duties list */}
                    {job.duties && job.duties.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          {language === 'tamil' ? 'வேலை பணிகள்' : language === 'hindi' ? 'कार्य जिम्मेदारियां' : 'Job Duties'}
                        </p>
                        <ul className="space-y-1.5">
                          {job.duties.map((d, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tools provided */}
                    {job.tools_provided && job.tools_provided.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          {language === 'tamil' ? 'இலவச உபகரணங்கள்' : language === 'hindi' ? 'मुफ्त उपकरण' : 'Free Tools Provided'}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {job.tools_provided.map((tool, i) => (
                            <span key={i} className="text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-100 px-2 py-1 rounded-lg">
                              🔧 {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Free Badge ── */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 mb-4">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{t.training_free_badge}</span>
                </div>

                {/* ── Action Buttons ── */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                  {/* Skill Gap detail */}
                  <button
                    type="button"
                    onClick={() => setGapJob(job)}
                    className={`min-h-[48px] rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-0.5 border transition-colors touch-manipulation ${
                      hasGaps
                        ? 'bg-rose-50/50 text-rose-600 border-rose-100 active:bg-rose-50'
                        : 'bg-indigo-50/50 text-indigo-700 border-indigo-100 active:bg-indigo-50'
                    }`}
                  >
                    {hasGaps ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{hasGaps ? (language === 'tamil' ? 'இடைவெளி' : language === 'hindi' ? 'अंतर' : 'Gaps') : '✓ Ready'}</span>
                  </button>

                  {/* Preview */}
                  <button
                    type="button"
                    onClick={() => setPreviewJob(job)}
                    className="min-h-[48px] bg-slate-800 active:bg-slate-900 text-white rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-0.5 shadow-sm touch-manipulation"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{t.button_preview}</span>
                  </button>

                  {/* Select */}
                  <button
                    type="button"
                    onClick={() => onToggleJobSelection(job.id)}
                    className={`min-h-[48px] rounded-xl font-bold text-[11px] flex flex-col items-center justify-center gap-0.5 shadow-sm transition-all active:scale-95 touch-manipulation ${
                      isSelected
                        ? 'bg-indigo-600 text-white active:bg-indigo-700'
                        : 'bg-indigo-50 text-indigo-900 border border-indigo-400 active:bg-indigo-100'
                    }`}
                  >
                    {isSelected
                      ? <CheckCircle2 className="w-4 h-4 text-white" />
                      : <Circle className="w-4 h-4 text-indigo-700" />}
                    <span>{isSelected ? t.button_selected.split(' ')[0] : t.button_select}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Sticky Bottom Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 z-40 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-600">
            {t.jobs_selected_count}{' '}
            <b className="text-indigo-700 text-sm">{selectedJobIds.length} / 3</b>
          </span>
          {selectedJobIds.length === 0 && (
            <span className="text-xs font-bold text-slate-700">
              {language === 'tamil'
                ? 'ஏதேனும் ஒரு வேலையைத் தேர்ந்தெடுக்கவும்'
                : language === 'hindi'
                ? 'कम से कम एक काम चुनें'
                : 'Select at least one job'}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onProceedToReport}
          disabled={selectedJobIds.length === 0}
          className={`w-full min-h-[56px] rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 touch-manipulation cursor-pointer ${
            selectedJobIds.length > 0
              ? 'bg-indigo-600 active:bg-indigo-700 text-white shadow-indigo-600/40'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
          aria-label={t.get_report_button}
        >
          <FileText className="w-6 h-6" />
          <span>{t.get_report_button}</span>
        </button>
      </div>

      {/* ── Modals ── */}
      {previewJob && (
        <VideoPreviewModal
          job={previewJob}
          language={language}
          onClose={() => setPreviewJob(null)}
          onSelect={(jobId) => onToggleJobSelection(jobId)}
          isSelected={selectedJobIds.includes(previewJob.id)}
        />
      )}

      {gapJob && (
        <SkillGaps
          job={gapJob}
          language={language}
          onClose={() => setGapJob(null)}
        />
      )}
    </div>
  );
};
