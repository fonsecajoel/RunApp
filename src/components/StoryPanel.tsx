import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Volume2, VolumeX, X } from "lucide-react";
import type { Poi } from "../data/pois";
import { VoiceWaveform } from "./VoiceWaveform";

type Props = {
  poi: Poi | null;
  speaking: boolean;
  muted: boolean;
  audioReady: boolean;
  onMuteToggle: () => void;
  onDismiss: () => void;
  onReplay: () => void;
};

export function StoryPanel({
  poi,
  speaking,
  muted,
  onMuteToggle,
  onDismiss,
  audioReady,
  onReplay,
}: Props) {
  return (
    <AnimatePresence>
      {poi && (
        <motion.div
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 260 }}
          className="absolute inset-x-3 bottom-[11.5rem] z-[500] safe-bottom sm:bottom-28"
        >
          <div className="rounded-3xl border border-white/15 bg-black/55 backdrop-blur-2xl shadow-card overflow-hidden">
            <div className={`h-1.5 w-full bg-gradient-to-r from-lisboa-tile via-lisboa-gold to-lisboa-river`} />
            <div className={`p-4 pb-3 bg-gradient-to-br ${poi.imageGradient} bg-blend-overlay`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-lisboa-gold font-medium">
                    {poi.era} · {poi.subtitle}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-white mt-1 leading-tight">
                    {poi.name}
                  </h3>
                  <p className="text-sm text-white/75 mt-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-lisboa-tile shrink-0" />
                    {poi.storyTitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="p-2 rounded-full bg-black/40 text-white/70 hover:text-white border border-white/10"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <VoiceWaveform active={speaking && !muted} />
                <p className="text-[11px] text-lisboa-mist">
                  {muted
                    ? "Narração silenciada — lê o texto"
                    : speaking
                      ? "Áudio do guia a tocar…"
                      : audioReady
                        ? "História gravada · toca «Ouvir de novo»"
                        : "História disponível"}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-white/88 mt-3 max-h-24 overflow-y-auto pr-1">
                {poi.story}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-black/50 border-t border-white/5">
              <button
                type="button"
                onClick={onMuteToggle}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 text-sm border border-white/5"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {muted ? "Som" : "Mudo"}
              </button>
              <button
                type="button"
                onClick={onReplay}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-lisboa-tile to-amber-800 text-sm font-semibold shadow-glow"
              >
                Ouvir de novo
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
