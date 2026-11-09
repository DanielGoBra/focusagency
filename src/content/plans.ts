export type PlanTone = "glass" | "featured" | "gold";

export type Plan = {
  id: string;
  name: string;
  tone: PlanTone;
  price?: string;
  period?: string;
  eyebrow?: string;
  recommended?: boolean;
  trial?: boolean;
  headline?: string;
  summary?: string;
  features: string[];
  note?: string;
  cta: string;
  href?: string;
  /** Abre el formulario de correo con este mensaje en vez de ir a un enlace. */
  contactMessage?: string;
};

/** Plataforma de Focus Chat: los planes con precio llevan al ingreso. */
export const FOCUS_CHAT_LOGIN = "https://chat.focuschat.co/login";

export const PLANS: Plan[] = [
  {
    id: "trial",
    name: "Prueba Gratis",
    tone: "glass",
    trial: true,
    price: "0",
    period: "/ Mes",
    summary: "Acceso a todas las características avanzadas",
    features: [
      "No se requiere tarjeta de crédito",
      "1 bot incluido",
      "200 contactos",
      "1 usuario incluido",
      "Conversaciones ilimitadas",
      "CRM integrado",
      "Acceso a características PRO",
      "Focus Academy",
      "Soporte vía email",
    ],
    cta: "Empieza gratis",
    href: FOCUS_CHAT_LOGIN,
  },
  {
    id: "essential",
    name: "Plan Essential",
    tone: "glass",
    price: "$79",
    period: "USD / mes",
    features: ["1 bot incluido", "1.000 usuarios", "5 miembros incluidos", "1.000 chats", "Conversaciones ilimitadas", "CRM integrado", "Focus Academy", "Soporte por WhatsApp"],
    cta: "Empieza ahora",
    href: FOCUS_CHAT_LOGIN,
  },
  {
    id: "business-lite",
    name: "Business Lite",
    tone: "featured",
    price: "$145",
    period: "USD / mes",
    recommended: true,
    features: ["1 bot incluido", "10.000 usuarios", "5 miembros incluidos", "10.000 chats", "Conversaciones ilimitadas", "CRM integrado", "Funciones PRO", "Focus Academy", "Soporte por WhatsApp"],
    cta: "Empieza ahora",
    href: FOCUS_CHAT_LOGIN,
  },
  {
    id: "premium",
    name: "Plan Premium",
    tone: "glass",
    price: "$190",
    period: "USD / mes",
    features: ["5 bots incluidos", "11.000 usuarios", "5 miembros incluidos", "11.000 chats", "Conversaciones ilimitadas", "CRM integrado", "Funciones PRO", "Focus Academy", "Soporte por WhatsApp", "Llamada individual uno a uno"],
    cta: "Empieza ahora",
    href: FOCUS_CHAT_LOGIN,
  },
  {
    id: "gold",
    name: "Business GOLD",
    tone: "gold",
    eyebrow: "Plan personalizado",
    headline: "Un plan a la medida de tu negocio",
    summary: "Agenda una asesoría personalizada y definamos juntos lo que tu negocio necesita.",
    features: ["Bots y usuarios adaptados a tu operación", "Funcionalidades según tus necesidades", "Configuración completa por nuestro equipo", "Focus Academy"],
    note: "¿Prefieres dejarlo en nuestras manos? Podemos configurar tu agente de IA y dejarlo listo para atender a tus clientes.",
    cta: "Agenda tu asesoría",
    contactMessage: "Hola, quiero agendar una asesoría para el plan Business GOLD.",
  },
];

export const PLAN_RATE = "Precios aproximados en USD · Tasa de referencia: 1 USD = 3.192.53 COP · 22/09/2026";

export const PLAN_EVENT = "focus-plan";

export function choosePlan(plan: Plan) {
  window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: plan.name }));
}
