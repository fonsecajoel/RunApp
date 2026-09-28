import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, LocateFixed } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { AmbientBackground } from "./components/AmbientBackground";
import { AppShell } from "./components/AppShell";
import { CountdownOverlay } from "./components/CountdownOverlay";
import { DiscoveryMoment } from "./components/DiscoveryMoment";
import { HomeScreen } from "./components/HomeScreen";
import { RunComplete } from "./components/RunComplete";
import { RunDock } from "./components/RunDock";
import { RunMap } from "./components/RunMap";
import { SplashScreen } from "./components/SplashScreen";
import {
  ROUTE_PLANS,
  getPoiById,
  haversineM,
  LISBON_POIS,
  type Poi,
  type RoutePlan,
} from "./data/pois";
import { useDemoTour } from "./hooks/useDemoTour";
import { useGeolocation } from "./hooks/useGeolocation";
import { useNarration } from "./hooks/useNarration";
import { isMobileDevice } from "./lib/device";
import { preloadPoiAudio } from "./lib/preloadAudio";
import { fetchWalkingRoute, polylineLengthM, snapToRoute, type LatLng } from "./lib/routing";
import { playDiscoveryChime, unlockAudio, vibrateDiscovery } from "./lib/sfx";
import { unlockSpeech } from "./lib/speech";

type Screen = "splash" | "home" | "countdown" | "run";

