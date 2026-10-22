import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Business, Period } from "@negocios/core";
import type { Session } from "@negocios/data";
import { repo } from "./repo";

type AppState = {
  session: Session | null | undefined;
  business: Business | null | undefined;
  reloadBusinesses: () => Promise<void>;
  period: Period;
  setPeriod: (period: Period) => void;
  version: number;
  changed: () => void;
};

const Context = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>();
  const [business, setBusiness] = useState<Business | null>();
  const [period, setPeriod] = useState<Period>("today");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    void repo.getSession().then(setSession);
    return repo.onSessionChange(setSession);
  }, []);

  // El selector de negocio llega después; por ahora, el primero.
  const reloadBusinesses = useCallback(async () => {
    const items = await repo.listBusinesses();
    setBusiness(items[0] ?? null);
  }, []);

  useEffect(() => {
    if (session) void reloadBusinesses();
    else setBusiness(session === null ? null : undefined);
  }, [session, reloadBusinesses]);

  const changed = useCallback(() => setVersion((value) => value + 1), []);

  const value = useMemo(
    () => ({ session, business, reloadBusinesses, period, setPeriod, version, changed }),
    [session, business, reloadBusinesses, period, version, changed],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp(): AppState {
  const value = useContext(Context);
  if (!value) throw new Error("useApp fuera de AppStateProvider");
  return value;
}

export function useBusiness(): AppState & { business: Business } {
  const app = useApp();
  if (!app.business) throw new Error("useBusiness sin negocio");
  return app as AppState & { business: Business };
}

/** Carga datos y recarga cuando cambian las dependencias o se pide. */
export function useLoad<T>(load: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    load()
      .then((value) => alive && (setData(value), setError(null)))
      .catch((reason: unknown) => alive && setError(reason instanceof Error ? reason.message : "Algo salió mal."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { data, error, loading, reload: () => setNonce((value) => value + 1) };
}
