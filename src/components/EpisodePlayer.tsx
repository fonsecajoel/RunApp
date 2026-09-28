import type { Episode } from "../data/episodes";
import type { Poi } from "../data/pois";

type Props = {
  poi: Poi;
  episode: Episode;
  speaking: boolean;
  muted: boolean;
  onMute: () => void;
  onReplay: () => void;
};

export function EpisodePlayer({ poi, episode, speaking, muted, onMute, onReplay }: Props) {
  return (
    <article className="rounded-xl border border-line bg-ink p-4">
      <p className="text-[10px] uppercase tracking-wider text-accent font-semibold">
        {episode.series}
        {speaking && !muted ? " · a tocar" : ""}
      </p>
      <h3 className="text-lg font-semibold mt-1">{poi.name}</h3>
      <p className="text-sm text-ink-mute mt-1">{poi.storyTitle}</p>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase text-ink-mute mb-2">O que ficas a saber</p>
        <ul className="space-y-2">
          {episode.learnPoints.map((point) => (
            <li key={point} className="flex gap-2 text-sm leading-snug text-white/90">
              <span className="text-accent shrink-0">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] text-ink-mute/80 mt-3 italic">Fonte: {episode.sourceNote}</p>

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={onMute}
          className="px-3 h-9 rounded-lg border border-line text-sm"
        >
          {muted ? "Ligar som" : "Silenciar"}
        </button>
        <button
          type="button"
          onClick={onReplay}
          className="flex-1 h-9 rounded-lg bg-accent text-sm font-semibold text-white"
        >
          Ouvir episódio
        </button>
      </div>
    </article>
  );
}
