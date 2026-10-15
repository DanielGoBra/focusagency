import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BrandLogo, Mascot } from "../components/Logo";
import { ContactForm, Reveal, SiteFooter, SiteSwitcher, SocialLinks, WhatsAppChat } from "../components/Site";

const MARQUEE = ["WhatsApp", "Instagram", "Meta Ads", "Score", "Flujos", "Bandeja", "Calendario", "Inteligencia"];

const REPLIES = {
  pauta: {
    user: "Quiero más leads por Meta.",
    bot: "Te dejo en pauta. Score 86: una persona tiene que ver este chat.",
    score: 86,
    tag: "Meta Ads",
    focus: true,
  },
  bot: {
    user: "Necesito un bot en WhatsApp.",
    bot: "Puedo calificar solo y pasar la ficha. Score 64: sigue en automático.",
    score: 64,
    tag: "WhatsApp",
    focus: false,
  },
  ambos: {
    user: "Los dos, y que hablen entre sí.",
    bot: "Eso es el Hub. Score 92. Este hilo no debería esperar.",
    score: 92,
    tag: "Prioridad",
    focus: true,
  },
} as const;

type ReplyKey = keyof typeof REPLIES;
type Msg = { from: "bot" | "you"; text: string };
type Scene = "chat" | "pauta" | "flujo";
type NodeId = "wa" | "ig" | "meta" | "cal";

const NODES: { id: NodeId; label: string; hint: string; x: number; y: number; tone: string }[] = [
  { id: "wa", label: "WhatsApp", hint: "Conversación", x: 0, y: 18, tone: "bg-lime text-navy" },
  { id: "ig", label: "Instagram", hint: "Entrada", x: 80, y: 2, tone: "bg-focus text-navy" },
  { id: "meta", label: "Meta Ads", hint: "Pauta", x: 0, y: 62, tone: "bg-navy text-white" },
  { id: "cal", label: "Agenda", hint: "Cita", x: 80, y: 56, tone: "bg-white text-navy" },
];

const ANCHORS: Record<NodeId, { x: number; y: number }> = {
  wa: { x: -230, y: -30 },
  ig: { x: 40, y: -150 },
  meta: { x: -210, y: 120 },
  cal: { x: 200, y: 90 },
};

const STORY = [
  {
    kicker: "01",
    title: "Entra",
    text: "El anuncio, el directo de Instagram y la web caen en la misma bandeja. Nadie copia el chat a una hoja.",
    face: "Una sola bandeja",
    detail: "Camila · Instagram · hace 2 min",
  },
  {
    kicker: "02",
    title: "Califica",
    text: "El bot pregunta lo justo: qué necesita, para cuándo y si ya invierte. Con eso arma un score.",
    face: "Score 92",
    detail: "Presupuesto listo · quiere esta semana",
  },
  {
    kicker: "03",
    title: "Decide",
    text: "Modo foco deja a la vista solo lo que no puede esperar. El resto sigue en automático.",
    face: "Merece una persona",
    detail: "Camila lleva 26 min sin respuesta",
  },
  {
    kicker: "04",
    title: "Aprende",
    text: "Lo que se cierra vuelve a la pauta: qué mensaje trajo la conversación útil y cuál solo trajo ruido.",
    face: "ROAS 4.6×",
    detail: "La campaña de leads baja el costo",
  },
];

const SERVICES = [
  {
    title: "Chatbots",
    text: "WhatsApp e Instagram que califican y entregan la ficha, no un chat eterno.",
    span: "md:col-span-7",
    wash: "bg-navy text-white",
  },
  {
    title: "Meta Ads",
    text: "La pauta se lee por conversación útil y costo por lead.",
    span: "md:col-span-5",
    wash: "bg-focus text-navy",
  },
  {
    title: "Automatizaciones",
    text: "El equipo entra cuando la conversación ya merece foco. El resto sigue solo.",
    span: "md:col-span-5",
    wash: "bg-lime text-navy",
  },
  {
    title: "Inteligencia",
    text: "Un pulso del negocio: qué canal trae, qué mensaje convierte, qué oportunidad se enfría.",
    span: "md:col-span-7",
    wash: "bg-white text-navy",
  },
];

