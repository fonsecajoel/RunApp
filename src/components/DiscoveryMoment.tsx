import { motion, AnimatePresence } from "framer-motion";
import type { Poi } from "../data/pois";

type Props = { poi: Poi | null };

export function DiscoveryMoment({ poi }: Props) {
  return (
    <AnimatePresence>
      {poi && (
        <motion.div
          key={poi.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 z-[500] flex items-center justify-center max-w-[430px] mx-auto"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute w-40 h-40 rounded-full bg-lisboa-gold/30 blur-2xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-center px-6"
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-lisboa-gold mb-2">
              Chegaste
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight">{poi.name}</h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
