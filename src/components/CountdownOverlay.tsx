import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = { onComplete: () => void };

const STEPS = ["3", "2", "1", "Vai!"];

export function CountdownOverlay({ onComplete }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= STEPS.length) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setIndex((i) => i + 1), index === STEPS.length - 1 ? 700 : 850);
    return () => clearTimeout(t);
  }, [index, onComplete]);

  const label = STEPS[index];

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/75 backdrop-blur-md">
      <AnimatePresence mode="wait">
        {label && (
          <motion.div
            key={label}
            initial={{ scale: 0.5, opacity: 0, filter: "blur(8px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 1.4, opacity: 0, filter: "blur(12px)" }}
            transition={{ type: "spring", damping: 18, stiffness: 260 }}
            className="font-display text-7xl font-bold text-white"
          >
            {label === "Vai!" ? (
              <span className="text-lisboa-gold">{label}</span>
            ) : (
              label
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="absolute w-48 h-48 rounded-full border border-lisboa-gold/40"
        animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
        transition={{ duration: 0.85, repeat: Infinity }}
      />
    </div>
  );
}