const FAQ = [
  ["¿El bot reemplaza al equipo?", "No. Sostiene el ruido y entrega la ficha. Una persona entra cuando el score o la espera lo piden."],
  ["¿Se conecta con WhatsApp, Instagram y Meta?", "Ese es el diseño del Hub. En esta demo el estado de cada conexión vive en tu navegador, para que puedas recorrerlo sin cuentas reales."],
  ["¿La pauta se mide por clics?", "El clic es el comienzo. La lectura que importa es la conversación útil y lo que cuesta conseguirla."],
  ["¿Puedo mover leads y armar flujos?", "Sí. En el Hub creas el lead, cambias su etapa, escribes en la bandeja y ordenas los pasos de un flujo."],
];

type NeuralTone = "light" | "navy" | "lime" | "focus";

const NEURAL: Record<NeuralTone, { a: string; b: string; node: string; lime: string }> = {
  light: { a: "110, 182, 52", b: "32, 34, 70", node: "#202246", lime: "#6eb634" },
  navy: { a: "110, 182, 52", b: "186, 224, 255", node: "#ffffff", lime: "#6eb634" },
  lime: { a: "32, 34, 70", b: "26, 28, 51", node: "#202246", lime: "#1a1c33" },
  focus: { a: "32, 34, 70", b: "255, 255, 255", node: "#202246", lime: "#ffffff" },
};

