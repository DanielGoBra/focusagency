import { useEffect, useId, useRef, useState, type ComponentType, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { ChevronDown, Clapperboard, Cpu, Database, Infinity as InfinityIcon, ScanLine } from "lucide-react";
import { BrandDarkContext } from "./brandTheme";
import { FocuMotion } from "./FocuMotion";
import { motion, useReducedMotion } from "motion/react";
import { NeuralField } from "./NeuralField";
import { SiteHeader } from "./SiteHeader";
import { Reveal, SocialGlyph } from "./Site";

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

/** Marco común de Agency y Academy: header de marcas, red neuronal lateral y tema claro/oscuro como en Focuschat. */
export function BrandPage({
  title,
  sections,
  children,
}: {
  title: string;
  sections: readonly { hash: string; label: string }[];
  children: ReactNode;
}) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "Focuschat";
    };
  }, [title]);

  return (
    <BrandDarkContext.Provider value={dark}>
      <div data-theme={dark ? "dark" : "light"} className="brand-page min-h-screen">
        <NeuralField />
        <SiteHeader theme={dark ? "dark" : "light"} onThemeChange={setDark} sections={sections} />
        {children}
      </div>
    </BrandDarkContext.Provider>
  );
}

const POSES = {
  frente: "/brand/mascot/frente.png?v=8",
  senala: "/brand/mascot/senala.png?v=8",
  chat: "/brand/mascot/chat.png?v=8",
  cafe: "/brand/mascot/cafe.png?v=8",
  serio: "/brand/mascot/serio.png?v=8",
  "perfil-azul": "/brand/mascot/perfil-azul.png?v=8",
  "perfil-cerebro": "/brand/mascot/perfil-cerebro.png?v=8",
} as const;

export type Pose = keyof typeof POSES;

/** FOCU con su burbuja; cada sección usa una pose distinta (DESIGN.md). */
export function PageMascot({
  pose,
  kicker,
  text,
  className = "w-[200px] sm:w-[230px]",
  bubbleSide = "left",
}: {
  pose: Pose;
  kicker?: string;
  text?: string;
  className?: string;
  bubbleSide?: "left" | "right";
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`pointer-events-none relative mx-auto ${className}`}>
      {text ? (
        <motion.div
          className="focu-bubble relative z-10 mb-3 rounded-[22px] border-2 border-[#2BBDEF] bg-white px-3 py-2.5 text-[#202246] shadow-[0_0_16px_rgb(94_211_252_/_0.9),0_0_34px_rgb(43_189_239_/_0.6)]"
          initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
        >
          {kicker && <span className="block text-[10px] font-bold tracking-[0.16em] uppercase">{kicker}</span>}
          <span className="mt-0.5 block text-sm leading-snug font-extrabold">{text}</span>
          <span className={`absolute -bottom-2 h-4 w-4 rotate-45 border-2 border-[#2BBDEF] bg-[#2BBDEF] ${bubbleSide === "left" ? "left-9" : "right-9"}`} />
          <span className={`absolute -bottom-[5px] h-3.5 w-3.5 rotate-45 bg-white ${bubbleSide === "left" ? "left-[38px]" : "right-[38px]"}`} />
        </motion.div>
      ) : null}
      <FocuMotion>
        <img src={POSES[pose]} alt="" draggable={false} className="w-full object-contain object-bottom select-none" />
        <div className="mx-auto mt-1 h-3 w-1/2 rounded-full bg-navy/20 blur-sm" />
      </FocuMotion>
    </div>
  );
}

export function VideoSlot({
  src,
  title,
  note,
  className = "aspect-video",
  compact = false,
}: {
  src?: string;
  title: string;
  note: string;
  className?: string;
  compact?: boolean;
}) {
  const frame = `hero-video relative max-w-full min-w-0 ${compact ? "border-4! rounded-[1.1rem]!" : "w-full"} ${className}`;
  if (src) {
    return (
      <div className={frame}>
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
    <div className={`${frame} shimmer text-white`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(43_189_239/0.28),transparent_62%)]" />
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-[0.08] invert" />
      <div className={`relative flex h-full flex-col items-center justify-center text-center ${compact ? "gap-2 p-4" : "gap-3 p-5 sm:gap-4 sm:p-6"}`}>
        <span
          className={`ping-soft relative grid place-items-center rounded-full bg-gradient-to-br from-[#2ad8ff] to-lime text-navy shadow-[0_0_40px_rgb(43_189_239/0.45)] ${
            compact ? "h-12 w-12" : "h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20"
          }`}
        >
          <Clapperboard className={compact ? "h-5 w-5" : "h-7 w-7 md:h-9 md:w-9"} strokeWidth={1.8} />
        </span>
        <p className={`font-extrabold tracking-tight ${compact ? "text-base" : "text-lg sm:text-xl md:text-3xl"}`}>{title}</p>
        <p className={`max-w-md text-white/70 ${compact ? "text-xs" : "text-xs sm:text-sm md:text-base"}`}>{note}</p>
        <span className="inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 text-[11px] font-extrabold tracking-[0.18em] text-navy uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy" />
          Próximamente
        </span>
      </div>
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
    <ul className={`flex flex-wrap items-center gap-y-3 text-sm text-fg/85 xl:text-[15px] ${className}`}>
      {PILLS.map((pill, index) => {
        const Glyph = pill.icon;
        return (
          <li key={pill.label} className={`flex items-center gap-2 pr-4 sm:px-3 sm:first:pl-0 xl:px-4 ${index > 0 ? "sm:border-l sm:border-fg/20" : ""}`}>
            {Glyph === "wa" ? <SocialGlyph name="WhatsApp" className="h-5 w-5" /> : <Glyph className="h-5 w-5" strokeWidth={1.6} />}
            {pill.label}
          </li>
        );
      })}
    </ul>
  );
}

