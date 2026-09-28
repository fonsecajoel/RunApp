import type { Poi } from "../data/pois";

const cache = new Map<string, HTMLAudioElement>();

export function preloadPoiAudio(pois: Poi[]): void {
  for (const poi of pois) {
    const url = `/audio/${poi.id}.wav`;
    if (cache.has(url)) continue;
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.load();
    cache.set(url, audio);
  }
}

export function playPoiAudio(poi: Poi): HTMLAudioElement {
  const url = `/audio/${poi.id}.wav`;
  let audio = cache.get(url);
  if (!audio) {
    audio = new Audio(url);
    cache.set(url, audio);
  }
  audio.currentTime = 0;
  return audio;
}
