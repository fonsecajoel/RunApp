import { useEffect, useMemo } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { Poi } from "../data/pois";
import type { LatLng } from "../lib/routing";

const runnerIcon = L.divIcon({
  className: "runner-pulse",
  html: `<div style="width:16px;height:16px;margin-left:-8px;margin-top:-8px;border-radius:9999px;background:#d4a853;border:2px solid #fff;box-shadow:0 0 20px rgba(212,168,83,0.6)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const poiIcon = (active: boolean) =>
  L.divIcon({
    className: "",
    html: `<div style="width:${active ? 14 : 10}px;height:${active ? 14 : 10}px;margin-left:-${active ? 7 : 5}px;margin-top:-${active ? 7 : 5}px;border-radius:9999px;background:${active ? "#c45c3e" : "rgba(255,255,255,0.92)"};border:2px solid rgba(212,168,83,0.7);box-shadow:0 2px 12px rgba(0,0,0,0.45)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

function MapController({
  center,
  follow,
}: {
  center: LatLng | null;
  follow: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (follow && center) {
      map.panTo(center, { animate: true, duration: 0.4 });
    }
  }, [center, follow, map]);
  return null;
}

type Props = {
  route: LatLng[];
  pois: Poi[];
  userPos: LatLng | null;
  activePoiId: string | null;
  visitedIds: Set<string>;
  followUser: boolean;
};

export function RunMap({
  route,
  pois,
  userPos,
  activePoiId,
  visitedIds,
  followUser,
}: Props) {
  const defaultCenter = useMemo<LatLng>(
    () => route[0] ?? [38.6936, -9.2057],
    [route]
  );

  return (
    <MapContainer
      center={defaultCenter}
      zoom={14}
      className="h-full w-full z-0"
      zoomControl={false}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CARTO'
      />
      {route.length > 1 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: "#d4a853",
            weight: 4,
            opacity: 0.85,
            lineCap: "round",
          }}
        />
      )}
      {route.length > 1 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: "#d4a853",
            weight: 12,
            opacity: 0.12,
            lineCap: "round",
          }}
        />
      )}
      {pois.map((poi) => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lng]}
          icon={poiIcon(poi.id === activePoiId || visitedIds.has(poi.id))}
        />
      ))}
      {pois.map((poi) => (
        <Circle
          key={`ring-${poi.id}`}
          center={[poi.lat, poi.lng]}
          radius={poi.triggerRadiusM}
          pathOptions={{
            color: visitedIds.has(poi.id) ? "#c45c3e" : "#3d6b8a",
            fillColor: visitedIds.has(poi.id) ? "#c45c3e" : "#3d6b8a",
            fillOpacity: 0.08,
            weight: 1,
            dashArray: visitedIds.has(poi.id) ? undefined : "6 8",
          }}
        />
      ))}
      {userPos && (
        <Marker position={userPos} icon={runnerIcon} zIndexOffset={1000} />
      )}
      {userPos && (
        <Circle
          center={userPos}
          radius={25}
          pathOptions={{
            color: "#d4a853",
            fillColor: "#d4a853",
            fillOpacity: 0.15,
            weight: 1,
          }}
        />
      )}
      <MapController center={userPos} follow={followUser} />
    </MapContainer>
  );
}
