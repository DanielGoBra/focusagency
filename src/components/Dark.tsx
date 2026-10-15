import { useEffect, useId, useState, type ComponentType, type ReactNode } from "react";
import { ArrowRight, ChevronDown, Cpu, Database, Infinity as InfinityIcon, ScanLine } from "lucide-react";
import { Reveal, SocialGlyph } from "./Site";

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

export function FocusWordmark({ suffix, className = "" }: { suffix: string; className?: string }) {
  const id = useId();
  return (
    <span className={`inline-flex flex-col leading-none text-white ${className}`} aria-label={`Focus ${suffix.toLowerCase()}`}>
      <span className="flex items-center text-[1.95rem] font-bold tracking-[0.03em]" aria-hidden="true">
        F
        <svg viewBox="0 0 40 40" className="mx-[0.04em] h-[0.74em] w-[0.74em]">
          <defs>
            <linearGradient id={`${id}-ring`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#4ef2e4" />
              <stop offset="0.55" stopColor="#5fe4fa" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="15.5" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="7" />
        </svg>
        CUS
      </span>
      <span className="mt-1 pl-[0.35em] text-[0.62rem] font-medium tracking-[0.62em]" aria-hidden="true">
        {suffix}
      </span>
    </span>
  );
}

export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const seen = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        let best = "";
        let ratio = 0;
        for (const id of ids) {
          const value = seen.get(id) ?? 0;
          if (value > ratio) {
            best = id;
            ratio = value;
          }
        }
        if (best) setActive(best);
      },
      { threshold: [0, 0.15, 0.35, 0.6], rootMargin: "-80px 0px -35% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

export function DarkHeader({
  suffix,
  links,
  cta,
  onCta,
}: {
  suffix: string;
  links: readonly { id: string; label: string }[];
  cta: string;
  onCta: () => void;
}) {
  const [ids] = useState(() => links.map((link) => link.id));
  const active = useActiveSection(ids);
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-abyss/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <a href="#inicio" className="shrink-0">
          <FocusWordmark suffix={suffix} />
        </a>
        <nav className="hidden items-center gap-8 text-[15px] text-white/85 lg:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`relative py-2 transition hover:text-white ${active === link.id ? "text-white" : ""}`}
            >
              {link.label}
              <span
                className={`absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full bg-aqua transition-opacity ${active === link.id ? "opacity-100" : "opacity-0"}`}
              />
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={onCta}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-aqua px-4 py-2.5 text-sm font-medium text-abyss shadow-[0_0_30px_rgb(78_242_228/0.35)] transition hover:-translate-y-0.5 sm:px-6 sm:py-3 sm:text-[15px]"
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function ReelGlyph({ className, cut }: { className?: string; cut: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <mask id={`${id}-m`}>
          <rect width="48" height="48" fill="white" />
          <path d="M14.5 4 19.5 13.6h4.2L18.7 4zM24.7 4l5 9.6h4.2L28.9 4zM34.9 4l5 9.6h3.3l-4.6-9.6z" fill="black" />
          <path d="M20.5 23.6v12.2c0 1.1 1.2 1.8 2.1 1.2l9.5-6.1c.9-.6.9-1.8 0-2.4l-9.5-6.1c-.9-.6-2.1.1-2.1 1.2z" fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${id}-m)`} fill={cut}>
        <path d="M14 3.5h20a9.5 9.5 0 0 1 9.5 9.5v.6h-39V13A9.5 9.5 0 0 1 14 3.5z" />
        <path d="M4.5 16.6h39v18.2a9.7 9.7 0 0 1-9.7 9.7H14.2a9.7 9.7 0 0 1-9.7-9.7z" />
      </g>
    </svg>
  );
}

export function VideoSlot({
  src,
  title,
  className = "aspect-video",
  tone = "iris",
}: {
  src?: string;
  title: string;
  className?: string;
  tone?: "iris" | "navy";
}) {
  if (src) {
    return (
      <div className={`overflow-hidden rounded-[28px] bg-abyss ${className}`}>
        <iframe
          className="h-full w-full"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`${title} (video pendiente)`}
      className={`grid place-items-center overflow-hidden rounded-[28px] ${tone === "iris" ? "bg-iris" : "bg-[#0d1850]"} ${className}`}
    >
      <ReelGlyph className="h-[38%] max-h-48 w-auto text-white" cut="#ffffff" />
    </div>
  );
}

const PILLS: { label: string; icon: Icon | "wa" }[] = [
  { label: "Meta Ads", icon: InfinityIcon },
  { label: "Creativos", icon: ScanLine },
  { label: "WhatsApp", icon: "wa" },
  { label: "CRM", icon: Database },
  { label: "Automatización + IA", icon: Cpu },
];

export function ToolPills({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-y-3 text-sm text-white/85 xl:text-[15px] ${className}`}>
      {PILLS.map((pill, index) => {
        const Glyph = pill.icon;
        return (
          <li key={pill.label} className={`flex items-center gap-2 pr-4 sm:px-3 sm:first:pl-0 xl:px-4 ${index > 0 ? "sm:border-l sm:border-white/20" : ""}`}>
            {Glyph === "wa" ? <SocialGlyph name="WhatsApp" className="h-5 w-5" /> : <Glyph className="h-5 w-5" strokeWidth={1.6} />}
            {pill.label}
          </li>
        );
      })}
    </ul>
  );
}

