import { useCallback, useState, type ComponentType } from "react";
import {
  ArrowRight,
  DatabaseZap,
  FilePenLine,
  FileVideo,
  GraduationCap,
  Lightbulb,
  Megaphone,
  Workflow,
} from "lucide-react";
import { useBrandDark } from "../components/brandTheme";
import { BrandPage, DarkFaq, FlowLink, GlowCard, HeroWave, Kicker, PageMascot, Testimonials, ToolPills, VideoSlot, useCycle, type Testimonial } from "../components/Dark";
import { PriceStrike, SavingsCalculator } from "../components/AcademyValue";
import { ParticleMorph } from "../components/ParticleMorph";
import { PLANS } from "../content/plans";
import { FOCUS_COMMUNITY_URL, Reveal, SiteFooter, WhatsAppChat, openExternal } from "../components/Site";

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

// Cuando el cliente entregue el video de presentación de la academia, va aquí como URL de embed.
const ACADEMY_VIDEO = "";

const SECTIONS = [
  { hash: "clases", label: "Clases gratis" },
  { hash: "recursos", label: "Recursos" },
  { hash: "testimonios", label: "Comunidad" },
  { hash: "soporte", label: "Soporte" },
];

// value: lo que cuesta cada curso por fuera, en USD. Se muestra tachado encima de GRATIS.
const STEPS: { title: string; text: string; icon: Icon; value?: number; paid?: boolean }[] = [
  { title: "Aprende estrategias", text: "Clases prácticas y directas al grano.", icon: Lightbulb, value: 570 },
  { title: "Crea copys", text: "Escribe mensajes que convierten.", icon: FilePenLine, value: 90 },
  { title: "Guiones para videos", text: "Ideas que conectan con tu audiencia.", icon: FileVideo, value: 800 },
  { title: "Campañas Meta Ads", text: "Aprende a segmentar, crear y optimizar.", icon: Megaphone, value: 300 },
  { title: "Curso de automatizaciones", text: "Pon tu WhatsApp y tu CRM a trabajar solos.", icon: Workflow, value: 1200 },
  { title: "CRM", text: "Organiza, automatiza y convierte.", icon: DatabaseZap, paid: true },
];

const usd = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });
const FREE_VALUE = STEPS.reduce((sum, step) => sum + (step.value ?? 0), 0);
const FREE_COUNT = STEPS.filter((step) => !step.paid).length;
const SAVINGS = STEPS.flatMap((step) => (step.value ? [{ title: step.title, value: step.value }] : []));
const PLAN_FROM = PLANS.find((plan) => plan.id === "essential")?.price ?? "$79";

const TESTIMONIALS: Testimonial[] = [
  { name: "Nombre del estudiante", business: "Negocio · Ciudad", quote: "Aquí va, en palabras del estudiante, qué aprendió y cómo lo aplicó en su negocio." },
  { name: "Nombre del estudiante", business: "Negocio · Ciudad", quote: "Aquí va, en palabras del estudiante, qué aprendió y cómo lo aplicó en su negocio." },
  { name: "Nombre del estudiante", business: "Negocio · Ciudad", quote: "Aquí va, en palabras del estudiante, qué aprendió y cómo lo aplicó en su negocio." },
];

const FAQ = [
  ["¿Las clases tienen costo?", "No. Las clases de Focus Academy son gratis con tu suscripción a Focus Chat."],
  ["Entonces, ¿qué pago?", "Solo tu suscripción a Focus Chat, la plataforma (CRM) para organizar, automatizar y convertir tus leads."],
  [
    "¿Qué voy a aprender?",
    "Estrategia, copys, guiones para videos, campañas de Meta Ads y automatizaciones. Todo lo que necesitas para atraer, gestionar y vender más.",
  ],
  ["¿Necesito experiencia previa?", "No. Son clases prácticas y directas al grano, desde la creación de copys hasta la automatización en el CRM."],
  ["¿Por qué aprender a llenar mi WhatsApp de leads?", "Porque de nada te sirve automatizar tus leads si no tienes leads que gestionar. Primero los atraes; después el CRM los organiza."],
  ["¿Cómo accedo a la academia?", "Con tu suscripción a Focus Chat. Si aún no la tienes, únete a la comunidad de Focus Academy en WhatsApp y te ayudamos a empezar."],
] as const;

