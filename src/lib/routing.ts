export type LatLng = [number, number];

export async function fetchWalkingRoute(waypoints: LatLng[]): Promise<LatLng[]> {
  if (waypoints.length < 2) return waypoints;

  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/foot/${coords}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("OSRM failed");
    const data = await res.json();
    const geometry = data.routes?.[0]?.geometry?.coordinates as [number, number][];
    if (!geometry?.length) throw new Error("No geometry");
    return geometry.map(([lng, lat]) => [lat, lng] as LatLng);
  } catch {
    return waypoints;
  }
}

export function polylineLengthM(coords: LatLng[]): number {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lat1, lng1] = coords[i - 1];
    const [lat2, lng2] = coords[i];
    total += haversine(lat1, lng1, lat2, lng2);
  }
  return total;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Closest point on polyline + distance along path from start */
export function snapToRoute(
  route: LatLng[],
  pos: LatLng
): { distanceAlongM: number; offRouteM: number } {
  if (route.length < 2) return { distanceAlongM: 0, offRouteM: Infinity };

  let bestOff = Infinity;
  let bestAlong = 0;
  let accumulated = 0;

  for (let i = 1; i < route.length; i++) {
    const [lat1, lng1] = route[i - 1];
    const [lat2, lng2] = route[i];
    const segLen = haversine(lat1, lng1, lat2, lng2);
    const t = closestTOnSegment(pos[0], pos[1], lat1, lng1, lat2, lng2);
    const projLat = lat1 + t * (lat2 - lat1);
    const projLng = lng1 + t * (lng2 - lng1);
    const off = haversine(pos[0], pos[1], projLat, projLng);
    const along = accumulated + t * segLen;
    if (off < bestOff) {
      bestOff = off;
      bestAlong = along;
    }
    accumulated += segLen;
  }

  return { distanceAlongM: bestAlong, offRouteM: bestOff };
}

function closestTOnSegment(
  pLat: number,
  pLng: number,
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dx = lat2 - lat1;
  const dy = lng2 - lng1;
  if (dx === 0 && dy === 0) return 0;
  const t = ((pLat - lat1) * dx + (pLng - lng1) * dy) / (dx * dx + dy * dy);
  return Math.max(0, Math.min(1, t));
}
