import { useEffect, useMemo } from "react";
import { Circle, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Poi } from "../data/pois";
import type { LatLng } from "../lib/routing";

const userIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#fff;border:3px solid #ff4d2e;box-shadow:0 0 0 4px rgba(255,77,46,0.25)"></div>`,
  iconSize: [14, 14],
});

function Follow({ center, on }: { center: LatLng | null; on: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (on && center) map.panTo(center, { animate: true, duration: 0.35 });
  }, [center, on, map]);
  return null;
}

type Props = {
  route: LatLng[];
  pois: Poi[];
  userPos: LatLng | null;
  visitedIds: Set<string>;
  followUser: boolean;
};

export function RunMap({ route, pois, userPos, visitedIds, followUser }: Props) {
  const center = useMemo<LatLng>(() => route[0] ?? [38.6936, -9.2057], [route]);

  return (
    <MapContainer center={center} zoom={14} className="h-full w-full" zoomControl={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      {route.length > 1 && (
        <Polyline positions={route} pathOptions={{ color: "#ff4d2e", weight: 4, opacity: 0.9 }} />
      )}
      {pois.map((poi) => (
        <Circle
          key={poi.id}
          center={[poi.lat, poi.lng]}
          radius={poi.triggerRadiusM}
          pathOptions={{
            color: visitedIds.has(poi.id) ? "#ff4d2e" : "#4b5563",
            fillOpacity: 0.06,
            weight: 1,
          }}
        />
      ))}
      {userPos && <Marker position={userPos} icon={userIcon} />}
      <Follow center={userPos} on={followUser} />
    </MapContainer>
  );
}
