import { Link } from "react-router-dom";
import { RUN_ROUTES } from "../data/routes";
import { useAuth } from "../context/AuthContext";

export function RoutesPage() {
  const { user } = useAuth();

  return (
    <div className="px-5 pt-8 safe-top pb-4">
      <p className="text-sm text-ink-mute">Olá, {user?.displayName}</p>
      <h1 className="text-2xl font-bold mt-1">Escolhe o percurso</h1>
      <p className="text-ink-mute text-sm mt-2 leading-relaxed">
        Rotas delineadas em Lisboa. Cada paragem tem um episódio com factos no ecrã e narração no
        ouvido.
      </p>

      <ul className="mt-6 space-y-3">
        {RUN_ROUTES.map((route) => (
          <li key={route.id}>
            <Link
              to={`/routes/${route.id}`}
              className="block rounded-2xl border border-line bg-ink-soft p-4 active:scale-[0.99] transition-transform"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="text-xs text-accent font-semibold uppercase">{route.zone}</p>
                  <h2 className="text-lg font-semibold mt-0.5">{route.title}</h2>
                  <p className="text-sm text-ink-mute">{route.subtitle}</p>
                </div>
                <div className="text-right text-sm shrink-0">
                  <p className="font-bold">{route.distanceKm} km</p>
                  <p className="text-ink-mute capitalize">{route.difficulty}</p>
                </div>
              </div>
              <p className="text-sm text-white/80 mt-3 leading-relaxed">{route.description}</p>
              <p className="text-xs text-ink-mute mt-2">
                {route.poiIds.length} episódios · ~{route.durationMin} min
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
