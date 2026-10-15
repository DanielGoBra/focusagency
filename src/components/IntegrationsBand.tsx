import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  SiAirtable,
  SiFacebook,
  SiGmail,
  SiGoogle,
  SiGoogleads,
  SiGoogleanalytics,
  SiGooglecalendar,
  SiGoogledrive,
  SiGooglesheets,
  SiHubspot,
  SiInstagram,
  SiMailchimp,
  SiMake,
  SiMeta,
  SiMongodb,
  SiNotion,
  SiPostgresql,
  SiShopify,
  SiStripe,
  SiTelegram,
  SiTiktok,
  SiWhatsapp,
  SiWoocommerce,
  SiYoutube,
  SiZapier,
  SiZoom,
} from "react-icons/si";

const TOOLS: { Icon: IconType; color: string; name: string }[] = [
  { Icon: SiStripe, color: "#635bff", name: "Stripe" },
  { Icon: SiHubspot, color: "#ff7a59", name: "HubSpot" },
  { Icon: SiSlackMark, color: "#611f69", name: "Slack" },
  { Icon: SiShopify, color: "#96bf48", name: "Shopify" },
  { Icon: SiGoogleads, color: "#4285f4", name: "Google Ads" },
  { Icon: SiPostgresql, color: "#336791", name: "PostgreSQL" },
  { Icon: SiFacebook, color: "#1877f2", name: "Facebook" },
  { Icon: SiGmail, color: "#ea4335", name: "Gmail" },
  { Icon: SiNotion, color: "currentColor", name: "Notion" },
  { Icon: SiGoogle, color: "#4285f4", name: "Google" },
  { Icon: SiWhatsapp, color: "#25d366", name: "WhatsApp" },
  { Icon: SiMailchimp, color: "#ffe01b", name: "Mailchimp" },
  { Icon: SiGooglesheets, color: "#0f9d58", name: "Sheets" },
  { Icon: SiWoocommerce, color: "#7f54b3", name: "WooCommerce" },
  { Icon: SiZapier, color: "#ff4f00", name: "Zapier" },
  { Icon: SiTelegram, color: "#26a5e4", name: "Telegram" },
  { Icon: SiMake, color: "#6d00cc", name: "Make" },
  { Icon: SiGoogleanalytics, color: "#e37400", name: "Analytics" },
  { Icon: SiMeta, color: "#0668e1", name: "Meta" },
  { Icon: SiInstagram, color: "#e1306c", name: "Instagram" },
  { Icon: SiAirtable, color: "#18bfff", name: "Airtable" },
  { Icon: SiMongodb, color: "#47a248", name: "MongoDB" },
  { Icon: SiYoutube, color: "#ff0000", name: "YouTube" },
  { Icon: SiTiktok, color: "currentColor", name: "TikTok" },
  { Icon: SiGoogledrive, color: "#1fa463", name: "Drive" },
  { Icon: SiGooglecalendar, color: "#4285f4", name: "Calendar" },
  { Icon: SiZoom, color: "#2d8cff", name: "Zoom" },
];

function SiSlackMark(props: { className?: string; color?: string; title?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} aria-hidden>
      <path fill="#e01e5a" d="M6.2 15.2a1.6 1.6 0 1 1-1.6-1.6h1.6zm.8 0a1.6 1.6 0 0 1 3.2 0v4a1.6 1.6 0 1 1-3.2 0z" />
      <path fill="#36c5f0" d="M8.8 6.2a1.6 1.6 0 1 1 1.6-1.6v1.6zm0 .8a1.6 1.6 0 0 1 0 3.2h-4a1.6 1.6 0 1 1 0-3.2z" />
      <path fill="#2eb67d" d="M17.8 8.8a1.6 1.6 0 1 1 1.6 1.6h-1.6zm-.8 0a1.6 1.6 0 0 1-3.2 0v-4a1.6 1.6 0 1 1 3.2 0z" />
      <path fill="#ecb22e" d="M15.2 17.8a1.6 1.6 0 1 1-1.6 1.6v-1.6zm0-.8a1.6 1.6 0 0 1 0-3.2h4a1.6 1.6 0 1 1 0 3.2z" />
    </svg>
  );
}

export function IntegrationsBand({ dark = true }: { dark?: boolean }) {
  return (
    <section data-tone={dark ? "navy" : "light"} className="template-sheet relative z-10">
      <div className="mx-auto max-w-6xl px-5 py-16 text-center md:py-24">
        <h2 className="sheet-title text-4xl font-extrabold tracking-tight text-[#14245c] md:text-6xl">
          Diseñado para adaptarse con sus soluciones tecnológicas
        </h2>
        <p className="sheet-lead mx-auto mt-4 max-w-2xl text-base text-[#14245c]/70 md:text-lg">
          Cree conexiones en tiempo real que envíen y reciban datos entre herramientas externas sin código.
        </p>
        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-4 gap-x-4 gap-y-8 sm:grid-cols-6 lg:grid-cols-9">
          {TOOLS.map(({ Icon, color, name }) => (
            <li key={name} className={`grid place-items-center ${color === "currentColor" ? "integ-ink" : ""}`} title={name}>
              <Icon className="h-9 w-9" color={color} aria-label={name} />
            </li>
          ))}
        </ul>
        <Link
          to="/hub/integraciones"
          className="mt-12 inline-flex rounded-full bg-[#3ef3ff] px-6 py-3 text-sm font-extrabold text-[#071428] shadow-[0_10px_24px_rgb(62_243_255_/_0.28)]"
        >
          Explora todas las integraciones
        </Link>
      </div>
    </section>
  );
}
