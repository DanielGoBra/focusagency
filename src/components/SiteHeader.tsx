import { Link, NavLink, useLocation } from "react-router-dom";
import { BrandLogo } from "./Logo";

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

  return (
    <header className="sticky top-3 z-40 px-3 sm:top-4 sm:px-5">
      <div className="mx-auto max-w-[1380px] rounded-[32px] border border-white/40 bg-[#e6e9ee]/72 px-4 py-2.5 shadow-[0_12px_32px_rgb(32_34_70_/_0.05)] backdrop-blur-md sm:px-5">
      <nav
        aria-label="Marcas"
        className="grid w-full grid-cols-3 gap-1 rounded-full bg-[#d7e6fb]/80 p-1.5 text-sm leading-tight font-extrabold sm:gap-3 sm:p-2 sm:text-lg lg:text-2xl"
      >
        {BRANDS.map((brand) => (
          <NavLink
            key={brand.to}
            to={brand.to}
            end={brand.end}
            data-cue={brand.cue}
            className={({ isActive }) =>
              `rounded-full border-2 border-[#2bbdef] px-2 py-2 text-center text-navy transition sm:px-6 sm:py-3 ${isActive ? "bg-white" : "hover:bg-white/50"}`
            }
          >
            <BrandWord label={brand.label} />
          </NavLink>
        ))}
      </nav>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link to="/" className="shrink-0" aria-label="Focuschat, inicio">
            <BrandLogo variant={dark ? "white" : "navy"} className="h-12 w-auto sm:h-14 lg:h-16" />
          </Link>
        </div>
        <div className="ml-auto flex min-w-0 items-center gap-3 sm:gap-5">
          <nav aria-label="Secciones" className="flex gap-4 overflow-x-auto text-sm font-bold sm:gap-6 sm:text-base">
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
      </div>
    </header>
  );
}
