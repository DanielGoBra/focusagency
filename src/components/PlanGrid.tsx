import { Link } from "react-router-dom";
import { stagger } from "motion";
import { motion, useReducedMotion } from "motion/react";
import { PLANS, choosePlan, type Plan } from "../content/plans";

function Check({ light = false, neon = false }: { light?: boolean; neon?: boolean }) {
  const fill = neon ? "#1efa5d" : light ? "#3ef3ff" : "#2ecfff";
  const stroke = neon || light ? "#071428" : "white";
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0">
      <circle cx="10" cy="10" r="9" fill={fill} />
      <path d="M6 10.2 8.6 12.8 14 7.4" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppMark() {
  return (
    <span className="plan-wa-plain">
      <img src="/brand/whatsapp-icon.png" alt="" className="plan-wa-photo" />
    </span>
  );
}

function PlanTitle({ name, light = false }: { name: string; light?: boolean }) {
  const [lead, ...rest] = name.split(" ");
  return (
    <h3 className={`leading-none font-extrabold tracking-tight ${light ? "text-[1.7rem]" : "text-[1.55rem]"}`}>
      <span className={light ? "text-white" : "text-[#14245c]"}>{lead}</span>
      {rest.length > 0 && <span className="text-[#1ec8f2]"> {rest.join(" ")}</span>}
    </h3>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const featured = plan.tone === "featured";
  const light = featured;
  const trial = plan.trial;

  return (
    <article
      className={`plan-card ${trial ? "plan-card-trial" : featured ? "plan-card-featured" : "plan-card-glass"} ${plan.tone === "gold" ? "plan-card-gold" : ""}`}
    >
      {plan.recommended && (
        <div className="recommended-tab">
          Recomendado <span className="star">★</span>
        </div>
      )}
      {trial ? (
        <p className="trial-kicker">Empieza hoy</p>
      ) : null}
      {trial ? (
        <>
          <h3 className="mt-3 text-center text-[1.65rem] leading-none font-extrabold tracking-tight text-white">
            Prueba <span className="text-[#3ef3ff]">Gratis</span>
          </h3>
          {plan.summary && <p className="mt-2 text-center text-[13px] leading-snug text-white/75">{plan.summary}</p>}
        </>
      ) : (
        <PlanTitle name={plan.name} light={light} />
      )}
      {plan.eyebrow && <p className="mt-3 text-xs font-extrabold tracking-[0.16em] text-[#1aa8d6] uppercase">{plan.eyebrow}</p>}
      {trial ? (
        <p className="mt-4 flex items-end justify-center gap-1 leading-none text-white">
          <span className="mb-2 text-2xl font-extrabold">$</span>
          <span className="text-7xl font-extrabold tracking-tight text-[#3ef3ff]">0</span>
          <span className="mb-2 text-xl font-extrabold">/ Mes</span>
        </p>
      ) : plan.price ? (
        <p className="mt-3 leading-none">
          <span className={`font-extrabold tracking-tight ${light ? "text-5xl text-[#3ad7ff]" : "text-4xl text-[#19b7e6]"}`}>{plan.price}</span>
          <span className={`mt-1 block text-xs font-bold ${light ? "text-white/75" : "text-[#14245c]/65"}`}>{plan.period}</span>
        </p>
      ) : (
        <p className="mt-2 text-2xl leading-tight font-extrabold tracking-tight text-[#14245c]">{plan.headline}</p>
      )}
      {plan.summary && !trial && <p className="mt-2 text-[13px] leading-snug text-[#14245c]/75">{plan.summary}</p>}
      <ul className="mt-3 space-y-1.5">
        {plan.features.map((feature) => (
          <li key={feature} className={`flex items-start gap-2 text-[13px] leading-snug font-semibold ${light || trial ? "text-white" : "text-[#14245c]"}`}>
            <Check light={light} neon={trial} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {plan.note && <p className="plan-note">{plan.note}</p>}
      <a
        href={plan.href ?? "#contacto"}
        onClick={plan.href ? undefined : () => choosePlan(plan)}
        className={`plan-cta ${trial ? "plan-cta-trial" : featured || plan.tone === "gold" ? "plan-cta-solid" : "plan-cta-ghost"} ${plan.tone === "gold" ? "plan-cta-gold" : ""}`}
      >
        {plan.cta}
        {plan.tone === "gold" && (
          <span className="plan-wa-mini">
            <WhatsAppMark />
          </span>
        )}
      </a>
    </article>
  );
}

const planList = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.07) } },
};

const planItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
  hover: { y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function PlanGrid() {
  const reduce = useReducedMotion();
  return (
    <section id="planes" aria-labelledby="planes-titulo" className="plan-stage relative z-10 px-4 py-14 text-[#14245c] sm:px-6 md:py-16 lg:px-10">
      <div className="relative mx-auto w-full">
        <div className="plan-head">
          <p className="plan-brand">
            <img src="/brand/focu-bulb.png?v=2" alt="" className="plan-mark" />
            <span className="text-xl font-extrabold tracking-wide text-[#14245c]">FOCUS CHAT</span>
            <span className="rounded-md bg-[#16325c] px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white">CRM</span>
          </p>
          <div className="text-center">
            <h2 id="planes-titulo" className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              Planes que crecen contigo
            </h2>
            <p className="plan-academy mt-3 text-lg font-semibold text-[#14245c]">
              Todos los planes incluyen{" "}
              <Link
                to="/academy"
                className="inline-flex rounded-full border-2 border-[#d4a017] bg-white px-4 py-1.5 font-extrabold text-[#14245c] shadow-[0_0_18px_rgb(212_160_23_/_0.35)]"
              >
                Focus Academy
              </Link>{" "}
              gratis
            </p>
          </div>
          <span className="plan-wa-sticker">
            <WhatsAppMark />
          </span>
        </div>
        <p className="plan-kicker mt-3 text-center text-lg text-[#14245c]/70">Elige el plan ideal para tu negocio</p>
        <motion.div
          className="mt-8 grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-5"
          initial={reduce ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={planList}
        >
          {PLANS.map((plan) => (
            <motion.div key={plan.id} className="plan-gold-slot" variants={planItem} whileHover={reduce ? undefined : "hover"}>
              <PlanCard plan={plan} />
            </motion.div>
          ))}
        </motion.div>
        <p className="plan-kicker mt-8 text-center text-sm">
          <Link to="/terminos#condiciones" className="font-extrabold underline decoration-[#d4a017] underline-offset-4">
            Términos y condiciones
          </Link>
          <span aria-hidden="true"> · </span>
          <Link to="/terminos#privacidad" className="font-extrabold underline decoration-[#d4a017] underline-offset-4">
            Política de privacidad
          </Link>
        </p>
      </div>
    </section>
  );
}