function unit(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let raf = 0;
    const sections: { top: number; bottom: number; tone: NeuralTone }[] = [];
    const nodes: { x: number; y: number; angle: number; spin: number; speed: number; lime: boolean }[] = [];

    const seed = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const count = Math.max(36, Math.min(58, Math.round((width * height) / 28000)));
      nodes.length = 0;
      for (let i = 0; i < count; i += 1) {
        nodes.push({
          x: unit(i + 1) * width,
          y: unit(i + 2) * height,
          angle: unit(i + 11) * Math.PI * 2,
          spin: (unit(i + 17) - 0.5) * 0.004,
          speed: 0.22 + unit(i + 4) * 0.28,
          lime: i % 5 === 0,
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const measure = () => {
      sections.length = 0;
      document.querySelectorAll<HTMLElement>("[data-tone]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const tone = (el.dataset.tone || "light") as NeuralTone;
        sections.push({ top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY, tone });
      });
    };

    const toneAt = (y: number): NeuralTone => {
      for (const section of sections) {
        if (y >= section.top && y < section.bottom) return section.tone;
      }
      return "light";
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.style.width !== `${width}px` || canvas.style.height !== `${height}px`) {
        resize();
        measure();
      }
      const scroll = window.scrollY;
      ctx.clearRect(0, 0, width, height);
      if (nodes.length === 0) seed();
      const reach = width < 760 ? 150 : 220;

      for (const node of nodes) {
        if (!reduce) {
          node.angle += node.spin;
          node.x += Math.cos(node.angle) * node.speed;
          node.y += Math.sin(node.angle) * node.speed;
        }
        if (node.x < -30) node.x = width + 30;
        if (node.x > width + 30) node.x = -30;
        if (node.y < -30) node.y = height + 30;
        if (node.y > height + 30) node.y = -30;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        const tone = NEURAL[toneAt(scroll + a.y)];
        const near: { index: number; dist: number }[] = [];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dist = Math.hypot(a.x - nodes[j].x, a.y - nodes[j].y);
          if (dist <= reach) near.push({ index: j, dist });
        }
        near.sort((left, right) => left.dist - right.dist);
        for (const link of near.slice(0, 3)) {
          const b = nodes[link.index];
          const fade = 1 - link.dist / reach;
          const organic = a.lime || b.lime;
          const rgb = organic ? tone.a : tone.b;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${rgb}, ${0.05 + fade * 0.08})`;
          ctx.lineWidth = 2.6;
          ctx.stroke();
          ctx.strokeStyle = `rgba(${rgb}, ${0.28 + fade * 0.34})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          if (!reduce && (i + link.index) % 5 === 0) {
            const travel = ((frame * 0.004) + i * 0.08) % 1;
            ctx.fillStyle = organic ? tone.lime : `rgb(${tone.a})`;
            ctx.beginPath();
            ctx.arc(a.x + (b.x - a.x) * travel, a.y + (b.y - a.y) * travel, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      for (const node of nodes) {
        const tone = NEURAL[toneAt(scroll + node.y)];
        ctx.fillStyle = node.lime ? tone.lime : tone.node;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.lime ? 3.2 : 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      frame += 1;
      if (!reduce) raf = window.requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      measure();
      if (reduce) draw();
    };

    resize();
    measure();
    draw();
    const observer = new ResizeObserver(onResize);
    observer.observe(document.body);
    window.addEventListener("resize", onResize);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[1] h-full w-full opacity-40" aria-hidden="true" />;
}


function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function ChannelMark({ id, className = "h-4 w-4" }: { id: NodeId; className?: string }) {
  if (id === "wa") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M12 3.2A8.7 8.7 0 0 0 4.6 16.2L3.4 20.6l4.5-1.2A8.8 8.8 0 1 0 12 3.2zm0 1.6a7.1 7.1 0 0 1 6 10.7 7.1 7.1 0 0 1-9.3 2.6l-.3-.2-2.7.7.7-2.6-.2-.3A7.1 7.1 0 0 1 12 4.8zm3.8 8.8c-.2-.1-1.1-.5-1.3-.6s-.3-.1-.4.1-.5.6-.6.7-.2.1-.4 0a5.8 5.8 0 0 1-1.7-1 6.4 6.4 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.4l.3-.3.1-.2a.5.5 0 0 0 0-.4c0-.1-.4-1.1-.6-1.5s-.3-.3-.5-.3h-.4a.8.8 0 0 0-.6.3 2.3 2.3 0 0 0-.7 1.7 4 4 0 0 0 .8 2.1 8.8 8.8 0 0 0 3.4 3 3.6 3.6 0 0 0 2.4.5 2 2 0 0 0 1.4-1 1.7 1.7 0 0 0 .1-1c-.1-.1-.2-.2-.4-.3z" />
      </svg>
    );
  }
  if (id === "ig") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.4 6.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  if (id === "meta") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M14.2 20v-7.1h2.4l.4-2.8h-2.8V8.4c0-.8.2-1.4 1.4-1.4H17V4.5A18 18 0 0 0 14.9 4c-2.1 0-3.5 1.3-3.5 3.6v2.5H9v2.8h2.4V20z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3.5V7M16 3.5V7M4 10h16" />
    </svg>
  );
}

function ProductStage({ embedded = false }: { embedded?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: NodeId; dx: number; dy: number } | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [pos, setPos] = useState<Record<NodeId, { x: number; y: number }>>({
    wa: { x: 0, y: 18 },
    ig: { x: 80, y: 2 },
    meta: { x: 0, y: 62 },
    cal: { x: 80, y: 56 },
  });
  const [dragging, setDragging] = useState<NodeId | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scene, setScene] = useState<Scene>("chat");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hola. Soy el asistente de Focus. ¿Qué te trajo hoy?" },
  ]);
  const [pending, setPending] = useState(false);
  const [picked, setPicked] = useState<ReplyKey | null>(null);
  const [live, setLive] = useState(true);
  const [flowAt, setFlowAt] = useState(1);
  const [emerge, setEmerge] = useState(0);
  const timer = useRef(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setEmerge(1);
      return;
    }
    let frame = 0;
    let started = false;
    const play = () => {
      if (started) return;
      started = true;
      const duration = 3400;
      const origin = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - origin) / duration);
        setEmerge(progress);
        if (progress < 1) frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    };
    const watch = () => {
      const el = stageRef.current;
      if (!el || started) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.78) play();
    };
    watch();
    window.addEventListener("scroll", watch, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", watch);
    };
  }, []);

  function choose(key: ReplyKey) {
    if (pending || picked) return;
    const item = REPLIES[key];
    setMessages((list) => [...list, { from: "you", text: item.user }]);
    setPending(true);
    timer.current = window.setTimeout(() => {
      setMessages((list) => [...list, { from: "bot", text: item.bot }]);
      setPicked(key);
      setPending(false);
    }, 650);
  }

  function resetChat() {
    window.clearTimeout(timer.current);
    setMessages([{ from: "bot", text: "Hola. Soy el asistente de Focus. ¿Qué te trajo hoy?" }]);
    setPicked(null);
    setPending(false);
  }

  function onPointerDown(id: NodeId, event: React.PointerEvent<HTMLButtonElement>) {
    const stage = stageRef.current;
    if (!stage || box.w < 800 || emerge < 0.98) return;
    const rect = stage.getBoundingClientRect();
    const nx = (pos[id].x / 100) * rect.width;
    const ny = (pos[id].y / 100) * rect.height;
    drag.current = { id, dx: event.clientX - rect.left - nx, dy: event.clientY - rect.top - ny };
    setDragging(id);
    const move = (pointer: PointerEvent) => {
      const current = drag.current;
      const host = stageRef.current;
      if (!current || !host) return;
      const bounds = host.getBoundingClientRect();
      const x = ((pointer.clientX - bounds.left - current.dx) / bounds.width) * 100;
      const y = ((pointer.clientY - bounds.top - current.dy) / bounds.height) * 100;
      setPos((places) => ({ ...places, [current.id]: { x: clamp(x, 0, 82), y: clamp(y, 0, 78) } }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      drag.current = null;
      setDragging(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (drag.current) return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    if (rect.width < 800) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: clamp(py * -8, -6, 6), y: clamp(px * 10, -7, 7) });
  }

  const result = picked ? REPLIES[picked] : null;
  const wide = !embedded && box.w >= 800;
  const spend = live ? 6960000 : 2760000;
  const roas = live ? "4.6×" : "3.8×";

  function flight(index: number, id: NodeId) {
    const place = pos[id];
    if (!wide || dragging === id) return { x: place.x, y: place.y, scale: 1, opacity: 1 };
    const local = clamp((emerge - index * 0.16) / 0.52, 0, 1);
    const t = local < 0.5 ? 2 * local * local : 1 - (-2 * local + 2) ** 2 / 2;
    return {
      x: 46 + (place.x - 46) * t,
      y: 38 + (place.y - 38) * t,
      scale: 0.28 + 0.72 * t,
      opacity: t,
    };
  }

  return (
    <div
      ref={stageRef}
      className={embedded ? "relative" : "relative mx-auto mt-2 max-w-6xl md:h-[540px]"}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {wide && box.w > 0 && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${box.w} ${box.h}`} aria-hidden="true">
          <defs>
            <linearGradient id="synapse" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#48a4dc" />
              <stop offset="55%" stopColor="#202246" />
              <stop offset="100%" stopColor="#6eb634" />
            </linearGradient>
          </defs>
          {NODES.map((node, index) => {
            const shown = flight(index, node.id);
            const x1 = (shown.x / 100) * box.w + 70;
            const y1 = (shown.y / 100) * box.h + 28;
            const x2 = box.w / 2 + ANCHORS[node.id].x;
            const y2 = box.h / 2 + ANCHORS[node.id].y;
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2 - 36 * shown.opacity;
            const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
            return (
              <g key={node.id} opacity={shown.opacity}>
                <path d={d} fill="none" stroke="#48a4dc" strokeOpacity="0.22" strokeWidth="14" strokeLinecap="round" />
                <path d={d} fill="none" stroke="url(#synapse)" strokeWidth="2.6" strokeLinecap="round" />
                <path d={d} fill="none" stroke="#f4f7fb" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 14" className="synapse-dash" />
                <circle cx={x2} cy={y2} r="4.5" fill="#6eb634" stroke="#202246" strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>
      )}

      <div className={`mb-4 flex flex-wrap justify-center gap-2 lg:justify-start ${embedded ? "" : "md:hidden"}`}>
        {NODES.map((node) => (
          <span key={node.id} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow ${node.tone}`}>
            <ChannelMark id={node.id} className="h-3.5 w-3.5" />
            {node.label}
          </span>
        ))}
      </div>

      {NODES.map((node, index) => {
        const shown = flight(index, node.id);
        const settled = shown.opacity > 0.98 && dragging !== node.id;
        return (
          <button
            key={node.id}
            type="button"
            aria-label={`Mover ${node.label}`}
            onPointerDown={(event) => onPointerDown(node.id, event)}
            className={`${node.tone} absolute z-20 flex min-w-36 cursor-grab items-center gap-2.5 rounded-2xl border border-navy/10 px-3 py-2 text-left shadow-xl active:cursor-grabbing ${embedded || !wide ? "hidden" : "block"} ${settled ? "float" : ""}`}
            style={{
              left: `${shown.x}%`,
              top: `${shown.y}%`,
              opacity: shown.opacity,
              transform: `scale(${shown.scale})`,
              transformOrigin: "center center",
              animationDelay: `${index * -1.1}s`,
              pointerEvents: shown.opacity > 0.7 ? "auto" : "none",
            }}
          >
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${node.id === "meta" ? "bg-white/20" : "bg-navy/10"}`}>
              <ChannelMark id={node.id} />
            </span>
            <span>
              <span className="block text-[10px] font-bold tracking-[0.14em] uppercase opacity-70">{node.hint}</span>
              <span className="font-soft text-sm font-extrabold">{node.label}</span>
            </span>
          </button>
        );
      })}

      <div
        className={`relative z-10 w-full ${embedded ? "" : "mx-auto max-w-xl md:absolute md:top-[46%] md:left-1/2 md:w-[min(32rem,44%)]"}`}
        style={wide ? { transform: `translate(-50%, -50%) perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` } : undefined}
      >
        <div className="glass-card overflow-hidden rounded-[28px]">
          <div className="flex items-center justify-between border-b border-paper px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-lime" />
              <p className="text-xs font-bold tracking-[0.16em] text-navy/60">FOCUS HUB</p>
            </div>
            <div className="flex rounded-full bg-paper p-1 text-xs font-bold">
              {(
                [
                  ["chat", "Chat"],
                  ["pauta", "Pauta"],
                  ["flujo", "Flujo"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setScene(id)}
                  className={`rounded-full px-3 py-1 ${scene === id ? "bg-navy text-white" : "text-navy/70"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {scene === "chat" && (
            <div className={`grid gap-0 ${embedded ? "" : "md:grid-cols-[1.3fr_0.8fr]"}`}>
              <div className="flex min-h-72 flex-col p-4">
                <div className="flex flex-1 flex-col gap-2">
                  {messages.map((message, index) => (
                    <p
                      key={`${message.from}-${index}`}
                      className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${message.from === "bot" ? "bg-paper text-navy" : "ml-auto bg-navy text-white"}`}
                    >
                      {message.text}
                    </p>
                  ))}
                  {pending && (
                    <p className="w-fit rounded-2xl bg-paper px-3 py-2 text-sm tracking-widest text-navy/50">···</p>
                  )}
                </div>
                {picked ? (
                  <button type="button" onClick={resetChat} className="mt-3 text-left text-xs font-bold text-focus">
                    Probar otra respuesta
                  </button>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(Object.keys(REPLIES) as ReplyKey[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => choose(key)}
                        className="rounded-full border border-navy/15 px-3 py-1.5 text-xs font-bold text-navy hover:bg-paper"
                      >
                        {REPLIES[key].user.replace(/\.$/, "")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <aside className={`border-t border-paper p-4 ${embedded ? "" : "md:border-t-0 md:border-l"} ${result?.focus ? "bg-lime" : "bg-paper"}`}>
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase">Lectura</p>
                <p className="font-soft mt-2 text-4xl font-extrabold">{result ? result.score : "—"}</p>
                <p className="mt-1 text-sm font-bold">{result ? result.tag : "Elige una respuesta"}</p>
                <p className="mt-3 text-sm">
                  {result ? (result.focus ? "Merece foco. Entra una persona." : "Puede seguir sola.") : "El score aparece cuando el visitante responde."}
                </p>
              </aside>
            </div>
          )}

          {scene === "pauta" && (
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-focus">CAMPAÑA DE LEADS</p>
                  <h3 className="mt-1 text-2xl font-extrabold">Norte · conversaciones</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setLive((value) => !value)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${live ? "bg-lime text-navy" : "bg-paper text-navy"}`}
                >
                  {live ? "Activa" : "En pausa"}
                </button>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Metric label="Inversión" value={spend.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })} />
                <Metric label="ROAS" value={roas} />
                <Metric label="Útiles" value={live ? "128" : "74"} />
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-paper">
                <div className="h-full rounded-full bg-focus transition-all duration-500" style={{ width: live ? "78%" : "36%" }} />
              </div>
              <p className="mt-3 text-sm text-navy/70">Pausa la campaña y mira cómo caen la inversión y el retorno de esta demo.</p>
            </div>
          )}

          {scene === "flujo" && (
            <div className="p-5">
              <p className="text-xs font-bold tracking-[0.16em] text-focus">FLUJO · CALIFICAR LEAD</p>
              <ol className="mt-4 space-y-2">
                {["Saludo", "Pregunta presupuesto", "Espera 4 h", "Asigna si score > 80"].map((step, index) => (
                  <li key={step}>
                    <button
                      type="button"
                      onClick={() => setFlowAt(index)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left ${flowAt === index ? "bg-navy text-white" : "bg-paper text-navy"}`}
                    >
                      <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-extrabold ${flowAt === index ? "bg-lime text-navy" : "bg-white"}`}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold">{step}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        {!embedded && <p className="mt-3 hidden text-center text-xs font-bold text-navy/50 md:block">Arrastra los canales. La línea los sigue.</p>}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-paper p-3">
      <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-navy/50">{label}</p>
      <p className="mt-1 text-sm font-extrabold md:text-base">{value}</p>
    </div>
  );
}

function Story() {
  const [step, setStep] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (paused.current) return;
      setStep((current) => (current + 1) % STORY.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, []);

  const current = STORY[step];

  return (
    <section
      id="sistema"
      data-tone="navy"
      className="relative text-white"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <div className="absolute inset-0 z-0 bg-navy" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-20">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-lime">SE MUEVE SOLO</p>
              <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">Cómo se mueve un lead.</h2>
            </div>
            <p className="max-w-sm text-sm text-white/70">Los cuatro pasos avanzan solos. Si te detienes encima, espera contigo.</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STORY.map((item, index) => (
            <Reveal key={item.kicker} delay={index * 80}>
              <button
                type="button"
                onClick={() => setStep(index)}
                className={`w-full rounded-2xl px-4 py-4 text-left transition ${index === step ? "bg-white text-navy" : "bg-navy-2 text-white hover:bg-white/15"}`}
              >
                <span className={`font-soft text-sm font-extrabold ${index === step ? "text-focus" : "text-lime"}`}>{item.kicker}</span>
                <span className="mt-1 block text-lg font-extrabold">{item.title}</span>
              </button>
            </Reveal>
          ))}
        </div>

        <article key={current.kicker} className="step-in animate-in fade-in zoom-in-95 slide-in-from-bottom-4 relative mt-4 grid items-center gap-6 overflow-hidden rounded-[32px] bg-white p-8 text-navy duration-500 md:grid-cols-[1.15fr_0.85fr] md:p-10">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-focus">{current.title}</p>
            <h3 className="font-soft mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">{current.face}</h3>
            <p className="mt-4 max-w-xl text-lg">{current.text}</p>
            <p className="mt-3 text-sm font-bold text-navy/60">{current.detail}</p>
            <div className="mt-8 h-2 overflow-hidden rounded-full bg-paper">
              <div className="h-full rounded-full bg-lime transition-all duration-700" style={{ width: `${((step + 1) / STORY.length) * 100}%` }} />
            </div>
          </div>
          <Mascot tone="navy" className="float mx-auto h-52 w-auto md:h-64" />
        </article>
      </div>
    </section>
  );
}

export function Landing() {
  const [open, setOpen] = useState<number | null>(0);
  const [service, setService] = useState(0);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const openWhatsApp = useCallback(() => setWhatsappOpen(true), []);
  const closeWhatsApp = useCallback(() => setWhatsappOpen(false), []);

  return (
    <div className="bg-paper text-navy">
      <NeuralField />
      <SiteSwitcher />
      <header className="sticky top-0 z-30 border-b border-navy/5 bg-paper/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1580px] items-center justify-between gap-4 px-4 py-3">
          <a href="#inicio" className="shrink-0">
            <BrandLogo className="h-11 w-auto" />
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
            <a href="#sistema" className="hover:text-focus">Sistema</a>
            <a href="#servicios" className="hover:text-focus">Servicios</a>
            <a href="#preguntas" className="hover:text-focus">Preguntas</a>
            <a href="#contacto" className="hover:text-focus">Contacto</a>
          </nav>
          <SocialLinks onWhatsApp={openWhatsApp} />
          <Link to="/hub" className="shrink-0 rounded-full bg-lime px-3 py-2 text-xs font-bold text-navy transition hover:-translate-y-0.5 sm:px-4 sm:text-sm">
            Entrar al Hub
          </Link>
        </div>
      </header>

      <section id="inicio" data-tone="light" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[#f4f7fb]" />
        <div className="pointer-events-none absolute -top-24 left-1/4 z-0 h-72 w-72 rounded-full bg-focus/20 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-10 z-0 h-80 w-80 rounded-full bg-lime/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-[1280px] px-4 pt-6 pb-8 md:px-8">
          <div className="glass-sheet rounded-[32px] p-2 md:p-3">
            <div className="hero-video">
              <iframe
                className="aspect-video w-full"
                src="https://www.youtube.com/embed/ERUiJeoRlX4?si=aEknFyAF9cXk55Lk"
                title="Video de Focus Chat & Agency"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
          <div className="glass-sheet relative z-10 mx-auto mt-5 flex max-w-5xl flex-col items-center gap-4 rounded-[28px] px-5 py-4 md:flex-row md:px-7">
            <div className="min-w-0 flex-1 text-center md:text-left">
              <p className="text-[11px] font-bold tracking-[0.22em] text-focus">FOCUS CHAT & AGENCY</p>
              <h1 className="mt-1 text-2xl leading-tight font-extrabold tracking-tight md:text-3xl">
                El cliente escribe. El sistema decide si entras tú.
              </h1>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-3">
              <Link to="/hub" className="rounded-full bg-navy px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5">
                Abrir el Hub
              </Link>
              <a href="#sistema" className="rounded-full border border-navy/10 bg-white/70 px-5 py-3 text-sm font-bold backdrop-blur">
                Ver cómo se mueve
              </a>
            </div>
          </div>
          <ProductStage />
        </div>
      </section>

      <div data-tone="light" className="relative">
        <div className="absolute inset-0 z-0 border-y border-navy/10 bg-white/75" />
        <div className="marquee relative z-10 py-4">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((item, index) => (
            <span key={`${item}-${index}`} className="mx-6 text-sm font-extrabold tracking-[0.18em] text-navy/70">
              {item}
            </span>
          ))}
        </div>
        </div>
      </div>

      <Story />

      <section id="servicios" data-tone="light" className="relative">
        <div className="absolute inset-0 z-0 bg-paper" />
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.18em] text-focus">QUÉ HACEMOS</p>
          <h2 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">Cuatro oficios. Una sola lectura del cliente.</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-12">
          {SERVICES.map((item, index) => {
            const active = service === index;
            return (
              <Reveal key={item.title} delay={index * 90} className={item.span}>
                <button
                  type="button"
                  onClick={() => setService(index)}
                  className={`${item.wash} h-full w-full rounded-[28px] p-7 text-left shadow-sm transition hover:-translate-y-1 ${active ? "ring-4 ring-navy/15" : ""}`}
                >
                  <span className="text-xs font-bold tracking-[0.16em] opacity-60">0{index + 1}</span>
                  <h3 className="font-soft mt-3 text-3xl font-extrabold">{item.title}</h3>
                  <p className={`mt-3 max-w-md text-base ${active ? "" : "opacity-80"}`}>{item.text}</p>
                </button>
              </Reveal>
            );
          })}
        </div>
        </div>
      </section>

      <section data-tone="lime" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-lime" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-6 px-5 py-16 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal from="zoom">
            <div className="float">
              <Mascot tone="navy" className="mx-auto h-72 w-auto md:h-[26rem]" />
            </div>
          </Reveal>
          <Reveal from="right" delay={140}>
            <p className="text-xs font-bold tracking-[0.18em]">PERSONAJE</p>
            <h2 className="font-soft mt-2 text-4xl font-extrabold tracking-tight md:text-6xl">Yo miro el ruido. Tú cierras.</h2>
            <p className="mt-4 max-w-xl text-lg">
              Señala la conversación caliente y deja el resto andando. En el Hub puedes crear el lead, armar el flujo y conectar la herramienta que lo ejecuta.
            </p>
            <Link to="/hub/flujos" className="mt-6 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-bold text-white">
              Crear un flujo
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="preguntas" data-tone="light" className="relative">
        <div className="absolute inset-0 z-0 bg-paper" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 py-20">
        <Reveal>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Preguntas cortas.</h2>
        </Reveal>
        <div className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
          {FAQ.map(([question, answer], index) => {
            const shown = open === index;
            return (
              <Reveal key={question} delay={index * 70}>
                <button
                  type="button"
                  aria-expanded={shown}
                  onClick={() => setOpen(shown ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-lg font-extrabold">{question}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-sm font-bold text-white">
                    {shown ? "–" : "+"}
                  </span>
                </button>
                {shown && <p className="pb-5 text-navy/75">{answer}</p>}
              </Reveal>
            );
          })}
        </div>
        </div>
      </section>

      <ContactForm />

      <SiteFooter onWhatsApp={openWhatsApp} />
      <WhatsAppChat open={whatsappOpen} onOpen={openWhatsApp} onClose={closeWhatsApp} />
    </div>
  );
}
