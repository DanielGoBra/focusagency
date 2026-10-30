import { useLayoutEffect, useRef, useState } from "react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";

function Knot() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        d="M12 3.2c2.2 1.4 3.2 3.2 3.2 5.2 0 1.2-.4 2.2-1.1 3 .7.8 1.1 1.8 1.1 3 0 2-1 3.8-3.2 5.2-2.2-1.4-3.2-3.2-3.2-5.2 0-1.2.4-2.2 1.1-3-.7-.8-1.1-1.8-1.1-3 0-2 1-3.8 3.2-5.2z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M8.2 8.4c1.6 1 2.6 1.6 3.8 1.6s2.2-.6 3.8-1.6M8.2 15.6c1.6-1 2.6-1.6 3.8-1.6s2.2.6 3.8 1.6" />
    </svg>
  );
}

function PublicIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1.15a6.85 6.85 0 1 0 .01 13.7A6.85 6.85 0 0 0 8 1.15Zm0 1.25c.55 0 1.55 1.55 1.95 4.15H6.05C6.45 3.95 7.45 2.4 8 2.4ZM3.05 8.7h2.15c.12 1.55.48 2.95.95 3.95A5.6 5.6 0 0 1 3.05 8.7Zm2.2-1.4H3.05A5.6 5.6 0 0 1 6.15 3.4c-.47 1-.83 2.4-.9 3.9Zm.95 0h3.6c-.28 2.15-1.05 3.7-1.8 3.7s-1.52-1.55-1.8-3.7Zm3.75 0h2.2A5.6 5.6 0 0 1 9.85 12.65c.47-1 .83-2.4.9-3.95Zm2.2-1.4h-2.15c-.12-1.5-.48-2.9-.95-3.9a5.6 5.6 0 0 1 3.1 3.9ZM6.15 12.6c.47.35 1.1.55 1.85.55s1.38-.2 1.85-.55c-.47-1-1.05-2.45-1.85-2.45s-1.38 1.45-1.85 2.45Z"
      />
    </svg>
  );
}

function ActionIcon({ kind }: { kind: "like" | "comment" | "share" }) {
  if (kind === "like") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path fill="currentColor" d="M8.2 10.2V20H5.4A1.4 1.4 0 0 1 4 18.6v-7a1.4 1.4 0 0 1 1.4-1.4h2.8Zm2.1-.4 2.2-4.2a1.7 1.7 0 0 1 1.5-.9c.9 0 1.6.8 1.5 1.7l-.4 3.2h4.3a1.8 1.8 0 0 1 1.8 2.1l-1 6.2a1.8 1.8 0 0 1-1.8 1.5H10.3a2 2 0 0 1-2-1.6v-6.6c0-.5.2-.9.5-1.4Z" />
      </svg>
    );
  }
  if (kind === "comment") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path fill="currentColor" d="M5 5.5h14A1.5 1.5 0 0 1 20.5 7v8A1.5 1.5 0 0 1 19 16.5h-6.2L8 20.2v-3.7H5A1.5 1.5 0 0 1 3.5 15V7A1.5 1.5 0 0 1 5 5.5Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="currentColor" d="M13.2 4.2 20 11l-6.8 6.8v-3.6H9.4c-3.2 0-5.2 1.5-6.4 4.2.2-4.8 2.6-9.2 10.2-9.6V4.2Z" />
    </svg>
  );
}

function FlowNode({
  kicker,
  label,
  action = false,
  glyph,
  className = "",
}: {
  kicker: string;
  label: string;
  action?: boolean;
  glyph: "message" | "bolt";
  className?: string;
}) {
  return (
    <article className={`n8n-node ${action ? "n8n-node-action" : ""} ${className}`}>
      <span className="n8n-port n8n-port-in" />
      <span className="n8n-glyph" aria-hidden>
        {glyph === "message" ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="currentColor" d="M5 6.2h14A1.2 1.2 0 0 1 20.2 7.4v7.2a1.2 1.2 0 0 1-1.2 1.2H9.4L6 19.2v-3.4H5A1.2 1.2 0 0 1 3.8 14.6V7.4A1.2 1.2 0 0 1 5 6.2Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="currentColor" d="M13.2 2.5 4.8 13.2h6.1l-1 8.3 9.3-11.4h-6.2l.2-7.6Z" />
          </svg>
        )}
      </span>
      <div>
        <p className="n8n-kicker">{kicker}</p>
        <p className="n8n-label">{label}</p>
      </div>
      <span className="n8n-knot">
        <Knot />
      </span>
      <span className="n8n-port n8n-port-out" />
    </article>
  );
}

function OpenAiMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
      <path
        fill="currentColor"
        d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.142-.081 4.778-2.758a.795.795 0 0 0 .393-.681v-6.737l2.02 1.169a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.495 4.493zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.677l5.815 3.354-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387 2.015-1.164a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.307 12.863l-2.02-1.164a.08.08 0 0 1-.038-.057V6.074a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"
      />
    </svg>
  );
}

function AgentBrain() {
  return (
    <div className="opportunity-brain">
      <p className="opportunity-brain-title">Responde a cada comentario o reacción.</p>
      <ul className="opportunity-brain-row">
        <li>
          <span className="brain-mark brain-ig">
            <SiInstagram className="h-8 w-8" aria-hidden />
          </span>
          <span className="sr-only">Instagram</span>
        </li>
        <li>
          <span className="brain-mark brain-fb">
            <SiFacebook className="h-8 w-8" aria-hidden />
          </span>
          <span className="sr-only">Facebook</span>
        </li>
        <li>
          <span className="brain-mark brain-wa">
            <SiWhatsapp className="h-8 w-8" aria-hidden />
          </span>
          <span className="sr-only">WhatsApp</span>
        </li>
        <li>
          <span className="brain-mark brain-ai">
            <OpenAiMark />
          </span>
          <span className="sr-only">OpenAI, cerebro del agente</span>
        </li>
      </ul>
    </div>
  );
}

type WirePoint = { x: number; y: number };
type WireFigure = { d: string; dots: WirePoint[] };

function n(value: number) {
  return value.toFixed(1);
}

function pointOf(stage: DOMRect, node: Element, side: "left" | "right" | "center") {
  const box = node.getBoundingClientRect();
  const x = side === "left" ? box.left : side === "right" ? box.right : box.left + box.width / 2;
  return { x: x - stage.left, y: box.top + box.height / 2 - stage.top };
}

function uniqueDots(dots: WirePoint[]) {
  const kept: WirePoint[] = [];
  for (const dot of dots) {
    if (kept.some((item) => Math.hypot(item.x - dot.x, item.y - dot.y) < 10)) continue;
    kept.push(dot);
  }
  return kept;
}

function link(from: WirePoint, to: WirePoint) {
  if (Math.abs(from.y - to.y) < 6) {
    return { d: `M ${n(from.x)} ${n(from.y)} H ${n(to.x)}`, dots: [] as WirePoint[] };
  }
  const bend = to.x >= from.x ? to.x - 18 : from.x - 18;
  return {
    d: `M ${n(from.x)} ${n(from.y)} H ${n(bend)} V ${n(to.y)} H ${n(to.x)}`,
    dots: [
      { x: bend, y: from.y },
      { x: bend, y: to.y },
    ],
  };
}

