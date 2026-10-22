import { useEffect, useState } from "react";
import { NavLink, Outlet, useOutletContext } from "react-router";
import { BarChart3, HandCoins, LogOut, Monitor, Moon, Package, Plus, Receipt, ShoppingBag, Sun } from "lucide-react";
import { ROLE_LABELS } from "@negocios/core";
import { useBusiness } from "../lib/app-state";
import { repo } from "../lib/repo";
import { NewSaleSheet } from "../features/NewSaleSheet";
import { Button, cx, Select } from "./ui";

const NAV = [
  { to: "/", label: "Inicio", icon: BarChart3 },
  { to: "/ventas", label: "Ventas", icon: ShoppingBag },
  { to: "/gastos", label: "Gastos", icon: Receipt },
  { to: "/inventario", label: "Inventario", icon: Package },
  { to: "/fiados", label: "Fiados", icon: HandCoins },
];

type ShellContext = { openSale: () => void };

export function useShell() {
  return useOutletContext<ShellContext>();
}

type Theme = "system" | "light" | "dark";
const THEME_KEY = "negocios-tema";

function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(THEME_KEY) as Theme | null) ?? "system";
    } catch {
      return "system";
    }
  });

  useEffect(() => {
    if (theme === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Se aplica igual en esta pestaña.
    }
  }, [theme]);

  const next = () => setTheme((current) => (current === "system" ? "light" : current === "light" ? "dark" : "system"));
  return [theme, next];
}

export function AppShell() {
  const { business, businesses, selectBusiness, session, message } = useBusiness();
  const [saleOpen, setSaleOpen] = useState(false);
  const [theme, nextTheme] = useTheme();
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const themeLabel = theme === "dark" ? "Tema oscuro" : theme === "light" ? "Tema claro" : "Tema del sistema";

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-line bg-surface lg:flex lg:h-dvh lg:flex-col lg:sticky lg:top-0">
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-4">
          <img src="/favicon.svg" alt="" className="size-8" />
          <span className="text-lg font-semibold">Negocios</span>
        </div>
        <div className="px-4 pb-4">
          {businesses && businesses.length > 1 ? (
            <Select aria-label="Negocio" value={business.id} onChange={(event) => selectBusiness(event.target.value)}>
              {businesses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          ) : (
            <div className="rounded-xl bg-surface-2 px-3.5 py-2.5">
              <p className="truncate font-semibold">{business.name}</p>
              <p className="text-xs text-ink-3">{ROLE_LABELS[business.role]}</p>
            </div>
          )}
        </div>
        <nav aria-label="Principal" className="flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cx(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors",
                  isActive ? "bg-brand-soft text-brand" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                )
              }
            >
              <Icon size={20} aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 border-t border-line p-3">
          <button type="button" onClick={nextTheme} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-ink-2 hover:bg-surface-2">
            <ThemeIcon size={18} aria-hidden /> {themeLabel}
          </button>
          <button type="button" onClick={() => void repo.signOut()} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-ink-2 hover:bg-surface-2">
            <LogOut size={18} aria-hidden />
            <span className="truncate">Salir {session?.email ? `(${session.email})` : ""}</span>
          </button>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur lg:px-8">
          <div className="min-w-0 lg:hidden">
            <p className="truncate font-semibold">{business.name}</p>
            <p className="text-xs text-ink-3">{ROLE_LABELS[business.role]}</p>
          </div>
          {repo.mode === "demo" ? (
            <p className="hidden text-sm text-ink-3 lg:block">Modo demostración: los datos son de ejemplo y viven en este navegador.</p>
          ) : (
            <span className="hidden lg:block" />
          )}
          <div className="flex items-center gap-2">
            <button type="button" onClick={nextTheme} aria-label={themeLabel} className="grid size-11 place-items-center rounded-xl text-ink-2 hover:bg-surface-2 lg:hidden">
              <ThemeIcon size={20} />
            </button>
            <Button variant="primary" icon={<Plus size={18} />} onClick={() => setSaleOpen(true)} className="hidden sm:inline-flex">
              Nueva venta
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-5 pb-28 lg:px-8 lg:pt-8 lg:pb-12">
          <Outlet context={{ openSale: () => setSaleOpen(true) } satisfies ShellContext} />
        </main>
      </div>

      {/* Celular: acción principal flotante y navegación inferior */}
      <button
        type="button"
        onClick={() => setSaleOpen(true)}
        className="fixed right-4 bottom-[calc(76px+env(safe-area-inset-bottom))] z-20 flex min-h-14 items-center gap-2 rounded-2xl bg-brand px-5 font-semibold text-brand-ink shadow-pop sm:hidden"
      >
        <Plus size={22} aria-hidden /> Vender
      </button>
      <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cx("flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium", isActive ? "text-brand" : "text-ink-3")
            }
          >
            <Icon size={22} aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <NewSaleSheet open={saleOpen} onClose={() => setSaleOpen(false)} />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        {message ? <p className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-bg shadow-pop">{message}</p> : null}
      </div>
    </div>
  );
}
