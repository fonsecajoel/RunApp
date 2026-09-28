import { motion } from "framer-motion";
import { Headphones, Map, Navigation } from "lucide-react";
import { DistancePicker } from "./DistancePicker";
import { PoiCarousel } from "./PoiCarousel";
import { RoutePreviewMap } from "./RoutePreviewMap";
import type { RoutePlan } from "../data/pois";
import type { Poi } from "../data/pois";
import type { LatLng } from "../lib/routing";

type Props = {
  plans: RoutePlan[];
  selectedKm: number | null;
  onSelectKm: (km: number) => void;
  routeLoading: boolean;
  route: LatLng[];
  pois: Poi[];
  onStart: () => void;
  canStart: boolean;
};

export function HomeScreen({
  plans,
  selectedKm,
  onSelectKm,
  routeLoading,
  route,
  pois,
  onStart,
  canStart,
}: Props) {
  return (
    <div className="min-h-full flex flex-col relative pb-28">
      <header className="px-5 pt-10 pb-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-lisboa-tile to-amber-900 flex items-center justify-center shadow-glow border border-white/10">
            <Map className="w-5 h-5 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-lisboa-mist">Stride Lisboa</p>
            <p className="text-sm font-medium text-lisboa-gold">Corrida + audioguia</p>
          </div>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight"
        >
          História em
          <br />
          <span className="text-lisboa-gold">cada passo.</span>
        </motion.h1>
        <p className="text-lisboa-mist mt-3 text-[15px] leading-relaxed max-w-[95%]">
          Rota de corrida por Belém e Lisboa. Áudio automático quando chegas a cada monumento.
        </p>
      </header>

      <main className="flex-1 px-5 space-y-5">
        <RoutePreviewMap route={route} pois={pois} loading={routeLoading} />
        <DistancePicker
          plans={plans}
          selectedKm={selectedKm}
          onSelect={onSelectKm}
          loading={routeLoading}
        />
        <PoiCarousel pois={pois} />
        <div className="flex items-start gap-3 rounded-2xl border border-lisboa-gold/20 bg-lisboa-gold/5 px-4 py-3">
          <Headphones className="w-5 h-5 text-lisboa-gold shrink-0 mt-0.5" />
          <p className="text-sm text-white/85 leading-relaxed">
            Ao começar, as <strong className="text-lisboa-gold font-medium">histórias tocam sozinhas</strong> no
            computador. No telemóvel, usa o GPS ao correr em Lisboa.
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none max-w-[430px] mx-auto">
        <div className="h-20 bg-gradient-to-t from-lisboa-night via-lisboa-night/95 to-transparent" />
        <div className="pointer-events-auto px-5 pb-6 safe-bottom -mt-14">
          <motion.button
            type="button"
            whileTap={{ scale: 0.985 }}
            disabled={!canStart}
            onClick={onStart}
            className="w-full py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-lisboa-tile via-amber-600 to-lisboa-tile shadow-glow border border-white/10 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Começar corrida
          </motion.button>
        </div>
      </div>
    </div>
  );
}
