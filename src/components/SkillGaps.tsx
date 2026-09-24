import React from 'react';
import { JobCardData, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  X,
  CheckCircle2,
  XCircle,
  BookOpen,
  TrendingUp,
  Award,
  Layers,
  Briefcase,
  GraduationCap,
  MapPin,
  Heart,
  Sparkles,
} from 'lucide-react';

interface SkillGapsProps {
  job: JobCardData;
  language: Language;
  onClose: () => void;
}

// Bridge course suggestions mapped to common gap patterns
const BRIDGE_COURSE_MAP: Record<string, string> = {
  'electrical': 'ITI Electrician – 1 Year / PMKVY 45 Days Free',
  'wiring': 'Domestic Wireman Course – PMKVY Free',
  'circuit': 'Basic Electrical Safety – Online (Free)',
  'multimeter': 'Electrical Testing Tools – PMKVY',
  'mcb': 'Circuit Protection Devices – ITI Module',
  'pipe': 'Plumbing Foundation – PMKVY 45 Days',
  'cpvc': 'Pipe Fitting & Jointing – ITI Module',
  'sanitary': 'Sanitary Fittings – PMKVY Free Course',
  'sewing': 'Sewing Machine Operation – PMKVY 30 Days Free',
  'cutting': 'Fabric Cutting & Patterns – DAY-NRLM SHG Course',
  'garment': 'Garment Finishing – PMKVY Module',
  'solar': 'Solar PV Technician – PMKVY 60 Days / NISE',
  'inverter': 'Solar Inverter Basics – NISE Online Free',
  'engine': 'Automotive Basics – ASDC / PMKVY',
  'brake': 'Two-Wheeler Mechanics – ITI / PMKVY 45 Days',
  'mortar': 'Masonry Foundation – CIDC / PMKVY 30 Days',
  'tiling': 'Floor Tiling – Construction Skill Course',
  'skin': 'Beauty Therapy Foundation – B&WSSC / PMKVY',
  'hair': 'Hair Styling Basics – Beauty SSC Free',
  'food': 'Food Safety & Hygiene – FSSAI Free Online',
  'packaging': 'Food Packaging – MoFPI Skill Course',
  'security': 'Security Guard Training – SSSC / PMKVY 20 Days',
  'loom': 'Handloom Weaving – National Handloom Programme',
  'default': 'PMKVY Free Skill Training – Enrol at nearest centre',
};

function getBridgeCourse(gapText: string): string {
  const lower = gapText.toLowerCase();
  for (const [key, course] of Object.entries(BRIDGE_COURSE_MAP)) {
    if (key !== 'default' && lower.includes(key)) return course;
  }
  return BRIDGE_COURSE_MAP.default;
}

// Derive "already have" competencies from qp_competencies vs skill_gaps
function deriveExistingSkills(job: JobCardData): string[] {
  const allCompetencies = job.qp_competencies || job.duties || [];
  const gapSet = new Set(
    job.skill_gaps.map((g) => g.toLowerCase().substring(0, 30))
  );
  // A competency is "already present" if it's not referenced in any gap
  return allCompetencies.filter((comp) => {
    const compLower = comp.toLowerCase();
    return ![...gapSet].some((gap) => compLower.includes(gap.substring(0, 15)));
  });
}

