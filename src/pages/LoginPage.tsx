import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) return <Navigate to="/routes" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signIn(email, password);
      navigate("/routes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
    }
  };

  return (
    <div className="min-h-[100dvh] max-w-lg mx-auto px-5 pt-16 safe-top">
      <p className="text-xs font-semibold tracking-widest text-accent uppercase">RunApp</p>
      <h1 className="text-3xl font-bold mt-3">Entrar</h1>
      <p className="text-ink-mute mt-2">Corre em Lisboa com episódios por GPS.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full h-12 rounded-2xl bg-white text-ink font-semibold disabled:opacity-40"
          disabled={!email || !password}
        >
          Entrar
        </button>
      </form>

      <p className="text-center text-sm text-ink-mute mt-6">
        Sem conta?{" "}
        <Link to="/register" className="text-white font-medium">
          Criar conta
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-mute uppercase tracking-wide">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 rounded-xl bg-ink-soft border border-line px-3 text-[15px] outline-none focus:border-accent/60"
      />
    </label>
  );
}
