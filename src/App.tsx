import React, { useState, useEffect } from 'react';
import { Language, ExtractedProfile, JobCardData } from './types';
import { LanguageScreen } from './components/LanguageScreen';
import { VoiceInterviewScreen } from './components/VoiceInterviewScreen';
import { JobCardsScreen } from './components/JobCardsScreen';
import { ReportScreen } from './components/ReportScreen';
import {
  getStoredUser,
  getStoredProfile,
  saveUserLanguage,
  saveProfileToStorage,
  getOrCreateUid,
  clearSession,
} from './services/firebase';
import { recommendTop3Jobs } from './data/jobs';

export default function App() {
  // Navigation step state: 'language' | 'voice' | 'jobs' | 'report'
  const [currentStep, setCurrentStep] = useState<'language' | 'voice' | 'jobs' | 'report'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [userPhone, setUserPhone] = useState<string>('');
  const [profile, setProfile] = useState<ExtractedProfile | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<JobCardData[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

  // Check stored user on initial mount
  useEffect(() => {
    const storedUser = getStoredUser();
    const storedProfile = getStoredProfile();

    if (storedUser && storedUser.language) {
      setSelectedLanguage(storedUser.language);
      setUserPhone(storedUser.phone || '');
    }

    if (storedProfile) {
      setProfile(storedProfile);
      if (storedProfile.selected_jobs && storedProfile.selected_jobs.length > 0) {
        setSelectedJobIds(storedProfile.selected_jobs);
      }
    }
  }, []);

  // Step 1: User selects language
  const handleSelectLanguage = async (lang: Language) => {
    setSelectedLanguage(lang);
    await saveUserLanguage(lang);
    setCurrentStep('voice');
  };

  // Step 2: Voice Interview complete
  const handleInterviewComplete = async (transcript: string, extractedData: ExtractedProfile) => {
    if (!selectedLanguage) return;

    setProfile(extractedData);
    await saveProfileToStorage(extractedData);

    // Compute top 3 recommended jobs using extracted NLP
    const top3 = recommendTop3Jobs(
      transcript,
      extractedData.education,
      extractedData.current_work,
      extractedData.interests,
      selectedLanguage
    );
    setRecommendedJobs(top3);

    // Auto-select the #1 best matching job by default for frictionless experience
    if (top3.length > 0) {
      const defaultSelection = [top3[0].id];
      setSelectedJobIds(defaultSelection);
      await saveProfileToStorage({ selected_jobs: defaultSelection });
    }

    setCurrentStep('jobs');
  };

  // Step 3: Toggle job selection
  const handleToggleJobSelection = async (jobId: string) => {
    let updated: string[];
    if (selectedJobIds.includes(jobId)) {
      // Don't allow deselecting all if user taps last one (keep minimum 1 selected or allow toggle)
      updated = selectedJobIds.filter((id) => id !== jobId);
    } else {
      if (selectedJobIds.length >= 3) {
        // Replace earliest
        updated = [...selectedJobIds.slice(1), jobId];
      } else {
        updated = [...selectedJobIds, jobId];
      }
    }
    setSelectedJobIds(updated);
    await saveProfileToStorage({ selected_jobs: updated });
  };

  // Proceed to Step 4 (Report)
  const handleProceedToReport = () => {
    if (selectedJobIds.length === 0 && recommendedJobs.length > 0) {
      setSelectedJobIds([recommendedJobs[0].id]);
    }
    setCurrentStep('report');
  };

  // Reset / Start over
  const handleStartOver = () => {
    clearSession();
    setSelectedLanguage(null);
    setProfile(null);
    setSelectedJobIds([]);
    setRecommendedJobs([]);
    setCurrentStep('language');
  };

  // Switch back to Language Selection
  const handleChangeLanguage = () => {
    setCurrentStep('language');
  };

  // Back to Voice Interview
  const handleBackToVoice = () => {
    setCurrentStep('voice');
  };

  // Update phone number in session
  const handleUpdatePhone = async (phone: string) => {
    setUserPhone(phone);
    if (selectedLanguage) {
      await saveUserLanguage(selectedLanguage, phone);
    }
  };

  // Filter full JobCardData for selected jobs in report
  const selectedJobCards = recommendedJobs.filter((job) => selectedJobIds.includes(job.id));

  // MODULE 1 - LANGUAGE SELECTION SCREEN (FIRST SCREEN)
  // NO other features visible until language is selected
  if (currentStep === 'language' || !selectedLanguage) {
    return <LanguageScreen onSelectLanguage={handleSelectLanguage} />;
  }

  // MODULE 2 - VOICE INTERVIEW (SECOND SCREEN)
  if (currentStep === 'voice') {
    return (
      <VoiceInterviewScreen
        language={selectedLanguage}
        onInterviewComplete={handleInterviewComplete}
        onChangeLanguage={handleChangeLanguage}
      />
    );
  }

  // MODULE 3 - JOB CARDS (THIRD SCREEN)
  if (currentStep === 'jobs' && profile) {
    return (
      <JobCardsScreen
        jobs={recommendedJobs}
        language={selectedLanguage}
        profile={profile}
        selectedJobIds={selectedJobIds}
        onToggleJobSelection={handleToggleJobSelection}
        onProceedToReport={handleProceedToReport}
        onBackToVoice={handleBackToVoice}
      />
    );
  }

  // MODULE 4 - SIMPLE REPORT (FOURTH SCREEN)
  if (currentStep === 'report' && profile) {
    return (
      <ReportScreen
        language={selectedLanguage}
        profile={profile}
        selectedJobs={selectedJobCards.length > 0 ? selectedJobCards : recommendedJobs.slice(0, 1)}
        onStartOver={handleStartOver}
        userPhone={userPhone}
        onUpdatePhone={handleUpdatePhone}
      />
    );
  }

  // Fallback to Language Selection
  return <LanguageScreen onSelectLanguage={handleSelectLanguage} />;
}