function formatPace(secPerKm: number): string {
  if (!Number.isFinite(secPerKm) || secPerKm <= 0) return "—";
  const m = Math.floor(secPerKm / 60);
  const s = Math.floor(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDist(m: number | null): string {
  if (m == null) return "—";
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}

function nearestUnvisitedPoi(
  pois: Poi[],
  visited: Set<string>,
  userPos: LatLng | null
): { poi: Poi | null; distanceM: number | null } {
  const remaining = pois.filter((p) => !visited.has(p.id));
  if (!remaining.length) return { poi: null, distanceM: null };
  if (!userPos) return { poi: remaining[0], distanceM: null };
  let best = remaining[0];
  let bestD = haversineM(userPos[0], userPos[1], best.lat, best.lng);
  for (const p of remaining.slice(1)) {
    const d = haversineM(userPos[0], userPos[1], p.lat, p.lng);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return { poi: best, distanceM: bestD };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedKm, setSelectedKm] = useState<number | null>(15);
  const [route, setRoute] = useState<LatLng[]>([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [demoTour, setDemoTour] = useState(false);
  const [followUser, setFollowUser] = useState(true);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(() => new Set());
  const [elapsedSec, setElapsedSec] = useState(0);
  const [distanceM, setDistanceM] = useState(0);
  const [discoveryPoi, setDiscoveryPoi] = useState<Poi | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const lastPosRef = useRef<LatLng | null>(null);
  const visitedRef = useRef<Set<string>>(new Set());
  const pausedRef = useRef(paused);
  const tourStartedRef = useRef(false);
  pausedRef.current = paused;

  const plan = useMemo(
    () => ROUTE_PLANS.find((p) => p.km === selectedKm) ?? ROUTE_PLANS[1],
    [selectedKm]
  );

  const routePois = useMemo(
    () => plan.poiIds.map((id) => getPoiById(id)).filter(Boolean) as typeof LISBON_POIS,
    [plan]
  );

  const geo = useGeolocation(screen === "run" && running && !paused && !demoTour);
  const narration = useNarration();

  const loadRoute = useCallback(async (p: RoutePlan) => {
    setRouteLoading(true);
    const coords = await fetchWalkingRoute(p.waypoints);
    setRoute(coords);
    setRouteLoading(false);
  }, []);

  useEffect(() => {
    if (selectedKm) loadRoute(plan);
  }, [selectedKm, plan, loadRoute]);

  useEffect(() => {
    preloadPoiAudio(routePois);
  }, [routePois]);

  useEffect(() => {
    if (screen !== "splash") return;
    const t = setTimeout(() => setScreen("home"), 2200);
    return () => clearTimeout(t);
  }, [screen]);

  const discoverPoi = useCallback(
    (poi: Poi) => {
      if (visitedRef.current.has(poi.id)) return;
      visitedRef.current.add(poi.id);
      setVisitedIds(new Set(visitedRef.current));
      vibrateDiscovery();
      playDiscoveryChime();
      setDiscoveryPoi(poi);
      window.setTimeout(() => setDiscoveryPoi(null), 1800);
      narration.speakPoi(poi);
    },
    [narration.speakPoi]
  );

  const waitForNarration = useCallback(() => {
    return new Promise<void>((resolve) => {
      const max = window.setTimeout(resolve, 120_000);
      const finish = () => {
        clearTimeout(max);
        unsub();
        resolve();
      };
      const unsub = narration.onNarrationEnd(finish);
    });
  }, [narration.onNarrationEnd]);

  const handleDemoMove = useCallback(
    (pos: LatLng) => {
      geo.setSimulated(pos[0], pos[1]);
      if (route.length > 1) {
        const snap = snapToRoute(route, pos);
        if (snap.offRouteM < 200) setDistanceM((m) => Math.max(m, snap.distanceAlongM));
      }
    },
    [geo, route]
  );

  const startDemoTour = useCallback(() => {
    unlockSpeech();
    unlockAudio();
    tourStartedRef.current = true;
    setDemoTour(true);
    setPaused(false);
    setShowComplete(false);
    if (route[0]) geo.setSimulated(route[0][0], route[0][1]);
  }, [geo, route]);

  useDemoTour({
    active: demoTour && running && screen === "run",
    pausedRef,
    pois: routePois,
    onMove: handleDemoMove,
    onReachPoi: discoverPoi,
    onFinished: () => {
      setPaused(true);
      setShowComplete(true);
    },
    waitForNarration,
  });

  const userPos: LatLng | null = geo.position
    ? [geo.position.lat, geo.position.lng]
    : null;

  useEffect(() => {
    if (screen !== "run" || !running || demoTour || tourStartedRef.current) return;
    if (isMobileDevice()) return;
    const t = window.setTimeout(() => startDemoTour(), 700);
    return () => clearTimeout(t);
  }, [screen, running, demoTour, startDemoTour]);

  useEffect(() => {
    if (!running || paused) return;
    const id = window.setInterval(() => setElapsedSec((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running, paused]);

  useEffect(() => {
    if (!userPos || !running || paused || demoTour) return;

    if (lastPosRef.current) {
      const d = haversineM(
        lastPosRef.current[0],
        lastPosRef.current[1],
        userPos[0],
        userPos[1]
      );
      if (d < 100) setDistanceM((m) => m + d);
    }
    lastPosRef.current = userPos;

    if (route.length > 1) {
      const snap = snapToRoute(route, userPos);
      if (snap.offRouteM < 150) setDistanceM((m) => Math.max(m, snap.distanceAlongM));
    }

    for (const poi of routePois) {
      const dist = haversineM(userPos[0], userPos[1], poi.lat, poi.lng);
      if (dist <= poi.triggerRadiusM && !visitedRef.current.has(poi.id)) {
        discoverPoi(poi);
      }
    }
  }, [userPos, running, paused, route, routePois, demoTour, discoverPoi]);

  const routeLenM = route.length > 1 ? polylineLengthM(route) : plan.km * 1000;
  const progress = Math.min(100, (distanceM / routeLenM) * 100);
  const paceSecPerKm = distanceM > 200 ? elapsedSec / (distanceM / 1000) : 0;

  const { poi: nextPoi, distanceM: distNext } = nearestUnvisitedPoi(
    routePois,
    visitedIds,
    userPos
  );

  const prepareRun = () => {
    unlockSpeech();
    unlockAudio();
    preloadPoiAudio(routePois);
    setScreen("countdown");
  };

  const beginRun = () => {
    unlockSpeech();
    unlockAudio();
    narration.reset();
    visitedRef.current = new Set();
    tourStartedRef.current = false;
    setVisitedIds(new Set());
    setElapsedSec(0);
    setDistanceM(0);
    setShowComplete(false);
    setDiscoveryPoi(null);
    setDemoTour(false);
    lastPosRef.current = null;
    setPaused(false);
    setRunning(true);
    setScreen("run");
  };

  const endRun = () => {
    setRunning(false);
    setDemoTour(false);
    tourStartedRef.current = false;
    setShowComplete(false);
    narration.stop();
    setScreen("home");
  };

  const geoHint =
    geo.error && !demoTour
      ? `${geo.error} Toca «Ouvir histórias».`
      : narration.lastError
        ? `Voz alternativa: ${narration.lastError}`
        : null;

  return (
    <AppShell>
      <AmbientBackground intense={screen === "run"} />
      <AnimatePresence>
        {screen === "splash" && <SplashScreen onDone={() => setScreen("home")} />}
      </AnimatePresence>

      {screen === "home" && (
        <HomeScreen
          plans={ROUTE_PLANS}
          selectedKm={selectedKm}
          onSelectKm={setSelectedKm}
          routeLoading={routeLoading}
          route={route}
          pois={routePois}
          onStart={prepareRun}
          canStart={!routeLoading && route.length > 1}
        />
      )}

      {screen === "countdown" && <CountdownOverlay onComplete={beginRun} />}

      {screen === "run" && (
        <div className="h-full min-h-[100dvh] flex flex-col relative">
          <div className="absolute inset-0 map-vignette pointer-events-none z-[300]" />
          <div className="absolute inset-0 bottom-[280px] sm:bottom-[300px]">
            <RunMap
              route={route}
              pois={routePois}
              userPos={userPos}
              activePoiId={narration.activePoi?.id ?? discoveryPoi?.id ?? null}
              visitedIds={visitedIds}
              followUser={followUser}
            />
          </div>

          <div className="relative z-[400] flex flex-col h-full pointer-events-none">
            <div className="pointer-events-auto flex items-center justify-between p-3 pt-4">
              <button
                type="button"
                onClick={endRun}
                className="p-2.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setFollowUser((f) => !f)}
                className={`p-2.5 rounded-xl backdrop-blur-xl border ${
                  followUser
                    ? "bg-lisboa-gold/25 border-lisboa-gold/50"
                    : "bg-black/60 border-white/10"
                }`}
              >
                <LocateFixed className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1" />

            <RunDock
              planLabel={plan.label}
              modeLabel={demoTour ? "Histórias" : "GPS"}
              progress={progress}
              storiesDone={visitedIds.size}
              storiesTotal={routePois.length}
              time={formatTime(elapsedSec)}
              km={(distanceM / 1000).toFixed(2)}
              pace={formatPace(paceSecPerKm)}
              nextPoi={nextPoi}
              distNext={formatDist(distNext)}
              activePoi={narration.activePoi}
              speaking={narration.speaking}
              muted={narration.muted}
              demoTour={demoTour}
              paused={paused}
              geoHint={geoHint}
              onPause={() => setPaused((p) => !p)}
              onTour={startDemoTour}
              onMute={() => narration.setMuted(!narration.muted)}
              onDismissStory={() => narration.dismiss()}
              onReplay={() => narration.activePoi && narration.speakPoi(narration.activePoi)}
            />
          </div>

          <DiscoveryMoment poi={discoveryPoi} />

          {showComplete && (
            <RunComplete
              distanceKm={distanceM / 1000}
              elapsedSec={elapsedSec}
              stories={visitedIds.size}
              onHome={endRun}
            />
          )}
        </div>
      )}
    </AppShell>
  );
}
