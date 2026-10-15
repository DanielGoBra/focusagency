import { useCallback, useState, type ComponentType, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CalendarCheck,
  ChartNoAxesCombined,
  Check,
  Database,
  Filter,
  Goal,
  Handshake,
  ImageIcon,
  ListChecks,
  MessageSquareText,
  Play,
  Sparkles,
  Swords,
  Tags,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import {
  BrandPage,
  DarkFaq,
  FlowLink,
  GlowCard,
  GmailMark,
  GoogleG,
  HeroWave,
  InstagramMark,
  Kicker,
  MetaMark,
  PageMascot,
  TikTokMark,
  Testimonials,
  ToolPills,
  VideoSlot,
  useCycle,
  type Testimonial,
} from "../components/Dark";
import { useBrandDark } from "../components/brandTheme";
import { CampaignBars, GrowthChart } from "../components/Charts";
import { ContactForm, Reveal, SiteFooter, SocialGlyph, WhatsAppChat, openFocusWhatsApp } from "../components/Site";

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

// Cuando el cliente entregue el video de bienvenida, va aquí como URL de embed (YouTube, Vimeo…).
const WELCOME_VIDEO = "";

const CONSULTING_TEXT = "Hola, quiero agendar una consultoría con Focus Agency.";

const SECTIONS = [
  { hash: "servicios", label: "Servicios" },
  { hash: "casos", label: "Casos de éxito" },
  { hash: "nosotros", label: "Nosotros" },
  { hash: "contacto", label: "Contacto" },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Nombre del cliente", business: "Negocio · Ciudad", quote: "Aquí va, en palabras del cliente, lo que cambió en su negocio con Focus." },
  { name: "Nombre del cliente", business: "Negocio · Ciudad", quote: "Aquí va, en palabras del cliente, lo que cambió en su negocio con Focus." },
  { name: "Nombre del cliente", business: "Negocio · Ciudad", quote: "Aquí va, en palabras del cliente, lo que cambió en su negocio con Focus." },
];

const CHAIN = ["Estrategia", "Creativos", "Meta Ads", "CRM", "Automatización", "Venta"];

const STRATEGY: { label: string; icon: Icon }[] = [
  { label: "Oferta", icon: Tags },
  { label: "Público", icon: Users },
  { label: "Competencia", icon: Swords },
  { label: "Objetivos", icon: Goal },
  { label: "Embudo", icon: Filter },
  { label: "Proceso comercial", icon: Handshake },
];

const ADS_STEPS = ["Creativos", "Campañas", "Audiencias", "Optimización"];

const LEAD_PATH: { label: string; icon: Icon | "wa" }[] = [
  { label: "Anuncio", icon: Target },
  { label: "WhatsApp", icon: "wa" },
  { label: "Lead", icon: Users },
  { label: "CRM", icon: Database },
  { label: "Seguimiento", icon: CalendarCheck },
];

const AUTOMATION: { label: string; icon: Icon }[] = [
  { label: "Automatización", icon: Workflow },
  { label: "IA", icon: Sparkles },
  { label: "Respuestas", icon: MessageSquareText },
  { label: "Calificación", icon: BadgeCheck },
  { label: "Seguimiento", icon: CalendarCheck },
  { label: "Organización de leads", icon: ListChecks },
];

// Cada caso se llena con los datos reales del cliente y una captura de la campaña.
const CASES = [
  { id: "01", client: "Cliente / Nicho", campaign: "Nombre de la campaña", investment: "$X", leads: "X", cpl: "$X", sales: "X", roas: "X", image: "" },
  { id: "02", client: "Cliente / Nicho", campaign: "Nombre de la campaña", investment: "$X", leads: "X", cpl: "$X", sales: "X", roas: "X", image: "" },
];

const AUDIENCE = [
  "Ya han invertido en publicidad digital",
  "Quieren generar más oportunidades comerciales",
  "Tienen problemas convirtiendo sus leads",
  "Quieren automatizar WhatsApp",
  "Necesitan seguimiento de prospectos",
  "Quieren escalar con datos",
];

const FAQ = [
  [
    "¿Qué incluye el servicio?",
    "Construimos el embudo completo: estrategia, creativos, campañas de Meta Ads, WhatsApp conectado a un CRM y las automatizaciones que sostienen el seguimiento. Todo conectado con un solo objetivo: que tu negocio venda más.",
  ],
  [
    "¿Ustedes hacen los anuncios?",
    "Sí. Diseñamos los creativos y gestionamos las campañas de Meta Ads, pensadas para atraer personas con potencial de convertirse en clientes.",
  ],
  [
    "¿Necesito tener un CRM?",
    "No. Si aún no tienes uno, trabajamos con Focus Chat para organizar tus conversaciones de WhatsApp y saber en qué etapa está cada prospecto.",
  ],
  [
    "¿Cuánto debo invertir en publicidad?",
    "Depende de tu oferta, tu público y tus objetivos. Lo definimos en la etapa de estrategia, antes de invertir, porque hacer publicidad sin estrategia solo acelera el gasto.",
  ],
  [
    "¿Qué tareas se automatizan?",
    "Lo que no debería depender de una persona: respuestas, calificación, seguimiento y organización de leads. Tu equipo se enfoca en vender.",
  ],
  [
    "¿Cómo empezamos?",
    "Agenda una consultoría. Revisamos tu negocio y tu proceso comercial, y te proponemos el embudo que necesitas.",
  ],
] as const;

const FRAME = "flex flex-col rounded-[28px] p-5 md:p-6 lg:h-[540px]";

function FrameHeader({ label, badge }: { label: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-bold tracking-[0.18em] text-accent-ink uppercase">{label}</p>
      {badge && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-2.5 py-1 text-[11px] font-bold text-lime-ink">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
          {badge}
        </span>
      )}
    </div>
  );
}