function stackedWires(
  comment: WirePoint,
  triggerIn: WirePoint,
  triggerOut: WirePoint,
  actionRight: WirePoint,
  actionLeft: WirePoint,
  reply: WirePoint,
): WireFigure {
  const rightRail = Math.max(triggerOut.x, actionRight.x) + 26;
  const leftRail = Math.min(triggerIn.x, actionLeft.x) - 18;
  const bow = Math.min(16, Math.abs(actionRight.y - triggerOut.y) / 2);
  const drop = Math.min(16, Math.abs(triggerOut.y - comment.y) / 2);
  const intoTrigger = [
    `M ${n(comment.x)} ${n(comment.y)}`,
    `H ${n(rightRail - drop)}`,
    `Q ${n(rightRail)} ${n(comment.y)} ${n(rightRail)} ${n(comment.y + drop)}`,
    `V ${n(triggerOut.y - bow)}`,
    `Q ${n(rightRail)} ${n(triggerOut.y)} ${n(rightRail - bow)} ${n(triggerOut.y)}`,
    `H ${n(triggerOut.x)}`,
  ].join(" ");
  const bridge = [
    `M ${n(triggerOut.x)} ${n(triggerOut.y)}`,
    `H ${n(rightRail - bow)}`,
    `Q ${n(rightRail)} ${n(triggerOut.y)} ${n(rightRail)} ${n(triggerOut.y + bow)}`,
    `V ${n(actionRight.y - bow)}`,
    `Q ${n(rightRail)} ${n(actionRight.y)} ${n(rightRail - bow)} ${n(actionRight.y)}`,
    `H ${n(actionRight.x)}`,
  ].join(" ");
  const intoReply = [
    `M ${n(actionLeft.x)} ${n(actionLeft.y)}`,
    `H ${n(leftRail)}`,
    `V ${n(reply.y)}`,
    `H ${n(reply.x)}`,
  ].join(" ");
  return {
    d: `${intoTrigger} ${bridge} ${intoReply}`,
    dots: uniqueDots([
      { x: rightRail, y: comment.y + drop },
      { x: rightRail, y: triggerOut.y },
      { x: rightRail, y: actionRight.y },
      { x: leftRail, y: actionLeft.y },
      { x: leftRail, y: reply.y },
    ]),
  };
}

function integratedWires(
  comment: WirePoint,
  triggerIn: WirePoint,
  triggerOut: WirePoint,
  actionRight: WirePoint,
  actionLeft: WirePoint,
  reply: WirePoint,
): WireFigure {
  const intoTrigger = link(comment, triggerIn);
  const rail = Math.max(triggerOut.x, actionRight.x) + 34;
  const bow = Math.min(18, Math.abs(actionRight.y - triggerOut.y) / 2);
  const bridge = [
    `M ${n(triggerOut.x)} ${n(triggerOut.y)}`,
    `H ${n(rail - bow)}`,
    `Q ${n(rail)} ${n(triggerOut.y)} ${n(rail)} ${n(triggerOut.y + bow)}`,
    `V ${n(actionRight.y - bow)}`,
    `Q ${n(rail)} ${n(actionRight.y)} ${n(rail - bow)} ${n(actionRight.y)}`,
    `H ${n(actionRight.x)}`,
  ].join(" ");
  const intoReply = link(actionLeft, reply);
  return {
    d: `${intoTrigger.d} ${bridge} ${intoReply.d}`,
    dots: uniqueDots([...intoTrigger.dots, ...intoReply.dots]),
  };
}

