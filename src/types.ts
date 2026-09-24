export type Language = 'tamil' | 'hindi' | 'english';

export interface User {
  uid: string;
  phone?: string;
  language: Language;
  created_at: string;
}

export interface ExtractedProfile {
  user_id: string;
  transcript: string;
  education: string;
  current_work: string;
  interests: string;
  selected_jobs: string[];
  pdf_url?: string;
}

export interface TrainingCentre {
  name: string;
  address: string;
  contact_person: string;
  phone: string;
  helpline: string;
  stipend_info: string;
}

export interface JobCardData {
  id: string;
  title: string;
  title_en: string;
  title_ta?: string;
  title_hi?: string;
  category: string;
  qp_code?: string;           // e.g. ELE/Q1000
  sector?: string;            // e.g. Electronics & Hardware
  iconName: 'lightbulb' | 'scissors' | 'wrench' | 'hammer' | 'bike' | 'sun' | 'tractor' | 'shield';
  nsqf_level: 1 | 2 | 3;
  match_score: number;        // 0-100
  score_breakdown?: {         // from NSQF matcher
    education: number;
    interest: number;
    mobility: number;
    preference: number;
  };
  stars: number;              // 3, 4, 5
  wage_estimate: string;
  training_duration: string;
  summary: string;
  duties: string[];
  tools_provided: string[];
  skill_gaps: string[];       // from nsqf_matcher (missing skills)
  qp_competencies?: string[]; // competencies from nsqf_roles.json
  nearest_centre: TrainingCentre;
}

export interface Translations {
  app_name: string;
  tagline: string;
  select_language: string;
  listen_prompt: string;
  lang_tamil: string;
  lang_hindi: string;
  lang_english: string;
  step_voice_title: string;
  step_voice_subtitle: string;
  speak_prompt: string;
  sample_placeholder: string;
  try_sample_label: string;
  recording_active: string;
  tap_to_speak: string;
  done_button: string;
  cancel_button: string;
  seconds_left: string;
  analyzing_voice: string;
  voice_error_permission: string;
  voice_error_generic: string;
  jobs_title: string;
  jobs_subtitle: string;
  jobs_selected_count: string;
  button_preview: string;
  button_select: string;
  button_selected: string;
  preview_title: string;
  preview_close: string;
  nsqf_badge: string;
  match_label: string;
  daily_wage_label: string;
  training_free_badge: string;
  get_report_button: string;
  report_title: string;
  report_subtitle: string;
  phone_number_label: string;
  phone_placeholder: string;
  save_phone_button: string;
  download_pdf: string;
  send_whatsapp: string;
  nearest_training_centre: string;
  toll_free_help: string;
  change_language: string;
  start_over: string;
  free_government_scheme: string;
  back_button: string;
  extracted_summary_title: string;
  extracted_education: string;
  extracted_work: string;
  extracted_interest: string;
  // Skill gap section labels
  your_skills_label: string;
  missing_skills_label: string;
  bridge_course_label: string;
  skill_gap_title: string;
  skill_gap_subtitle: string;
  skill_gap_close: string;
  no_gaps_label: string;
  score_education_label: string;
  score_interest_label: string;
  score_mobility_label: string;
  score_pref_label: string;
  match_progress_label: string;
  qp_code_label: string;
  sector_label: string;
}
