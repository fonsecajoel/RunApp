import { NavLink, Outlet } from "react-router-dom";
import { Map, User } from "lucide-react";

export function AppLayout() {
  return (
    <div className="min-h-[100dvh] flex flex-col max-w-lg mx-auto w-full bg-ink">
      <main className="flex-1 min-h-0 pb-16">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-line bg-ink-soft/95 backdrop-blur-md safe-bottom">
        <div className="max-w-lg mx-auto flex">
          <Tab to="/routes" icon={<Map className="w-5 h-5" />} label="Percursos" />
          <Tab to="/profile" icon={<User className="w-5 h-5" />} label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

function Tab({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
          isActive ? "text-accent" : "text-ink-mute"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
