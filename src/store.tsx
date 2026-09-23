import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SEED } from "./data";
import { isPriority, matchesLead } from "./lib/insights";
import type { Flow, FlowStep, HubData, Lead, Stage } from "./types";

const KEY = "focus-hub-mvp-2";

type HubContextValue = {
  data: HubData;
  query: string;
  focusMode: boolean;
  selectedLeadId: string | null;
  notice: string | null;
  mobileNav: boolean;
  setQuery: (value: string) => void;
  toggleFocus: () => void;
  setMobileNav: (open: boolean) => void;
  selectLead: (id: string | null) => void;
  moveLead: (id: string, stage: Stage) => void;
  upsertLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  toggleCampaign: (id: string) => void;
  toggleFlow: (id: string) => void;
  saveFlow: (flow: Flow) => void;
  addStep: (flowId: string) => void;
  updateStep: (flowId: string, step: FlowStep) => void;
  removeStep: (flowId: string, stepId: string) => void;
  moveStep: (flowId: string, stepId: string, toIndex: number) => void;
  toggleIntegration: (id: string) => void;
  markRead: (conversationId: string) => void;
  reset: () => void;
};

const HubContext = createContext<HubContextValue | null>(null);

function loadData(): HubData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(SEED);
    const parsed = JSON.parse(raw) as HubData;
    if (!Array.isArray(parsed.leads) || !Array.isArray(parsed.conversations) || !Array.isArray(parsed.integrations)) {
      return structuredClone(SEED);
    }
    return {
      ...parsed,
      flows: parsed.flows.map((flow) => ({ ...flow, steps: flow.steps ?? [] })),
    };
  } catch {
    return structuredClone(SEED);
  }
}

