import { EpisodePlayer } from "./EpisodePlayer";
import { getEpisode } from "../data/episodes";
import type { Poi } from "../data/pois";

type Props = {
  time: string;
  km: string;
  pace: string;
  progress: number;
  stories: number;
  total: number;
  nextPoi: Poi | null;
  activePoi: Poi | null;
  speaking: boolean;
  paused: boolean;
  simulating: boolean;
  muted: boolean;
  onPause: () => void;
  onMute: () => void;
  onReplay: () => void;
};

export function RunSheet({
  time,
  km,
  pace,
  progress,
  stories,
  total,
  nextPoi,
  activePoi,
  speaking,
  paused,
  simulating,
  muted,
  onPause,
  onMute,
  onReplay,
}: Props) {
  const episode = activePoi ? getEpisode(activePoi) : null;

  return (
    <div className="rounded-t-2xl border-t border-line bg-ink-soft/95 backdrop-blur-md safe-bottom max-h-[52vh] flex flex-col">
      <div className="h-1 bg-white/5 shrink-0">
        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="px-4 pt-3 pb-4 overflow-y-auto">
        <div className="flex items-center justify-between text-xs text-ink-mute mb-3">
          <span className="font-medium text-white/90">
            {simulating ? "Simulação ativa" : "GPS ao vivo"}
          </span>
          <span>{stories}/{total} episódios</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <Cell label="Tempo" value={time} />
          <Cell label="Km" value={km} bold />
          <Cell label="Ritmo" value={pace} />
        </div>

        {activePoi && episode ? (
          <div className="mb-3">
            <EpisodePlayer
              poi={activePoi}
              episode={episode}
              speaking={speaking}
              muted={muted}
              onMute={onMute}
              onReplay={onReplay}
            />
          </div>
        ) : nextPoi ? (
          <p className="text-sm text-ink-mute mb-3 px-1">
            A caminho de <span className="text-white font-medium">{nextPoi.name}</span>
          </p>
        ) : (
          <p className="text-sm text-accent mb-3 px-1 font-medium">Todos os episódios deste percurso.</p>
        )}

        <button
          type="button"
          onClick={onPause}
          className="w-full h-11 rounded-xl border border-line font-medium text-sm bg-ink"
        >
          {paused ? "Continuar corrida" : "Pausar"}
        </button>
      </div>
    </div>
  );
}

function Cell({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="rounded-xl bg-ink border border-line py-2 px-2 text-center">
      <p className="text-[10px] uppercase text-ink-mute">{label}</p>
      <p className={`tabular-nums mt-0.5 ${bold ? "text-lg font-bold" : "text-base font-semibold"}`}>
        {value}
      </p>
    </div>
  );
}
