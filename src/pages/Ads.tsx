import { useEffect } from "react";
import { cop, cpl, ctr, num, roas } from "../lib/format";
import { useHub } from "../store";

export function Ads() {
  const { data, toggleCampaign } = useHub();
  const active = data.campaigns.filter((campaign) => campaign.active);
  const spend = active.reduce((sum, campaign) => sum + campaign.spend, 0);
  const leads = active.reduce((sum, campaign) => sum + campaign.leads, 0);
  const revenue = active.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const clicks = active.reduce((sum, campaign) => sum + campaign.clicks, 0);
  const impressions = active.reduce((sum, campaign) => sum + campaign.impressions, 0);

  useEffect(() => {
    document.title = "Meta Ads · Focus Hub";
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Meta Ads</h1>
        <p className="font-soft text-lg font-bold text-navy/80">Las cifras de arriba solo cuentan campañas activas.</p>
      </div>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Inversión activa" value={cop(spend)} />
        <Stat label="Leads" value={num(leads)} />
        <Stat label="Costo por lead" value={cop(cpl(spend, leads))} />
        <Stat label="Retorno" value={`${roas(revenue, spend).toFixed(1)}x`} />
      </section>
      <div className="overflow-x-auto rounded-[28px] bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs tracking-wide text-navy/55 uppercase">
            <tr>
              <th className="px-4 py-4 font-bold">Campaña</th>
              <th className="px-4 py-4 font-bold">Inversión</th>
              <th className="px-4 py-4 font-bold">Leads</th>
              <th className="px-4 py-4 font-bold">CPL</th>
              <th className="px-4 py-4 font-bold">CTR</th>
              <th className="px-4 py-4 font-bold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-t border-navy/5">
                <td className="px-4 py-4">
                  <p className="font-bold">{campaign.name}</p>
                  <p className="text-navy/60">{campaign.objective}</p>
                </td>
                <td className="px-4 py-4">{cop(campaign.spend)}</td>
                <td className="px-4 py-4">{num(campaign.leads)}</td>
                <td className="px-4 py-4">{cop(cpl(campaign.spend, campaign.leads))}</td>
                <td className="px-4 py-4">{ctr(campaign.clicks, campaign.impressions).toFixed(2)}%</td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => toggleCampaign(campaign.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      campaign.active ? "bg-lime text-navy" : "bg-paper text-navy"
                    }`}
                  >
                    {campaign.active ? "Activa · pausar" : "En pausa · activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-navy/60">CTR combinado de activas: {ctr(clicks, impressions).toFixed(2)}%.</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[28px] bg-white p-5">
      <p className="text-xs font-bold tracking-[0.14em] text-navy/55 uppercase">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight">{value}</p>
    </article>
  );
}
