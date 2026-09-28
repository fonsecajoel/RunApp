import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function SettingsPage() {
  const { user, patchSettings } = useAuth();
  if (!user) return null;

  const s = user.settings;

  return (
    <div className="px-5 pt-4 safe-top pb-24">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-ink-mute mb-4">
        <ChevronLeft className="w-4 h-4" /> Perfil
      </Link>
      <h1 className="text-2xl font-bold">Definições</h1>

      <div className="mt-6 rounded-2xl border border-line divide-y divide-line overflow-hidden">
        <Toggle
          label="GPS de alta precisão"
          hint="Mais bateria, melhor posição em corrida"
          checked={s.highAccuracyGps}
          onChange={(v) => patchSettings({ highAccuracyGps: v })}
        />
        <Toggle
          label="Vibração ao descobrir"
          checked={s.haptics}
          onChange={(v) => patchSettings({ haptics: v })}
        />
      </div>

      <label className="block mt-6">
        <span className="text-xs font-medium text-ink-mute uppercase">Velocidade da voz</span>
        <input
          type="range"
          min={0.75}
          max={1.1}
          step={0.05}
          value={s.speechRate}
          onChange={(e) => patchSettings({ speechRate: Number(e.target.value) })}
          className="w-full mt-2"
        />
        <p className="text-xs text-ink-mute mt-1">{s.speechRate.toFixed(2)}×</p>
      </label>

      <p className="text-xs text-ink-mute mt-8 leading-relaxed">
        Login local (demo). Para ligar ao Supabase como no projeto Bora, configura{" "}
        <code className="text-white/80">VITE_SUPABASE_URL</code> numa próxima versão.
      </p>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-ink-soft"
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-ink-mute mt-0.5">{hint}</p>}
      </div>
      <div
        className={`w-11 h-6 rounded-full p-0.5 transition-colors ${checked ? "bg-accent" : "bg-ink-mute/40"}`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`}
        />
      </div>
    </button>
  );
}
