let voicesReady = false;
let portugueseVoice: SpeechSynthesisVoice | null = null;
let unlocked = false;

function pickPortugueseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const pt = voices.filter((v) => v.lang.toLowerCase().startsWith("pt"));
  const prefer =
    pt.find((v) => v.lang.toLowerCase() === "pt-pt") ??
    pt.find((v) => v.lang.toLowerCase() === "pt-br") ??
    pt.find((v) => !v.localService) ??
    pt[0];
  return prefer ?? voices[0] ?? null;
}

export function initSpeech(): void {
  if (!("speechSynthesis" in window)) return;

  const load = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      portugueseVoice = pickPortugueseVoice(voices);
      voicesReady = true;
    }
  };

  load();
  window.speechSynthesis.addEventListener("voiceschanged", load);
}

/** Browsers block TTS until a user gesture — call from button taps. */
export function unlockSpeech(): boolean {
  if (!("speechSynthesis" in window)) return false;
  unlocked = true;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0.01;
  u.rate = 10;
  window.speechSynthesis.speak(u);
  window.speechSynthesis.cancel();
  return true;
}

export function isSpeechAvailable(): boolean {
  return "speechSynthesis" in window;
}

export function getSpeechStatus(): {
  available: boolean;
  unlocked: boolean;
  voiceName: string | null;
} {
  return {
    available: isSpeechAvailable(),
    unlocked,
    voiceName: portugueseVoice?.name ?? null,
  };
}

let keepAliveTimer: ReturnType<typeof setInterval> | null = null;

function startKeepAlive() {
  if (keepAliveTimer) return;
  keepAliveTimer = setInterval(() => {
    if (!window.speechSynthesis.speaking) return;
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }, 8000);
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

export type SpeakOptions = {
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (reason: string) => void;
};

export function speakPortuguese(text: string, options: SpeakOptions = {}): () => void {
  if (!("speechSynthesis" in window)) {
    options.onError?.("Narração por voz não disponível neste browser.");
    return () => {};
  }

  if (!unlocked) {
    unlockSpeech();
  }

  window.speechSynthesis.cancel();

  const run = () => {
    if (!voicesReady) {
      const voices = window.speechSynthesis.getVoices();
      portugueseVoice = pickPortugueseVoice(voices);
      voicesReady = voices.length > 0;
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = portugueseVoice?.lang ?? "pt-PT";
    if (portugueseVoice) u.voice = portugueseVoice;
    u.rate = options.rate ?? 0.92;
    u.pitch = 1;
    u.volume = 1;

    u.onstart = () => {
      startKeepAlive();
      options.onStart?.();
    };
    u.onend = () => {
      stopKeepAlive();
      options.onEnd?.();
    };
    u.onerror = (e) => {
      stopKeepAlive();
      options.onError?.(e.error ?? "speech-error");
      options.onEnd?.();
    };

    window.speechSynthesis.speak(u);
  };

  window.setTimeout(run, 80);

  return () => {
    window.speechSynthesis.cancel();
    stopKeepAlive();
  };
}

export function stopSpeech(): void {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  stopKeepAlive();
}
