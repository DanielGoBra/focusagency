import type { CSSProperties } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BrandLogo } from "./Logo";
import { MetaPartner } from "./MetaPartner";

const BRANDS = [
  { to: "/", label: "Focuschat", end: true, cue: "chat" },
  { to: "/agency", label: "Focus Agency", end: false, cue: "agency" },
  { to: "/academy", label: "Focus Academy", end: false, cue: "academy" },
] as const;

const BRAND_PARTS: Record<string, [string, string, string]> = {
  Focuschat: ["Foc", "us", "chat"],
  "Focus Agency": ["Focus", " ", "Agency"],
  "Focus Academy": ["Focus", " ", "Academy"],
};

const SECTIONS = [
  { hash: "sistema", label: "Sistema", cue: "sistema" },
  { hash: "servicios", label: "Servicios", cue: "servicios" },
  { hash: "preguntas", label: "Preguntas", cue: "preguntas" },
  { hash: "contacto", label: "Contacto", cue: "contacto" },
] as const;

function BrandWord({ label }: { label: string }) {
  const [start, mid, end] = BRAND_PARTS[label] ?? [label, "", ""];
  return (
    <span>
      <span className="brand-shade-start">{start}</span>
      <span className="brand-shade-mid">{mid}</span>
      <span className="brand-shade-end">{end}</span>
    </span>
  );
}

export function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-3 z-40 px-3 sm:top-4 sm:px-5">
      <div className="mx-auto max-w-[1380px] rounded-[32px] border border-white/40 bg-[#e6e9ee]/72 px-4 py-2.5 shadow-[0_12px_32px_rgb(32_34_70_/_0.05)] backdrop-blur-md sm:px-5">
      <nav
        aria-label="Marcas"
        className="grid w-full grid-cols-3 gap-1 rounded-full bg-[#d7e6fb]/80 p-1.5 text-sm leading-tight font-extrabold sm:gap-3 sm:p-2 sm:text-lg lg:text-2xl"
      >
        {BRANDS.map((brand, index) => (
          <NavLink
            key={brand.to}
            to={brand.to}
            end={brand.end}
            data-cue={brand.cue}
            style={{ "--brand-delay": `${index * 0.55}s` } as CSSProperties}
            className={({ isActive }) =>
              `brand-link rounded-full px-2 py-2 text-center text-navy transition sm:px-6 sm:py-3 ${isActive ? "brand-link-on bg-white shadow-sm" : "hover:bg-white/50"}`
            }
          >
            <BrandWord label={brand.label} />
          </NavLink>
        ))}
      </nav>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Link to="/" className="shrink-0" aria-label="Focuschat, inicio">
            <BrandLogo className="h-12 w-auto sm:h-14 lg:h-16" />
          </Link>
          <MetaPartner />
        </div>
        <div className="ml-auto flex min-w-0 items-center gap-4 sm:gap-6">
          <nav aria-label="Secciones" className="flex gap-4 overflow-x-auto text-sm font-bold sm:gap-6 sm:text-base">
            {SECTIONS.map((item) => (
              <a
                key={item.hash}
                href={pathname === "/" ? `#${item.hash}` : `/#${item.hash}`}
                data-cue={item.cue}
                className="shrink-0 py-1 hover:text-focus"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      </div>
    </header>
  );
}
