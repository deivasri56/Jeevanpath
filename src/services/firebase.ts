import { Language, User, ExtractedProfile } from '../types';

const STORAGE_KEY_USER = 'jeevanpath_user';
const STORAGE_KEY_PROFILE = 'jeevanpath_profile';

export function getOrCreateUid(): string {
  let uid = localStorage.getItem('jeevanpath_uid');
  if (!uid) {
    uid = 'jp_sc_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString().slice(-4);
    localStorage.setItem('jeevanpath_uid', uid);
  }
  return uid;
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredProfile(): ExtractedProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveUserLanguage(language: Language, phone?: string): Promise<User> {
  const uid = getOrCreateUid();
  const existing = getStoredUser();
  const user: User = {
    uid,
    phone: phone || existing?.phone || '',
    language,
    created_at: existing?.created_at || new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

  // Sync to backend endpoint
  try {
    await fetch('/api/language/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, language, phone: user.phone }),
    });
  } catch (err) {
    console.warn('Backend language sync fallback to local:', err);
  }

  return user;
}

export async function saveProfileToStorage(
  profileData: Partial<ExtractedProfile>
): Promise<ExtractedProfile> {
  const uid = getOrCreateUid();
  const existing = getStoredProfile();

  const fullProfile: ExtractedProfile = {
    user_id: uid,
    transcript: profileData.transcript || existing?.transcript || '',
    education: profileData.education || existing?.education || '',
    current_work: profileData.current_work || existing?.current_work || '',
    interests: profileData.interests || existing?.interests || '',
    selected_jobs: profileData.selected_jobs || existing?.selected_jobs || [],
    pdf_url: profileData.pdf_url || existing?.pdf_url || '',
  };

  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(fullProfile));
  return fullProfile;
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY_USER);
  localStorage.removeItem(STORAGE_KEY_PROFILE);
}
