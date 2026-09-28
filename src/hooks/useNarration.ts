import { useCallback, useEffect, useRef, useState } from "react";
import { getEpisode } from "../data/episodes";
import type { Poi } from "../data/pois";
import { playPoiAudio } from "../lib/preloadAudio";
import { speakPortuguese, stopSpeech } from "../lib/speech";

export function useNarration(speechRate = 0.92) {
  const [activePoi, setActivePoi] = useState<Poi | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cancelTtsRef = useRef<(() => void) | null>(null);
  const endListeners = useRef<Set<() => void>>(new Set());

  const notifyEnd = useCallback(() => {
    endListeners.current.forEach((fn) => fn());
  }, []);

  const onNarrationEnd = useCallback((fn: () => void) => {
    endListeners.current.add(fn);
    return () => endListeners.current.delete(fn);
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
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
    (text: string) => {
      cancelTtsRef.current = speakPortuguese(text, {
        rate: speechRate,
        onStart: () => setSpeaking(true),
        onEnd: () => {
          setSpeaking(false);
          notifyEnd();
        },
        onError: () => {
          setSpeaking(false);
          notifyEnd();
        },
      });
    },
    [notifyEnd, speechRate]
  );

  const speakPoi = useCallback(
    (poi: Poi) => {
      const episode = getEpisode(poi);
      setActivePoi(poi);
      if (muted) {
        window.setTimeout(notifyEnd, 4000);
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
        speakWithTts(episode.narrationScript);
      };
      void audio.play().catch(() => speakWithTts(episode.narrationScript));
    },
    [muted, stop, speakWithTts, notifyEnd]
  );

  const reset = useCallback(() => {
    stop();
    setActivePoi(null);
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return {
    activePoi,
    speaking,
    muted,
    setMuted,
    speakPoi,
    stop,
    dismiss,
    reset,
    onNarrationEnd,
  };
}
