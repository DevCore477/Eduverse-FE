import { AudioStatus } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from "react";
import { useTTS } from "./use-tts";

export interface UseAutoSpeakOptions {
  enabled?: boolean;
  defaultLanguage?: "en" | "ar" | "fr";
}

export const useAutoSpeak = ({
  enabled = true,
  defaultLanguage = "en",
}: UseAutoSpeakOptions = {}) => {
  const { speak: ttsSpeak, stop: ttsStop, pause: ttsPause, resume: ttsResume, isPending, error, player, status } = useTTS();
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number>(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isSpeakingRef = useRef(false);
  const wordsRef = useRef<string[]>([]);
  const statusListenerRef = useRef<any>(null);

  const cleanup = useCallback(() => {
    setHighlightedWordIndex(-1);
    setCurrentTime(0);
    setIsSpeaking(false);
    setIsPaused(false);
    isSpeakingRef.current = false;
    wordsRef.current = [];
    
    if (statusListenerRef.current) {
      statusListenerRef.current.remove();
      statusListenerRef.current = null;
    }
  }, []);

  const stop = useCallback(async () => {
    console.log("Stop function called");
    
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setHighlightedWordIndex(-1);
    
    if (ttsStop) {
      await ttsStop();
    }
    
    cleanup();
  }, [ttsStop, cleanup]);

  const pause = useCallback(async () => {
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setIsPaused(true);
    if (ttsPause) {
      ttsPause();
    }
  }, [ttsPause]);

  const resume = useCallback(async () => {
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setIsPaused(false);
    if (ttsResume) {
      ttsResume();
    }
  }, [ttsResume]);

  useEffect(() => {
    if (!player) return;

    if (statusListenerRef.current) {
      statusListenerRef.current.remove();
      statusListenerRef.current = null;
    }

    statusListenerRef.current = player.addListener('playbackStatusUpdate', (playbackStatus: AudioStatus) => {
      if (!isSpeakingRef.current && !playbackStatus.playing) return;

      if (playbackStatus.isLoaded) {
        if (playbackStatus.didJustFinish) {
          console.log("Playback finished normally");
          cleanup();
        } else if (playbackStatus.playing) {
          setCurrentTime(playbackStatus.currentTime / 1000);
          
          if (playbackStatus.duration && wordsRef.current.length > 0) {
            const progress = playbackStatus.currentTime / playbackStatus.duration;
            const wordIndex = Math.floor(progress * wordsRef.current.length);
            setHighlightedWordIndex(Math.min(wordIndex, wordsRef.current.length - 1));
          }
        }
      }
    });

    return () => {
      if (statusListenerRef.current) {
        statusListenerRef.current.remove();
        statusListenerRef.current = null;
      }
    };
  }, [player, cleanup]);

  // Track playback completion
  useEffect(() => {
    if (status?.isLoaded && status.didJustFinish) {
      // Audio finished playing naturally
      cleanup();
    }
  }, [status?.didJustFinish, status?.isLoaded]);

  const speak = useCallback(async (text: string | string[], languageFromAPI?: "en" | "ar" | "fr") => {
    if (!enabled) {
      console.log("TTS not enabled");
      return;
    }
    
    // Stop any current playback first
    await stop();
    
    isSpeakingRef.current = true;
    setTtsError(null);

    const textToSpeak = Array.isArray(text) ? text.join(". ") : text;
    if (!textToSpeak.trim()) {
      console.log("Empty text to speak");
      isSpeakingRef.current = false;
      return;
    }

    wordsRef.current = textToSpeak.split(/\s+/);
    setHighlightedWordIndex(0);
    setCurrentTime(0);
    setIsSpeaking(true);

    try {
      console.log("Calling TTS with text:", textToSpeak);
      
      // Use language from API if provided, otherwise detect from content
      let detectedLanguage: "en" | "ar" | "fr";
      if (languageFromAPI && ["en", "ar", "fr"].includes(languageFromAPI)) {
        detectedLanguage = languageFromAPI;
        console.log("Using language from API:", detectedLanguage);
      } else {
        detectedLanguage = defaultLanguage;
        console.log("Using default language:", detectedLanguage);
      }
      
      const audioPayload = { text: textToSpeak, language: detectedLanguage };
      
      await ttsSpeak(audioPayload, {
        shouldPlay: true
      });
      
      console.log("TTS request sent with language:", detectedLanguage);

    } catch (err: any) {
      console.error("Error in speak function:", err.message || err);
      setTtsError(err.message || "Failed to speak text");
      setIsSpeaking(false);
    }
  }, [enabled, defaultLanguage, ttsSpeak, stop]);

  // useEffect(() => {
  //   return () => {
  //     stop();
  //   };
  // }, [stop]);

  return { 
    speak, 
    stop,
    pause,
    resume, 
    currentTime, 
    highlightedWordIndex, 
    isPending, 
    isSpeaking,
    isPaused,
    error: error || ttsError 
  };
};