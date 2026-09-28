import { useCallback, useEffect, useRef, useState } from "react";
import type { Poi } from "../data/pois";
import { playPoiAudio } from "../lib/preloadAudio";
import { getSpeechStatus, speakPortuguese, stopSpeech } from "../lib/speech";

function narrationText(poi: Poi): string {
  return `${poi.name}. ${poi.storyTitle}. ${poi.story}`;
}

export function useNarration() {
  const [activePoi, setActivePoi] = useState<Poi | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cancelTtsRef = useRef<(() => void) | null>(null);
  const endListeners = useRef<Set<() => void>>(new Set());

  const notifyEnd = useCallback(() => {
    endListeners.current.forEach((fn) => fn());
  }, []);

  const onNarrationEnd = useCallback((fn: () => void) => {
    endListeners.current.add(fn);
    return () => {
      endListeners.current.delete(fn);
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onplay = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    cancelTtsRef.current?.();
    cancelTtsRef.current = null;
    stopSpeech();
    setSpeaking(false);
  }, []);

  const dismiss = useCallback(() => {
    stop();
    setActivePoi(null);
  }, [stop]);

  const speakWithTts = useCallback(
    (poi: Poi) => {
      cancelTtsRef.current = speakPortuguese(narrationText(poi), {
        onStart: () => setSpeaking(true),
        onEnd: () => {
          setSpeaking(false);
          notifyEnd();
        },
        onError: (reason) => {
          setLastError(reason);
          setSpeaking(false);
          notifyEnd();
        },
      });
    },
    [notifyEnd]
  );

  const speakPoi = useCallback(
    (poi: Poi) => {
      setActivePoi(poi);
      setLastError(null);
      if (muted) {
        window.setTimeout(() => notifyEnd(), 5500);
        return;
      }

      stop();

      const audio = playPoiAudio(poi);
      audioRef.current = audio;

      audio.onplay = () => setSpeaking(true);
      audio.onended = () => {
        setSpeaking(false);
        audioRef.current = null;
        notifyEnd();
      };
      audio.onerror = () => {
        audioRef.current = null;
        speakWithTts(poi);
      };

      void audio.play().catch(() => {
        speakWithTts(poi);
      });
    },
    [muted, stop, speakWithTts, notifyEnd]
  );

  const reset = useCallback(() => {
    stop();
    setActivePoi(null);
    setLastError(null);
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return {
    activePoi,
    speaking,
    muted,
    setMuted,
    lastError,
    speechStatus: getSpeechStatus(),
    speakPoi,
    stop,
    dismiss,
    reset,
    onNarrationEnd,
  };
}