const FUNNEL = [
  {
    title: "Anuncios",
    text: "Atraemos tu audiencia",
    art: (
      <div className="relative h-14 w-20">
        <span className="absolute top-3 left-0 grid h-8 w-8 place-items-center rounded-full bg-white shadow">
          <MetaMark className="h-5 w-5" />
        </span>
        <span className="absolute top-0 left-6 grid h-8 w-8 place-items-center rounded-full bg-white shadow">
          <InstagramMark className="h-5 w-5" />
        </span>
        <span className="absolute top-3 left-12 grid h-8 w-8 place-items-center rounded-full bg-white shadow">
          <GoogleG className="h-5 w-5" />
        </span>
        <span className="absolute top-7 left-6 grid h-7 w-7 place-items-center rounded-full shadow">
          <TikTokMark className="h-7 w-7" />
        </span>
      </div>
    ),
  },
  {
    title: "Creativos",
    text: "Captamos su atención",
    art: (
      <div className="relative grid h-14 w-20 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#1d3a4a] via-[#0b1d2a] to-[#123247]">
        <ImageIcon className="h-6 w-6 text-white/80" strokeWidth={1.6} />
        <span className="absolute right-1.5 bottom-1.5 grid h-5 w-5 place-items-center rounded-full bg-focus text-navy">
          <Play className="h-3 w-3" fill="currentColor" />
        </span>
      </div>
    ),
  },
  {
    title: "Leads",
    text: "Generamos conversaciones",
    art: (
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_0_24px_rgb(37_211_102/0.45)]">
        <SocialGlyph name="WhatsApp" className="h-8 w-8" />
      </span>
    ),
  },
  { title: "CRM", text: "Organizamos y hacemos seguimiento", art: <Database className="h-12 w-12 text-[#19b7e6]" strokeWidth={1.6} /> },
  { title: "Ventas", text: "Convertimos en clientes", art: <ChartNoAxesCombined className="h-12 w-12 text-lime-ink" strokeWidth={1.8} /> },
];

