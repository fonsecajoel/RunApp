import { motion } from "framer-motion";
import { Map } from "lucide-react";

type Props = { onDone: () => void };

export function SplashScreen({ onDone }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onDone}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#06080c] max-w-[430px] mx-auto left-0 right-0"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 16, stiffness: 200 }}
        className="w-20 h-20 rounded-[1.35rem] bg-gradient-to-br from-lisboa-tile to-amber-900 flex items-center justify-center shadow-glow"
      >
        <Map className="w-9 h-9 text-white" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-display text-3xl font-bold mt-8"
      >
        Stride <span className="text-lisboa-gold">Lisboa</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-lisboa-mist mt-2 text-sm"
      >
        Correr. Ouvir. Descobrir.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-10 text-xs text-lisboa-mist/70"
      >
        Toca para continuar
      </motion.p>
    </motion.button>
  );
}
