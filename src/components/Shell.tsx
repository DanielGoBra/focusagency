import { NavLink, Outlet, Link } from "react-router-dom";
import { BrandLogo } from "./Logo";
import { useHub } from "../store";

const LINKS = [
  { to: "/hub", label: "Pulso", end: true },
  { to: "/hub/bandeja", label: "Bandeja", end: false },
  { to: "/hub/pipeline", label: "Pipeline", end: false },
  { to: "/hub/ads", label: "Meta Ads", end: false },
  { to: "/hub/flujos", label: "Flujos", end: false },
  { to: "/hub/integraciones", label: "Integraciones", end: false },
  { to: "/hub/inteligencia", label: "Inteligencia", end: false },
];

export function Shell() {
  const { data, query, setQuery, focusMode, toggleFocus, mobileNav, setMobileNav, reset } = useHub();
  const waiting = data.leads.filter((lead) => lead.waitingHuman && lead.stage !== "ganado").length;

  return (
    <div className="min-h-screen bg-paper text-navy md:grid md:grid-cols-[240px_1fr]">
      <aside
        className={`${mobileNav ? "flex" : "hidden"} fixed inset-0 z-40 flex-col bg-navy text-white md:static md:flex`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <Link to="/" onClick={() => setMobileNav(false)} aria-label="Ir al sitio de Focus Agency">
            <BrandLogo variant="white" className="h-11 w-auto" />
          </Link>
          <button type="button" className="text-sm font-bold md:hidden" onClick={() => setMobileNav(false)}>
            Cerrar
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMobileNav(false)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold ${
                  isActive ? "bg-white text-navy" : "text-white/85 hover:bg-white/10"
                }`
              }
            >
              <span>{link.label}</span>
              {link.to === "/hub/bandeja" && waiting > 0 && (
                <span className="rounded-full bg-lime px-2 py-0.5 text-xs text-navy">{waiting}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-3 px-5 py-6">
          <p className="text-xs font-medium leading-relaxed text-white/70">Demo local. Nada sale de este navegador.</p>
          <button type="button" onClick={reset} className="text-sm font-bold text-lime">
            Restablecer demo
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-navy/10 bg-paper/95 px-4 py-3 backdrop-blur md:px-8">
          <button
            type="button"
            className="rounded-full border border-navy/15 px-3 py-2 text-sm font-bold md:hidden"
            onClick={() => setMobileNav(true)}
          >
            Menú
          </button>
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Buscar</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar lead, empresa o canal"
              className="w-full rounded-full border border-navy/10 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-navy/45"
            />
          </label>
          <button
            type="button"
            onClick={toggleFocus}
            aria-pressed={focusMode}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold ${
              focusMode ? "bg-lime text-navy" : "bg-navy text-white"
            }`}
          >
            Modo foco
          </button>
        </header>
        <main className="rise px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
