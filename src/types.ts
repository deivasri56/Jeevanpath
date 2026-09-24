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
  category: string;
  iconName: 'lightbulb' | 'scissors' | 'wrench' | 'hammer' | 'bike' | 'sun' | 'tractor' | 'shield';
  nsqf_level: 1 | 2 | 3;
  match_score: number; // e.g. 75, 85, 92
  stars: number; // 3, 4, 5
  wage_estimate: string;
  training_duration: string;
  summary: string;
  duties: string[];
  tools_provided: string[];
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
}
