import { useCallback, useEffect, useState, type ComponentType } from "react";
import {
  ArrowRight,
  ChartNoAxesCombined,
  ChevronRight,
  Clapperboard,
  DatabaseZap,
  FilePenLine,
  FileVideo,
  GraduationCap,
  Lightbulb,
  Megaphone,
} from "lucide-react";
import { DarkFaq, DarkHeader, HeroWave, Kicker, Testimonials, ToolPills, VideoSlot, type Testimonial } from "../components/Dark";
import { Reveal, SiteFooter, SiteSwitcher, WhatsAppChat, openFocusWhatsApp } from "../components/Site";

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

// Cuando el cliente entregue el video de presentación de la academia, va aquí como URL de embed.
const ACADEMY_VIDEO = "";

const ACCESS_TEXT = "Hola, quiero acceder a Focus Academy.";

const LINKS = [
  { id: "clases", label: "Clases gratis" },
  { id: "recursos", label: "Recursos" },
  { id: "testimonios", label: "Comunidad" },
  { id: "soporte", label: "Soporte" },
] as const;

const STEPS: { title: string; text: string; icon: Icon; paid?: boolean }[] = [
  { title: "Aprende estrategias", text: "Clases prácticas y directas al grano.", icon: Lightbulb },
  { title: "Crea copys", text: "Escribe mensajes que convierten.", icon: FilePenLine },
  { title: "Guiones para videos", text: "Ideas que conectan con tu audiencia.", icon: FileVideo },
  { title: "Edición de videos", text: "Haz contenido atractivo y profesional.", icon: Clapperboard },
  { title: "Campañas Meta Ads", text: "Aprende a segmentar, crear y optimizar.", icon: Megaphone },
  { title: "Escalamiento", text: "Lleva tus resultados al siguiente nivel.", icon: ChartNoAxesCombined },
  { title: "CRM", text: "Organiza, automatiza y convierte.", icon: DatabaseZap, paid: true },
];

const TESTIMONIALS: [Testimonial, Testimonial, Testimonial] = [
  { name: "Nombre del estudiante", business: "Negocio · Ciudad", quote: "Aquí va, en palabras del estudiante, qué aprendió y cómo lo aplicó en su negocio." },
  { name: "Nombre del estudiante", business: "Negocio · Ciudad", quote: "Aquí va, en palabras del estudiante, qué aprendió y cómo lo aplicó en su negocio." },
  { name: "Nombre del estudiante", business: "Negocio · Ciudad", quote: "Aquí va, en palabras del estudiante, qué aprendió y cómo lo aplicó en su negocio." },
];

const FAQ = [
  ["¿Las clases tienen costo?", "No. Las clases de Focus Academy son gratis con tu suscripción a Focus Chat."],
  ["Entonces, ¿qué pago?", "Solo tu suscripción a Focus Chat, la plataforma (CRM) para organizar, automatizar y convertir tus leads."],
  [
    "¿Qué voy a aprender?",
    "Estrategia, copys, guiones y edición de videos, campañas de Meta Ads y escalamiento. Todo lo que necesitas para atraer, gestionar y vender más.",
  ],
  ["¿Necesito experiencia previa?", "No. Son clases prácticas y directas al grano, desde la creación de copys hasta la automatización en el CRM."],
  ["¿Por qué aprender a llenar mi WhatsApp de leads?", "Porque de nada te sirve automatizar tus leads si no tienes leads que gestionar. Primero los atraes; después el CRM los organiza."],
  ["¿Cómo accedo a la academia?", "Con tu suscripción a Focus Chat. Si aún no la tienes, escríbenos por WhatsApp y te ayudamos a empezar."],
] as const;

