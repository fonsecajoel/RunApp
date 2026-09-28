import { motion } from "framer-motion";
import type { Poi } from "../data/pois";

type Props = { pois: Poi[] };

export function PoiCarousel({ pois }: Props) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-lisboa-mist mb-3">
        Monumentos na rota
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide -mx-0.5 px-0.5">
        {pois.map((poi, i) => (
          <motion.article
            key={poi.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.04 * i }}
            className={`snap-start shrink-0 w-[10.5rem] rounded-2xl border border-white/10 bg-gradient-to-br ${poi.imageGradient} p-3.5`}
          >
            <p className="text-[10px] font-medium text-lisboa-gold/95">{poi.era}</p>
            <h4 className="font-display text-[15px] font-semibold leading-snug mt-1 line-clamp-2">
              {poi.name}
            </h4>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
