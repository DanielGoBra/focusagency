import { useCallback, useEffect, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  CalendarCheck,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  Crosshair,
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
  DarkFaq,
  DarkHeader,
  GmailMark,
  GoogleG,
  HeroWave,
  InstagramMark,
  Kicker,
  MetaMark,
  TikTokMark,
  Testimonials,
  ToolPills,
  VideoSlot,
  type Testimonial,
} from "../components/Dark";
import { ContactForm, Reveal, SiteFooter, SiteSwitcher, SocialGlyph, WhatsAppChat, openFocusWhatsApp } from "../components/Site";

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

// Cuando el cliente entregue el video de bienvenida, va aquí como URL de embed (YouTube, Vimeo…).
const WELCOME_VIDEO = "";

const CONSULTING_TEXT = "Hola, quiero agendar una consultoría con Focus Agency.";

const LINKS = [
  { id: "servicios", label: "Servicios" },
  { id: "casos", label: "Casos de éxito" },
  { id: "nosotros", label: "Nosotros" },
  { id: "contacto", label: "Contacto" },
] as const;

const TESTIMONIALS: [Testimonial, Testimonial, Testimonial] = [
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

function FunnelCard({
  title,
  text,
  art,
  className = "",
}: {
  title: string;
  text: string;
  art: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full flex-col items-center rounded-2xl border border-aqua/40 bg-[#07141f]/85 px-3 py-4 text-center shadow-[0_0_28px_rgb(78_242_228/0.16),inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md ${className}`}
    >
      <div className="grid h-16 w-full place-items-center">{art}</div>
      <p className="mt-2 text-[17px] font-bold">{title}</p>
      <p className="mt-1 text-[13px] leading-snug text-white/70">{text}</p>
    </div>
  );
}

function FunnelHero() {
  const cards = [
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
      offset: "lg:translate-y-0 lg:-rotate-3",
    },
    {
      title: "Creativos",
      text: "Captamos su atención",
      art: (
        <div className="relative grid h-14 w-24 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-[#1d3a4a] via-[#0b1d2a] to-[#123247]">
          <ImageIcon className="h-6 w-6 text-white/80" strokeWidth={1.6} />
          <span className="absolute right-1.5 bottom-1.5 grid h-5 w-5 place-items-center rounded-full bg-aqua text-abyss">
            <Play className="h-3 w-3" fill="currentColor" />
          </span>
        </div>
      ),
      offset: "lg:translate-y-8 lg:-rotate-1",
    },
    {
      title: "Leads",
      text: "Generamos conversaciones",
      art: (
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_0_24px_rgb(37_211_102/0.45)]">
          <SocialGlyph name="WhatsApp" className="h-8 w-8" />
        </span>
      ),
      offset: "lg:translate-y-14",
    },
    {
      title: "CRM",
      text: "Organizamos y hacemos seguimiento",
      art: <Database className="h-12 w-12 text-sky" strokeWidth={1.6} />,
      offset: "lg:translate-y-10 lg:rotate-1",
    },
    {
      title: "Ventas",
      text: "Convertimos en clientes",
      art: <ChartNoAxesCombined className="h-12 w-12 text-mint" strokeWidth={1.8} />,
      offset: "lg:translate-y-2 lg:rotate-3",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-10 right-0 h-[32rem] w-[40rem] rounded-full bg-[#0b3a46]/60 blur-3xl" />
      <HeroWave />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-5 pt-16 pb-14 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:pt-20 lg:pb-20">
        <Reveal from="left">
          <Kicker>Publicidad + Tecnología + Estrategia</Kicker>
          <h2 className="mt-6 text-5xl leading-[1.02] font-bold tracking-tight md:text-6xl xl:text-7xl">
            No solo hacemos anuncios.
            <span className="block bg-gradient-to-r from-aqua via-[#5ef0e6] to-sky bg-clip-text text-transparent">Construimos un embudo de ventas.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
            Desde los creativos y las campañas, hasta el cierre en tu CRM. Un solo sistema, todo conectado.
          </p>
          <button
            type="button"
            onClick={() => openFocusWhatsApp(CONSULTING_TEXT)}
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-aqua px-8 py-4 text-lg font-medium text-abyss shadow-[0_0_40px_rgb(78_242_228/0.35)] transition hover:-translate-y-0.5"
          >
            Agendar una consultoría
            <ArrowRight className="h-5 w-5" />
          </button>
          <ToolPills className="mt-12" />
        </Reveal>

        <Reveal from="right" delay={120} className="relative">
          <div className="relative mx-auto max-w-3xl">
            <img
              src="/agency/hero-equipo.jpg"
              alt="Equipo de Focus Agency"
              width={792}
              height={320}
              className="w-full [mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_78%)] object-cover"
            />
            <div className="relative z-10 -mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:-mt-24 lg:flex lg:items-start lg:gap-1">
              {cards.map((card, index) => (
                <div key={card.title} className="flex items-center lg:flex-1">
                  <FunnelCard title={card.title} text={card.text} art={card.art} className={`float ${card.offset}`} />
                  {index < cards.length - 1 && <ChevronRight className="hidden h-5 w-5 shrink-0 text-white/60 lg:block" />}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Welcome() {
  const bubbles = [
    { node: <GmailMark className="h-8 w-8" />, place: "left-[-1.5rem] top-[52%] md:left-[-4.5rem]", delay: "0s" },
    { node: <GoogleG className="h-8 w-8" />, place: "right-[-1.5rem] top-[44%] md:right-[-4.5rem]", delay: "-1.6s" },
    { node: <InstagramMark className="h-8 w-8" />, place: "left-[6%] -bottom-6 md:-left-10 md:bottom-[8%]", delay: "-3s" },
    { node: <MetaMark className="h-8 w-8" />, place: "right-[6%] -top-6 md:-right-8 md:top-[6%]", delay: "-2.2s" },
  ];
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-[0.07] invert" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-aqua/10 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-10 h-80 w-80 rounded-full bg-iris/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 pt-14 pb-24 text-center md:pt-20 md:pb-28">
        <Reveal>
          <h1 className="mx-auto max-w-4xl text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
            Bienvenido a Focus: publicidad digital y sistemas de ventas que{" "}
            <span className="bg-gradient-to-r from-aqua to-sky bg-clip-text text-transparent">hacen crecer tu negocio</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            Te ayudamos a atraer clientes, convertir oportunidades y organizar todo tu proceso comercial en un solo sistema.
          </p>
        </Reveal>
        <Reveal from="zoom" delay={150}>
          <div className="relative mx-auto mt-10 max-w-4xl">
            <VideoSlot src={WELCOME_VIDEO || undefined} title="Video de bienvenida de Focus Agency" className="aspect-video shadow-[0_24px_70px_rgb(139_156_236/0.2)]" />
            {bubbles.map((bubble, index) => (
              <span
                key={index}
                className={`float absolute grid h-14 w-14 place-items-center rounded-full bg-white shadow-[0_14px_40px_rgb(0_0_0/0.35)] md:h-16 md:w-16 ${bubble.place}`}
                style={{ animationDelay: bubble.delay }}
                aria-hidden="true"
              >
                {bubble.node}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StrategyBoard() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#081723] p-5 shadow-[0_30px_80px_rgb(0_0_0/0.35)] md:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold tracking-[0.18em] text-aqua">TABLERO ESTRATÉGICO</p>
        <div className="flex -space-x-2" aria-label="Equipo Focus">
          {["LQ", "DG", "FA"].map((who, index) => (
            <span
              key={who}
              className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[#081723] text-[11px] font-bold text-abyss ${["bg-aqua", "bg-mint", "bg-iris"][index]}`}
            >
              {who}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {STRATEGY.map((item, index) => {
          const Glyph = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center justify-between">
                <Glyph className="h-5 w-5 text-sky" strokeWidth={1.7} />
                <span className="text-[10px] font-bold text-white/40">0{index + 1}</span>
              </div>
              <p className="mt-3 text-sm font-bold">{item.label}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-aqua to-sky" style={{ width: `${55 + ((index * 17) % 45)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4 rounded-2xl bg-white/[0.04] p-4">
        <svg viewBox="0 0 220 70" className="h-16 w-full" aria-hidden="true">
          <path d="M0 60 L30 52 L60 56 L90 40 L120 44 L150 26 L180 30 L220 8" fill="none" stroke="#4ef2e4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 60 L30 52 L60 56 L90 40 L120 44 L150 26 L180 30 L220 8 L220 70 L0 70Z" fill="#4ef2e4" fillOpacity="0.08" />
        </svg>
        <div className="flex h-16 items-end gap-1.5" aria-hidden="true">
          {[30, 45, 38, 60, 72].map((h) => (
            <span key={h} className="w-3 rounded-t bg-mint/80" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AdsPanel() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setStep((value) => (value + 1) % ADS_STEPS.length), 1800);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
      <div className="overflow-hidden rounded-[24px] bg-white text-navy shadow-[0_30px_80px_rgb(0_0_0/0.35)]">
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">TU</span>
          <span className="min-w-0">
            <span className="block text-sm font-bold">Tu marca</span>
            <span className="block text-[11px] text-navy/55">Publicidad · Meta</span>
          </span>
          <MetaMark className="ml-auto h-6 w-6" />
        </div>
        <div className="relative grid aspect-square place-items-center bg-gradient-to-br from-[#0b2a3a] via-[#0e3d52] to-[#1b5fd6] text-white">
          <div className="text-center">
            <p className="text-xs tracking-[0.3em] text-aqua">TU OFERTA</p>
            <p className="mt-2 px-6 text-2xl leading-tight font-bold">El anuncio que detiene el scroll.</p>
          </div>
          <span className="absolute top-3 right-3 rounded-full bg-black/40 px-2 py-1 text-[10px] font-bold">Creativo</span>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <span className="text-xs text-navy/60">focuschat.co</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white">
            <SocialGlyph name="WhatsApp" className="h-3.5 w-3.5" />
            Enviar mensaje
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-[24px] border border-white/10 bg-[#081723] p-4">
          <p className="text-xs font-bold tracking-[0.18em] text-aqua">CICLO DE CAMPAÑA</p>
          <ol className="mt-3 space-y-2">
            {ADS_STEPS.map((label, index) => (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${index === step ? "bg-aqua text-abyss" : "bg-white/[0.04] text-white/80"}`}
              >
                <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${index === step ? "bg-abyss text-aqua" : "bg-white/10"}`}>{index + 1}</span>
                {label}
              </li>
            ))}
          </ol>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Alcance", "68%"],
            ["CTR", "52%"],
            ["Leads", "80%"],
          ].map(([label, fill]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#081723] p-3">
              <p className="text-[10px] font-bold tracking-[0.14em] text-white/50 uppercase">{label}</p>
              <div className="mt-3 flex h-12 items-end gap-1" aria-hidden="true">
                {[0.4, 0.55, 0.5, 0.75, 1].map((k, i) => (
                  <span key={i} className="flex-1 rounded-t bg-sky/70" style={{ height: `calc(${fill} * ${k})` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-right text-[11px] text-white/40">Vista ilustrativa</p>
      </div>
    </div>
  );
}

function LeadFlow() {
  const columns = [
    { stage: "Nuevo", leads: ["Camila", "Andrés"] },
    { stage: "En conversación", leads: ["Laura"] },
    { stage: "Calificado", leads: ["Mateo", "Sofía"] },
    { stage: "Propuesta", leads: ["Daniel"] },
  ];
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#081723] p-5 shadow-[0_30px_80px_rgb(0_0_0/0.35)] md:p-6">
      <div className="relative">
        <div className="absolute top-6 right-6 left-6 h-px bg-gradient-to-r from-aqua/0 via-aqua/70 to-aqua/0" aria-hidden="true" />
        <ol className="relative grid grid-cols-5 gap-1">
          {LEAD_PATH.map((item) => {
            const Glyph = item.icon;
            return (
              <li key={item.label} className="flex flex-col items-center gap-2 text-center">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl border ${item.icon === "wa" ? "border-[#25D366] bg-[#25D366] text-white" : "border-aqua/40 bg-abyss text-aqua"}`}
                >
                  {Glyph === "wa" ? <SocialGlyph name="WhatsApp" className="h-6 w-6" /> : <Glyph className="h-5 w-5" strokeWidth={1.8} />}
                </span>
                <span className="text-[11px] font-bold sm:text-xs">{item.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs font-bold tracking-[0.18em] text-aqua">FOCUS CHAT · PIPELINE</p>
        <span className="rounded-full bg-mint/15 px-2.5 py-1 text-[11px] font-bold text-mint">En vivo</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {columns.map((column) => (
          <div key={column.stage} className="rounded-2xl bg-white/[0.04] p-2.5">
            <p className="text-[11px] font-bold text-white/60">{column.stage}</p>
            <div className="mt-2 space-y-1.5">
              {column.leads.map((lead) => (
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
    </div>
  );
}

function AutomationHub() {
  const spots = [
    "left-1/2 top-0 -translate-x-1/2",
    "right-0 top-[22%]",
    "right-0 bottom-[22%]",
    "left-1/2 bottom-0 -translate-x-1/2",
    "left-0 bottom-[22%]",
    "left-0 top-[22%]",
  ];
  const ends = [
    [50, 8],
    [86, 30],
    [86, 70],
    [50, 92],
    [14, 70],
    [14, 30],
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {ends.map(([x, y]) => (
          <line key={`${x}-${y}`} x1="50" y1="50" x2={x} y2={y} className="flow-line" style={{ strokeWidth: 0.45, strokeDasharray: "1.2 1.6" }} />
        ))}
        <circle cx="50" cy="50" r="30" fill="none" stroke="#5fe4fa" strokeOpacity="0.15" strokeWidth="0.4" />
      </svg>
      <div className="absolute top-1/2 left-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-aqua to-sky text-abyss shadow-[0_0_60px_rgb(78_242_228/0.45)]">
        <div className="text-center">
          <Bot className="mx-auto h-8 w-8" strokeWidth={1.8} />
          <p className="mt-1 text-xs font-bold">Focus IA</p>
        </div>
      </div>
      {AUTOMATION.map((item, index) => {
        const Glyph = item.icon;
        return (
          <div
            key={item.label}
            className={`absolute flex max-w-[44%] items-center gap-2 rounded-2xl border border-white/10 bg-[#081723] px-3 py-2 text-xs font-bold shadow-lg sm:text-sm ${spots[index]}`}
          >
            <Glyph className="h-4 w-4 shrink-0 text-aqua" strokeWidth={2} />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

function ServiceRow({
  number,
  kicker,
  title,
  children,
  visual,
  flip = false,
}: {
  number: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
      <Reveal from={flip ? "right" : "left"} className={flip ? "lg:order-2" : ""}>
        <div className="flex items-baseline gap-4">
          <span className="bg-gradient-to-b from-aqua to-sky/30 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">{number}</span>
          <Kicker>{kicker}</Kicker>
        </div>
        <h3 className="mt-4 text-3xl leading-tight font-bold tracking-tight md:text-5xl">{title}</h3>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-white/75">{children}</div>
      </Reveal>
      <Reveal from={flip ? "left" : "right"} delay={120} className={flip ? "lg:order-1" : ""}>
        {visual}
      </Reveal>
    </div>
  );
}

function Services() {
  return (
    <section id="servicios" className="relative">
      <div className="mx-auto max-w-[1400px] px-5 pt-20 md:px-8 md:pt-28">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">Construimos cada parte de tu embudo de ventas</h2>
          <ol className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-x-2 gap-y-3 text-sm font-medium tracking-[0.18em] uppercase md:text-base">
            {CHAIN.map((item, index) => (
              <li key={item} className="flex items-center gap-2">
                <span className={`rounded-full border px-4 py-2 ${index === CHAIN.length - 1 ? "border-mint bg-mint text-abyss" : "border-aqua/40 text-white"}`}>{item}</span>
                {index < CHAIN.length - 1 && <ChevronRight className="h-4 w-4 text-aqua" />}
              </li>
            ))}
          </ol>
          <p className="mt-8 text-xl text-white/80 md:text-2xl">Todo conectado. Un solo objetivo: crecer.</p>
        </Reveal>

        <div className="divide-y divide-white/10">
          <ServiceRow number="01" kicker="Estrategia" title="Primero entendemos el negocio." visual={<StrategyBoard />}>
            <p>Antes de invertir en publicidad analizamos:</p>
            <ul className="flex flex-wrap gap-2">
              {STRATEGY.map((item) => (
                <li key={item.label} className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-sm font-bold text-white">
                  {item.label}
                </li>
              ))}
            </ul>
            <p className="border-l-2 border-aqua pl-4 font-bold text-white">Porque hacer publicidad sin estrategia solo acelera el gasto.</p>
          </ServiceRow>

          <ServiceRow number="02" kicker="Creatividad + Meta Ads" title="Creamos anuncios que generan atención." visual={<AdsPanel />} flip>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-bold text-white">
              {ADS_STEPS.map((label, index) => (
                <span key={label} className="flex items-center gap-2">
                  {label}
                  {index < ADS_STEPS.length - 1 && <ArrowRight className="h-4 w-4 text-aqua" />}
                </span>
              ))}
            </p>
            <p>Diseñamos y gestionamos campañas de Meta Ads pensadas para atraer personas con potencial de convertirse en clientes.</p>
          </ServiceRow>

          <ServiceRow number="03" kicker="WhatsApp + CRM" title="Convertimos los leads en oportunidades reales." visual={<LeadFlow />}>
            <p>
              Aquí entra <strong className="text-aqua">Focus Chat</strong>. No basta con generar conversaciones: hay que organizarlas, darles seguimiento y saber en qué
              etapa está cada prospecto.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-aqua hover:underline">
              Conoce Focus Chat
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ServiceRow>

          <ServiceRow number="04" kicker="Automatización + IA" title="Automatizamos lo que no debería depender de una persona." visual={<AutomationHub />} flip>
            <ul className="grid grid-cols-2 gap-2">
              {AUTOMATION.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-base text-white">
                  <Zap className="h-4 w-4 shrink-0 text-aqua" />
                  {item.label}
                </li>
              ))}
            </ul>
            <p className="text-2xl leading-snug font-bold text-white">
              Tu equipo se enfoca en vender.{" "}
              <span className="bg-gradient-to-r from-aqua to-sky bg-clip-text text-transparent">La tecnología se encarga de lo repetitivo.</span>
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
      <div className="pointer-events-none absolute top-24 left-1/2 h-80 w-[50rem] max-w-full -translate-x-1/2 rounded-full bg-[#0b3a46]/45 blur-3xl" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <Reveal className="text-center">
          <h2 className="inline-flex flex-wrap items-center justify-center gap-4 text-4xl font-extrabold tracking-tight uppercase md:text-6xl">
            <TrendingUp className="h-10 w-10 text-mint md:h-14 md:w-14" strokeWidth={2.4} />
            Resultados que hablan por sí solos
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {CASES.map((item, index) => (
            <Reveal key={item.id} delay={index * 120}>
              <article className="grid h-full overflow-hidden rounded-[28px] border border-white/10 bg-[#081723] sm:grid-cols-[1fr_0.9fr]">
                <div className="p-6 md:p-8">
                  <p className="text-xs font-bold tracking-[0.2em] text-aqua">CASO {item.id}</p>
                  <h3 className="mt-2 text-2xl font-bold">{item.client}</h3>
                  <p className="mt-1 text-sm text-white/60">Campaña: {item.campaign}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-2">
                    {[
                      ["Inversión", item.investment],
                      ["Leads", item.leads],
                      ["Costo por lead", item.cpl],
                      ["Ventas", item.sales],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-white/[0.05] p-3">
                        <dt className="text-[10px] font-bold tracking-[0.14em] text-white/50 uppercase">{label}</dt>
                        <dd className="mt-1 text-xl font-bold">{value}</dd>
                      </div>
                    ))}
                    <div className="col-span-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-aqua to-sky p-3 text-abyss">
                      <dt className="text-xs font-bold tracking-[0.14em] uppercase">ROAS</dt>
                      <dd className="text-2xl font-extrabold">{item.roas}</dd>
                    </div>
                  </dl>
                </div>
                {item.image ? (
                  <img src={item.image} alt={`Captura del caso ${item.id}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="m-4 grid min-h-56 place-items-center rounded-[20px] border-2 border-dashed border-white/15 text-center text-sm text-white/45 sm:ml-0">
                    <div>
                      <ImageIcon className="mx-auto h-8 w-8" strokeWidth={1.5} />
                      <p className="mt-2">Captura real de la campaña</p>
                    </div>
                  </div>
                )}
              </article>
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
        <Reveal className="text-center">
          <p className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.2em] text-aqua uppercase">
            <Users className="h-5 w-5" />
            ¿Para quién es Focus?
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">Focus es para negocios que quieren dejar de improvisar.</h2>
          <p className="mt-5 text-lg text-white/70">Especialmente empresas que:</p>
        </Reveal>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          {AUDIENCE.map((item, index) => (
            <Reveal key={item} delay={index * 70}>
              <li className="flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-[#081723] px-5 py-4 text-lg font-bold">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint text-abyss">
                  <Check className="h-5 w-5" strokeWidth={3} />
                </span>
                {item}
              </li>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-14 text-center">
          <p className="mx-auto max-w-3xl text-2xl leading-snug font-bold md:text-3xl">
            Si tu negocio ya está generando oportunidades, pero sabes que podrías convertir muchas más,{" "}
            <span className="text-aqua">hablemos.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-72 -translate-y-1/2 bg-gradient-to-r from-aqua/0 via-aqua/15 to-sky/0 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-5 py-24 text-center md:py-32">
        <Reveal>
          <Crosshair className="mx-auto h-10 w-10 text-aqua" strokeWidth={1.6} />
          <h2 className="mt-6 text-4xl leading-tight font-bold tracking-tight md:text-7xl">Tu próxima venta puede empezar con un anuncio.</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-lg font-medium transition hover:-translate-y-0.5 hover:bg-white hover:text-abyss"
            >
              Contactarnos
            </a>
            <button
              type="button"
              onClick={() => openFocusWhatsApp(CONSULTING_TEXT)}
              className="inline-flex items-center gap-2 rounded-full bg-aqua px-8 py-4 text-lg font-medium text-abyss shadow-[0_0_40px_rgb(78_242_228/0.35)] transition hover:-translate-y-0.5"
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

  useEffect(() => {
    document.title = "Focus Agency · Publicidad digital y sistemas de ventas";
    return () => {
      document.title = "Focus Agency";
    };
  }, []);

  return (
    <div className="min-h-screen bg-abyss text-white">
      <SiteSwitcher tone="dark" />
      <DarkHeader suffix="AGENCY" links={LINKS} cta="Agendar una consultoría" onCta={() => openFocusWhatsApp(CONSULTING_TEXT)} />
      <main>
        <Welcome />
        <FunnelHero />
        <Testimonials items={TESTIMONIALS} />
        <Services />
        <Results />
        <Audience />
        <FinalCta />
        <DarkFaq id="preguntas" subtitle="Preguntas o información sobre nuestros servicios" items={FAQ} />
        <ContactForm tone="dark" />
      </main>
      <SiteFooter band="aqua" onWhatsApp={openWhatsApp} />
      <WhatsAppChat open={whatsappOpen} onOpen={openWhatsApp} onClose={closeWhatsApp} />
    </div>
  );
}
