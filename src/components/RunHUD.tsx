import { motion } from "framer-motion";
import type { Poi } from "../data/pois";

type Props = {
  progress: number;
  storiesDone: number;
  storiesTotal: number;
};

export function RunHUD({ progress, storiesDone, storiesTotal }: Props) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;

  return (
    <div className="pointer-events-none flex justify-center -mt-2 mb-1">
      <div className="relative w-[7.5rem] h-[7.5rem]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="#d4a853"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums">{Math.round(progress)}%</span>
          <span className="text-[9px] uppercase tracking-wider text-lisboa-mist">
            {storiesDone}/{storiesTotal}
          </span>
        </div>
      </div>
    </div>
  );
}

export function NextPoiChip({
  nextPoi,
  distanceToNextM,
}: {
  nextPoi: Poi | null;
  distanceToNextM: number | null;
}) {
  if (!nextPoi) {
    return (
      <p className="text-center text-xs text-lisboa-gold/90 mb-2">Rota quase completa — força!</p>
    );
  }
  const dist =
    distanceToNextM != null
      ? distanceToNextM >= 1000
        ? `${(distanceToNextM / 1000).toFixed(1)} km`
        : `${Math.round(distanceToNextM)} m`
      : "—";

  return (
    <motion.div
      layout
      className="mx-3 mb-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/45 backdrop-blur-xl px-3 py-2.5"
    >
      <div className="w-9 h-9 rounded-xl bg-lisboa-river/30 flex items-center justify-center text-xs font-bold text-lisboa-gold">
        →
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase text-lisboa-mist">Próxima história</p>
        <p className="text-sm font-medium truncate">{nextPoi.name}</p>
      </div>
      <p className="text-sm font-semibold tabular-nums text-lisboa-gold">{dist}</p>
    </motion.div>
  );
}
