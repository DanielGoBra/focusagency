import { useEffect, useState } from "react";
import { useHub } from "../store";
import { STEP_KINDS, type Flow, type StepKind } from "../types";

export function Flows() {
  const { data, toggleFlow, saveFlow, addStep, updateStep, removeStep, moveStep } = useHub();
  const [activeId, setActiveId] = useState(data.flows[0]?.id ?? "");
  const active = data.flows.find((flow) => flow.id === activeId) ?? data.flows[0];

  useEffect(() => {
    document.title = "Flujos · Focus Hub";
  }, []);

  function create() {
    const flow: Flow = {
      id: crypto.randomUUID(),
      name: "Flujo nuevo",
      trigger: "Define el disparador",
      channel: "WhatsApp",
      runsToday: 0,
      success: 100,
      enabled: false,
      steps: [{ id: crypto.randomUUID(), kind: "mensaje", text: "Primer mensaje del flujo" }],
    };
    saveFlow(flow);
    setActiveId(flow.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Flujos</h1>
          <p className="font-soft text-lg font-bold text-navy/80">Arma la secuencia, ordénala y enciéndela.</p>
        </div>
        <button type="button" onClick={create} className="rounded-full bg-lime px-4 py-2 text-sm font-bold text-navy">
          Nuevo flujo
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {data.flows.map((flow) => (
            <button
              key={flow.id}
              type="button"
              onClick={() => setActiveId(flow.id)}
              className={`w-full rounded-3xl p-4 text-left ${flow.id === active?.id ? "bg-navy text-white" : "bg-white"}`}
            >
              <span className="block font-extrabold">{flow.name}</span>
              <span className={`mt-1 block text-sm ${flow.id === active?.id ? "text-white/70" : "text-navy/60"}`}>
                {flow.steps.length} {flow.steps.length === 1 ? "paso" : "pasos"} · {flow.enabled ? "activo" : "apagado"}
              </span>
            </button>
          ))}
        </div>
        {active && (
          <article className="rounded-[28px] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <label className="min-w-[200px] flex-1 text-sm font-bold">
                Nombre
                <input
                  className="mt-1 w-full rounded-2xl border border-navy/10 bg-paper px-3 py-2 text-base"
                  value={active.name}
                  onChange={(event) => saveFlow({ ...active, name: event.target.value })}
                />
              </label>
              <button
                type="button"
                role="switch"
                aria-checked={active.enabled}
                onClick={() => toggleFlow(active.id)}
                className={`relative mt-6 h-7 w-12 rounded-full ${active.enabled ? "bg-lime" : "bg-mist"}`}
              >
                <span className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-navy transition ${active.enabled ? "translate-x-5" : ""}`} />
              </button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="text-sm font-bold">
                Disparador
                <input className="mt-1 w-full rounded-2xl border border-navy/10 bg-paper px-3 py-2" value={active.trigger} onChange={(event) => saveFlow({ ...active, trigger: event.target.value })} />
              </label>
              <label className="text-sm font-bold">
                Canal
                <input className="mt-1 w-full rounded-2xl border border-navy/10 bg-paper px-3 py-2" value={active.channel} onChange={(event) => saveFlow({ ...active, channel: event.target.value })} />
              </label>
            </div>
            {active.lastError && active.enabled && <p className="mt-4 rounded-2xl bg-paper px-3 py-3 text-sm">{active.lastError}</p>}
            <ol className="mt-5 space-y-3">
              {active.steps.map((step, index) => (
                <li
                  key={step.id}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData("text/plain", step.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const from = event.dataTransfer.getData("text/plain");
                    const fromIndex = active.steps.findIndex((item) => item.id === from);
                    if (fromIndex < 0 || fromIndex === index) return;
                    moveStep(active.id, from, index);
                  }}
                  className="rounded-3xl bg-paper p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-focus px-2 py-1 text-xs font-extrabold text-navy">{index + 1}</span>
                    <select
                      className="rounded-full bg-white px-3 py-1 text-sm font-bold"
                      value={step.kind}
                      onChange={(event) => updateStep(active.id, { ...step, kind: event.target.value as StepKind })}
                    >
                      {STEP_KINDS.map((kind) => <option key={kind.id} value={kind.id}>{kind.label}</option>)}
                    </select>
                    <span className="ml-auto flex gap-1">
                      <button type="button" className="rounded-full px-2 text-sm font-bold" onClick={() => moveStep(active.id, step.id, index - 1)} aria-label="Subir paso">↑</button>
                      <button type="button" className="rounded-full px-2 text-sm font-bold" onClick={() => moveStep(active.id, step.id, index + 1)} aria-label="Bajar paso">↓</button>
                      <button type="button" className="rounded-full px-2 text-sm font-bold" onClick={() => removeStep(active.id, step.id)} aria-label="Quitar paso">✕</button>
                    </span>
                  </div>
                  <textarea
                    className="mt-2 w-full rounded-2xl border border-navy/10 bg-white px-3 py-2 text-sm"
                    rows={2}
                    value={step.text}
                    onChange={(event) => updateStep(active.id, { ...step, text: event.target.value })}
                  />
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => addStep(active.id)} className="mt-4 rounded-full bg-navy px-4 py-2 text-sm font-bold text-white">
              Agregar paso
            </button>
          </article>
        )}
      </div>
    </div>
  );
}