function FunnelHero() {
  const active = useCycle(FUNNEL.length, 1500);
  const dark = useBrandDark();
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-10 right-0 h-[32rem] w-[40rem] rounded-full bg-focus/10 blur-3xl" />
      <HeroWave />
      <div className="relative mx-auto grid max-w-[1380px] items-center gap-10 px-5 pt-10 pb-14 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:pt-14 lg:pb-20">
        <Reveal from="blur">
          <Kicker>Publicidad + Tecnología + Estrategia</Kicker>
          <h2 className="mt-6 text-5xl leading-[1.02] font-extrabold tracking-tight md:text-6xl xl:text-7xl">
            No solo hacemos anuncios.
            <span className="block text-accent-ink">Construimos un embudo de ventas.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/85 md:text-xl">
            Desde los creativos y las campañas, hasta el cierre en tu CRM. Un solo sistema, todo conectado.
          </p>
          <button
            type="button"
            onClick={() => openFocusWhatsApp(CONSULTING_TEXT)}
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-focus px-8 py-4 text-lg font-extrabold text-navy shadow-[0_0_28px_rgb(43_189_239/0.4)] transition hover:-translate-y-0.5"
          >
            Agendar una consultoría
            <ArrowRight className="h-5 w-5" />
          </button>
          <ToolPills className="mt-12" />
        </Reveal>

        <Reveal from="blur" delay={150} className="relative min-w-0">
          {dark ? (
            <img
              src="/agency/hero-equipo.jpg"
              alt="Equipo de Focus Agency"
              width={792}
              height={320}
              className="mx-auto w-full max-w-3xl [mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_78%)] object-cover"
            />
          ) : (
            <PageMascot pose="senala" kicker="Así se arma" text="Tu embudo, paso a paso" className="w-[190px] sm:w-[220px]" bubbleSide="right" />
          )}
          <ol className={`snap-rail relative z-10 flex items-stretch overflow-x-auto pt-4 pb-2 lg:overflow-visible ${dark ? "-mt-8 lg:-mt-20" : "mt-6"}`}>
            {FUNNEL.map((card, index) => (
              <li key={card.title} className="flex shrink-0 items-center lg:min-w-0 lg:flex-1 lg:last:flex-none lg:last:basis-[calc((100%-4*1.25rem)/5)]">
                <GlowCard
                  live={index === active}
                  className="flex h-[196px] w-[150px] flex-col items-center rounded-2xl px-3 py-4 text-center lg:w-full"
                  style={{ animationDelay: `${index * -1.4}s` }}
                >
                  <div className="live-icon grid h-16 w-full place-items-center">{card.art}</div>
                  <p className="mt-3 text-[17px] font-bold">{card.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-fg/70">{card.text}</p>
                </GlowCard>
                {index < FUNNEL.length - 1 && <FlowLink className="w-4 shrink-0 lg:w-5" delay={index * 0.3} />}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

function Welcome() {
  const bubbles = [
    { node: <GmailMark className="h-7 w-7" />, place: "-left-5 top-[55%] md:-left-8", delay: "0s" },
    { node: <GoogleG className="h-7 w-7" />, place: "-right-5 top-[40%] md:-right-8", delay: "-1.6s" },
    { node: <InstagramMark className="h-7 w-7" />, place: "left-[8%] -bottom-6", delay: "-3s" },
    { node: <MetaMark className="h-7 w-7" />, place: "right-[8%] -top-6", delay: "-2.2s" },
  ];
  return (
    <section id="inicio" className="relative">
      <div className="relative mx-auto max-w-5xl px-4 pt-8 text-center md:pt-12">
        <Reveal from="blur">
          <h1 className="mx-auto max-w-4xl text-[1.85rem] leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-[3.15rem]">
            <span className="text-lime-ink">Bienvenido a Focus:</span>
            <span className="mt-1 block">publicidad digital y sistemas de ventas que hacen crecer tu negocio.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-fg/75 md:text-lg">
            Te ayudamos a atraer clientes, convertir oportunidades y organizar todo tu proceso comercial en un solo sistema.
          </p>
        </Reveal>
      </div>
      <div className="relative mx-auto mt-8 w-full max-w-[1500px] px-4 pb-10 sm:px-8 lg:mt-10">
        <div className="relative">
          <Reveal from="blur" delay={150}>
            <div className="relative mx-auto w-full max-w-[720px]">
              <VideoSlot
                src={WELCOME_VIDEO || undefined}
                title="Aquí irá nuestro video de bienvenida"
                note="Estamos preparando un video que muestra cómo trabajamos. Lo publicaremos en este espacio muy pronto."
                className="aspect-video"
              />
              {bubbles.map((bubble, index) => (
                <span
                  key={index}
                  className={`float absolute z-10 grid h-12 w-12 place-items-center rounded-full border-2 border-[#2bbdef] bg-white shadow-[0_0_18px_rgb(43_189_239/0.45)] md:h-14 md:w-14 ${bubble.place}`}
                  style={{ animationDelay: bubble.delay }}
                  aria-hidden="true"
                >
                  {bubble.node}
                </span>
              ))}
            </div>
          </Reveal>
          <div className="absolute bottom-0 left-0 hidden xl:block">
            <PageMascot pose="frente" kicker="Focus Agency" text="Publicidad, tecnología y estrategia" />
          </div>
        </div>
        <div className="mt-10 xl:hidden">
          <PageMascot pose="frente" kicker="Focus Agency" text="Publicidad, tecnología y estrategia" className="w-[170px]" />
        </div>
      </div>
      <div aria-hidden="true" className="section-bridge relative" />
    </section>
  );
}

function StrategyBoard() {
  const active = useCycle(STRATEGY.length, 1300);
  return (
    <GlowCard className={FRAME}>
      <div className="flex items-center justify-between gap-3">
        <FrameHeader label="Tablero estratégico" />
        <div className="flex -space-x-2" aria-label="Equipo Focus">
          {["LQ", "DG", "FA"].map((who, index) => (
            <span
              key={who}
              className={`grid h-8 w-8 place-items-center rounded-full border-2 border-card text-[11px] font-bold text-navy ${["bg-focus", "bg-lime", "bg-[#19b7e6]"][index]}`}
            >
              {who}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {STRATEGY.map((item, index) => {
          const Glyph = item.icon;
          const on = index === active;
          return (
            <div
              key={item.label}
              className={`rounded-2xl border p-3 transition duration-500 ${on ? "border-focus/60 bg-focus/10 shadow-[0_0_24px_rgb(43_189_239/0.2)]" : "border-fg/10 bg-fg/[0.03]"}`}
            >
              <div className="flex items-center justify-between">
                <Glyph className={`h-5 w-5 transition duration-500 ${on ? "scale-125 text-accent-ink" : "text-[#19b7e6]"}`} strokeWidth={1.7} />
                <span className="text-[10px] font-bold text-fg/40">0{index + 1}</span>
              </div>
              <p className="mt-2 text-sm font-bold">{item.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-2xl bg-fg/[0.03] px-3 pt-3">
        <div className="flex items-baseline justify-between px-1">
          <p className="text-sm font-bold">Leads calificados por mes</p>
          <p className="text-[11px] text-fg/45">Datos de ejemplo</p>
        </div>
        <GrowthChart height={215} />
      </div>
    </GlowCard>
  );
}

function AdsPanel() {
  const step = useCycle(ADS_STEPS.length, 1600);
  return (
    <GlowCard className={FRAME} style={{ animationDelay: "-2s" }}>
      <FrameHeader label="Ciclo de campaña" badge="Optimizando" />
      <ol className="mt-4 flex items-center">
        {ADS_STEPS.map((label, index) => (
          <li key={label} className="flex min-w-0 flex-1 items-center last:flex-none">
            <span
              className={`rounded-full px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap transition duration-500 sm:px-3 sm:text-xs ${
                index === step ? "bg-focus text-navy shadow-[0_0_20px_rgb(43_189_239/0.5)]" : "bg-fg/[0.06] text-fg/75"
              }`}
            >
              {label}
            </span>
            {index < ADS_STEPS.length - 1 && <FlowLink className="mx-1 min-w-3 flex-1" delay={index * 0.35} />}
          </li>
        ))}
      </ol>
      <div className="mt-4 grid min-h-0 flex-1 gap-4 sm:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col overflow-hidden rounded-[20px] bg-white text-navy">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-[10px] font-bold text-white">TU</span>
            <span className="min-w-0">
              <span className="block text-xs font-bold">Tu marca</span>
              <span className="block text-[10px] text-navy/55">Publicidad · Meta</span>
            </span>
            <MetaMark className="ml-auto h-5 w-5" />
          </div>
          <div className="shimmer relative grid min-h-40 flex-1 place-items-center bg-gradient-to-br from-[#0b2a3a] via-[#0e3d52] to-[#1b5fd6] text-white">
            <div className="px-4 text-center">
              <p className="text-[10px] tracking-[0.3em] text-accent-ink">TU OFERTA</p>
              <p className="mt-2 text-lg leading-tight font-bold">El anuncio que detiene el scroll.</p>
            </div>
          </div>
          <div className="flex items-center justify-end px-3 py-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-[11px] font-bold text-white">
              <SocialGlyph name="WhatsApp" className="h-3.5 w-3.5" />
              Enviar mensaje
            </span>
          </div>
        </div>
        <div className="flex min-w-0 flex-col rounded-[20px] bg-fg/[0.03] p-3">
          <div className="flex items-baseline justify-between px-1 pb-2">
            <p className="text-sm font-bold">Rendimiento por semana</p>
            <p className="text-[11px] text-fg/45">Datos de ejemplo</p>
          </div>
          <CampaignBars height={230} />
        </div>
      </div>
    </GlowCard>
  );
}

const PIPELINE = ["Nuevo", "En conversación", "Calificado", "Propuesta"];

function LeadFlow() {
  const node = useCycle(LEAD_PATH.length, 1200);
  const stage = useCycle(PIPELINE.length, 2000);
  const others: Record<string, string[]> = {
    Nuevo: ["Andrés", "Valentina", "Julián"],
    "En conversación": ["Laura", "Sebastián"],
    Calificado: ["Mateo", "Sofía"],
    Propuesta: ["Daniel"],
  };
  return (
    <GlowCard className={FRAME} style={{ animationDelay: "-4s" }}>
      <FrameHeader label="Del anuncio al CRM" badge="En vivo" />
      <ol className="mt-5 flex items-start">
        {LEAD_PATH.map((item, index) => {
          const Glyph = item.icon;
          const on = index === node;
          return (
            <li key={item.label} className="flex min-w-0 flex-1 items-start last:flex-none">
              <div className="flex w-14 shrink-0 flex-col items-center gap-2 text-center sm:w-16">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl border transition duration-500 ${
                    item.icon === "wa" ? "border-[#25D366] bg-[#25D366] text-white" : "border-focus/40 bg-page text-accent-ink"
                  } ${on ? "scale-110 shadow-[0_0_28px_rgb(43_189_239/0.6)]" : ""}`}
                >
                  {Glyph === "wa" ? <SocialGlyph name="WhatsApp" className="h-6 w-6" /> : <Glyph className="h-5 w-5" strokeWidth={1.8} />}
                </span>
                <span className={`text-[11px] font-bold transition sm:text-xs ${on ? "text-accent-ink" : ""}`}>{item.label}</span>
              </div>
              {index < LEAD_PATH.length - 1 && <FlowLink className="mt-6 min-w-2 flex-1" delay={index * 0.25} />}
            </li>
          );
        })}
      </ol>
      <div className="mt-5 flex items-baseline justify-between">
        <p className="text-sm font-bold">Focus Chat · pipeline</p>
        <p className="text-[11px] text-fg/45">Camila avanza sola de etapa</p>
      </div>
      <div className="mt-3 grid min-h-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
        {PIPELINE.map((column, index) => (
          <div key={column} className={`flex flex-col rounded-2xl p-2.5 transition duration-500 ${index === stage ? "bg-focus/10 ring-1 ring-focus/40" : "bg-fg/[0.04]"}`}>
            <p className="text-[11px] font-bold text-fg/60">{column}</p>
            <div className="mt-2 space-y-1.5">
              {index === stage && (
                <div key={`camila-${stage}`} className="animate-in fade-in zoom-in-90 slide-in-from-left-6 flex items-center gap-2 rounded-xl bg-focus px-2 py-1.5 text-navy shadow-[0_0_20px_rgb(43_189_239/0.45)] duration-500">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#25D366] text-white">
                    <SocialGlyph name="WhatsApp" className="h-3 w-3" />
                  </span>
                  <span className="text-xs font-bold">Camila</span>
                </div>
              )}
              {others[column].map((lead) => (
                <div key={lead} className="flex items-center gap-2 rounded-xl bg-white px-2 py-1.5 text-navy">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#25D366] text-white">
                    <SocialGlyph name="WhatsApp" className="h-3 w-3" />
                  </span>
                  <span className="text-xs font-bold">{lead}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlowCard>
  );
}

function AutomationHub() {
  const active = useCycle(AUTOMATION.length, 1100);
  const spots = [
    "left-1/2 top-[3%] -translate-x-1/2",
    "right-0 top-[24%]",
    "right-0 bottom-[24%]",
    "left-1/2 bottom-[3%] -translate-x-1/2",
    "left-0 bottom-[24%]",
    "left-0 top-[24%]",
  ];
  const ends = [
    [50, 10],
    [84, 31],
    [84, 69],
    [50, 90],
    [16, 69],
    [16, 31],
  ];
  return (
    <GlowCard className={FRAME} style={{ animationDelay: "-5s" }}>
      <FrameHeader label="Focus IA trabajando" badge="24/7" />
      <div className="relative mx-auto mt-2 aspect-square w-full max-w-[26rem] min-h-0 flex-1 lg:max-w-[28rem]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {ends.map(([x, y], index) => (
            <line
              key={`${x}-${y}`}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              className="flow-line"
              style={{ strokeWidth: index === active ? 0.9 : 0.45, strokeDasharray: "1.2 1.6", stroke: index === active ? "#ffffff" : "#4ef2e4" }}
            />
          ))}
          <g className="orbit-spin">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#5fe4fa" strokeOpacity="0.25" strokeWidth="0.4" strokeDasharray="0.6 2.4" />
            <circle cx="80" cy="50" r="1.2" fill="#4ef2e4" />
            <circle cx="20" cy="50" r="0.9" fill="#5fe4fa" />
          </g>
        </svg>
        <div className="ping-soft absolute top-1/2 left-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[#2ad8ff] to-lime text-navy shadow-[0_0_60px_rgb(43_189_239/0.45)] sm:h-28 sm:w-28">
          <div className="text-center">
            <Bot className="mx-auto h-8 w-8" strokeWidth={1.8} />
            <p className="mt-1 text-xs font-bold">Focus IA</p>
          </div>
        </div>
        {AUTOMATION.map((item, index) => {
          const Glyph = item.icon;
          const on = index === active;
          return (
            <div
              key={item.label}
              className={`absolute flex max-w-[46%] items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold shadow-lg transition duration-500 sm:text-sm ${spots[index]} ${
                on ? "border-focus bg-focus text-navy shadow-[0_0_28px_rgb(43_189_239/0.55)]" : "border-fg/10 bg-card"
              }`}
            >
              <Glyph className={`h-4 w-4 shrink-0 ${on ? "" : "text-accent-ink"}`} strokeWidth={2} />
              {item.label}
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}

function ServiceRow({
  number,
  kicker,
  title,
  children,
  visual,
  mascot,
  flip = false,
}: {
  number: string;
  kicker: string;
  title: string;
  children: ReactNode;
  visual: ReactNode;
  mascot?: ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
      <Reveal from="blur" className={flip ? "lg:order-2" : ""}>
        <div className="flex items-baseline gap-4">
          <span className="bg-gradient-to-b from-focus to-lime bg-clip-text text-6xl font-extrabold text-transparent md:text-7xl">{number}</span>
          <Kicker>{kicker}</Kicker>
        </div>
        <h3 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight md:text-5xl">{title}</h3>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-fg/75">{children}</div>
        {mascot && <div className="mt-8 hidden lg:block">{mascot}</div>}
      </Reveal>
      <Reveal from="blur" delay={150} className={`min-w-0 ${flip ? "lg:order-1" : ""}`}>
        {visual}
      </Reveal>
    </div>
  );
}

function Chain() {
  const active = useCycle(CHAIN.length, 1100);
  return (
    <ol className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-center lg:gap-0">
      {CHAIN.map((item, index) => {
        const last = index === CHAIN.length - 1;
        const on = index <= active;
        return (
          <li key={item} className="flex min-w-0 items-center lg:flex-1 lg:last:flex-none lg:last:basis-[calc((100%-5*2rem)/6)]">
            <span
              className={`flex h-12 w-full min-w-0 items-center justify-center rounded-full border px-3 text-xs font-bold tracking-[0.14em] uppercase transition duration-500 ${
                last
                  ? on
                    ? "border-lime bg-lime text-navy shadow-[0_0_30px_rgb(30_250_93/0.55)]"
                    : "border-lime/50 text-lime-ink"
                  : on
                    ? "border-focus bg-focus/15 text-fg shadow-[0_0_22px_rgb(43_189_239/0.3)]"
                    : "border-fg/15 text-fg/70"
              }`}
            >
              {item}
            </span>
            {!last && <FlowLink className="hidden w-8 shrink-0 px-1 lg:block" delay={index * 0.3} />}
          </li>
        );
      })}
    </ol>
  );
}

function Services() {
  return (
    <section id="servicios" className="relative">
      <div className="mx-auto max-w-[1400px] px-5 pt-20 md:px-8 md:pt-28">
        <Reveal from="blur" className="text-center">
          <h2 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl">Construimos cada parte de tu embudo de ventas</h2>
          <Chain />
          <p className="mt-8 text-xl text-fg/80 md:text-2xl">Todo conectado. Un solo objetivo: crecer.</p>
        </Reveal>

        <div className="divide-y divide-fg/10">
          <ServiceRow number="01" kicker="Estrategia" title="Primero entendemos el negocio."
            visual={<StrategyBoard />}
            mascot={<PageMascot pose="perfil-cerebro" kicker="Antes de invertir" text="Primero pensamos" className="ml-0 w-[150px]" />}
          >
            <p>Antes de invertir en publicidad analizamos:</p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {STRATEGY.map((item) => (
                <li key={item.label} className="rounded-full border border-fg/15 bg-fg/[0.04] px-3.5 py-1.5 text-center text-sm font-bold text-fg">
                  {item.label}
                </li>
              ))}
            </ul>
            <p className="border-l-2 border-focus pl-4 font-bold text-fg">Porque hacer publicidad sin estrategia solo acelera el gasto.</p>
          </ServiceRow>

          <ServiceRow number="02" kicker="Creatividad + Meta Ads" title="Creamos anuncios que generan atención." visual={<AdsPanel />} flip>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-bold text-fg">
              {ADS_STEPS.map((label, index) => (
                <span key={label} className="flex items-center gap-2">
                  {label}
                  {index < ADS_STEPS.length - 1 && <ArrowRight className="h-4 w-4 text-accent-ink" />}
                </span>
              ))}
            </p>
            <p>Diseñamos y gestionamos campañas de Meta Ads pensadas para atraer personas con potencial de convertirse en clientes.</p>
          </ServiceRow>

          <ServiceRow number="03" kicker="WhatsApp + CRM" title="Convertimos los leads en oportunidades reales."
            visual={<LeadFlow />}
            mascot={<PageMascot pose="chat" kicker="Así responde FOCU" text="Cada lead, en su etapa" className="ml-0 w-[170px]" />}
          >
            <p>
              Aquí entra <strong className="text-accent-ink">Focus Chat</strong>. No basta con generar conversaciones: hay que organizarlas, darles seguimiento y saber en qué
              etapa está cada prospecto.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-accent-ink hover:underline">
              Conoce Focus Chat
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ServiceRow>

          <ServiceRow number="04" kicker="Automatización + IA" title="Automatizamos lo que no debería depender de una persona." visual={<AutomationHub />} flip>
            <ul className="grid grid-cols-2 gap-2">
              {AUTOMATION.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-base text-fg">
                  <Zap className="h-4 w-4 shrink-0 text-accent-ink" />
                  {item.label}
                </li>
              ))}
            </ul>
            <p className="text-2xl leading-snug font-bold text-fg">
              Tu equipo se enfoca en vender.{" "}
              <span className="text-accent-ink">La tecnología se encarga de lo repetitivo.</span>
            </p>
          </ServiceRow>
        </div>
      </div>
    </section>
  );
}

function Results() {
  return (
    <section id="casos" className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-24 left-1/2 h-80 w-[50rem] max-w-full -translate-x-1/2 rounded-full bg-focus/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <Reveal from="blur" className="text-center">
          <h2 className="inline-flex flex-wrap items-center justify-center gap-4 text-4xl font-extrabold tracking-tight uppercase md:text-6xl">
            <TrendingUp className="h-10 w-10 text-lime-ink md:h-14 md:w-14" strokeWidth={2.4} />
            Resultados que hablan por sí solos
          </h2>
        </Reveal>
        <div className="mt-14 grid auto-rows-fr gap-6 lg:grid-cols-2">
          {CASES.map((item, index) => (
            <Reveal key={item.id} from="blur" delay={index * 150} className="h-full">
              <GlowCard className="grid h-full rounded-[28px] sm:grid-cols-2" style={{ animationDelay: `${index * -3}s` }}>
                <div className="flex flex-col p-6 md:p-8">
                  <p className="text-xs font-bold tracking-[0.2em] text-accent-ink">CASO {item.id}</p>
                  <h3 className="mt-2 text-2xl font-extrabold">{item.client}</h3>
                  <p className="mt-1 text-sm text-fg/60">Campaña: {item.campaign}</p>
                  <dl className="mt-6 grid flex-1 grid-cols-2 gap-2">
                    {[
                      ["Inversión", item.investment],
                      ["Leads", item.leads],
                      ["Costo por lead", item.cpl],
                      ["Ventas", item.sales],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-fg/[0.05] p-3">
                        <dt className="text-[10px] font-bold tracking-[0.14em] text-fg/50 uppercase">{label}</dt>
                        <dd className="mt-1 text-xl font-bold">{value}</dd>
                      </div>
                    ))}
                    <div className="col-span-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#2ad8ff] to-lime p-3 text-navy">
                      <dt className="text-xs font-bold tracking-[0.14em] uppercase">ROAS</dt>
                      <dd className="text-2xl font-extrabold">{item.roas}</dd>
                    </div>
                  </dl>
                </div>
                {item.image ? (
                  <img src={item.image} alt={`Captura del caso ${item.id}`} className="h-full w-full rounded-r-[28px] object-cover" />
                ) : (
                  <div className="m-4 grid min-h-56 place-items-center rounded-[20px] border-2 border-dashed border-fg/15 text-center text-sm text-fg/45 sm:ml-0">
                    <div className="px-4">
                      <ImageIcon className="mx-auto h-8 w-8" strokeWidth={1.5} />
                      <p className="mt-2 font-bold text-fg/70">Captura real de la campaña</p>
                      <p className="mt-1 text-xs">La publicaremos aquí cuando el caso esté listo.</p>
                    </div>
                  </div>
                )}
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section id="nosotros" className="relative">
      <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <Reveal from="blur" className="text-center">
          <p className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.2em] text-accent-ink uppercase">
            <Users className="h-5 w-5" />
            ¿Para quién es Focus?
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">Focus es para negocios que quieren dejar de improvisar.</h2>
          <p className="mt-5 text-lg text-fg/70">Especialmente empresas que:</p>
        </Reveal>
        <ul className="mx-auto mt-10 grid max-w-5xl auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCE.map((item, index) => (
            <Reveal key={item} from="blur" delay={index * 90} className="h-full">
              <li className="h-full">
                <GlowCard className="flex h-full min-h-28 items-center gap-4 rounded-2xl px-5 py-5 text-lg font-bold" style={{ animationDelay: `${index * -1.1}s` }}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime text-navy shadow-[0_0_20px_rgb(30_250_93/0.45)]">
                    <Check className="h-5 w-5" strokeWidth={3} />
                  </span>
                  {item}
                </GlowCard>
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal from="blur" className="mt-14 flex flex-col items-center gap-6 text-center md:flex-row md:justify-center md:text-left">
          <PageMascot pose="cafe" className="m-0 w-[140px] shrink-0" />
          <p className="max-w-3xl text-2xl leading-snug font-extrabold md:text-3xl">
            Si tu negocio ya está generando oportunidades, pero sabes que podrías convertir muchas más,{" "}
            <span className="text-accent-ink">hablemos.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 bg-gradient-to-r from-focus/0 via-focus/15 to-lime/0 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-5 py-24 text-center md:py-32">
        <Reveal from="blur">
          <PageMascot pose="senala" kicker="Hablemos" text="Agenda tu cita" className="w-[170px]" />
          <h2 className="mt-6 text-4xl leading-tight font-extrabold tracking-tight md:text-7xl">Tu próxima venta puede empezar con un anuncio.</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#2bbdef] bg-white px-8 py-4 text-lg font-extrabold text-[#14245c] transition hover:-translate-y-0.5"
            >
              Contactarnos
            </a>
            <button
              type="button"
              onClick={() => openFocusWhatsApp(CONSULTING_TEXT)}
              className="inline-flex items-center gap-2 rounded-full bg-focus px-8 py-4 text-lg font-extrabold text-navy shadow-[0_0_40px_rgb(43_189_239/0.35)] transition hover:-translate-y-0.5"
            >
              <CalendarCheck className="h-5 w-5" />
              Agendar cita
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Agency() {
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const openWhatsApp = useCallback(() => setWhatsappOpen(true), []);
  const closeWhatsApp = useCallback(() => setWhatsappOpen(false), []);

  return (
    <BrandPage title="Focus Agency · Publicidad digital y sistemas de ventas" sections={SECTIONS}>
      <main className="relative z-10">
        <Welcome />
        <FunnelHero />
        <Testimonials items={TESTIMONIALS} />
        <Services />
        <Results />
        <Audience />
        <FinalCta />
        <DarkFaq id="preguntas" subtitle="Preguntas o información sobre nuestros servicios" items={FAQ} />
        <ContactForm tone="brand" />
      </main>
      <SiteFooter onWhatsApp={openWhatsApp} />
      <WhatsAppChat open={whatsappOpen} onOpen={openWhatsApp} onClose={closeWhatsApp} />
    </BrandPage>
  );
}
