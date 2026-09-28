import { DistancePicker } from "./DistancePicker";
import { RoutePreviewMap } from "./RoutePreviewMap";
import type { Poi, RoutePlan } from "../data/pois";
import type { LatLng } from "../lib/routing";

type Props = {
  plans: RoutePlan[];
  selectedKm: number | null;
  onSelectKm: (km: number) => void;
  routeLoading: boolean;
  route: LatLng[];
  pois: Poi[];
  onStart: () => void;
  onSimulate: () => void;
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
  onSimulate,
  canStart,
}: Props) {
  const plan = plans.find((p) => p.km === selectedKm);

  return (
    <div className="min-h-full flex flex-col max-w-lg mx-auto">
      <header className="px-5 pt-8 safe-top">
        <p className="text-xs font-semibold tracking-widest text-accent uppercase">RunApp</p>
        <h1 className="text-[2rem] font-bold tracking-tight mt-2 leading-tight">
          Correr em Lisboa com história no ouvido.
        </h1>
        <p className="text-ink-mute text-[15px] mt-2 leading-relaxed">
          Escolhe a distância. A narração começa quando passas por cada monumento.
        </p>
      </header>

      <main className="flex-1 px-5 mt-6 space-y-5 pb-36">
        <RoutePreviewMap route={route} pois={pois} loading={routeLoading} />
        <DistancePicker
          plans={plans}
          selectedKm={selectedKm}
          onSelect={onSelectKm}
          loading={routeLoading}
        />

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-mute mb-3">
            Paragens · {plan?.poiIds.length ?? 0}
          </h2>
          <ol className="space-y-0 border border-line rounded-2xl overflow-hidden divide-y divide-line">
            {pois.map((poi, i) => (
              <li key={poi.id} className="flex gap-3 px-4 py-3 bg-ink-soft/50">
                <span className="text-xs font-bold text-accent tabular-nums w-5 pt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-[15px] leading-snug">{poi.name}</p>
                  <p className="text-xs text-ink-mute mt-0.5 truncate">{poi.storyTitle}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="fixed bottom-0 inset-x-0 z-10 pointer-events-none">
        <div className="max-w-lg mx-auto px-5 pb-6 safe-bottom pt-4 bg-gradient-to-t from-ink via-ink to-transparent pointer-events-auto space-y-2">
          <button
            type="button"
            disabled={!canStart}
            onClick={onStart}
            className="w-full h-12 rounded-2xl bg-white text-ink font-semibold text-[15px] disabled:opacity-40"
          >
            Iniciar corrida (GPS)
          </button>
          <button
            type="button"
            disabled={!canStart}
            onClick={onSimulate}
            className="w-full h-11 rounded-2xl border border-line text-[14px] font-medium text-white/90 disabled:opacity-40"
          >
            Simular percurso e ouvir histórias
          </button>
        </div>
      </footer>
    </div>
  );
}
