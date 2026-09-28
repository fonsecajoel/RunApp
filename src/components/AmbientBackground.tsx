import { motion } from "framer-motion";

export function AmbientBackground({ intense = false }: { intense?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 bg-lisboa-night" />
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-soft-light noise-overlay"
        aria-hidden
      />
      <motion.div
        className="absolute -top-[40%] -left-[30%] w-[90%] h-[70%] rounded-full bg-lisboa-tile/25 blur-[100px]"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, 30, 10, 0],
          scale: intense ? [1, 1.15, 1.05, 1] : [1, 1.08, 1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[30%] -right-[25%] w-[85%] h-[65%] rounded-full bg-lisboa-river/30 blur-[110px]"
        animate={{
          x: [0, -50, 20, 0],
          y: [0, -25, 15, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[20%] right-[10%] w-[45%] h-[40%] rounded-full bg-lisboa-gold/15 blur-[90px]"
        animate={{ opacity: [0.4, 0.7, 0.45, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-lisboa-night/20 to-lisboa-night" />
    </div>
  );
}
