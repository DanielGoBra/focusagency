import { useEffect, useRef } from "react";

type NeuralTone = "light" | "navy" | "lime" | "focus";

const NEURAL: Record<NeuralTone, { a: string; b: string; node: string; lime: string }> = {
  light: { a: "30, 250, 93", b: "43, 189, 239", node: "#202246", lime: "#1EFA5D" },
  navy: { a: "30, 250, 93", b: "186, 224, 255", node: "#ffffff", lime: "#1EFA5D" },
  lime: { a: "32, 34, 70", b: "26, 28, 51", node: "#202246", lime: "#1a1c33" },
  focus: { a: "32, 34, 70", b: "255, 255, 255", node: "#202246", lime: "#ffffff" },
};

function unit(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** Red neuronal animada en los costados de escritorio; toma el tono de cada sección con data-tone. */
export function NeuralField() {
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
      const band = sideBand(width);
      for (let i = 0; i < count; i += 1) {
        const slot = band ? (i % 2 === 0 ? unit(i + 1) * band.left : band.right + unit(i + 1) * (width - band.right)) : unit(i + 1) * width;
        nodes.push({
          x: slot,
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
      if (width < 960) {
        frame += 1;
        if (!reduce) raf = window.requestAnimationFrame(draw);
        return;
      }
      if (nodes.length === 0) seed();
      const reach = Math.min(120, sideBand(width).left * 0.85);

      const band = sideBand(width);
      for (const node of nodes) {
        if (!reduce) {
          node.angle += node.spin;
          node.x += Math.cos(node.angle) * node.speed;
          node.y += Math.sin(node.angle) * node.speed;
        }
        if (band && node.x > band.left && node.x < band.right) {
          node.x = node.x < width / 2 ? band.left - 12 : band.right + 12;
        }
        if (node.x < -30) node.x = band ? band.left - 12 : width + 30;
        if (node.x > width + 30) node.x = band ? band.right + 12 : -30;
        if (node.y < -30) node.y = height + 30;
        if (node.y > height + 30) node.y = -30;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        const tone = NEURAL[toneAt(scroll + a.y)];
        if (band && a.x > band.left && a.x < band.right) continue;
        const near: { index: number; dist: number }[] = [];
        for (let j = i + 1; j < nodes.length; j += 1) {
          if (band && nodes[j].x > band.left && nodes[j].x < band.right) continue;
          const dist = Math.hypot(a.x - nodes[j].x, a.y - nodes[j].y);
          if (dist <= reach) near.push({ index: j, dist });
        }
        near.sort((left, right) => left.dist - right.dist);
        for (const link of near.slice(0, 3)) {
          const b = nodes[link.index];
          const sameSide = (a.x < band.left && b.x < band.left) || (a.x > band.right && b.x > band.right);
          if (!sameSide) continue;
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
        if (band && node.x > band.left && node.x < band.right) continue;
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

  return <canvas ref={ref} className="neural-sides pointer-events-none fixed inset-0 z-[1] h-full w-full opacity-70" aria-hidden="true" />;
}

function sideBand(width: number) {
  const gutter = Math.max(96, width * 0.11);
  return { left: gutter, right: width - gutter };
}
