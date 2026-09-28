import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, LocateFixed } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RunComplete } from "../components/RunComplete";
import { RunMap } from "../components/RunMap";
import { RunSheet } from "../components/RunSheet";
import { getPoiById, haversineM, type Poi } from "../data/pois";
import { getRouteById } from "../data/routes";
import { useAuth } from "../context/AuthContext";
import { useDemoTour } from "../hooks/useDemoTour";
import { useGeolocation } from "../hooks/useGeolocation";
import { useNarration } from "../hooks/useNarration";
import { preloadPoiAudio } from "../lib/preloadAudio";
import { fetchWalkingRoute, polylineLengthM, snapToRoute, type LatLng } from "../lib/routing";
import { playDiscoveryChime, unlockAudio, vibrateDiscovery } from "../lib/sfx";
import { unlockSpeech } from "../lib/speech";

function formatPace(secPerKm: number): string {
  if (!Number.isFinite(secPerKm) || secPerKm <= 0) return "—";
  const m = Math.floor(secPerKm / 60);
  const s = Math.floor(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function nextPoi(pois: Poi[], visited: Set<string>, pos: LatLng | null): Poi | null {
  const left = pois.filter((p) => !visited.has(p.id));
  if (!left.length) return null;
  if (!pos) return left[0];
  return left.reduce((a, b) =>
    haversineM(pos[0], pos[1], a.lat, a.lng) < haversineM(pos[0], pos[1], b.lat, b.lng) ? a : b
  );
}

export function RunPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const routeDef = id ? getRouteById(id) : undefined;
  const simulating = params.get("simulate") === "1";

  const [path, setPath] = useState<LatLng[]>([]);
  const [paused, setPaused] = useState(false);
  const [followUser, setFollowUser] = useState(true);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(() => new Set());
  const [elapsedSec, setElapsedSec] = useState(0);
  const [distanceM, setDistanceM] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [gpsBanner, setGpsBanner] = useState<string | null>(null);
  const visitedRef = useRef<Set<string>>(new Set());
  const pausedRef = useRef(false);
  const lastPosRef = useRef<LatLng | null>(null);
  pausedRef.current = paused;

  const routePois = useMemo(
    () =>
      routeDef
        ? routeDef.poiIds.map((pid) => getPoiById(pid)).filter((p): p is Poi => Boolean(p))
        : [],
    [routeDef]
  );

  const geo = useGeolocation(Boolean(routeDef) && !paused && !simulating, user?.settings.highAccuracyGps);
  const narration = useNarration(user?.settings.speechRate);

  useEffect(() => {
    unlockSpeech();
    unlockAudio();
    visitedRef.current = new Set();
    setVisitedIds(new Set());
    narration.reset();
    return () => {
      narration.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset só ao mudar percurso/modo
  }, [id, simulating]);

  useEffect(() => {
    if (!routeDef) return;
    preloadPoiAudio(routePois);
    fetchWalkingRoute(routeDef.waypoints).then(setPath);
  }, [routeDef, routePois]);

  useEffect(() => {
    if (!simulating || !path[0]) return;
    geo.setSimulated(path[0][0], path[0][1]);
  }, [simulating, path, geo]);

  useEffect(() => {
    if (simulating) return;
    if (geo.error) setGpsBanner(geo.error);
    else if (geo.position) setGpsBanner(null);
  }, [geo.error, geo.position, simulating]);

  const discoverPoi = useCallback(
    (poi: Poi) => {
      if (visitedRef.current.has(poi.id)) return;
      visitedRef.current.add(poi.id);
      setVisitedIds(new Set(visitedRef.current));
      if (user?.settings.haptics) vibrateDiscovery();
      playDiscoveryChime();
      narration.speakPoi(poi);
    },
    [narration.speakPoi, user?.settings.haptics]
  );

  const waitForNarration = useCallback(() => {
    return new Promise<void>((resolve) => {
      const max = window.setTimeout(resolve, 120_000);
      const off = narration.onNarrationEnd(() => {
        clearTimeout(max);
        off();
        resolve();
      });
    });
  }, [narration.onNarrationEnd]);

  const onSimMove = useCallback(
    (pos: LatLng) => {
      geo.setSimulated(pos[0], pos[1]);
      if (path.length > 1) {
        const snap = snapToRoute(path, pos);
        if (snap.offRouteM < 200) setDistanceM((m) => Math.max(m, snap.distanceAlongM));
      }
    },
    [geo, path]
  );

  const tourActive = simulating && Boolean(routeDef) && path.length > 1 && !paused;

  useDemoTour({
    active: tourActive,
    pausedRef,
    pois: routePois,
    onMove: onSimMove,
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
    if (paused) return;
    const t = window.setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    if (!userPos || paused || simulating) return;
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
    if (path.length > 1) {
      const snap = snapToRoute(path, userPos);
      if (snap.offRouteM < 150) setDistanceM((m) => Math.max(m, snap.distanceAlongM));
    }
    for (const poi of routePois) {
      const d = haversineM(userPos[0], userPos[1], poi.lat, poi.lng);
      if (d <= poi.triggerRadiusM && !visitedRef.current.has(poi.id)) discoverPoi(poi);
    }
  }, [userPos, paused, simulating, path, routePois, discoverPoi]);

  if (!routeDef) {
    return (
      <div className="p-5">
        <p>Percurso inválido.</p>
        <button type="button" className="mt-4 underline" onClick={() => navigate("/routes")}>
          Voltar
        </button>
      </div>
    );
  }

  const routeLen = path.length > 1 ? polylineLengthM(path) : routeDef.distanceKm * 1000;
  const progress = Math.min(100, (distanceM / routeLen) * 100);

  return (
    <div className="h-[100dvh] flex flex-col bg-ink max-w-lg mx-auto w-full">
      <header className="absolute top-0 inset-x-0 z-[500] flex items-center justify-between px-3 safe-top max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => navigate(`/routes/${routeDef.id}`)}
          className="w-10 h-10 rounded-full bg-ink/90 border border-line flex items-center justify-center shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="px-3 py-1 rounded-full bg-ink/90 border border-line text-xs font-medium">
          {routeDef.title}
        </div>
        <button
          type="button"
          onClick={() => setFollowUser((f) => !f)}
          className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-lg ${
            followUser ? "bg-accent/25 border-accent/50" : "bg-ink/90 border-line"
          }`}
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 min-h-0">
        <RunMap
          route={path}
          pois={routePois}
          userPos={userPos}
          visitedIds={visitedIds}
          followUser={followUser}
        />
      </div>

      {gpsBanner && !simulating && (
        <p className="px-4 py-2 text-xs text-amber-100 bg-amber-950/90 border-t border-amber-800/50 text-center">
          {gpsBanner}
        </p>
      )}

      {simulating && !narration.activePoi && visitedIds.size === 0 && (
        <p className="px-4 py-2 text-xs text-center text-white/80 bg-accent/20 border-t border-accent/30">
          A aproximar do primeiro monumento…
        </p>
      )}

      <RunSheet
        time={formatTime(elapsedSec)}
        km={(distanceM / 1000).toFixed(2)}
        pace={formatPace(distanceM > 200 ? elapsedSec / (distanceM / 1000) : 0)}
        progress={progress}
        stories={visitedIds.size}
        total={routePois.length}
        nextPoi={nextPoi(routePois, visitedIds, userPos)}
        activePoi={narration.activePoi}
        speaking={narration.speaking}
        paused={paused}
        simulating={simulating}
        muted={narration.muted}
        onPause={() => setPaused((p) => !p)}
        onMute={() => narration.setMuted(!narration.muted)}
        onReplay={() => narration.activePoi && narration.speakPoi(narration.activePoi)}
      />

      {showComplete && (
        <RunComplete
          distanceKm={distanceM / 1000}
          elapsedSec={elapsedSec}
          stories={visitedIds.size}
          onHome={() => navigate("/routes")}
        />
      )}
    </div>
  );
}