function StepCard({ step }: { step: (typeof STEPS)[number] }) {
  const Glyph = step.icon;
  return (
    <div
      className={`relative flex h-full flex-col items-center rounded-2xl border px-3 pt-8 pb-5 text-center backdrop-blur-md ${
        step.paid
          ? "border-iris/70 bg-[#0b1233]/85 shadow-[0_0_30px_rgb(139_156_236/0.25)]"
          : "border-aqua/45 bg-[#07141f]/85 shadow-[0_0_28px_rgb(78_242_228/0.15)]"
      }`}
    >
      <span
        className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-lg py-1 font-bold whitespace-nowrap ${
          step.paid ? "bg-[#3b3fd1] px-2 text-[10px] text-white" : "bg-mint px-3 text-[11px] text-abyss shadow-[0_0_18px_rgb(82_250_164/0.5)]"
        }`}
      >
        {step.paid ? "PAGAS TU SUSCRIPCIÓN" : "GRATIS"}
      </span>
      <Glyph className={`h-11 w-11 ${step.paid ? "text-sky" : "text-aqua"}`} strokeWidth={1.5} />
      <p className="mt-3 text-[17px] leading-tight font-bold">{step.title}</p>
      <p className="mt-2 text-[13px] leading-snug text-white/70">{step.text}</p>
    </div>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 h-[34rem] w-[44rem] rounded-full bg-[#0a3150]/60 blur-3xl" />
      <HeroWave className="h-[18%]! opacity-60" />
      <div className="relative mx-auto max-w-[1400px] px-5 pt-14 md:px-8 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal from="left">
            <Kicker>Aprende · Aplica · Haz crecer tu negocio</Kicker>
            <h1 className="mt-6 text-5xl leading-[1.04] font-bold tracking-tight md:text-6xl xl:text-[4.25rem]">
              <span className="block lg:whitespace-nowrap">Suscríbete a un CRM.</span>
              <span className="block bg-gradient-to-r from-aqua to-sky bg-clip-text text-transparent lg:whitespace-nowrap">Accede a una academia.</span>
              <span className="block lg:whitespace-nowrap">Impulsa tus ventas.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
              Con tu suscripción a <span className="text-aqua">Focus Chat</span>, accede a las <span className="text-aqua">clases gratuitas</span> de Focus Academy y aprende
              nuevas estrategias para crecer.
            </p>
          </Reveal>
          <Reveal from="right" delay={120}>
            <VideoSlot src={ACADEMY_VIDEO || undefined} title="Video de Focus Academy" className="aspect-video shadow-[0_30px_90px_rgb(139_156_236/0.25)]" />
          </Reveal>
        </div>

        <div id="clases" className="mt-16 pt-4 lg:mt-20">
          <ol className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:items-stretch lg:gap-1">
            {STEPS.map((step, index) => (
              <li key={step.title} className={`flex items-stretch lg:flex-1 ${step.paid ? "col-span-2 mx-auto w-1/2 sm:col-span-1 sm:w-full" : ""}`}>
                <Reveal delay={index * 70} className="w-full">
                  <StepCard step={step} />
                </Reveal>
                {index < STEPS.length - 1 && <ChevronRight className="hidden h-6 w-6 shrink-0 self-center text-sky lg:block" />}
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="relative mt-14 pb-16 text-center lg:mt-16 lg:pb-20">
          <svg viewBox="0 0 1200 60" className="absolute inset-x-0 top-6 mx-auto h-10 w-full max-w-5xl" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 58C260 58 380 6 600 6S940 58 1200 58" fill="none" stroke="#4ef2e4" strokeOpacity="0.5" strokeWidth="1.5" />
          </svg>
          <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border border-aqua/50 bg-abyss text-aqua shadow-[0_0_30px_rgb(78_242_228/0.3)]">
            <GraduationCap className="h-7 w-7" strokeWidth={1.7} />
          </span>
          <p className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            Todo esto es <span className="text-mint">GRATIS.</span>
          </p>
          <p className="mt-3 text-sm tracking-[0.22em] text-white/85 uppercase md:text-base">
            Y solo pagas tu <span className="text-aqua">suscripción</span> por utilizar la plataforma.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Resources() {
  return (
    <section id="recursos" className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal from="left">
          <Kicker>Aprende · Aplica · Haz crecer tu negocio</Kicker>
          <h2 className="mt-6 text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
            En Focus Academy{" "}
            <span className="bg-gradient-to-r from-aqua to-sky bg-clip-text text-transparent">aprendes todo lo que necesitas para atraer, gestionar y vender más.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            De nada te sirve automatizar <strong>tus leads</strong> si no tienes leads que gestionar. Por eso, aquí aprenderás a <strong>llenar</strong> tu WhatsApp de leads
            potenciales. Te enseñamos desde la creación de copys hasta la automatización en el CRM.
          </p>
          <a
            href="#clases"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-aqua px-8 py-4 text-lg font-medium text-abyss shadow-[0_0_40px_rgb(78_242_228/0.35)] transition hover:-translate-y-0.5"
          >
            Explora las clases gratis
            <ArrowRight className="h-5 w-5" />
          </a>
          <ToolPills className="mt-12" />
        </Reveal>
        <Reveal from="right" delay={120}>
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-gradient-to-br from-aqua/20 via-iris/10 to-sky/20 blur-2xl" />
            <img
              src="/academy/hero-estudio.jpg"
              alt="Estudiante tomando una clase de Focus Academy"
              width={902}
              height={377}
              loading="lazy"
              className="relative w-full rounded-[28px] border border-white/10 object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Academy() {
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const openWhatsApp = useCallback(() => setWhatsappOpen(true), []);
  const closeWhatsApp = useCallback(() => setWhatsappOpen(false), []);

  useEffect(() => {
    document.title = "Focus Academy · Aprende, aplica y haz crecer tu negocio";
    return () => {
      document.title = "Focus Agency";
    };
  }, []);

  return (
    <div className="min-h-screen bg-abyss text-white">
      <SiteSwitcher tone="dark" />
      <DarkHeader suffix="ACADEMY" links={LINKS} cta="Acceder a la academia" onCta={() => openFocusWhatsApp(ACCESS_TEXT)} />
      <main>
        <Hero />
        <Resources />
        <Testimonials items={TESTIMONIALS} />
        <DarkFaq id="soporte" subtitle="Preguntas o información sobre la academia y tu suscripción" items={FAQ} />
      </main>
      <SiteFooter band="aqua" onWhatsApp={openWhatsApp} />
      <WhatsAppChat open={whatsappOpen} onOpen={openWhatsApp} onClose={closeWhatsApp} />
    </div>
  );
}
