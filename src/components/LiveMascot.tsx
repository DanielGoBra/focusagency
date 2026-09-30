import { useEffect, useRef, useState } from "react";
import { MetaInfinity } from "./MetaPartner";

const CYCLE = ["partner", "frase", "video", "agency", "academy", "servicios", "sistema", "contacto"] as const;

const COPY: Record<string, { kicker: string; text: string; partner?: boolean }> = {
  partner: { kicker: "Somos", text: "Meta Business Partner", partner: true },
  frase: { kicker: "24/7", text: "Responde, asesora, agenda y vende" },
  video: { kicker: "Míralo", text: "El video está aquí" },
  agency: { kicker: "Ruta", text: "Entra a Focus Agency" },
  academy: { kicker: "Ruta", text: "Entra a Focus Academy" },
  servicios: { kicker: "Oficio", text: "Chatbots, pauta y flujos" },
  sistema: { kicker: "Sistema", text: "Así se mueve un lead" },
  preguntas: { kicker: "Dudas", text: "Abre las preguntas" },
  contacto: { kicker: "Hola", text: "Escríbele al equipo" },
  chat: { kicker: "Estás en", text: "Focuschat" },
};

const POSES = {
  frente: "/brand/mascot/frente.png?v=5",
  senala: "/brand/mascot/senala.png?v=5",
} as const;

type Pose = keyof typeof POSES;

const POSE_FOR: Record<string, Pose> = {
  partner: "senala",
  frase: "frente",
  video: "senala",
  agency: "frente",
  academy: "senala",
  servicios: "frente",
  sistema: "senala",
  preguntas: "frente",
  contacto: "senala",
  chat: "frente",
};

export function LiveMascot() {
  const tiltRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const cue = hover ?? CYCLE[step] ?? "partner";
  const line = COPY[cue] ?? COPY.partner;
  const pose = POSE_FOR[cue] ?? "senala";

  useEffect(() => {
    if (hover) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setStep((current) => (current + 1) % CYCLE.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [hover]);

  useEffect(() => {
    const onOver = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest("[data-cue]");
      const id = el?.getAttribute("data-cue");
      if (!id || !COPY[id]) return;
      setHover((current) => (current === id ? current : id));
    };
    const onOut = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest("[data-cue]");
      if (!el) return;
      const next = event instanceof PointerEvent && event.relatedTarget instanceof Node ? event.relatedTarget : null;
      if (next && el.contains(next)) return;
      setHover(null);
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return () => {
        document.removeEventListener("pointerover", onOver);
        document.removeEventListener("pointerout", onOut);
      };
    }

    let frame = 0;
    const tick = (now: number) => {
      const tilt = tiltRef.current;
      if (tilt) {
        const bob = Math.sin(now / 1600) * 6;
        tilt.style.transform = `translateY(${bob}px)`;
      }
      if (shadowRef.current) {
        shadowRef.current.style.transform = `scaleX(${1 - Math.sin(now / 1600) * 0.06})`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <div className="pointer-events-none relative mx-auto w-[220px] sm:w-[260px]">
      <div className="focu-bubble relative z-10 mb-3 rounded-[22px] border-2 border-[#2BBDEF] bg-white px-3 py-2.5 text-[#202246] shadow-[0_0_16px_rgb(94_211_252_/_0.9),0_0_34px_rgb(43_189_239_/_0.6)]">
        {line?.partner ? (
          <p className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.16em] text-[#202246]/55 uppercase">Somos</span>
            <MetaInfinity className="h-4 w-7 shrink-0 text-[#0081FB]" />
            <span className="text-[13px] leading-tight font-extrabold text-[#202246]">
              Meta
              <span className="block text-[10px] font-bold text-[#202246]/70">Business Partner</span>
            </span>
          </p>
        ) : (
          <p>
            <span className="text-[10px] font-bold tracking-[0.16em] text-[#202246] uppercase">{line?.kicker}</span>
            <span className="mt-0.5 block text-sm leading-snug font-extrabold text-[#202246]">{line?.text}</span>
          </p>
        )}
        <span className="absolute -bottom-2 left-9 h-4 w-4 rotate-45 border-2 border-[#2BBDEF] bg-[#2BBDEF]" />
        <span className="absolute -bottom-[5px] left-[38px] h-3.5 w-3.5 rotate-45 bg-white" />
      </div>
      <div ref={tiltRef} className="relative h-64 sm:h-72">
        {(Object.keys(POSES) as Pose[]).map((name) => (
          <img
            key={name}
            src={POSES[name]}
            alt=""
            draggable={false}
            className={`absolute inset-0 h-full w-full object-contain object-bottom select-none transition-opacity duration-700 ${name === pose ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>
      <div ref={shadowRef} className="mx-auto mt-1 h-3 w-28 rounded-full bg-navy/15 blur-sm" />
    </div>
  );
}
