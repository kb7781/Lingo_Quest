"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { UserStats } from "@/types";

interface UserContextValue {
  user: UserStats | null;
  setUser: (user: UserStats) => void;
  updateHearts: (hearts: number) => void;
  addXP: (xp: number) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
  updateHearts: () => {},
  addXP: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserStats | null>(null);

  const updateHearts = useCallback((hearts: number) => {
    setUser((prev) => (prev ? { ...prev, hearts } : prev));
  }, []);

  const addXP = useCallback((xp: number) => {
    setUser((prev) =>
      prev ? { ...prev, xp: prev.xp + xp, daily_xp: prev.daily_xp + xp } : prev
    );
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, updateHearts, addXP }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
