import { useCallback, useEffect, useRef, useState } from "react";

export type GeoPosition = {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
};

type State = {
  position: GeoPosition | null;
  error: string | null;
  watching: boolean;
};

export function useGeolocation(enabled: boolean) {
  const [state, setState] = useState<State>({
    position: null,
    error: null,
    watching: false,
  });
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (watchId.current != null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      setState((s) => ({ ...s, watching: false }));
      return;
    }

    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "GPS não disponível neste dispositivo." }));
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
          },
          error: null,
          watching: true,
        });
      },
      (err) => {
        setState((s) => ({
          ...s,
          error:
            err.code === 1
              ? "Permite o acesso à localização para a corrida."
              : "Não foi possível obter o GPS.",
          watching: false,
        }));
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );

    return () => {
      if (watchId.current != null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [enabled]);

  const setSimulated = useCallback((lat: number, lng: number) => {
    setState({
      position: {
        lat,
        lng,
        accuracy: 8,
        heading: null,
        speed: 3,
      },
      error: null,
      watching: true,
    });
  }, []);

  return { ...state, setSimulated };
}
