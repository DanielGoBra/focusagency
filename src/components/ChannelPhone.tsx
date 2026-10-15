import { useRef, useState, type ReactNode } from "react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";

type Channel = "whatsapp" | "instagram" | "facebook";

const CHANNELS: {
  id: Channel;
  label: string;
  Icon: typeof SiWhatsapp;
  color: string;
  title: string;
  body: string;
}[] = [
  {
    id: "whatsapp",
    label: "WhatsApp Business",
    Icon: SiWhatsapp,
    color: "#25D366",
    title: "Conéctate a WhatsApp con la API oficial",
    body: "Activa tu canal de ventas más poderoso con una integración directa, segura y escalable. Nuestra IA trabaja sobre la API oficial para brindarte atención, ventas y soporte automatizado sin límites.",
  },
  {
    id: "instagram",
    label: "Instagram Direct",
    Icon: SiInstagram,
    color: "#E4405F",
    title: "Conéctate a Instagram y vende desde el directo",
    body: "Responde reels, comentarios y mensajes con la misma IA. Muestra productos, resuelve dudas y cierra la compra sin sacar al cliente de Instagram.",
  },
  {
    id: "facebook",
    label: "Facebook Messenger",
    Icon: SiFacebook,
    color: "#0866FF",
    title: "Conéctate a Facebook Messenger",
    body: "Atiende anuncios, el inbox y los comentarios en un solo hilo. FOCU cotiza, agenda y hace seguimiento mientras tu equipo se concentra en vender.",
  },
];