export function HubProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<HubData>(loadData);
  const [query, setQuery] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const flash = (message: string) => {
    if (timer.current) window.clearTimeout(timer.current);
    setNotice(message);
    timer.current = window.setTimeout(() => setNotice(null), 2600);
  };

  const value = useMemo<HubContextValue>(
    () => ({
      data,
      query,
      focusMode,
      selectedLeadId,
      notice,
      mobileNav,
      setQuery,
      toggleFocus: () => setFocusMode((on) => !on),
      setMobileNav,
      selectLead: setSelectedLeadId,
      moveLead: (id, stage) => {
        setData((current) => ({
          ...current,
          leads: current.leads.map((lead) =>
            lead.id === id
              ? {
                  ...lead,
                  stage,
                  updated: "Ahora",
                  waitingHuman: stage === "ganado" ? false : lead.waitingHuman,
                }
              : lead,
          ),
        }));
        const lead = data.leads.find((item) => item.id === id);
        flash(`${lead?.name ?? "Lead"} cambió de etapa.`);
      },
      upsertLead: (lead) => {
        const exists = data.leads.some((item) => item.id === lead.id);
        setData((current) => ({
          ...current,
          leads: exists
            ? current.leads.map((item) => (item.id === lead.id ? lead : item))
            : [lead, ...current.leads],
          conversations: exists
            ? current.conversations
            : [
                {
                  id: crypto.randomUUID(),
                  leadId: lead.id,
                  unread: true,
                  messages: [
                    {
                      id: crypto.randomUUID(),
                      from: "bot" as const,
                      text: `Hola ${lead.name.split(" ")[0]}, soy el asistente de Focus. Cuéntame qué necesitas y lo dejo listo para el equipo.`,
                      at: new Date().toISOString(),
                    },
                  ],
                },
                ...current.conversations,
              ],
        }));
        flash(exists ? "Lead actualizado." : "Lead creado y la bienvenida ya quedó en la bandeja.");
      },
      deleteLead: (id) => {
        const lead = data.leads.find((item) => item.id === id);
        setData((current) => ({
          ...current,
          leads: current.leads.filter((item) => item.id !== id),
          conversations: current.conversations.filter((item) => item.leadId !== id),
        }));
        setSelectedLeadId(null);
        flash(`${lead?.name ?? "Lead"} salió del pipeline.`);
      },
      sendMessage: (conversationId, text) => {
        const clean = text.trim();
        if (!clean) return;
        setData((current) => {
          const conversation = current.conversations.find((item) => item.id === conversationId);
          return {
            ...current,
            conversations: current.conversations.map((item) =>
              item.id === conversationId
                ? {
                    ...item,
                    unread: false,
                    messages: [
                      ...item.messages,
                      {
                        id: crypto.randomUUID(),
                        from: "agent" as const,
                        text: clean,
                        at: new Date().toISOString(),
                      },
                    ],
                  }
                : item,
            ),
            leads: current.leads.map((lead) => {
              if (lead.id !== conversation?.leadId) return lead;
              return {
                ...lead,
                waitingHuman: false,
                waitingMinutes: 0,
                updated: "Ahora",
                stage: lead.stage === "nuevo" ? "conversacion" : lead.stage,
                owner: lead.owner === "Focus Bot" ? "Valentina R." : lead.owner,
              };
            }),
          };
        });
        flash("Respuesta enviada. El lead ya no espera a una persona.");
      },
      toggleCampaign: (id) => {
        const campaign = data.campaigns.find((item) => item.id === id);
        if (!campaign) return;
        const nextActive = !campaign.active;
        setData((current) => ({
          ...current,
          campaigns: current.campaigns.map((item) =>
            item.id === id ? { ...item, active: nextActive } : item,
          ),
        }));
        flash(`${campaign.name} ${nextActive ? "activa" : "en pausa"}.`);
      },
      toggleFlow: (id) => {
        const flow = data.flows.find((item) => item.id === id);
        if (!flow) return;
        const nextEnabled = !flow.enabled;
        setData((current) => ({
          ...current,
          flows: current.flows.map((item) =>
            item.id === id ? { ...item, enabled: nextEnabled } : item,
          ),
        }));
        flash(`${flow.name} ${nextEnabled ? "activado" : "apagado"}.`);
      },
      saveFlow: (flow) => {
        const exists = data.flows.some((item) => item.id === flow.id);
        setData((current) => ({
          ...current,
          flows: exists
            ? current.flows.map((item) => (item.id === flow.id ? flow : item))
            : [flow, ...current.flows],
        }));
        if (!exists) flash("Flujo creado.");
      },
      addStep: (flowId) => {
        setData((current) => ({
          ...current,
          flows: current.flows.map((flow) =>
            flow.id === flowId
              ? {
                  ...flow,
                  steps: [...flow.steps, { id: crypto.randomUUID(), kind: "mensaje", text: "Nuevo paso" }],
                }
              : flow,
          ),
        }));
      },
      updateStep: (flowId, step) => {
        setData((current) => ({
          ...current,
          flows: current.flows.map((flow) =>
            flow.id === flowId
              ? { ...flow, steps: flow.steps.map((item) => (item.id === step.id ? step : item)) }
              : flow,
          ),
        }));
      },
      removeStep: (flowId, stepId) => {
        setData((current) => ({
          ...current,
          flows: current.flows.map((flow) =>
            flow.id === flowId ? { ...flow, steps: flow.steps.filter((step) => step.id !== stepId) } : flow,
          ),
        }));
      },
      moveStep: (flowId, stepId, toIndex) => {
        setData((current) => ({
          ...current,
          flows: current.flows.map((flow) => {
            if (flow.id !== flowId) return flow;
            const from = flow.steps.findIndex((step) => step.id === stepId);
            if (from < 0 || toIndex < 0 || toIndex >= flow.steps.length || from === toIndex) return flow;
            const steps = [...flow.steps];
            const [item] = steps.splice(from, 1);
            steps.splice(toIndex, 0, item);
            return { ...flow, steps };
          }),
        }));
      },
      toggleIntegration: (id) => {
        const integration = data.integrations.find((item) => item.id === id);
        if (!integration) return;
        const connected = !integration.connected;
        setData((current) => ({
          ...current,
          integrations: current.integrations.map((item) => (item.id === id ? { ...item, connected } : item)),
        }));
        flash(`${integration.name} ${connected ? "conectada" : "desconectada"}.`);
      },
      markRead: (conversationId) => {
        setData((current) => ({
          ...current,
          conversations: current.conversations.map((item) =>
            item.id === conversationId ? { ...item, unread: false } : item,
          ),
        }));
      },
      reset: () => {
        localStorage.removeItem(KEY);
        setData(structuredClone(SEED));
        setQuery("");
        setFocusMode(false);
        setSelectedLeadId(null);
        flash("Demo restablecida.");
      },
    }),
    [data, query, focusMode, selectedLeadId, notice, mobileNav],
  );

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}

export function useHub() {
  const context = useContext(HubContext);
  if (!context) throw new Error("useHub debe usarse dentro de HubProvider");
  return context;
}

export function useVisibleLeads() {
  const { data, query, focusMode } = useHub();
  return useMemo(
    () =>
      data.leads.filter((lead) => {
        if (!matchesLead(lead, query)) return false;
        if (focusMode && !isPriority(lead)) return false;
        return true;
      }),
    [data.leads, query, focusMode],
  );
}
