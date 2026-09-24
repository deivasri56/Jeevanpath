import React, { useState, useEffect, useRef } from 'react';
import { Language, ExtractedProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Mic, Square, Check, Volume2, ArrowLeft, Sparkles } from 'lucide-react';
import { speakText, extractProfileNLP, SAMPLE_VOICE_PROMPTS } from '../services/bhashini';

interface Props {
  language: Language;
  onInterviewComplete: (transcript: string, profile: ExtractedProfile) => void;
  onChangeLanguage: () => void;
}

export const VoiceInterviewScreen: React.FC<Props> = ({
  language,
  onInterviewComplete,
  onChangeLanguage,
}) => {
  const t = TRANSLATIONS[language];
  const [isRecording, setIsRecording] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Speech Recognition Reference
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptBufferRef = useRef<string>('');

  // Initialize Web Speech Recognition
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'tamil' ? 'ta-IN' : language === 'hindi' ? 'hi-IN' : 'en-IN';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let currentSpoken = '';
          for (let i = 0; i < event.results.length; i++) {
            currentSpoken += event.results[i][0].transcript + ' ';
          }
          currentSpoken = currentSpoken.trim();
          transcriptBufferRef.current = currentSpoken;
          setTranscript(currentSpoken);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event.error);
          if (event.error === 'not-allowed') {
            setErrorMessage(t.voice_error_permission);
          }
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition setup error:', err);
      }
    }

    return () => {
      stopRecordingSession();
    };
  }, [language, t.voice_error_permission]);

  // Handle countdown timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleStopAndSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecordingSession = () => {
    setErrorMessage('');
    setTranscript('');
    transcriptBufferRef.current = '';
    setSecondsLeft(30);
    setIsRecording(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Recognition start exception:', e);
      }
    }
  };

  const stopRecordingSession = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Recognition stop exception:', e);
      }
    }
  };

  const handleStopAndSubmit = async (customText?: string) => {
    stopRecordingSession();
    setIsAnalyzing(true);

    const finalText = (customText || transcriptBufferRef.current || transcript || '').trim();
    // Default fallback if microphone yielded empty text
    const processedText = finalText.length > 3 ? finalText : getDefaultFallbackText(language);

    try {
      // Call Backend API Endpoint POST /api/voice/interview
      const res = await fetch('/api/voice/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_text: processedText,
          language: language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsAnalyzing(false);
        onInterviewComplete(data.transcript, {
          user_id: data.user_id || 'jp_' + Date.now(),
          transcript: data.transcript,
          education: data.education,
          current_work: data.current_work,
          interests: data.interests,
          selected_jobs: [],
        });
        return;
      }
    } catch (err) {
      console.warn('Backend API interview fallback to local NLP:', err);
    }

    // Client-side NLP fallback if offline
    const extracted = extractProfileNLP(processedText, language);
    setIsAnalyzing(false);
    onInterviewComplete(processedText, {
      user_id: 'jp_' + Date.now(),
      transcript: processedText,
      education: extracted.education,
      current_work: extracted.current_work,
      interests: extracted.interests,
      selected_jobs: [],
    });
  };

  const getDefaultFallbackText = (lang: Language) => {
    if (lang === 'tamil') {
      return 'நான் 10-ஆம் வகுப்பு படித்துள்ளேன், வயலில் கூலி வேலை செய்கிறேன், மின்சார வேலை கற்றுக்கொள்ள விரும்புகிறேன்.';
    } else if (lang === 'hindi') {
      return 'मैं 10वीं पास हूँ, खेत में काम करता हूँ, बिजली का काम सीखना चाहता हूँ।';
    }
    return 'I am 10th pass, I work in farm, I want electrical job.';
  };

  const readPromptAloud = () => {
    speakText(t.speak_prompt + '. ' + t.sample_placeholder, language);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between max-w-md mx-auto p-4 sm:p-6 select-none">
      {/* Top Bar with Language Indicator & Back */}
      <header className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={onChangeLanguage}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl active:bg-slate-200 min-h-[48px] touch-manipulation"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
          <span>{t.back_button}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
            {language === 'tamil' ? 'தமிழ்' : language === 'hindi' ? 'हिंदी' : 'English'}
          </span>
          <button
            type="button"
            onClick={readPromptAloud}
            className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center justify-center active:bg-emerald-200"
            title={t.listen_prompt}
            aria-label={t.listen_prompt}
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Screen Title & Prompt */}
      <div className="text-center my-3">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          {t.step_voice_title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium">
          {isRecording ? t.recording_active : t.step_voice_subtitle}
        </p>

        {/* Example spoken sentence box */}
        <div className="mt-3 bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-left shadow-sm">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-700" />
            {t.speak_prompt}:
          </p>
          <p className="text-sm font-semibold text-slate-800 mt-1 italic">
            &ldquo;{t.sample_placeholder}&rdquo;
          </p>
        </div>
      </div>

      {/* Big Microphone Button Section (50% of the screen) */}
      <div className="flex flex-col items-center justify-center my-auto py-2">
        <div className="relative flex items-center justify-center">
          {/* Animated Pulsating Rings when recording */}
          {isRecording && (
            <>
              <div className="absolute w-72 h-72 rounded-full bg-red-400/20 animate-ping pointer-events-none" />
              <div className="absolute w-64 h-64 rounded-full bg-red-500/30 animate-pulse pointer-events-none" />
            </>
          )}

          {/* Huge 50% Screen Mic Button */}
          <button
            type="button"
            onClick={isRecording ? () => handleStopAndSubmit() : startRecordingSession}
            disabled={isAnalyzing}
            className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 transition-transform active:scale-95 touch-manipulation cursor-pointer ${
              isRecording
                ? 'bg-red-600 border-red-300 text-white shadow-red-500/50'
                : 'bg-emerald-600 border-emerald-300 text-white shadow-emerald-600/50'
            }`}
            aria-label={isRecording ? t.done_button : t.tap_to_speak}
          >
            {isRecording ? (
              <>
                <Square className="w-16 h-16 sm:w-20 sm:h-20 fill-white" />
                <span className="text-xl sm:text-2xl font-black mt-2 tracking-wide">
                  {secondsLeft} {t.seconds_left}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider bg-red-800/80 px-3 py-1 rounded-full mt-1">
                  {t.done_button}
                </span>
              </>
            ) : (
              <>
                <Mic className="w-20 h-20 sm:w-24 sm:h-24 stroke-[2.5]" />
                <span className="text-lg sm:text-xl font-black mt-2 text-center px-4 leading-tight">
                  {t.tap_to_speak}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Live Transcript / Speech Indicator */}
        {transcript && (
          <div className="mt-4 p-3 bg-white border border-slate-300 rounded-xl w-full text-center shadow-sm">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">உரையாடல் (Transcript):</p>
            <p className="text-base font-semibold text-slate-900">{transcript}</p>
          </div>
        )}

        {/* Analyzing Spinner */}
        {isAnalyzing && (
          <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-300">
            <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-bold">{t.analyzing_voice}</span>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-3 p-3 bg-red-50 text-red-800 text-sm font-medium rounded-xl border border-red-300 text-center">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Done Action Button when recording */}
      {isRecording && (
        <div className="my-2">
          <button
            type="button"
            onClick={() => handleStopAndSubmit()}
            className="w-full min-h-[56px] bg-emerald-600 active:bg-emerald-700 text-white text-xl font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg touch-manipulation"
          >
            <Check className="w-7 h-7" />
            <span>{t.done_button}</span>
          </button>
        </div>
      )}

      {/* Quick Sample Voice Options (Crucial for uneducated users & testing) */}
      <div className="pt-2 pb-1">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 text-center">
          {t.try_sample_label}
        </p>
        <div className="space-y-2">
          {SAMPLE_VOICE_PROMPTS[language].map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleStopAndSubmit(sample.text)}
              className="w-full text-left p-3 min-h-[48px] bg-white active:bg-emerald-50 border border-slate-300 rounded-xl flex items-center justify-between text-sm font-bold text-slate-800 shadow-xs touch-manipulation"
            >
              <span>{sample.label}</span>
              <span className="text-emerald-700 text-xs font-black bg-emerald-100 px-2 py-1 rounded-md">
                தொடு / Tap
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
