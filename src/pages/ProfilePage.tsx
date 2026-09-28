import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProfilePage() {
  const { user, patchProfile, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName);
    setUsername(user.username);
    setBio(user.bio);
  }, [user]);

  if (!user) return null;

  const save = () => {
    try {
      patchProfile(displayName, bio, username);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro");
    }
  };

  return (
    <div className="px-5 pt-8 safe-top pb-24">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <p className="text-ink-mute text-sm mt-1">{user.email}</p>

      <div className="mt-6 space-y-4">
        <Field label="Nome" value={displayName} onChange={setDisplayName} />
        <Field label="Utilizador" value={username} onChange={setUsername} />
        <label className="block">
          <span className="text-xs font-medium text-ink-mute uppercase">Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Corredor em Lisboa, curioso por história…"
            className="mt-1.5 w-full rounded-xl bg-ink-soft border border-line px-3 py-2 text-[15px] outline-none focus:border-accent/60 resize-none"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={save}
        className="mt-6 w-full h-11 rounded-xl bg-white text-ink font-semibold text-sm"
      >
        {saved ? "Guardado" : "Guardar perfil"}
      </button>

      <Link
        to="/settings"
        className="mt-4 block text-center text-sm text-ink-mute underline underline-offset-4"
      >
        Definições
      </Link>

      <button
        type="button"
        onClick={() => signOut()}
        className="mt-8 w-full h-11 rounded-xl border border-red-500/40 text-red-400 text-sm font-medium"
      >
        Terminar sessão
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-mute uppercase">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 rounded-xl bg-ink-soft border border-line px-3 text-[15px] outline-none focus:border-accent/60"
      />
    </label>
  );
}