export function HeroWave({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[42%] w-full ${className}`}
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-w`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0d6f6a" stopOpacity="0" />
          <stop offset="0.45" stopColor="#0f7c78" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1b5fd6" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <path d="M0 320C420 320 780 285 1060 180 1240 112 1350 46 1440 0V320Z" fill={`url(#${id}-w)`} />
      <path d="M0 320C420 320 780 285 1060 180 1240 112 1350 46 1440 0" fill="none" stroke="#4ef2e4" strokeOpacity="0.45" strokeWidth="1.5" />
    </svg>
  );
}

export type Testimonial = { name: string; business: string; quote: string; video?: string };

function TestimonialCaption({ item }: { item: Testimonial }) {
  return (
    <div className="mt-5 text-center">
      <p className="mx-auto max-w-xs text-[15px] leading-relaxed text-white/75">“{item.quote}”</p>
      <p className="mt-3 text-sm font-bold text-white">{item.name}</p>
      <p className="text-xs tracking-[0.14em] text-aqua uppercase">{item.business}</p>
    </div>
  );
}

export function Testimonials({ items, id = "testimonios" }: { items: readonly [Testimonial, Testimonial, Testimonial]; id?: string }) {
  const [first, second, third] = items;
  return (
    <section id={id} className="relative mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-x-8 gap-y-10 md:grid-cols-[0.95fr_1fr_1fr] md:grid-rows-[auto_1fr]">
        <Reveal className="md:col-span-2 md:col-start-2 md:self-end">
          <h2 className="text-center text-5xl font-light tracking-[0.04em] uppercase md:text-left md:text-7xl lg:text-8xl">Testimonios</h2>
        </Reveal>
        <Reveal className="md:col-start-1 md:row-span-2 md:row-start-1" from="left">
          <VideoSlot src={first.video} title={`Testimonio de ${first.name}`} tone="navy" className="aspect-[5/6]" />
          <TestimonialCaption item={first} />
        </Reveal>
        <Reveal className="md:col-start-2 md:row-start-2" delay={120}>
          <VideoSlot src={second.video} title={`Testimonio de ${second.name}`} tone="navy" className="aspect-[7/5]" />
          <TestimonialCaption item={second} />
        </Reveal>
        <Reveal className="md:col-start-3 md:row-start-2" delay={220}>
          <VideoSlot src={third.video} title={`Testimonio de ${third.name}`} tone="navy" className="aspect-[7/5]" />
          <TestimonialCaption item={third} />
        </Reveal>
      </div>
    </section>
  );
}