function StepCard({ step, live, order }: { step: (typeof STEPS)[number]; live: boolean; order: number }) {
  const Glyph = step.icon;
  return (
    <GlowCard
      live={live}
      tone={step.paid ? "sky" : "aqua"}
      className="flex h-[272px] w-[172px] flex-col items-center rounded-2xl px-3 pt-5 pb-4 text-center lg:w-full"
    >
      {step.value ? (
        <PriceStrike value={step.value} order={order} />
      ) : (
        <div className="flex h-[88px] w-full flex-col items-center">
          <p className="text-[11px] font-bold tracking-[0.16em] text-fg/55 uppercase">Tu suscripción</p>
          <p className="mt-0.5 text-[1.8rem] leading-none font-extrabold tracking-tight xl:text-[2.05rem]">
            {PLAN_FROM}
            <span className="ml-1 text-xs font-bold">/mes</span>
          </p>
          <span className="mt-auto rounded-xl bg-gradient-to-r from-[#2ad8ff] to-lime px-2.5 py-1 text-[11px] font-black text-navy shadow-[0_0_18px_rgb(43_189_239/0.5)]">
            DESDE · CRM
          </span>
        </div>
      )}
      <Glyph className={`live-icon mt-4 h-10 w-10 shrink-0 ${step.paid ? "text-[#19b7e6]" : "text-accent-ink"}`} strokeWidth={1.5} />
      <p className="mt-2 text-[16px] leading-tight font-bold">{step.title}</p>
      <p className="mt-1.5 text-[12.5px] leading-snug text-fg/70">{step.text}</p>
    </GlowCard>
  );
}

