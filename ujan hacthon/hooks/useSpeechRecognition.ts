import { useState, useEffect, useCallback } from 'react';

// --- START: TypeScript definitions for the Web Speech API ---
// These interfaces provide strong types for the browser's SpeechRecognition API,
// which may not be included in standard TypeScript DOM library typings.

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}
// --- END: TypeScript definitions ---


interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  startListening: (lang: 'en-IN' | 'hi-IN') => void;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
}

const getSpeechRecognition = (): SpeechRecognitionStatic | undefined => {
  if (typeof window !== 'undefined') {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }
  return undefined;
};

const SpeechRecognition = getSpeechRecognition();

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) return;
    
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    
    rec.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        }
      }
      setTranscript(finalTranscript);
    };

    rec.onend = () => {
      setIsListening(false);
      setTranscript(prev => prev.trim()); // Trim any final whitespace on stop
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error, event.message);
        setIsListening(false);
    };

    setRecognition(rec);

    return () => {
      rec.stop();
    };
  }, []);

  const startListening = useCallback((lang: 'en-IN' | 'hi-IN' = 'en-IN') => {
    if (recognition && !isListening) {
      recognition.lang = lang;
      setTranscript('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);
  
  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!SpeechRecognition,
  };
};
