import { useEffect, useMemo } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import type { LatLng } from "../lib/routing";
import type { Poi } from "../data/pois";
import L from "leaflet";

function FitRoute({ route, pois }: { route: LatLng[]; pois: Poi[] }) {
  const map = useMap();
  useEffect(() => {
    const points: LatLng[] = [...route];
    pois.forEach((p) => points.push([p.lat, p.lng]));
    if (points.length < 2) return;
    const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 14, animate: true });
  }, [map, route, pois]);
  return null;
}

type Props = {
  route: LatLng[];
  pois: Poi[];
  loading?: boolean;
};

export function RoutePreviewMap({ route, pois, loading }: Props) {
  const center = useMemo<LatLng>(() => route[0] ?? [38.6936, -9.2057], [route]);

  return (
    <div className="relative h-52 w-full rounded-2xl overflow-hidden border border-white/10 shadow-card ring-1 ring-white/5">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-lisboa-night/60 backdrop-blur-sm">
          <div className="h-8 w-8 rounded-full border-2 border-lisboa-gold/30 border-t-lisboa-gold animate-spin" />
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
          <>
            <Polyline
              positions={route}
              pathOptions={{ color: "#d4a853", weight: 10, opacity: 0.15, lineCap: "round" }}
            />
            <Polyline
              positions={route}
              pathOptions={{ color: "#d4a853", weight: 3, opacity: 0.95, lineCap: "round" }}
            />
          </>
        )}
        <FitRoute route={route} pois={pois} />
      </MapContainer>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-lisboa-night/90 to-transparent" />
      <p className="pointer-events-none absolute bottom-3 left-3 text-[11px] font-medium text-white/90">
        Pré-visualização da rota
      </p>
    </div>
  );
}
