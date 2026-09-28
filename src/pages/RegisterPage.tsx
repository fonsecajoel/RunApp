import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) return <Navigate to="/routes" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      register(email, password, displayName, username.toLowerCase());
      navigate("/routes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    }
  };

  return (
    <div className="min-h-[100dvh] max-w-lg mx-auto px-5 pt-12 safe-top pb-8">
      <h1 className="text-3xl font-bold">Criar conta</h1>
      <p className="text-ink-mute mt-2">Como no Bora: nome, utilizador e email.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Nome" value={displayName} onChange={setDisplayName} />
        <Field label="Utilizador" value={username} onChange={setUsername} hint="a-z, 0-9, _" />
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button type="submit" className="w-full h-12 rounded-2xl bg-accent font-semibold text-white">
          Registar
        </button>
      </form>

      <p className="text-center text-sm text-ink-mute mt-6">
        Já tens conta?{" "}
        <Link to="/login" className="text-white font-medium">
          Entrar
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-mute uppercase tracking-wide">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 rounded-xl bg-ink-soft border border-line px-3 text-[15px] outline-none focus:border-accent/60"
      />
      {hint && <span className="text-[11px] text-ink-mute">{hint}</span>}
    </label>
  );
}
