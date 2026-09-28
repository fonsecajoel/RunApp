import { motion, AnimatePresence } from "framer-motion";
import { Headphones, MapPin, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import type { Poi } from "../data/pois";
import { VoiceWaveform } from "./VoiceWaveform";

type Props = {
  planLabel: string;
  modeLabel: string;
  progress: number;
  storiesDone: number;
  storiesTotal: number;
  time: string;
  km: string;
  pace: string;
  nextPoi: Poi | null;
  distNext: string;
  activePoi: Poi | null;
  speaking: boolean;
  muted: boolean;
  demoTour: boolean;
  paused: boolean;
  geoHint: string | null;
  onPause: () => void;
  onTour: () => void;
  onMute: () => void;
  onDismissStory: () => void;
  onReplay: () => void;
};

export function RunDock({
  planLabel,
  modeLabel,
  progress,
  storiesDone,
  storiesTotal,
  time,
  km,
  pace,
  nextPoi,
  distNext,
  activePoi,
  speaking,
  muted,
  demoTour,
  paused,
  geoHint,
  onPause,
  onTour,
  onMute,
  onDismissStory,
  onReplay,
}: Props) {
  return (
    <div className="pointer-events-auto mx-2 mb-2 safe-bottom">
      <div className="rounded-[1.75rem] border border-white/12 bg-[#0a0d12]/88 backdrop-blur-2xl shadow-card overflow-hidden">
        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-lisboa-tile via-lisboa-gold to-amber-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>

        <div className="px-4 pt-3 pb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-lisboa-mist">
          <span>{planLabel}</span>
          <span className="text-lisboa-gold/90">{modeLabel}</span>
          <span>{storiesDone}/{storiesTotal} histórias</span>
        </div>

        <div className="grid grid-cols-3 gap-2 px-3 pb-3">
          <Metric label="Tempo" value={time} />
          <Metric label="Km" value={km} accent />
          <Metric label="Ritmo" value={pace} />
        </div>

        {nextPoi && (
          <div className="mx-3 mb-3 flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/8 px-3 py-2.5">
            <div className="w-10 h-10 rounded-xl bg-lisboa-river/25 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-lisboa-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-lisboa-mist uppercase tracking-wide">Próximo</p>
              <p className="text-sm font-medium truncate">{nextPoi.name}</p>
            </div>
            <p className="text-sm font-bold text-lisboa-gold tabular-nums">{distNext}</p>
          </div>
        )}

        <AnimatePresence>
          {activePoi && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/8"
            >
              <div className="p-3">
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-lisboa-tile/25 border border-lisboa-tile/40 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5 text-lisboa-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-lisboa-gold uppercase tracking-wider">
                      {activePoi.era} · A narrar
                    </p>
                    <p className="font-display text-lg font-semibold leading-tight truncate">
                      {activePoi.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <VoiceWaveform active={speaking && !muted} />
                      <span className="text-[11px] text-lisboa-mist">
                        {muted ? "Silenciado" : speaking ? "A tocar áudio" : "Pausado"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onDismissStory}
                    className="p-2 rounded-full bg-white/5 text-white/60"
                    aria-label="Fechar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-white/80 leading-relaxed mt-2 line-clamp-3">
                  {activePoi.story}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={onMute}
                    className="px-3 py-2 rounded-xl bg-white/8 text-sm flex items-center gap-1.5"
                  >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    {muted ? "Som" : "Mudo"}
                  </button>
                  <button
                    type="button"
                    onClick={onReplay}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-lisboa-tile to-amber-800 text-sm font-semibold"
                  >
                    Ouvir de novo
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {geoHint && (
          <p className="px-4 pb-2 text-[11px] text-center text-amber-100/90">{geoHint}</p>
        )}

        <div className="flex gap-2 p-3 pt-1 border-t border-white/5">
          <button
            type="button"
            onClick={onTour}
            disabled={demoTour}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all ${
              demoTour
                ? "bg-lisboa-gold/15 text-lisboa-gold border border-lisboa-gold/35"
                : "bg-lisboa-river/35 border border-lisboa-river/50 text-white"
            }`}
          >
            {demoTour ? "Histórias a tocar…" : "Ouvir histórias"}
          </button>
          <button
            type="button"
            onClick={onPause}
            className="w-[30%] py-3 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center gap-1.5 font-semibold text-sm"
          >
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {paused ? "Go" : "Pausa"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl py-2.5 text-center ${
        accent ? "bg-lisboa-gold/12 border border-lisboa-gold/25" : "bg-white/[0.03] border border-white/6"
      }`}
    >
      <p className="text-[9px] uppercase tracking-wider text-lisboa-mist">{label}</p>
      <p className="text-xl font-bold tabular-nums mt-0.5">{value}</p>
    </div>
  );
}
