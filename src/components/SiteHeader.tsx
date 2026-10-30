import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { preloadBrand } from "../brandPreload";
import { BrandLogo } from "./Logo";
import { MetaInfinity } from "./MetaPartner";
import { jumpTo } from "./ScrollToTop";

const BRANDS = [
  { to: "/", label: "Focuschat", end: true, cue: "chat" },
  { to: "/agency", label: "Focus Agency", end: false, cue: "agency" },
  { to: "/academy", label: "Focus Academy", end: false, cue: "academy" },
] as const;

type Section = { hash: string; label: string; cue?: string };

const SECTIONS: readonly Section[] = [
  { hash: "sistema", label: "Sistema", cue: "sistema" },
  { hash: "servicios", label: "Servicios", cue: "servicios" },
  { hash: "preguntas", label: "Preguntas", cue: "preguntas" },
  { hash: "contacto", label: "Contacto", cue: "contacto" },
];

function BrandWord({ label }: { label: string }) {
  return <span>{label}</span>;
}

function ThemeSwitch({ dark, onToggle }: { dark: boolean; onToggle: (dark: boolean) => void }) {
  return (
    <button
      type="button"
      className="theme-switch"
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={dark}
      onClick={() => onToggle(!dark)}
    >
      <svg className="theme-sun" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.4v2.3M12 19.3v2.3M2.4 12h2.3M19.3 12h2.3M5.05 5.05l1.63 1.63M17.32 17.32l1.63 1.63M18.95 5.05l-1.63 1.63M6.68 17.32l-1.63 1.63"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <svg className="theme-moon" viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M15.2 3.1a8.4 8.4 0 1 0 5.7 13.1A7.15 7.15 0 0 1 15.2 3.1z" />
      </svg>
    </button>
  );
}

export function SiteHeader({
  theme = "light",
  onThemeChange,
  sections = SECTIONS,
}: {
  theme?: "light" | "dark";
  onThemeChange?: (dark: boolean) => void;
  /** Secciones de la página actual; por defecto, las de la portada de Focuschat. */
  sections?: readonly Section[];
}) {
  const { pathname } = useLocation();
  const local = sections !== SECTIONS || pathname === "/";
  const dark = theme === "dark";
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 70, damping: 28, restDelta: 0.001 });
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let frame = 0;
    let holdUntil = 0;
    const apply = () => {
      frame = 0;
      if (performance.now() < holdUntil) return;
      const y = window.scrollY;
      setCompact((current) => {
        const next = !current && y > 120 ? true : current && y < 4 ? false : current;
        if (next !== current) holdUntil = performance.now() + 420;
        return next;
      });
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={`sticky z-40 overflow-anchor-none px-3 transition-[top] duration-300 sm:px-5 ${compact ? "top-2" : "top-3 sm:top-4"}`}>
      <div className={`relative mx-auto max-w-[1380px] rounded-[32px] border border-white/40 bg-[#e6e9ee]/72 shadow-[0_12px_32px_rgb(32_34_70_/_0.05)] backdrop-blur-md transition-all duration-300 ${compact ? "px-3 py-1.5" : "px-4 py-2.5 sm:px-5"}`}>
      <nav
        aria-label="Marcas"
        className={`grid w-full grid-cols-3 gap-1 rounded-full bg-[#d7e6fb]/80 font-extrabold transition-all duration-300 ${compact ? "p-1 text-[11px] leading-none sm:text-sm" : "p-1.5 text-sm leading-tight sm:gap-3 sm:p-2 sm:text-lg lg:text-2xl"}`}
      >
        {BRANDS.map((brand) => (
          <NavLink
            key={brand.to}
            to={brand.to}
            end={brand.end}
            data-cue={brand.cue}
            onMouseEnter={() => preloadBrand(brand.to)}
            onFocus={() => preloadBrand(brand.to)}
            onClick={() => {
              preloadBrand(brand.to);
              if (pathname === brand.to) jumpTo(0);
            }}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full border-2 border-[#2bbdef] text-center text-navy transition ${compact ? "px-1.5 py-1.5 sm:px-3" : "px-2 py-2 sm:px-6 sm:py-3"} ${isActive ? "bg-white" : "hover:bg-white/50"}`
            }
          >
            <BrandWord label={brand.label} />
          </NavLink>
        ))}
      </nav>
      <div className={`header-bar flex flex-wrap items-center gap-x-3 gap-y-2 ${compact ? "mt-1" : "mt-2"}`}>
        <Link to="/" className="shrink-0" aria-label="Focuschat, inicio" onClick={() => pathname === "/" && jumpTo(0)}>
          <BrandLogo variant={dark ? "white" : "navy"} className={compact ? "h-8 w-auto sm:h-9" : "h-12 w-auto sm:h-14 lg:h-16"} />
        </Link>
        <a href={pathname === "/" ? "#servicios" : "/#servicios"} className="header-partner gold-seal">
          <span className="gold-seal-inner header-partner-face">
            <span className="header-partner-kicker">Somos</span>
            <MetaInfinity className="h-3.5 w-6 shrink-0 text-[#0081FB]" />
            <span className="header-partner-copy">
              Meta
              <small>Business Partner</small>
            </span>
          </span>
        </a>
        <div className="header-tools ml-auto flex min-w-0 items-center gap-3 sm:gap-5">
          <nav aria-label="Secciones" className="flex min-w-0 flex-1 flex-wrap gap-x-4 gap-y-1 text-sm font-bold sm:flex-nowrap sm:gap-6 sm:overflow-x-auto sm:text-base">
            {sections.map((item) => (
              <a
                key={item.hash}
                href={local ? `#${item.hash}` : `/#${item.hash}`}
                data-cue={item.cue}
                className="shrink-0 py-1 hover:text-focus"
              >
                {item.label}
              </a>
            ))}
          </nav>
          {onThemeChange ? <ThemeSwitch dark={dark} onToggle={onThemeChange} /> : null}
        </div>
        </div>
        {reduce ? null : (
          <motion.div aria-hidden className="pointer-events-none absolute inset-x-8 bottom-1.5 h-px origin-left bg-[#3ef3ff]" style={{ scaleX }} />
        )}
      </div>
    </header>
  );
}
