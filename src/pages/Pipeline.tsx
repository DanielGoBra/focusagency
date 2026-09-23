import { useEffect, useState } from "react";
import { cop } from "../lib/format";
import { useHub, useVisibleLeads } from "../store";
import { STAGES, type Stage } from "../types";

export function Pipeline() {
  const { moveLead, selectLead, focusMode } = useHub();
  const leads = useVisibleLeads();
  const [over, setOver] = useState<Stage | null>(null);

  useEffect(() => {
    document.title = "Pipeline · Focus Hub";
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Pipeline</h1>
          <p className="font-soft text-lg font-bold text-navy/80">Arrastra una tarjeta, cambia la etapa o crea un lead.</p>
        </div>
        <button type="button" onClick={() => selectLead("new")} className="rounded-full bg-lime px-4 py-2 text-sm font-bold text-navy">
          Nuevo lead
        </button>
      </div>
      {focusMode && (
        <p className="rounded-2xl bg-lime px-4 py-3 text-sm font-bold">Modo foco: ocultamos lo que puede esperar.</p>
      )}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const column = leads.filter((lead) => lead.stage === stage.id);
          const total = column.reduce((sum, lead) => sum + lead.value, 0);
          return (
            <section
              key={stage.id}
              className={`w-[270px] shrink-0 rounded-[28px] bg-white p-3 ${over === stage.id ? "ring-2 ring-focus" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setOver(stage.id);
              }}
              onDragLeave={() => setOver((current) => (current === stage.id ? null : current))}
              onDrop={(event) => {
                event.preventDefault();
                const id = event.dataTransfer.getData("text/plain");
                if (id) moveLead(id, stage.id);
                setOver(null);
              }}
            >
              <header className="px-2 py-2">
                <h2 className="font-extrabold">{stage.label}</h2>
                <p className="text-xs text-navy/60">{column.length} · {cop(total)}</p>
              </header>
              <div className="space-y-2">
                {column.map((lead) => (
                  <article
                    key={lead.id}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/plain", lead.id)}
                    className="cursor-grab rounded-3xl bg-paper p-3 active:cursor-grabbing"
                  >
                    <button type="button" onClick={() => selectLead(lead.id)} className="w-full text-left">
                      <span className="flex items-start justify-between gap-2">
                        <span>
                          <span className="block font-bold">{lead.name}</span>
                          <span className="text-xs text-navy/65">{lead.company}</span>
                        </span>
                        <span className="rounded-full bg-white px-2 py-1 text-xs font-extrabold">{lead.score}</span>
                      </span>
                    </button>
                    <p className="mt-2 text-sm font-bold">{cop(lead.value)}</p>
                    <p className="text-xs text-navy/60">{lead.channel}{lead.waitingHuman ? " · espera persona" : ""}</p>
                    <label className="mt-2 block text-[11px] font-bold text-navy/50">
                      Etapa
                      <select
                        value={lead.stage}
                        onChange={(event) => moveLead(lead.id, event.target.value as Stage)}
                        className="mt-1 w-full rounded-xl border border-navy/10 bg-white px-2 py-1.5 text-sm font-bold text-navy"
                      >
                        {STAGES.map((option) => (
                          <option key={option.id} value={option.id}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
