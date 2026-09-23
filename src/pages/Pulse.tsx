import { useEffect } from "react";
import { Link } from "react-router-dom";
import { buildPulse } from "../lib/insights";
import { cop } from "../lib/format";
import { useHub, useVisibleLeads } from "../store";
import { stageLabel } from "../types";

export function Pulse() {
  const { data, focusMode, selectLead } = useHub();
  const leads = useVisibleLeads().filter((lead) => lead.stage !== "ganado");
  const pulse = buildPulse(data);
  const hot = [...leads].sort((a, b) => b.score - a.score).slice(0, 4);

  useEffect(() => {
    document.title = "Pulso · Focus Hub";
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.18em] text-focus uppercase">
        {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
      </p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Pulso</h1>
        <p className="font-soft text-lg font-bold text-navy/80">Lo que hoy pide una decisión.</p>
      </div>

      {focusMode && (
        <p className="rounded-2xl bg-lime px-4 py-3 text-sm font-bold">
          Modo foco activo: solo leads con score alto o esperando a una persona.
        </p>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Esperando persona" value={String(pulse.waiting.length)} hint="Conversaciones sin cierre humano" />
        <Metric label="Retorno activo" value={`${pulse.returnMultiple.toFixed(1)}x`} hint="Ingreso atribuido / inversión activa" />
        <Metric label="Pipeline abierto" value={cop(pulse.openPipeline)} hint="Todo lo que aún no está ganado" />
        <Metric label="Flujos con fallo" value={String(pulse.broken.length)} hint="Activos y con error reciente" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-[28px] bg-navy p-6 text-white">
          <p className="text-xs font-bold tracking-[0.16em] text-lime">LECTURA</p>
          <div className="mt-3 space-y-3">
            {pulse.lines.map((line) => (
              <p key={line} className="text-lg font-extralight leading-snug">{line}</p>
            ))}
          </div>
        </article>
        <article className="rounded-[28px] bg-white p-6">
          <h2 className="font-soft text-xl font-extrabold">Campañas vivas</h2>
          <ul className="mt-4 space-y-3">
            {data.campaigns.filter((campaign) => campaign.active).map((campaign) => (
              <li key={campaign.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-bold">{campaign.client}</span>
                <span className="text-navy/70">{cop(campaign.spend)}</span>
              </li>
            ))}
          </ul>
          <Link to="/hub/ads" className="mt-4 inline-block text-sm font-bold text-focus">Ver Meta Ads</Link>
        </article>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold">Prioridad</h2>
          <Link to="/hub/pipeline" className="text-sm font-bold text-focus">Abrir pipeline</Link>
        </div>
        {hot.length === 0 ? (
          <p className="rounded-[28px] bg-white p-6 text-sm text-navy/70">Nada coincide con la búsqueda o el modo foco.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {hot.map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => selectLead(lead.id)}
                className="rounded-[28px] bg-white p-5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold">{lead.name}</p>
                    <p className="text-sm text-navy/70">{lead.company} · {lead.channel}</p>
                  </div>
                  <span className="rounded-full bg-paper px-3 py-1 text-sm font-extrabold">{lead.score}</span>
                </div>
                <p className="mt-3 text-sm">
                  {stageLabel(lead.stage)} · {cop(lead.value)}
                  {lead.waitingHuman ? " · espera persona" : ""}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-[28px] bg-white p-5">
      <p className="text-xs font-bold tracking-[0.14em] text-navy/55 uppercase">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-navy/65">{hint}</p>
    </article>
  );
}
