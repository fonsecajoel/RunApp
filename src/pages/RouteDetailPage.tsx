import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getRouteById } from "../data/routes";
import { getPoiById } from "../data/pois";
import { getEpisode } from "../data/episodes";
import { RoutePreviewMap } from "../components/RoutePreviewMap";
import { useEffect, useMemo, useState } from "react";
import { fetchWalkingRoute, type LatLng } from "../lib/routing";

export function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const route = id ? getRouteById(id) : undefined;
  const [path, setPath] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState(true);

  const pois = useMemo(
    () => (route ? route.poiIds.map((pid) => getPoiById(pid)).filter(Boolean) : []),
    [route]
  );

  useEffect(() => {
    if (!route) return;
    setLoading(true);
    fetchWalkingRoute(route.waypoints).then((coords) => {
      setPath(coords);
      setLoading(false);
    });
  }, [route]);

  if (!route) {
    return (
      <div className="p-5">
        <p>Percurso não encontrado.</p>
        <Link to="/routes">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="px-5 pt-4 safe-top pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-ink-mute mb-4"
      >
        <ChevronLeft className="w-4 h-4" /> Percursos
      </button>

      <h1 className="text-2xl font-bold">{route.title}</h1>
      <p className="text-ink-mute mt-1">{route.subtitle}</p>

      <div className="mt-5">
        <RoutePreviewMap route={path} pois={pois as NonNullable<ReturnType<typeof getPoiById>>[]} loading={loading} />
      </div>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase text-ink-mute">Vais aprender</h2>
        <ul className="mt-2 space-y-2">
          {route.youWillLearn.map((item) => (
            <li key={item} className="text-sm flex gap-2">
              <span className="text-accent">•</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase text-ink-mute mb-2">Episódios</h2>
        <ol className="space-y-3">
          {pois.map((poi, i) => {
            if (!poi) return null;
            const ep = getEpisode(poi);
            return (
              <li key={poi.id} className="rounded-xl border border-line p-3 bg-ink-soft">
                <p className="text-[10px] text-accent font-semibold">
                  {i + 1}. {ep.series}
                </p>
                <p className="font-medium">{poi.name}</p>
                <p className="text-xs text-ink-mute mt-1 line-clamp-2">{ep.learnPoints[0]}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-8 space-y-2">
        <button
          type="button"
          onClick={() => navigate(`/run/${route.id}`)}
          className="w-full h-12 rounded-2xl bg-white text-ink font-semibold"
        >
          Correr com GPS
        </button>
        <button
          type="button"
          onClick={() => navigate(`/run/${route.id}?simulate=1`)}
          className="w-full h-11 rounded-2xl border border-line text-sm font-medium"
        >
          Simular (sem GPS)
        </button>
      </div>
    </div>
  );
}
