import { useEffect, useMemo } from "react";
import { ChannelValueChart, WeeklyChatsChart } from "../components/Charts";
import { WEEK } from "../data";
import { cop, cpl } from "../lib/format";
import { useHub } from "../store";
import type { Channel } from "../types";

const CHANNELS: Channel[] = ["WhatsApp", "Instagram", "Meta Ads", "Web"];

export function Intel() {
  const { data } = useHub();
  const byChannel = useMemo(
    () =>
      CHANNELS.map((channel) => ({
        channel,
        count: data.leads.filter((lead) => lead.channel === channel).length,
        value: data.leads.filter((lead) => lead.channel === channel).reduce((sum, lead) => sum + lead.value, 0),
      })),
    [data.leads],
  );
  const best = [...data.campaigns].filter((campaign) => campaign.leads > 0).sort(
    (a, b) => cpl(a.spend, a.leads) - cpl(b.spend, b.leads),
  )[0];
  const proposals = data.leads.filter((lead) => lead.stage === "propuesta");
  const botMessages = data.conversations.reduce(
    (sum, conversation) => sum + conversation.messages.filter((message) => message.from === "bot").length,
    0,
  );
  const allMessages = data.conversations.reduce((sum, conversation) => sum + conversation.messages.length, 0);
  const botShare = allMessages ? Math.round((botMessages / allMessages) * 100) : 0;

  useEffect(() => {
    document.title = "Inteligencia · Focus Hub";
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Inteligencia</h1>
        <p className="font-soft text-lg font-bold text-navy/80">De la conversación al canal, sin un reporte aparte.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <article className="rounded-[28px] bg-navy p-5 text-white">
          <p className="text-xs font-bold tracking-[0.14em] text-lime">MEJOR COSTO</p>
          <p className="mt-2 text-2xl font-extrabold">{best?.name}</p>
          <p className="mt-1 text-sm text-white/75">{best ? cop(cpl(best.spend, best.leads)) : "—"} por lead</p>
        </article>
        <article className="rounded-[28px] bg-white p-5">
          <p className="text-xs font-bold tracking-[0.14em] text-navy/55">EN PROPUESTA</p>
          <p className="mt-2 text-2xl font-extrabold">{proposals.length} cuentas</p>
          <p className="mt-1 text-sm text-navy/70">{proposals.map((lead) => lead.company).join(" · ") || "Ninguna"}</p>
        </article>
        <article className="rounded-[28px] bg-white p-5">
          <p className="text-xs font-bold tracking-[0.14em] text-navy/55">MENSAJES DEL BOT</p>
          <p className="mt-2 text-2xl font-extrabold">{botShare}%</p>
          <p className="mt-1 text-sm text-navy/70">Del total de la bandeja de ejemplo.</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[28px] bg-white p-6">
          <h2 className="font-extrabold">Conversaciones de la semana</h2>
          <p className="mb-4 text-sm text-navy/60">Cuántas entraron cada día y cuántas terminaron calificadas.</p>
          <WeeklyChatsChart rows={WEEK} />
        </article>
        <article className="rounded-[28px] bg-white p-6">
          <h2 className="font-extrabold">Origen del pipeline</h2>
          <p className="mb-4 text-sm text-navy/60">Valor abierto por canal de entrada. Pasa el cursor para ver los leads.</p>
          <ChannelValueChart rows={byChannel} height={284} />
        </article>
      </section>
    </div>
  );
}