export function DarkFaq({
  id,
  subtitle,
  items,
}: {
  id: string;
  subtitle: string;
  items: readonly (readonly [string, string])[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id={id} className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 left-1/3 h-80 w-[36rem] rounded-full bg-mint/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-80 w-[30rem] rounded-full bg-sky/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-24">
        <Reveal>
          <h2 className="text-5xl leading-[0.95] font-bold tracking-tight md:text-7xl">
            Preguntas
            <br />
            frecuentes
          </h2>
          <p className="mt-4 text-white/70">{subtitle}</p>
        </Reveal>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {items.map(([question, answer], index) => {
            const shown = open === index;
            return (
              <div key={question}>
                <button
                  type="button"
                  aria-expanded={shown}
                  onClick={() => setOpen(shown ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="text-lg font-bold md:text-xl">{question}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-aqua transition-transform ${shown ? "rotate-180" : ""}`} strokeWidth={2.4} />
                </button>
                {shown && <p className="animate-in fade-in slide-in-from-top-1 max-w-4xl pb-6 leading-relaxed text-white/75 duration-300">{answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function GoogleG({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function GmailMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M3.6 19.5h3.2v-7.8L2 8.1v9.9c0 .8.7 1.5 1.6 1.5z" />
      <path fill="#34A853" d="M17.2 19.5h3.2c.9 0 1.6-.7 1.6-1.5V8.1l-4.8 3.6z" />
      <path fill="#FBBC04" d="M17.2 5.4v6.3L22 8.1V6.2c0-1.8-2-2.8-3.4-1.7z" />
      <path fill="#EA4335" d="M6.8 11.7V5.4L12 9.3l5.2-3.9v6.3L12 15.6z" />
      <path fill="#C5221F" d="M2 6.2v1.9l4.8 3.6V5.4L5.4 4.5C4 3.4 2 4.4 2 6.2z" />
    </svg>
  );
}

export function InstagramMark({ className = "h-6 w-6" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-ig`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#feda75" />
          <stop offset="0.35" stopColor="#fa7e1e" />
          <stop offset="0.6" stopColor="#d62976" />
          <stop offset="0.85" stopColor="#962fbf" />
          <stop offset="1" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill={`url(#${id}-ig)`} />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="white" strokeWidth="1.9" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="white" />
    </svg>
  );
}

export function MetaMark({ className = "h-6 w-6" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-m`} x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0" stopColor="#0064e1" />
          <stop offset="1" stopColor="#0082fb" />
        </linearGradient>
      </defs>
      <path
        d="M6.3 6.5c-2.5 0-4.3 3.3-4.3 6.3 0 2.2 1 3.7 2.8 3.7 1.6 0 2.7-1.1 4.6-4.3l1-1.7c.9-1.5 1.6-2.6 2.4-3.1.6-.4 1.3-.5 1.9-.2 1.7.8 2.9 3.5 2.9 6 0 1.4-.6 2.1-1.4 2.1-.9 0-1.6-.9-3.4-3.9l-.8-1.3-.9 1.6.6 1c2 3.4 3 4.4 4.6 4.4 2 0 3.5-1.5 3.5-4.2 0-4-2.3-8.1-5.3-8.1-1.5 0-2.7.9-4.2 3.3l-.7 1.1-.6-1C9.8 7.6 8.4 6.5 6.3 6.5zm.1 2.1c1.1 0 1.9.7 3.1 2.6l.6 1-1 1.7c-1.4 2.3-2.2 3.2-3.2 3.2-.9 0-1.4-.8-1.4-2.2 0-2.7 1.3-6.3 1.9-6.3z"
        fill={`url(#${id}-m)`}
      />
    </svg>
  );
}

export function TikTokMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#010101" />
      <path
        transform="translate(4.2 4) scale(0.66)"
        fill="#25F4EE"
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.77.22 2.89 2.89 0 0 1 3.68-2.78V9.59a6.34 6.34 0 1 0 5.54 6.29V8.7a8.16 8.16 0 0 0 4.77 1.52V6.83a4.85 4.85 0 0 1-1-.14z"
      />
      <path
        transform="translate(4.8 4.4) scale(0.66)"
        fill="#FE2C55"
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.77.22 2.89 2.89 0 0 1 3.68-2.78V9.59a6.34 6.34 0 1 0 5.54 6.29V8.7a8.16 8.16 0 0 0 4.77 1.52V6.83a4.85 4.85 0 0 1-1-.14z"
      />
      <path
        transform="translate(4.5 4.2) scale(0.66)"
        fill="#ffffff"
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.77.22 2.89 2.89 0 0 1 3.68-2.78V9.59a6.34 6.34 0 1 0 5.54 6.29V8.7a8.16 8.16 0 0 0 4.77 1.52V6.83a4.85 4.85 0 0 1-1-.14z"
      />
    </svg>
  );
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-xs font-medium tracking-[0.32em] text-aqua uppercase md:text-sm ${className}`}>{children}</p>;
}
