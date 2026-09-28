import { motion } from "framer-motion";
import { PartyPopper, RotateCcw } from "lucide-react";

type Props = {
  distanceKm: number;
  elapsedSec: number;
  stories: number;
  onHome: () => void;
};

function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function RunComplete({ distanceKm, elapsedSec, stories, onHome }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[950] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-lg p-4"
    >
      <motion.div
        initial={{ y: 80, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 22 }}
        className="w-full max-w-md rounded-3xl border border-lisboa-gold/25 bg-gradient-to-b from-lisboa-slate to-lisboa-night p-6 shadow-glow"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-lisboa-gold/15 border border-lisboa-gold/30">
            <PartyPopper className="w-6 h-6 text-lisboa-gold" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Corrida épica</h2>
            <p className="text-sm text-lisboa-mist">Lisboa ficou mais tua hoje.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="rounded-2xl bg-black/30 border border-white/5 p-3 text-center">
            <p className="text-xl font-bold tabular-nums">{distanceKm.toFixed(1)}</p>
            <p className="text-[10px] uppercase text-lisboa-mist mt-1">km</p>
          </div>
          <div className="rounded-2xl bg-black/30 border border-white/5 p-3 text-center">
            <p className="text-xl font-bold tabular-nums">{formatTime(elapsedSec)}</p>
            <p className="text-[10px] uppercase text-lisboa-mist mt-1">tempo</p>
          </div>
          <div className="rounded-2xl bg-black/30 border border-white/5 p-3 text-center">
            <p className="text-xl font-bold tabular-nums">{stories}</p>
            <p className="text-[10px] uppercase text-lisboa-mist mt-1">histórias</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onHome}
          className="mt-6 w-full py-3.5 rounded-2xl bg-lisboa-tile font-semibold flex items-center justify-center gap-2 hover:bg-lisboa-tile/90 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Nova rota
        </button>
      </motion.div>
    </motion.div>
  );
}