function Hero() {
  const active = useCycle(STEPS.length, 1300);
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 h-[34rem] w-[44rem] rounded-full bg-focus/10 blur-3xl" />
      <HeroWave className="h-[18%]! opacity-60" />
      <div className="relative mx-auto max-w-[1400px] px-5 pt-14 md:px-8 lg:pt-20">
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal from="blur" className="min-w-0">
            <Kicker>Aprende · Aplica · Haz crecer tu negocio</Kicker>
            <h1 className="mt-6 max-w-full text-[clamp(1.55rem,7.2vw,3rem)] leading-[1.1] font-extrabold tracking-tight md:text-6xl lg:text-[3.4rem] xl:text-[3.9rem]">
              <span className="block lg:whitespace-nowrap">Suscríbete a un CRM.</span>
              <span className="block text-accent-ink">
                Accede a una academia <span className="inline-block rounded-2xl bg-lime px-2 text-navy">gratis</span>.
              </span>
              <span className="block lg:whitespace-nowrap">Impulsa tus ventas.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/85 md:text-xl">
              Con tu suscripción a <span className="font-bold text-accent-ink">Focus Chat</span>, accede a las{" "}
              <span className="font-bold text-accent-ink">clases gratuitas</span> de Focus Academy y aprende nuevas estrategias para crecer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openExternal(FOCUS_COMMUNITY_URL)}
                className="inline-flex items-center gap-2 rounded-full bg-focus px-6 py-3.5 text-base font-extrabold text-navy shadow-[0_0_28px_rgb(43_189_239/0.4)] transition hover:-translate-y-0.5"
              >
                Acceder a la academia
                <ArrowRight className="h-5 w-5" />
              </button>
              <a
                href="#clases"
                className="inline-flex items-center rounded-full border-2 border-[#2bbdef] bg-white px-6 py-3.5 text-base font-extrabold text-[#14245c] transition hover:-translate-y-0.5"
              >
                Ver las clases
              </a>
            </div>
          </Reveal>
          <Reveal from="blur" delay={150} className="min-w-0">
            <VideoSlot
              src={ACADEMY_VIDEO || undefined}
              title="Aquí irá el video de Focus Academy"
              note="Pronto publicaremos en este espacio un recorrido por la academia y sus clases gratuitas."
              className="aspect-video"
            />
          </Reveal>
        </div>

        <div id="clases" className="mt-16 pt-4 lg:mt-20">
          <ol className="snap-rail flex items-center overflow-x-auto pt-3 pb-2 lg:overflow-visible">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex shrink-0 items-center lg:min-w-0 lg:flex-1 lg:last:flex-none lg:last:basis-[calc((100%-5*1.25rem)/6)]">
                <Reveal from="blur" delay={index * 90} className="lg:w-full">
                  <StepCard step={step} live={index === active} order={index} />
                </Reveal>
                {index < STEPS.length - 1 && <FlowLink className="w-4 shrink-0 lg:w-5" delay={index * 0.25} />}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-center text-xs text-fg/45 lg:hidden">Desliza para ver las 6 clases →</p>
        </div>

        <div className="mt-14 pb-16 lg:mt-16 lg:pb-20">
          <Reveal from="blur" className="relative text-center">
            <span className="ping-soft relative mx-auto grid h-14 w-14 place-items-center rounded-full border border-focus/50 bg-page text-accent-ink shadow-[0_0_30px_rgb(43_189_239/0.3)]">
              <GraduationCap className="h-7 w-7" strokeWidth={1.7} />
            </span>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight md:text-5xl">
              ${usd.format(FREE_VALUE)} USD en cursos. <span className="rounded-2xl bg-lime px-3 text-navy">Para ti, $0.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-bold text-fg/80 md:text-lg">
              Las {FREE_COUNT} clases vienen incluidas en tu suscripción. Solo pagas la plataforma.
            </p>
          </Reveal>
          <div className="mt-10 xl:grid xl:grid-cols-[200px_1fr] xl:items-end xl:gap-6">
            <div className="hidden xl:block">
              <PageMascot pose="senala" kicker="Sin costo" text={`Las ${FREE_COUNT} clases son gratis`} className="ml-0 w-[190px]" />
            </div>
            <SavingsCalculator items={SAVINGS} planFrom={PLAN_FROM} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Resources() {
  const dark = useBrandDark();
  return (
    <section id="recursos" className="relative overflow-hidden">
      <div className="relative mx-auto grid min-w-0 max-w-[1400px] items-center gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal from="blur" className="min-w-0">
          <Kicker>Aprende · Aplica · Haz crecer tu negocio</Kicker>
          <h2 className="mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
            En Focus Academy{" "}
            <span className="text-accent-ink">aprendes todo lo que necesitas para atraer, gestionar y vender más.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/85">
            De nada te sirve automatizar <strong>tus leads</strong> si no tienes leads que gestionar. Por eso, aquí aprenderás a <strong>llenar</strong> tu WhatsApp de leads
            potenciales. Te enseñamos desde la creación de copys hasta la automatización en el CRM.
          </p>
          <a
            href="#clases"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-focus px-8 py-4 text-lg font-extrabold text-navy shadow-[0_0_28px_rgb(43_189_239/0.4)] transition hover:-translate-y-0.5"
          >
            Explora las clases gratis
            <ArrowRight className="h-5 w-5" />
          </a>
          <ToolPills className="mt-12" />
        </Reveal>
        <Reveal from="blur" delay={150} className="min-w-0">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-gradient-to-br from-focus/20 via-focus/5 to-lime/15 blur-2xl" />
            <ParticleMorph
              src="/brand/logo-chat-v-white.png"
              label="Logo de Focus"
              ink={dark ? "light" : "ink"}
              className="relative h-[280px] w-full sm:h-[360px]"
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
  const openCommunity = useCallback(() => openExternal(FOCUS_COMMUNITY_URL), []);

  return (
    <BrandPage title="Focus Academy · Aprende, aplica y haz crecer tu negocio" sections={SECTIONS}>
      <main className="relative z-10">
        <Hero />
        <Resources />
        <Testimonials
          items={TESTIMONIALS}
          title={
            <>
              Casos de éxito de <span className="text-accent-ink">estudiantes</span>
            </>
          }
          note="Aquí subiremos el video de este estudiante más adelante."
        />
        <DarkFaq
          id="soporte"
          subtitle="Preguntas o información sobre la academia y tu suscripción"
          items={FAQ}
          mascot={<PageMascot pose="perfil-azul" kicker="¿Dudas?" text="Aquí te respondo" className="w-[150px]" />}
        />
      </main>
      <SiteFooter onWhatsApp={openCommunity} />
      <WhatsAppChat open={whatsappOpen} onOpen={openWhatsApp} onClose={closeWhatsApp} community />
    </BrandPage>
  );
}
