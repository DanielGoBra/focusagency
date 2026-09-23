import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { clock } from "../lib/format";
import { useHub, useVisibleLeads } from "../store";

export function Inbox() {
  const { data, markRead, sendMessage, focusMode } = useHub();
  const leads = useVisibleLeads();
  const [params] = useSearchParams();
  const requestedLead = params.get("lead");
  const conversations = useMemo(
    () => data.conversations.filter((item) => leads.some((lead) => lead.id === item.leadId)),
    [data.conversations, leads],
  );
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    document.title = "Bandeja · Focus Hub";
  }, []);

  useEffect(() => {
    if (!requestedLead) return;
    const match = conversations.find((item) => item.leadId === requestedLead);
    if (match) {
      setActiveId(match.id);
      setShowList(false);
    }
  }, [requestedLead, conversations]);

  useEffect(() => {
    if (activeId && conversations.some((item) => item.id === activeId)) return;
    setActiveId(conversations[0]?.id ?? null);
  }, [conversations, activeId]);

  useEffect(() => {
    const current = data.conversations.find((item) => item.id === activeId);
    if (current?.unread) markRead(current.id);
  }, [activeId, data.conversations, markRead]);

  const active = conversations.find((item) => item.id === activeId) ?? null;
  const lead = leads.find((item) => item.id === active?.leadId);

  function submit() {
    if (!active) return;
    sendMessage(active.id, draft);
    setDraft("");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Bandeja</h1>
        <p className="font-soft text-lg font-bold text-navy/80">El bot sostiene. Una persona entra cuando el score lo pide.</p>
      </div>
      {conversations.length === 0 ? (
        <p className="rounded-[28px] bg-white p-6 text-sm">
          {focusMode ? "El modo foco no dejó conversaciones en esta búsqueda." : "No hay conversaciones para esta búsqueda."}
        </p>
      ) : (
        <div className="grid overflow-hidden rounded-[28px] bg-white md:h-[640px] md:grid-cols-[300px_1fr]">
          <div className={`${showList ? "block" : "hidden"} overflow-auto border-b border-navy/10 md:block md:border-r md:border-b-0`}>
            {conversations.map((conversation) => {
              const person = data.leads.find((item) => item.id === conversation.leadId);
              const last = conversation.messages.at(-1);
              const selected = conversation.id === activeId;
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => {
                    setActiveId(conversation.id);
                    setShowList(false);
                  }}
                  className={`block w-full border-b border-navy/5 px-4 py-4 text-left ${selected ? "bg-paper" : "bg-white"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-bold">{person?.name}</span>
                    {person?.waitingHuman && <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-bold">Espera</span>}
                  </span>
                  <span className="mt-1 block truncate text-sm text-navy/65">{last?.text}</span>
                </button>
              );
            })}
          </div>
          {active && lead && (
            <div className={`${showList ? "hidden" : "flex"} min-h-[70vh] flex-col md:flex md:min-h-0`}>
              <div className="flex items-center gap-3 border-b border-navy/10 px-4 py-3">
                <button type="button" className="text-sm font-bold md:hidden" onClick={() => setShowList(true)}>
                  Volver
                </button>
                <div className="min-w-0">
                  <p className="font-extrabold">{lead.name}</p>
                  <p className="truncate text-sm text-navy/65">{lead.company} · {lead.channel} · score {lead.score}</p>
                </div>
              </div>
              <div className="flex-1 space-y-3 overflow-auto px-4 py-4">
                {active.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.from === "lead" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm ${bubble(message.from)}`}>
                      <p className="text-[11px] font-bold tracking-wide uppercase opacity-70">{author(message.from)}</p>
                      <p className="mt-1">{message.text}</p>
                      <p className="mt-1 text-[11px] opacity-60">{clock(message.at)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form
                className="flex gap-2 border-t border-navy/10 p-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  submit();
                }}
              >
                <label className="sr-only" htmlFor="reply">Respuesta</label>
                <input
                  id="reply"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Responder como el equipo"
                  className="min-w-0 flex-1 rounded-full border border-navy/10 px-4 py-2.5 text-sm outline-none"
                />
                <button type="submit" className="rounded-full bg-navy px-4 py-2.5 text-sm font-bold text-white">
                  Enviar
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function bubble(from: "lead" | "bot" | "agent") {
  if (from === "lead") return "bg-paper text-navy";
  if (from === "bot") return "bg-focus/15 text-navy";
  return "bg-navy text-white";
}

function author(from: "lead" | "bot" | "agent") {
  if (from === "lead") return "Lead";
  if (from === "bot") return "Focus Bot";
  return "Equipo";
}
