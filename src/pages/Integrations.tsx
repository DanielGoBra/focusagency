import { useEffect } from "react";
import { useHub } from "../store";

const TONE: Record<string, string> = {
  Conversaciones: "bg-focus",
  Pauta: "bg-lime",
  Datos: "bg-mist",
  Agenda: "bg-navy text-white",
};

export function Integrations() {
  const { data, toggleIntegration } = useHub();

  useEffect(() => {
    document.title = "Integraciones · Focus Hub";
  }, []);

  const connected = data.integrations.filter((item) => item.connected).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Integraciones</h1>
        <p className="font-soft text-lg font-bold text-navy/80">{connected} de {data.integrations.length} conectadas en esta demo.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.integrations.map((item) => (
          <article key={item.id} className="rounded-[28px] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${TONE[item.category] ?? "bg-paper"}`}>{item.category}</p>
                <h2 className="mt-3 text-2xl font-extrabold">{item.name}</h2>
                <p className="mt-1 text-sm text-navy/70">{item.detail}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={item.connected}
                aria-label={`${item.connected ? "Desconectar" : "Conectar"} ${item.name}`}
                onClick={() => toggleIntegration(item.id)}
                className={`relative h-7 w-12 shrink-0 rounded-full ${item.connected ? "bg-lime" : "bg-mist"}`}
              >
                <span className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-navy transition ${item.connected ? "translate-x-5" : ""}`} />
              </button>
            </div>
            <p className="mt-4 text-sm font-bold">{item.connected ? "Conectada · recibiendo eventos de la demo" : "Desconectada"}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
