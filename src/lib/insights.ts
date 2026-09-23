import type { HubData, Lead } from "../types";
import { cop, roas } from "./format";

export function matchesLead(lead: Lead, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [lead.name, lead.company, lead.channel, lead.owner, lead.campaign ?? ""]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function isPriority(lead: Lead) {
  return lead.stage !== "ganado" && (lead.score >= 80 || lead.waitingHuman);
}

export function buildPulse(data: HubData) {
  const waiting = data.leads
    .filter((lead) => lead.waitingHuman && lead.stage !== "ganado")
    .sort((a, b) => b.score - a.score);
  const active = data.campaigns.filter((campaign) => campaign.active);
  const spend = active.reduce((sum, campaign) => sum + campaign.spend, 0);
  const revenue = active.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const broken = data.flows.filter((flow) => flow.enabled && flow.lastError);
  const openPipeline = data.leads
    .filter((lead) => lead.stage !== "ganado")
    .reduce((sum, lead) => sum + lead.value, 0);

  const lines: string[] = [];
  if (waiting.length) {
    const top = waiting[0];
    const noun = waiting.length === 1 ? "conversación espera" : "conversaciones esperan";
    lines.push(
      `${waiting.length} ${noun} a una persona. ${top.name}, de ${top.company}, lleva ${top.waitingMinutes} min con score ${top.score}.`,
    );
  } else {
    lines.push("Ninguna conversación está esperando a una persona. El bot sostiene la bandeja.");
  }
  if (broken[0]?.lastError) {
    lines.push(`${broken[0].name}: ${broken[0].lastError}`);
  }
  lines.push(
    `Las campañas activas devuelven ${roas(revenue, spend).toFixed(1)}x sobre ${cop(spend)}. El pipeline abierto vale ${cop(openPipeline)}.`,
  );

  return { waiting, spend, revenue, returnMultiple: roas(revenue, spend), broken, openPipeline, lines };
}
