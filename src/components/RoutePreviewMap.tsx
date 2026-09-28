import { useEffect, useMemo } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Poi } from "../data/pois";
import type { LatLng } from "../lib/routing";

function FitRoute({ route, pois }: { route: LatLng[]; pois: Poi[] }) {
  const map = useMap();
  useEffect(() => {
    const pts: LatLng[] = [...route, ...pois.map((p) => [p.lat, p.lng] as LatLng)];
    if (pts.length < 2) return;
    map.fitBounds(L.latLngBounds(pts), { padding: [24, 24], maxZoom: 14 });
  }, [map, route, pois]);
  return null;
}

type Props = { route: LatLng[]; pois: Poi[]; loading?: boolean };

export function RoutePreviewMap({ route, pois, loading }: Props) {
  const center = useMemo<LatLng>(() => route[0] ?? [38.6936, -9.2057], [route]);

  return (
    <div className="relative h-48 rounded-2xl overflow-hidden border border-line">
      {loading && (
        <div className="absolute inset-0 z-10 bg-ink/70 flex items-center justify-center text-sm text-ink-mute">
          A calcular rota…
        </div>
      )}
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {route.length > 1 && (
          <Polyline positions={route} pathOptions={{ color: "#ff4d2e", weight: 3, opacity: 0.95 }} />
        )}
        <FitRoute route={route} pois={pois} />
      </MapContainer>
    </div>
  );
}
