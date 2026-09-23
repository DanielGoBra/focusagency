import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHub } from "../store";
import { STAGES, type Channel, type Lead, type Stage } from "../types";

const CHANNELS: Channel[] = ["WhatsApp", "Instagram", "Meta Ads", "Web"];

const empty = (): Lead => ({
  id: crypto.randomUUID(),
  name: "",
  company: "",
  role: "Contacto",
  channel: "WhatsApp",
  stage: "nuevo",
  value: 0,
  score: 70,
  owner: "Valentina R.",
  waitingHuman: true,
  waitingMinutes: 1,
  updated: "Ahora",
});

export function LeadDialog() {
  const { data, selectedLeadId, selectLead, upsertLead, deleteLead, moveLead } = useHub();
  const navigate = useNavigate();
  const creating = selectedLeadId === "new";
  const existing = data.leads.find((item) => item.id === selectedLeadId);
  const [draft, setDraft] = useState<Lead | null>(null);

  useEffect(() => {
    if (creating) setDraft(empty());
    else if (existing) setDraft(existing);
    else setDraft(null);
  }, [creating, existing]);

  useEffect(() => {
    if (!draft) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") selectLead(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft, selectLead]);

  if (!selectedLeadId || !draft) return null;

  function set<K extends keyof Lead>(key: K, value: Lead[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  function save() {
    if (!draft || !draft.name.trim() || !draft.company.trim()) return;
    upsertLead({ ...draft, name: draft.name.trim(), company: draft.company.trim(), updated: "Ahora" });
    selectLead(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-4 sm:items-center" onClick={() => selectLead(null)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-title"
        className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-[28px] bg-white p-6 text-navy shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="lead-title" className="text-2xl font-extrabold">{creating ? "Nuevo lead" : "Editar lead"}</h2>
          <button type="button" onClick={() => selectLead(null)} className="rounded-full px-3 py-1 text-sm font-bold">Cerrar</button>
        </div>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <Field label="Nombre" value={draft.name} onChange={(value) => set("name", value)} />
          <Field label="Empresa" value={draft.company} onChange={(value) => set("company", value)} />
          <Field label="Rol" value={draft.role} onChange={(value) => set("role", value)} />
          <label className="text-sm font-bold">
            Canal
            <select className="mt-1 w-full rounded-2xl border border-navy/10 bg-paper px-3 py-2" value={draft.channel} onChange={(event) => set("channel", event.target.value as Channel)}>
              {CHANNELS.map((channel) => <option key={channel}>{channel}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold">
            Etapa
            <select className="mt-1 w-full rounded-2xl border border-navy/10 bg-paper px-3 py-2" value={draft.stage} onChange={(event) => set("stage", event.target.value as Stage)}>
              {STAGES.map((stage) => <option key={stage.id} value={stage.id}>{stage.label}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm font-bold">
              Valor COP
              <input className="mt-1 w-full rounded-2xl border border-navy/10 bg-paper px-3 py-2" type="number" min={0} value={draft.value} onChange={(event) => set("value", Number(event.target.value))} />
            </label>
            <label className="text-sm font-bold">
              Score
              <input className="mt-1 w-full rounded-2xl border border-navy/10 bg-paper px-3 py-2" type="number" min={0} max={100} value={draft.score} onChange={(event) => set("score", Number(event.target.value))} />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={draft.waitingHuman} onChange={(event) => set("waitingHuman", event.target.checked)} />
            Esperando a una persona
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="submit" className="rounded-full bg-lime px-4 py-2 text-sm font-bold text-navy">Guardar</button>
            {!creating && (
              <button type="button" className="rounded-full bg-paper px-4 py-2 text-sm font-bold" onClick={() => navigate(`/hub/bandeja?lead=${draft.id}`)}>
                Abrir chat
              </button>
            )}
            {!creating && (
              <button type="button" className="rounded-full px-4 py-2 text-sm font-bold text-navy/70" onClick={() => deleteLead(draft.id)}>
                Eliminar
              </button>
            )}
          </div>
          {!creating && (
            <div className="flex flex-wrap gap-2 pt-2">
              {STAGES.map((stage) => (
                <button key={stage.id} type="button" onClick={() => moveLead(draft.id, stage.id)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${draft.stage === stage.id ? "bg-navy text-white" : "bg-paper"}`}>
                  {stage.label}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-bold">
      {label}
      <input className="mt-1 w-full rounded-2xl border border-navy/10 bg-paper px-3 py-2 font-medium" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function Notice() {
  const { notice } = useHub();
  if (!notice) return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-full bg-navy px-4 py-2 text-sm font-bold text-white shadow-lg">
      {notice}
    </div>
  );
}
