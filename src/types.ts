export type Stage =
  | "nuevo"
  | "conversacion"
  | "calificado"
  | "propuesta"
  | "ganado";

export type Channel = "WhatsApp" | "Instagram" | "Meta Ads" | "Web";

export type Lead = {
  id: string;
  name: string;
  company: string;
  role: string;
  channel: Channel;
  stage: Stage;
  value: number;
  score: number;
  owner: string;
  campaign?: string;
  waitingHuman: boolean;
  waitingMinutes: number;
  updated: string;
};

export type Message = {
  id: string;
  from: "lead" | "bot" | "agent";
  text: string;
  at: string;
};

export type Conversation = {
  id: string;
  leadId: string;
  unread: boolean;
  messages: Message[];
};

export type Campaign = {
  id: string;
  name: string;
  client: string;
  objective: string;
  spend: number;
  leads: number;
  clicks: number;
  impressions: number;
  revenue: number;
  active: boolean;
};

export type StepKind = "mensaje" | "pregunta" | "espera" | "asignar" | "webhook";

export type FlowStep = {
  id: string;
  kind: StepKind;
  text: string;
};

export type Flow = {
  id: string;
  name: string;
  trigger: string;
  channel: string;
  runsToday: number;
  success: number;
  enabled: boolean;
  lastError?: string;
  steps: FlowStep[];
};

export type Integration = {
  id: string;
  name: string;
  category: string;
  detail: string;
  connected: boolean;
};

export type HubData = {
  leads: Lead[];
  conversations: Conversation[];
  campaigns: Campaign[];
  flows: Flow[];
  integrations: Integration[];
};

export const STEP_KINDS: { id: StepKind; label: string }[] = [
  { id: "mensaje", label: "Mensaje" },
  { id: "pregunta", label: "Pregunta" },
  { id: "espera", label: "Espera" },
  { id: "asignar", label: "Asignar" },
  { id: "webhook", label: "Webhook" },
];

export const STAGES: { id: Stage; label: string }[] = [
  { id: "nuevo", label: "Nuevo" },
  { id: "conversacion", label: "En conversación" },
  { id: "calificado", label: "Calificado" },
  { id: "propuesta", label: "Propuesta" },
  { id: "ganado", label: "Ganado" },
];

export function stageLabel(stage: Stage) {
  return STAGES.find((item) => item.id === stage)?.label ?? stage;
}
