export type UserSettings = {
  speechRate: number;
  highAccuracyGps: boolean;
  haptics: boolean;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  username: string;
  bio: string;
  settings: UserSettings;
};

const KEY = "runapp_session_v1";

const defaultSettings: UserSettings = {
  speechRate: 0.92,
  highAccuracyGps: true,
  haptics: true,
};

export function loadSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveSession(user: UserProfile): void {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(KEY);
}

export function signInLocal(email: string, password: string): UserProfile {
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Email inválido.");
  if (password.length < 6) throw new Error("Password deve ter pelo menos 6 caracteres.");
  const existing = loadSession();
  if (existing && existing.email === email.trim().toLowerCase()) {
    return existing;
  }
  const user: UserProfile = {
    id: crypto.randomUUID(),
    email: email.trim().toLowerCase(),
    displayName: email.split("@")[0],
    username: email.split("@")[0].replace(/[^a-z0-9_]/gi, "_").slice(0, 20),
    bio: "",
    settings: defaultSettings,
  };
  saveSession(user);
  return user;
}

export function registerLocal(
  email: string,
  password: string,
  displayName: string,
  username: string
): UserProfile {
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Email inválido.");
  if (password.length < 6) throw new Error("Password deve ter pelo menos 6 caracteres.");
  if (!displayName.trim()) throw new Error("Indica o teu nome.");
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    throw new Error("Utilizador: 3–20 caracteres, a-z, 0-9 ou _.");
  }
  const user: UserProfile = {
    id: crypto.randomUUID(),
    email: email.trim().toLowerCase(),
    displayName: displayName.trim(),
    username: username.toLowerCase(),
    bio: "",
    settings: defaultSettings,
  };
  saveSession(user);
  return user;
}

export function updateProfile(patch: Partial<Pick<UserProfile, "displayName" | "bio" | "username">>): UserProfile {
  const user = loadSession();
  if (!user) throw new Error("Sem sessão.");
  const next = { ...user, ...patch };
  saveSession(next);
  return next;
}

export function updateSettings(patch: Partial<UserSettings>): UserProfile {
  const user = loadSession();
  if (!user) throw new Error("Sem sessão.");
  const next = { ...user, settings: { ...user.settings, ...patch } };
  saveSession(next);
  return next;
}
