import type { RoutePlan } from "../data/pois";

type Props = {
  plans: RoutePlan[];
  selectedKm: number | null;
  onSelect: (km: number) => void;
  loading: boolean;
};

export function DistancePicker({ plans, selectedKm, onSelect, loading }: Props) {
  const active = plans.find((p) => p.km === selectedKm) ?? plans[0];

  return (
    <div>
      <div className="flex rounded-2xl border border-line p-1 bg-ink-soft">
        {plans.map((plan) => {
          const on = selectedKm === plan.km;
          return (
            <button
              key={plan.km}
              type="button"
              disabled={loading}
              onClick={() => onSelect(plan.km)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                on ? "bg-white text-ink" : "text-ink-mute"
              }`}
            >
              {plan.km} km
            </button>
          );
        })}
      </div>
      <p className="text-sm text-ink-mute mt-3 leading-relaxed">{active.description}</p>
      <p className="text-xs text-ink-mute/80 mt-1">~{active.estimatedMin} min · corrida leve</p>
    </div>
  );
}