// Score breakdown bar component
const ScoreBar: React.FC<{ label: string; score: number; max: number; color: string }> = ({
  label,
  score,
  max,
  color,
}) => {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="text-xs font-black text-slate-800">
          {score}/{max}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export const SkillGaps: React.FC<SkillGapsProps> = ({ job, language, onClose }) => {
  const t = TRANSLATIONS[language];
  const existingSkills = deriveExistingSkills(job);
  const hasGaps = job.skill_gaps.length > 0;
  const scoreBreakdown = job.score_breakdown;

  // NSQF level color map
  const nsqfColors: Record<number, string> = {
    1: 'from-blue-500 to-blue-700',
    2: 'from-emerald-500 to-teal-600',
    3: 'from-amber-500 to-orange-600',
  };
  const nsqfGradient = nsqfColors[job.nsqf_level] || 'from-slate-500 to-slate-700';

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Sheet panel */}
      <div
        className="w-full max-w-md bg-white rounded-t-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header strip with gradient */}
        <div className={`bg-gradient-to-r ${nsqfGradient} px-5 py-4 text-white`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-3">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 opacity-80" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-90">
                  {t.skill_gap_title}
                </span>
              </div>
              {/* Localised job title */}
              <h2 className="text-lg font-black leading-tight">
                {language === 'tamil' && job.title_ta
                  ? job.title_ta
                  : language === 'hindi' && job.title_hi
                  ? job.title_hi
                  : job.title_en}
              </h2>
              <p className="text-xs opacity-80 mt-0.5">{t.skill_gap_subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0 transition-colors"
              aria-label={t.skill_gap_close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* QP code & sector pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {job.qp_code && (
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                <Award className="w-3 h-3" />
                {job.qp_code}
              </span>
            )}
            {job.sector && (
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                <Briefcase className="w-3 h-3" />
                {job.sector}
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              <Layers className="w-3 h-3" />
              NSQF Level {job.nsqf_level}
            </span>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* ── Match Score Progress Bar ── */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                {t.match_progress_label}
              </span>
              <span className="text-2xl font-black text-emerald-700">{job.match_score}%</span>
            </div>
            {/* Main progress bar */}
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  job.match_score >= 80
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                    : job.match_score >= 60
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-red-400 to-rose-500'
                }`}
                style={{ width: `${job.match_score}%` }}
              />
            </div>

            {/* Score breakdown sub-bars */}
            {scoreBreakdown && (
              <div className="mt-4 bg-slate-50 rounded-2xl p-3 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Score Breakdown
                </p>
                <ScoreBar label={t.score_education_label} score={scoreBreakdown.education} max={30} color="bg-blue-500" />
                <ScoreBar label={t.score_interest_label} score={scoreBreakdown.interest} max={40} color="bg-emerald-500" />
                <ScoreBar label={t.score_mobility_label} score={scoreBreakdown.mobility} max={20} color="bg-purple-500" />
                <ScoreBar label={t.score_pref_label} score={scoreBreakdown.preference} max={10} color="bg-amber-500" />
              </div>
            )}
          </section>

          <hr className="border-slate-100" />

          {/* ── No gaps congratulation ── */}
          {!hasGaps && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-1">🎉</div>
              <p className="font-black text-emerald-800 text-sm">{t.no_gaps_label}</p>
              <p className="text-xs text-emerald-700 mt-1">
                {language === 'tamil'
                  ? 'உங்கள் அனைத்து திறன்களும் இந்த வேலைக்கு பொருந்துகின்றன.'
                  : language === 'hindi'
                  ? 'आपके सभी कौशल इस काम से मेल खाते हैं।'
                  : 'All your existing skills match this job role.'}
              </p>
            </div>
          )}

          {/* ── YOUR SKILLS (Green checkmarks) ── */}
          {existingSkills.length > 0 && (
            <section>
              <h3 className="text-sm font-black text-slate-800 mb-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                {t.your_skills_label}
              </h3>
              <ul className="space-y-2">
                {existingSkills.map((skill, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-emerald-900 leading-relaxed">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── MISSING SKILLS (Red X + bridge courses) ── */}
          {hasGaps && (
            <section>
              <h3 className="text-sm font-black text-slate-800 mb-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-red-600" />
                </div>
                {t.missing_skills_label}
              </h3>
              <ul className="space-y-3">
                {job.skill_gaps.map((gap, i) => (
                  <li
                    key={i}
                    className="bg-red-50 border border-red-100 rounded-xl overflow-hidden"
                  >
                    {/* Gap header */}
                    <div className="flex items-start gap-2.5 px-3 py-2.5">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-red-900 leading-relaxed">
                        {gap}
                      </span>
                    </div>
                    {/* Bridge course pill */}
                    <div className="bg-amber-50 border-t border-amber-100 px-3 py-2 flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700 mb-0.5">
                          {t.bridge_course_label}
                        </p>
                        <p className="text-[11px] font-semibold text-amber-900">
                          {getBridgeCourse(gap)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── NSQF Competencies (full list) ── */}
          {job.qp_competencies && job.qp_competencies.length > 0 && (
            <section>
              <h3 className="text-sm font-black text-slate-800 mb-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5 text-blue-700" />
                </div>
                {language === 'tamil'
                  ? 'NSQF முழு திறன் பட்டியல்'
                  : language === 'hindi'
                  ? 'NSQF पूर्ण दक्षता सूची'
                  : 'Full NSQF Competency List'}
              </h3>
              <ul className="space-y-1.5">
                {job.qp_competencies.map((comp, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-blue-900 leading-relaxed">
                      {comp}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Helpline footer */}
          <div className="bg-slate-50 rounded-2xl p-3.5 flex items-center gap-3 border border-slate-200">
            <Heart className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-700">
                {language === 'tamil'
                  ? 'இலவச உதவி எண்: 1800-425-2424'
                  : language === 'hindi'
                  ? 'टोल-फ्री: 1800-425-2424'
                  : 'Free Helpline: 1800-425-2424'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {language === 'tamil'
                  ? 'PMKVY பயிற்சி மையம் அமைவிடம் பெற அழைக்கவும்'
                  : language === 'hindi'
                  ? 'PMKVY केंद्र का पता जानने के लिए कॉल करें'
                  : 'Call to find nearest PMKVY training centre'}
              </p>
            </div>
          </div>

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>

        {/* Sticky close button */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="w-full min-h-[52px] bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-2xl font-black text-base transition-colors touch-manipulation"
          >
            {t.skill_gap_close}
          </button>
        </div>
      </div>
    </div>
  );
};
