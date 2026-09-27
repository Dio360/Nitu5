import React, { createContext, useContext, useEffect, useState } from "react";
import { User, api, clearToken, getToken, setToken } from "./api";

interface Auth {
  user: User | null;
  loading: boolean;
  login: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
}

const AuthCtx = createContext<Auth>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  reload: async () => {},
});

export const useAuth = (): Auth => useContext(AuthCtx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          setUser(await api<User>("/me"));
        }
      } catch {
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (phone: string, code: string): Promise<void> => {
    const res = await api<{ accessToken: string; user: User }>("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    });
    await setToken(res.accessToken);
    setUser(res.user);
  };

  const logout = async (): Promise<void> => {
    await clearToken();
    setUser(null);
  };

  const reload = async (): Promise<void> => {
    setUser(await api<User>("/me"));
  };

  return <AuthCtx.Provider value={{ user, loading, login, logout, reload }}>{children}</AuthCtx.Provider>;
};
