import { useEffect, useRef, type MutableRefObject } from "react";
import type { Poi } from "../data/pois";
import type { LatLng } from "../lib/routing";

type Options = {
  active: boolean;
  pausedRef: MutableRefObject<boolean>;
  pois: Poi[];
  onMove: (pos: LatLng) => void;
  onReachPoi: (poi: Poi) => void;
  onFinished: () => void;
  waitForNarration: () => Promise<void>;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

async function sleep(ms: number, pausedRef: MutableRefObject<boolean>) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    while (pausedRef.current) {
      await new Promise((r) => setTimeout(r, 150));
    }
    await new Promise((r) => setTimeout(r, 50));
  }
}

export function useDemoTour({
  active,
  pausedRef,
  pois,
  onMove,
  onReachPoi,
  onFinished,
  waitForNarration,
}: Options) {
  const runningRef = useRef(false);

  useEffect(() => {
    if (!active || !pois.length) return;
    if (runningRef.current) return;

    runningRef.current = true;
    let cancelled = false;

    const run = async () => {
      let from: LatLng = [pois[0].lat - 0.004, pois[0].lng - 0.003];
      onMove(from);

      for (const poi of pois) {
        if (cancelled) return;
        const to: LatLng = [poi.lat, poi.lng];
        const steps = 40;

        for (let s = 1; s <= steps; s++) {
          if (cancelled) return;
          while (pausedRef.current) {
            await new Promise((r) => setTimeout(r, 150));
          }
          const t = easeInOut(s / steps);
          onMove([lerp(from[0], to[0], t), lerp(from[1], to[1], t)]);
          await sleep(50, pausedRef);
        }

        from = to;
        onReachPoi(poi);
        await waitForNarration();
        await sleep(500, pausedRef);
      }

      if (!cancelled) onFinished();
    };

    run().finally(() => {
      runningRef.current = false;
    });

    return () => {
      cancelled = true;
      runningRef.current = false;
    };
  }, [active, pois, onMove, onReachPoi, onFinished, waitForNarration, pausedRef]);

  useEffect(() => {
    if (!active) runningRef.current = false;
  }, [active]);
}