function BrandText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /(Facebook Messenger|WhatsApp|Instagram)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    const phrase = match[0];
    const tone = phrase === "WhatsApp" ? "text-[#25D366]" : phrase === "Instagram" ? "brand-ig" : "text-[#0866FF]";
    parts.push(
      <span key={`${phrase}-${index}`} className={tone}>
        {phrase}
      </span>,
    );
    last = index + phrase.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function ChannelPhone() {
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const current = CHANNELS.find((item) => item.id === channel) ?? CHANNELS[0];

  return (
    <section data-tone="light" className="channel-stage bg-white px-4 py-16 text-navy md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          Conecta todos tus canales y deja que un solo agente de IA responda a tus clientes.
        </h2>
      </div>
      <div className="relative mx-auto mt-14 grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_auto]">
        <aside key={current.id} className="mx-auto flex max-w-xl items-start gap-4 lg:mx-0">
          <div className="min-w-0 pt-6">
            <h3 className="text-3xl font-extrabold tracking-tight text-balance">
              <BrandText text={current.title} />
            </h3>
            <p className="mt-4 text-base leading-relaxed text-navy/75">
              <BrandText text={current.body} />
            </p>
            <a
              href="#contacto"
              className="mt-6 inline-flex rounded-full border-2 border-[#2BBDEF] bg-navy px-5 py-3 text-sm font-bold text-white shadow-[0_0_16px_rgb(94_211_252_/_0.9),0_0_32px_rgb(43_189_239_/_0.55)]"
            >
              Quiero conectarme
            </a>
          </div>
          <current.Icon
            size={168}
            color={current.color}
            aria-hidden
            className="float -mt-10 hidden shrink-0 sm:block"
            style={{ filter: `drop-shadow(0 12px 16px ${current.color}55) drop-shadow(0 0 22px ${current.color})` }}
          />
        </aside>
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <IPhone channel={channel}>
              {channel === "whatsapp" && <WhatsAppChat />}
              {channel === "instagram" && <InstagramChat />}
              {channel === "facebook" && <MessengerChat />}
            </IPhone>
            <img src="/brand/mascot/chat.png?v=5" alt="" className="pointer-events-none absolute bottom-0 left-[calc(100%+0.75rem)] hidden w-56 object-contain xl:block" />
          </div>
          <div className="mt-6 flex w-full flex-row flex-nowrap justify-center gap-2 overflow-x-auto" role="tablist" aria-label="Canal de la conversación">
        {CHANNELS.map((item) => {
          const active = channel === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setChannel(item.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold whitespace-nowrap transition ${active ? "border-transparent text-white shadow-md" : "border-navy/10 bg-white text-navy hover:border-navy/25"}`}
              style={active ? { background: item.color } : undefined}
            >
              <item.Icon size={16} color={active ? "#fff" : item.color} aria-hidden />
              {item.label}
            </button>
          );
        })}
          </div>
        </div>
      </div>
    </section>
  );
}

function IPhone({ children, channel }: { children: ReactNode; channel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pose, setPose] = useState({ x: 0, y: 0, on: false });

  function move(event: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    setPose({ x: py * -14, y: px * 18, on: true });
  }

  const lift = pose.on ? -14 : 0;
  const shadow = `drop-shadow(${(-pose.y * 0.35).toFixed(1)}px ${(26 + pose.x * 0.4).toFixed(1)}px ${pose.on ? 22 : 16}px rgb(32 34 70 / ${pose.on ? 0.38 : 0.22}))`;

  return (
    <div className="phone-scene">
      <div
        ref={ref}
        onMouseMove={move}
        onMouseLeave={() => setPose({ x: 0, y: 0, on: false })}
        className={`phone-tilt relative w-[292px] sm:w-[340px] ${pose.on ? "is-hot" : ""}`}
        style={{ transform: `rotateX(${pose.x}deg) rotateY(${pose.y}deg) translateY(${lift}px)` }}
      >
        <div
          key={channel}
          className="absolute overflow-hidden bg-black"
          style={{ left: "4.37%", top: "1.75%", width: "91.52%", height: "96.5%", borderRadius: "12.4% / 5.7%" }}
        >
          {children}
        </div>
        <img
          src="/brand/iphone-17-pro.png"
          alt=""
          draggable={false}
          className="pointer-events-none relative z-10 block w-full select-none"
          style={{ filter: shadow }}
        />
      </div>
    </div>
  );
}

function VideoIcon({ ink = "white" }: { ink?: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <rect x="3" y="6" width="12" height="12" rx="2" stroke={ink} strokeWidth="1.7" />
      <path d="M15 10.5 21 7.5v9l-6-3Z" fill={ink} />
    </svg>
  );
}

function PhoneIcon({ ink = "white" }: { ink?: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={ink} aria-hidden>
      <path d="M7.2 3.8h2.1l1.2 3-1.6 1a12 12 0 0 0 5.3 5.3l1-1.6 3 1.2v2.1c0 .8-.6 1.5-1.4 1.6A14.5 14.5 0 0 1 5.6 5.2c.1-.8.8-1.4 1.6-1.4Z" />
    </svg>
  );
}

function DotsIcon({ ink = "white" }: { ink?: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill={ink} aria-hidden>
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
    </svg>
  );
}

function FocuFace({ className = "h-8 w-8" }: { className?: string }) {
  return <img src="/brand/mascot/focu-avatar.png?v=5" alt="" className={`rounded-full bg-[#071018] object-cover ${className}`} />;
}

function Status({ light = false }: { light?: boolean }) {
  const ink = light ? "white" : "#202246";
  return (
    <div className="flex h-9 items-center justify-between px-5 text-[12px] font-semibold" style={{ color: ink }}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 18 12" className="h-3 w-4" aria-hidden>
          <rect x="0" y="7" width="3" height="5" rx="0.5" fill={ink} />
          <rect x="5" y="4" width="3" height="8" rx="0.5" fill={ink} />
          <rect x="10" y="2" width="3" height="10" rx="0.5" fill={ink} />
          <rect x="15" y="0" width="3" height="12" rx="0.5" fill={ink} />
        </svg>
        <svg viewBox="0 0 16 12" className="h-3 w-4" fill="none" aria-hidden>
          <path d="M1 4.5C4.2 1.6 11.8 1.6 15 4.5" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M3.2 7C5.4 5.1 10.6 5.1 12.8 7" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="10" r="1.1" fill={ink} />
        </svg>
        <svg viewBox="0 0 25 12" className="h-3 w-6" aria-hidden>
          <rect x="0.6" y="0.6" width="20" height="10.8" rx="2.2" fill="none" stroke={ink} strokeWidth="1.2" />
          <rect x="2" y="2" width="14" height="8" rx="1" fill={ink} />
          <rect x="21.4" y="3.5" width="2" height="5" rx="0.6" fill={ink} />
        </svg>
      </span>
    </div>
  );
}

function WhatsAppChat() {
  return (
    <div className="wa-doodle flex h-full flex-col">
      <div className="bg-[#075e54] text-white">
        <Status light />
        <div className="flex items-center gap-2 px-2 pt-2 pb-2.5">
          <span className="text-lg leading-none">‹</span>
          <FocuFace />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">FOCU</span>
            <span className="block text-[11px] text-white/80">en línea</span>
          </span>
          <VideoIcon />
          <PhoneIcon />
          <DotsIcon />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3 text-[13px]">
        <BotBubble>¡Hola! 👋 Soy FOCU. ¿En qué te ayudo hoy?</BotBubble>
        <Bubble>Quiero saber qué servicios tienen.</Bubble>
        <BotBubble>Te dejo lo que más piden 🚀</BotBubble>
        <div className="ml-9 flex flex-wrap gap-1.5">
          {["🤖 Chatbots", "📣 Meta Ads", "⚡ Flujos"].map((item) => (
            <span key={item} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold shadow-sm">{item}</span>
          ))}
        </div>
        <VideoNote src="/brand/videos/whatsapp.mp4" title="Así responde FOCU 24/7" shape="note" />
        <Reactions />
      </div>
      <Bar placeholder="Escribe un mensaje" tone="#075e54" />
    </div>
  );
}

function InstagramChat() {
  return (
    <div className="flex h-full flex-col bg-white">
      <Status />
      <div className="flex items-center gap-2 border-b border-navy/10 px-2 py-2.5">
        <span className="text-lg leading-none text-navy">‹</span>
        <FocuFace className="h-8 w-8 ring-2 ring-[#ee2a7b]" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">focu</span>
          <span className="block text-[11px] text-navy/50">Activo ahora</span>
        </span>
        <PhoneIcon ink="#202246" />
        <VideoIcon ink="#202246" />
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3 text-[13px]">
        <BotBubble soft>Vi tu visita al catálogo ✨ ¿Buscas un plan o un producto?</BotBubble>
        <Bubble ig>Quiero ver los productos.</Bubble>
        <BotBubble soft>Estos son los favoritos 🔥</BotBubble>
        <div className="ml-9 grid grid-cols-2 gap-2">
          <Product name="Plan Essential" price="USD 62" />
          <Product name="Business Lite" price="USD 125" />
        </div>
        <VideoNote src="/brand/videos/instagram.mp4" title="focu" shape="reel" />
        <Reactions />
      </div>
      <Bar placeholder="Mensaje..." tone="#e4405f" />
    </div>
  );
}

function MessengerChat() {
  return (
    <div className="flex h-full flex-col bg-[#f4f6f8]">
      <div className="bg-[#0866ff] text-white">
        <Status light />
        <div className="flex items-center gap-2 px-2 pt-2 pb-2.5">
          <span className="text-lg leading-none">‹</span>
          <FocuFace />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold">FOCU</span>
            <span className="block text-[11px] text-white/80">responde al instante</span>
          </span>
          <PhoneIcon />
          <VideoIcon />
          <DotsIcon />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3 text-[13px]">
        <BotBubble soft>Hola 😊 Puedo cotizarte o agendar una asesoría.</BotBubble>
        <Bubble fb>Necesito una cotización.</Bubble>
        <BotBubble soft>Listo. WhatsApp + Instagram para 5 usuarios 💼</BotBubble>
        <div className="ml-9 rounded-2xl bg-white p-2.5 shadow-sm">
          <p className="text-[11px] font-bold text-[#0866ff]">Cotización</p>
          <p className="mt-1 text-[12px] leading-snug">La armamos en este chat y te dejo el seguimiento por aquí 📅</p>
        </div>
        <VideoNote src="/brand/videos/facebook.mp4" title="Asesoría con FOCU" shape="wide" />
        <Reactions />
      </div>
      <Bar placeholder="Aa" tone="#0866ff" />
    </div>
  );
}

function BotBubble({ children, soft = false }: { children: string; soft?: boolean }) {
  return (
    <div className="flex items-end gap-1.5">
      <FocuFace className="h-7 w-7 shrink-0" />
      <p className={`max-w-[78%] rounded-2xl px-3 py-2 leading-snug shadow-sm ${soft ? "bg-white text-navy" : "bg-white text-navy"}`}>{children}</p>
    </div>
  );
}

function Bubble({ children, ig = false, fb = false }: { children: string; ig?: boolean; fb?: boolean }) {
  const tone = ig ? "bg-[#efefef] text-navy" : fb ? "bg-[#0866ff] text-white" : "bg-[#dcf8c6] text-navy";
  return <p className={`max-w-[86%] self-end rounded-2xl px-3 py-2 leading-snug shadow-sm ${tone}`}>{children}</p>;
}

function VideoNote({ src, title, shape }: { src: string; title: string; shape: "note" | "reel" | "wide" }) {
  const frame = shape === "reel" ? "h-52 w-32" : shape === "wide" ? "h-28 w-52" : "h-40 w-36";
  return (
    <div className={`relative ml-9 overflow-hidden bg-black shadow-sm ${shape === "reel" ? "rounded-xl" : "rounded-2xl"} ${frame}`}>
      <video src={src} className="h-full w-full object-cover" controls playsInline preload="metadata" />
      {shape === "reel" && (
        <span className="pointer-events-none absolute right-1.5 bottom-8 flex flex-col items-center gap-2 text-[10px] text-white">
          <span>♥</span>
          <span>💬</span>
          <span>➤</span>
        </span>
      )}
      <span className="pointer-events-none absolute right-2 bottom-1 left-2 truncate text-[10px] font-bold text-white drop-shadow">{title}</span>
    </div>
  );
}

function Reactions() {
  const [picked, setPicked] = useState("🔥");
  return (
    <div className="ml-9 flex gap-1">
      {["👍", "🔥", "💬"].map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => setPicked(emoji)}
          className={`rounded-full px-2 py-0.5 text-sm shadow-sm ${picked === emoji ? "bg-[#dcf8c6]" : "bg-white"}`}
          aria-pressed={picked === emoji}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function Product({ name, price }: { name: string; price: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-navy/10 bg-white">
      <div className="grid h-14 place-items-center bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-lg">🛍️</div>
      <div className="p-2">
        <p className="text-[11px] font-bold">{name}</p>
        <p className="text-[11px] text-navy/60">{price}</p>
      </div>
    </div>
  );
}

function Bar({ placeholder, tone }: { placeholder: string; tone: string }) {
  return (
    <div className="flex items-center gap-2 border-t border-black/5 bg-white px-3 py-2.5">
      <span className="h-8 flex-1 rounded-full bg-[#f1f2f4] px-3 text-[12px] leading-8 text-navy/40">{placeholder}</span>
      <button type="button" aria-label="Enviar" className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ background: tone }}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M3.2 11.3 20.4 3.2c.8-.4 1.7.4 1.4 1.3L17.2 20c-.3.9-1.4 1.1-2 .4l-3.8-4.2-4.4 2.2c-.8.4-1.7-.3-1.6-1.2l.5-4.6-2.7-1.3Z" />
        </svg>
      </button>
    </div>
  );
}
