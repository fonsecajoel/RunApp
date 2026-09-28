import { motion } from "framer-motion";
import type { RoutePlan } from "../data/pois";

type Props = {
  plans: RoutePlan[];
  selectedKm: number | null;
  onSelect: (km: number) => void;
  loading: boolean;
};

export function DistancePicker({ plans, selectedKm, onSelect, loading }: Props) {
  const active = plans.find((p) => p.km === selectedKm) ?? plans[1];

  return (
    <div>
      <div className="flex gap-2 p-1 rounded-2xl bg-black/35 border border-white/10 backdrop-blur-md">
        {plans.map((plan) => {
          const selected = selectedKm === plan.km;
          return (
            <button
              key={plan.km}
              type="button"
              disabled={loading}
              onClick={() => onSelect(plan.km)}
              className={`relative flex-1 py-3 rounded-xl transition-all ${
                selected ? "text-white" : "text-lisboa-mist hover:text-white/80"
              }`}
            >
              {selected && (
                <motion.div
                  layoutId="km-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-b from-lisboa-gold/25 to-lisboa-tile/20 border border-lisboa-gold/40 shadow-glow"
                  transition={{ type: "spring", damping: 22, stiffness: 280 }}
                />
              )}
              <span className="relative z-10 block font-display text-2xl font-bold tabular-nums">
                {plan.km}
              </span>
              <span className="relative z-10 block text-[10px] uppercase tracking-wider opacity-80">
                km
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={active.km}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-2xl border border-white/10 bg-lisboa-slate/60 backdrop-blur-sm p-4"
      >
        <p className="text-sm text-white/90 leading-relaxed">{active.description}</p>
        <div className="flex gap-4 mt-3 text-xs text-lisboa-mist">
          <span>{active.poiIds.length} monumentos com narração GPS</span>
          <span>~{active.estimatedMin} min</span>
        </div>
      </motion.div>
    </div>
  );
}
