import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  loadSession,
  registerLocal,
  signInLocal,
  updateProfile,
  updateSettings,
  type UserProfile,
  type UserSettings,
} from "../lib/auth";

type AuthContextValue = {
  user: UserProfile | null;
  ready: boolean;
  signIn: (email: string, password: string) => void;
  register: (email: string, password: string, displayName: string, username: string) => void;
  signOut: () => void;
  patchProfile: (displayName: string, bio: string, username: string) => void;
  patchSettings: (settings: Partial<UserSettings>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(loadSession());
    setReady(true);
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    setUser(signInLocal(email, password));
  }, []);

  const register = useCallback(
    (email: string, password: string, displayName: string, username: string) => {
      setUser(registerLocal(email, password, displayName, username));
    },
    []
  );

  const signOut = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const patchProfile = useCallback((displayName: string, bio: string, username: string) => {
    setUser(updateProfile({ displayName, bio, username }));
  }, []);

  const patchSettings = useCallback((settings: Partial<UserSettings>) => {
    setUser(updateSettings(settings));
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      signIn,
      register,
      signOut,
      patchProfile,
      patchSettings,
    }),
    [user, ready, signIn, register, signOut, patchProfile, patchSettings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fora de AuthProvider");
  return ctx;
}