export function HeroWave({ className = "", seam = false }: { className?: string; seam?: boolean }) {
  const id = useId();
  const curve = "M0 320C420 320 780 285 1060 180 1240 112 1350 46 1440 0";
  return (
    <svg
      className={
        seam
          ? `pointer-events-none relative z-10 block h-36 w-full sm:h-44 ${className}`
          : `pointer-events-none absolute inset-x-0 bottom-0 h-[42%] w-full ${className}`
      }
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#2bbdef" stopOpacity="0" />
          <stop offset="0.38" stopColor="#2bbdef" stopOpacity="0.2" />
          <stop offset="0.68" stopColor="#3ef3ff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#1efa5d" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d7fbff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#f4fdff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#d9ffe8" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path d={`${curve}V320Z`} fill={`url(#${id}-glass)`} />
      <path className="hero-wave-stroke" d={curve} fill="none" stroke={`url(#${id}-line)`} strokeWidth="1.6" />
    </svg>
  );
}

export type Testimonial = { name: string; business: string; quote: string; video?: string };

export function Testimonials({
  items,
  id = "testimonios",
  kicker = "Lo que dicen de Focus",
  title = (
    <>
      Clientes que ya <span className="text-accent-ink">venden con Focus</span>
    </>
  ),
  note = "Aquí subiremos el video de este cliente más adelante.",
}: {
  items: readonly Testimonial[];
  id?: string;
  kicker?: string;
  title?: ReactNode;
  note?: string;
}) {
  return (
    <section id={id} className="relative mx-auto max-w-[1100px] px-5 py-12 md:px-8 md:py-16">
      <Reveal from="blur" className="text-center">
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h2>
      </Reveal>
      <div className="mt-8 grid auto-rows-fr gap-5 md:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={index} from="blur" delay={index * 140} className="h-full">
            <GlowCard className="flex h-full flex-col rounded-[28px] p-3" style={{ animationDelay: `${index * -2.3}s` }}>
              <VideoSlot
                src={item.video}
                title="Testimonio en video"
                note={note}
                className="aspect-[9/16] max-h-[460px]"
                compact
              />
              <div className="flex flex-1 flex-col px-3 pt-5 pb-3 text-center">
                <p className="flex-1 text-[15px] leading-relaxed text-fg/75">“{item.quote}”</p>
                <p className="mt-4 text-sm font-bold text-fg">{item.name}</p>
                <p className="text-xs font-bold tracking-[0.14em] text-accent-ink uppercase">{item.business}</p>
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function DarkFaq({
  id,
  subtitle,
  items,
  mascot,
}: {
  id: string;
  subtitle: string;
  items: readonly (readonly [string, string])[];
  mascot?: ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id={id} className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 left-1/3 h-80 w-[36rem] max-w-full rounded-full bg-lime/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-80 w-[30rem] max-w-full rounded-full bg-focus/10 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-5 py-12 md:py-16">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Preguntas <span className="text-accent-ink">frecuentes</span>
            </h2>
            <p className="mt-4 text-fg/70">{subtitle}</p>
          </div>
          {mascot && <div className="hidden shrink-0 md:block">{mascot}</div>}
        </Reveal>
        <div className="mt-10 divide-y divide-fg/10 border-y border-fg/10">
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
                  <span className="text-lg font-extrabold">{question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-focus text-navy">
                    <ChevronDown className={`h-4 w-4 transition-transform ${shown ? "rotate-180" : ""}`} strokeWidth={3} />
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: shown ? "auto" : 0, opacity: shown ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-4xl pb-6 leading-relaxed text-fg/75">{answer}</p>
                </motion.div>
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
      <circle cx="12" cy="12" r="11.15" fill="#010101" stroke="#ffffff" strokeWidth="1.7" />
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
  return <p className={`text-xs font-bold tracking-[0.22em] text-accent-ink uppercase md:text-sm ${className}`}>{children}</p>;
}

/** Tarjeta con borde de luz giratorio, foco que sigue al cursor e inclinación 3D suave. */
export function GlowCard({
  children,
  className = "",
  style,
  live = false,
  tone = "aqua",
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  live?: boolean;
  tone?: "aqua" | "sky";
  tilt?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  function move(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || event.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    if (tilt) {
      el.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
    }
  }
  function leave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={style}
      className={`glow-card ${tone === "sky" ? "tone-sky" : ""} ${live ? "is-live" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/** Índice activo que recorre los pasos de un flujo en bucle. */
export function useCycle(length: number, every = 1600) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((value) => (value + 1) % length), every);
    return () => window.clearInterval(id);
  }, [length, every]);
  return index;
}

/** Conector con un pulso de luz que viaja de un paso al siguiente. */
export function FlowLink({ vertical = false, delay = 0, className = "" }: { vertical?: boolean; delay?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flow-track ${vertical ? "vertical w-[2px]" : "h-[2px]"} block ${className}`}
      style={{ "--delay": `${delay}s` } as CSSProperties}
    />
  );
}