export function OpportunityFlow({ dark = true }: { dark?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [figure, setFigure] = useState<WireFigure>({ d: "", dots: [] });
  const [frame, setFrame] = useState({ w: 1, h: 1 });

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const root = stage.getBoundingClientRect();
      const comment = stage.querySelector("[data-wire='comment']");
      const reply = stage.querySelector("[data-wire='reply']");
      const triggerIn = stage.querySelector(".n8n-card-a .n8n-port-in");
      const triggerOut = stage.querySelector(".n8n-card-a .n8n-port-out");
      const actionLeft = stage.querySelector(".n8n-card-b .n8n-port-in");
      const actionRight = stage.querySelector(".n8n-card-b .n8n-port-out");
      if (!comment || !reply || !triggerIn || !triggerOut || !actionLeft || !actionRight) return;
      const commentRight = pointOf(root, comment, "right");
      const replyRight = pointOf(root, reply, "right");
      const replyLeft = pointOf(root, reply, "left");
      const triggerInPoint = pointOf(root, triggerIn, "center");
      const triggerOutPoint = pointOf(root, triggerOut, "center");
      const actionRightPoint = pointOf(root, actionRight, "center");
      const actionLeftPoint = pointOf(root, actionLeft, "center");
      const stacked = triggerInPoint.y > replyRight.y + 80;
      setFrame({ w: root.width, h: root.height });
      setFigure(
        stacked
          ? stackedWires(commentRight, triggerInPoint, triggerOutPoint, actionRightPoint, actionLeftPoint, replyLeft)
          : integratedWires(commentRight, triggerInPoint, triggerOutPoint, actionRightPoint, actionLeftPoint, replyRight),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section id="sistema" data-tone={dark ? "navy" : "light"} className="template-sheet relative z-10">
      <img src="/brand/mascot/serio.png?v=8" alt="FOCU triste" className="opportunity-sad" />
      <img src="/brand/mascot/frente.png?v=8" alt="FOCU con las manos abiertas" className="opportunity-open" />
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="flex justify-center">
          <h2 className="opportunity-title sheet-title text-center text-3xl font-extrabold tracking-tight text-[#14245c] md:text-5xl">
            No vuelvas a perder una oportunidad
          </h2>
        </div>
        <div ref={stageRef} className="opportunity-stage mx-auto mt-12 grid max-w-5xl">
          <svg className="flow-wires" viewBox={`0 0 ${frame.w} ${frame.h}`} aria-hidden>
            {figure.d ? (
              <>
                <path className="n8n-track-core" d={figure.d} />
                <path className="n8n-track" d={figure.d} />
              </>
            ) : null}
            {figure.dots.map((dot) => (
              <circle key={`${dot.x.toFixed(1)}-${dot.y.toFixed(1)}`} className="n8n-joint" cx={dot.x} cy={dot.y} r="6" />
            ))}
          </svg>
          <article className="fb-post post-card">
            <header className="fb-head">
              <span className="fb-avatar">
                <img src="/brand/focu-bulb.png?v=2" alt="" />
              </span>
              <div>
                <p className="fb-name">
                  FOCUS <span className="fb-follow">· Seguir</span>
                </p>
                <p className="fb-time">
                  Justo ahora <PublicIcon />
                </p>
              </div>
              <span className="fb-menu" aria-hidden>
                ···
              </span>
            </header>
            <p className="fb-copy">¡Bienvenidos, deja tus preguntas para el live!</p>
            <img src="/brand/post-live.png" alt="" className="fb-photo" />
            <div className="fb-stats">
              <span className="fb-reactions" aria-hidden>
                <span className="bg-[#1877f2]">👍</span>
                <span className="bg-[#f33e58]">❤️</span>
                <span className="bg-[#f7b125]">😮</span>
                <span className="bg-[#f7b125]">😂</span>
              </span>
              <span>2 comentarios</span>
            </div>
            <div className="fb-actions">
              <span className="fb-like"><ActionIcon kind="like" /> Me gusta</span>
              <span><ActionIcon kind="comment" /> Comentar</span>
              <span><ActionIcon kind="share" /> Compartir</span>
            </div>
            <div className="fb-thread">
              <div className="fb-comment">
                <span className="fb-ava">S</span>
                <div className="fb-bubble" data-wire="comment">
                  <strong>Sara</strong>
                  ¿Cuales son los casos de uso?
                </div>
              </div>
              <div className="fb-comment fb-reply">
                <span className="fb-mini">
                  <img src="/brand/focu-bulb.png?v=2" alt="" />
                </span>
                <div className="fb-bubble" data-wire="reply">
                  <strong>FOCUS</strong>
                  Hola Sara, es una gran pregunta. Cuando se trata de automatización...
                </div>
              </div>
            </div>
          </article>

          <AgentBrain />
          <div className="n8n-board">
            <FlowNode className="n8n-card-a" kicker="Trigger" label="Usuaria comenta" glyph="message" />
            <FlowNode className="n8n-card-b" kicker="Acción" label="Agente responsivo" glyph="bolt" action />
          </div>
        </div>
      </div>
    </section>
  );
}
