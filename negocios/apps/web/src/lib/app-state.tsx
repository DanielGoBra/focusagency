import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Business, Period } from "@negocios/core";
import type { Session } from "@negocios/data";
import { repo } from "./repo";

type AppState = {
  session: Session | null | undefined;
  businesses: Business[] | undefined;
  business: Business | undefined;
  selectBusiness: (id: string) => void;
  reloadBusinesses: () => Promise<void>;
  period: Period;
  setPeriod: (period: Period) => void;
  /** Sube con cada escritura para que las pantallas recarguen. */
  version: number;
  changed: () => void;
  toast: (message: string) => void;
  message: string | null;
};

const Context = createContext<AppState | null>(null);
const BUSINESS_KEY = "negocios-negocio-actual";

function stored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>();
  const [businesses, setBusinesses] = useState<Business[]>();
  const [businessId, setBusinessId] = useState<string | null>(() => stored(BUSINESS_KEY));
  const [period, setPeriod] = useState<Period>("today");
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    repo.getSession().then(setSession);
    return repo.onSessionChange(setSession);
  }, []);

  const reloadBusinesses = useCallback(async () => {
    setBusinesses(await repo.listBusinesses());
  }, []);

  useEffect(() => {
    if (session) void reloadBusinesses();
    else setBusinesses(undefined);
  }, [session, reloadBusinesses]);

  const selectBusiness = useCallback((id: string) => {
    setBusinessId(id);
    try {
      localStorage.setItem(BUSINESS_KEY, id);
    } catch {
      // Sin almacenamiento se recuerda solo en esta pestaña.
    }
  }, []);

  const toast = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage((current) => (current === text ? null : current)), 3200);
  }, []);

  const value = useMemo<AppState>(() => {
    const business = businesses?.find((item) => item.id === businessId) ?? businesses?.[0];
    return {
      session,
      businesses,
      business,
      selectBusiness,
      reloadBusinesses,
      period,
      setPeriod,
      version,
      changed: () => setVersion((current) => current + 1),
      toast,
      message,
    };
  }, [session, businesses, businessId, selectBusiness, reloadBusinesses, period, version, toast, message]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp(): AppState {
  const value = useContext(Context);
  if (!value) throw new Error("useApp fuera de AppStateProvider");
  return value;
}

/** Para pantallas dentro del negocio: ya se sabe que hay negocio. */
export function useBusiness(): AppState & { business: Business } {
  const app = useApp();
  if (!app.business) throw new Error("useBusiness sin negocio");
  return app as AppState & { business: Business };
}
