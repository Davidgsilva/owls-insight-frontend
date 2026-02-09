"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  discordUsername: string | null;
  discordAvatar: string | null;
  createdAt: string;
}

interface Subscription {
  tier: "free" | "bench" | "rookie" | "mvp";
  status: "active" | "past_due" | "canceled" | "trialing" | "paused" | "inactive";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  trialEligible: boolean;
}

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "owls_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const validateSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setSubscription(data.subscription);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              USER_STORAGE_KEY,
              JSON.stringify({ user: data.user, subscription: data.subscription })
            );
          }
        }
      } else {
        // Session invalid, clear state
        setUser(null);
        setSubscription(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Session validation error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hydrate user from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setUser(data.user);
        setSubscription(data.subscription);
      } catch {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    // Validate session with server
    validateSession();
  }, [validateSession]);

  const refreshUser = useCallback(async () => {
    await validateSession();
  }, [validateSession]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    setUser(data.user);
    // Fetch full subscription info
    await validateSession();
  }, [validateSession]);

  const register = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.details?.[0]?.message || "Registration failed");
    }

    setUser(data.user);
    // Fetch full subscription info
    await validateSession();
  }, [validateSession]);

  const logout = useCallback(async () => {
    // Navigate away from /dashboard BEFORE clearing auth state,
    // otherwise the dashboard layout's !isAuthenticated guard
    // fires router.replace("/login") and wins the race.
    router.push("/");
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Best effort - continue with client-side cleanup
    }
    setUser(null);
    setSubscription(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [router]);

  const value = useMemo(() => ({
    user,
    subscription,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  }), [user, subscription, isLoading, login, register, logout, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
