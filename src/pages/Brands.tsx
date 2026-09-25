import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";

const WHATSAPP = `https://wa.me/573106309679?text=${encodeURIComponent("Hola, estoy interesado.")}`;

function BrandScreen({
  title,
  documentTitle,
  kicker,
  lead,
  points,
}: {
  title: string;
  documentTitle: string;
  kicker: string;
  lead: string;
  points: string[];
}) {
  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  return (
    <div className="min-h-screen bg-paper text-navy">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-focus">{kicker}</p>
          <h1 className="mt-3 max-w-xl text-4xl font-extrabold tracking-tight md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg text-navy/75">{lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="rounded-full bg-navy px-5 py-3 text-sm font-bold text-white">
              Volver a Focuschat
            </Link>
            <a href={WHATSAPP} className="rounded-full bg-lime px-5 py-3 text-sm font-bold text-navy">
              Escribir por WhatsApp
            </a>
          </div>
        </div>
        <ul className="grid content-center gap-3">
          {points.map((point) => (
            <li key={point} className="rounded-[24px] border border-white/80 bg-white/70 px-5 py-4 text-base font-bold shadow-sm">
              {point}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export function Agency() {
  return (
    <BrandScreen
      documentTitle="Focus Agency"
      kicker="FOCUS AGENCY"
      title="La agencia que pone la pauta y la conversación en el mismo lugar."
      lead="Focus Agency diseña los chatbots, la pauta de Meta y las automatizaciones que Focuschat opera con el cliente. Esta ruta es la casa de la agencia."
      points={[
        "Chatbots que califican y entregan la ficha.",
        "Meta Ads leída por conversación útil.",
        "Flujos para que el equipo entre solo cuando hace falta.",
      ]}
    />
  );
}

export function Academy() {
  return (
    <BrandScreen
      documentTitle="Focus Academy"
      kicker="FOCUS ACADEMY"
      title="Aprende a responder, asesorar, agendar y vender por WhatsApp."
      lead="Focus Academy forma al equipo que va a operar la API de WhatsApp. El programa se publica en esta ruta; hoy el sistema se recorre en Focuschat."
      points={[
        "Cómo entra un cliente y cuándo responde una persona.",
        "Qué mirar de la pauta además del clic.",
        "Cómo armar un flujo sin perder la conversación.",
      ]}
    />
  );
}
