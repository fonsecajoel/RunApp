type Props = {
  distanceKm: number;
  elapsedSec: number;
  stories: number;
  onHome: () => void;
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function RunComplete({ distanceKm, elapsedSec, stories, onHome }: Props) {
  return (
    <div className="fixed inset-0 z-[600] bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-ink-soft p-6">
        <h2 className="text-xl font-bold">Corrida terminada</h2>
        <p className="text-ink-mute text-sm mt-1">Bom trabalho em Lisboa.</p>
        <div className="grid grid-cols-3 gap-2 mt-5">
          <Stat v={distanceKm.toFixed(1)} l="km" />
          <Stat v={formatTime(elapsedSec)} l="tempo" />
          <Stat v={String(stories)} l="histórias" />
        </div>
        <button
          type="button"
          onClick={onHome}
          className="mt-6 w-full h-11 rounded-xl bg-white text-ink font-semibold text-sm"
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-xl border border-line bg-ink py-3 text-center">
      <p className="text-lg font-bold tabular-nums">{v}</p>
      <p className="text-[10px] uppercase text-ink-mute mt-1">{l}</p>
    </div>
  );
}
