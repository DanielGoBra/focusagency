import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { mountParticleStage } from "./particleStage";

export function ParticleMorph({
  src,
  label,
  className = "",
  ink = "light",
}: {
  src: string;
  label: string;
  className?: string;
  ink?: "light" | "ink";
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (reduce || !stage || !canvas) return;
    let stop = () => {};
    let gone = false;
    mountParticleStage(canvas, stage, src, ink)
      .then((dispose) => {
        if (gone) dispose();
        else stop = dispose;
      })
      .catch(() => {
        if (!gone) setFailed(true);
      });
    return () => {
      gone = true;
      stop();
    };
  }, [ink, reduce, src]);

  if (reduce || failed) {
    return (
      <div className={`grid place-items-center ${className}`}>
        <img src={src} alt={label} className={`max-h-full w-auto object-contain ${ink === "light" ? "mix-blend-screen" : "mix-blend-multiply"}`} />
      </div>
    );
  }

  return (
    <div ref={stageRef} className={`particle-stage relative ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-label={label} />
    </div>
  );
}
