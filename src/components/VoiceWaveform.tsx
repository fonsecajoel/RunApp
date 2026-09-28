import { motion } from "framer-motion";

export function VoiceWaveform({ active }: { active: boolean }) {
  const bars = [0.35, 0.65, 1, 0.55, 0.85, 0.45, 0.75, 0.5];
  return (
    <div className="flex items-end justify-center gap-[3px] h-8" aria-hidden>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-lisboa-gold"
          animate={
            active
              ? {
                  height: [`${h * 12}px`, `${h * 28}px`, `${h * 14}px`],
                  opacity: [0.5, 1, 0.6],
                }
              : { height: `${h * 10}px`, opacity: 0.35 }
          }
          transition={
            active
              ? {
                  duration: 0.55 + i * 0.05,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
