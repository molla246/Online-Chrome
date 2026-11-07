import React, { useState, useEffect } from 'react';
import { Mic, X, Volume2, AlertCircle } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (transcript: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch
}) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognition) {
        try { recognition.stop(); } catch {}
      }
      setListening(false);
      setTranscript('');
      return;
    }

    // Initialize Web Speech API if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'bn-BD'; // Bengali first, or en-US

        recog.onstart = () => {
          setListening(true);
        };

        recog.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          if (event.results[current].isFinal) {
            setTimeout(() => {
              onSearch(text);
              onClose();
            }, 800);
          }
        };

        recog.onerror = (e: any) => {
          console.warn('Speech recognition error:', e);
          setListening(false);
        };

        recog.onend = () => {
          setListening(false);
        };

        setRecognition(recog);
        recog.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    } else {
      // Simulate listening state
      setListening(true);
      const timer = setTimeout(() => {
        setTranscript('Google Chrome latest updates');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#28292A] rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 text-center relative flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/60"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
          {listening ? "Listening... (বলুন...)" : "Voice Search"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">
          {listening ? "Say what you want to search on Google Chrome" : "Tap the microphone to speak"}
        </p>

        {/* Animated Mic Ring */}
        <div className="relative mb-8 flex items-center justify-center">
          {listening && (
            <>
              <div className="absolute w-32 h-32 rounded-full bg-red-400/20 animate-ping"></div>
              <div className="absolute w-28 h-28 rounded-full bg-red-500/10 animate-pulse"></div>
            </>
          )}
          <button
            onClick={() => {
              if (listening) {
                try { recognition?.stop(); } catch {}
                setListening(false);
              } else {
                try { recognition?.start(); } catch {}
                setListening(true);
              }
            }}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
              listening 
                ? 'bg-[#EA4335] text-white shadow-red-500/30 ring-4 ring-red-100 dark:ring-red-950' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Mic className="w-9 h-9" />
          </button>
        </div>

        {/* Live Transcript / Prompt */}
        <div className="min-h-[48px] w-full flex items-center justify-center">
          {transcript ? (
            <div className="text-base font-medium text-slate-800 dark:text-slate-100 animate-in fade-in">
              "{transcript}"
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>Speaking in Bengali (বাংলা) or English</span>
            </div>
          )}
        </div>

        {/* Manual Confirm if simulated */}
        {transcript && (
          <button
            onClick={() => {
              onSearch(transcript);
              onClose();
            }}
            className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
          >
            Search for "{transcript}"
          </button>
        )}
      </div>
    </div>
  );
};
