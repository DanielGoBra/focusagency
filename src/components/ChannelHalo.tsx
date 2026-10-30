import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  SiFacebook,
  SiGmail,
  SiGoogle,
  SiInstagram,
  SiMessenger,
  SiMeta,
  SiTelegram,
  SiTiktok,
  SiWhatsapp,
  SiYoutube,
} from "react-icons/si";

const ICONS: { name: string; Icon: IconType; color: string }[] = [
  { name: "WhatsApp", Icon: SiWhatsapp, color: "#25D366" },
  { name: "Instagram", Icon: SiInstagram, color: "#E4405F" },
  { name: "Facebook", Icon: SiFacebook, color: "#0866FF" },
  { name: "Messenger", Icon: SiMessenger, color: "#00B2FF" },
  { name: "Telegram", Icon: SiTelegram, color: "#26A5E4" },
  { name: "Gmail", Icon: SiGmail, color: "#EA4335" },
  { name: "Google", Icon: SiGoogle, color: "#4285F4" },
  { name: "YouTube", Icon: SiYoutube, color: "#FF0000" },
  { name: "TikTok", Icon: SiTiktok, color: "#111111" },
  { name: "Meta", Icon: SiMeta, color: "#0081FB" },
];

const SLOT = 76;
const HOLD = 1500;
const MOVE = 450;

function easeInOut(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - ((-2 * value + 2) ** 2) / 2;
}

export function ChannelReel() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [breathe, setBreathe] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let hold = 0;
    let stopped = false;

    const begin = () => {
      const start = performance.now();
      const step = (now: number) => {
        if (stopped) return;
        const t = Math.min(1, (now - start) / MOVE);
        setProgress(easeInOut(t));
        if (t < 1) {
          frame = requestAnimationFrame(step);
          return;
        }
        setIndex((current) => (current + 1) % ICONS.length);
        setProgress(0);
        hold = window.setTimeout(begin, HOLD);
      };
      frame = requestAnimationFrame(step);
    };

    hold = window.setTimeout(begin, HOLD);
    return () => {
      stopped = true;
      window.clearTimeout(hold);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (progress !== 0) {
      setBreathe(false);
      return;
    }
    const id = window.setTimeout(() => setBreathe(true), 700);
    return () => window.clearTimeout(id);
  }, [progress, index]);

  const slots = [-2, -1, 0, 1, 2, 3];

  return (
    <div className="mx-auto mb-3 w-[380px] max-w-full overflow-hidden" aria-hidden="true">
      <div className="flex items-center" style={{ transform: `translateX(${-SLOT * progress}px)` }}>
        {slots.map((offset) => {
          const item = ICONS[(index + offset + ICONS.length) % ICONS.length];
          const distance = Math.abs(offset - progress);
          const emphasis = Math.max(0, 1 - distance);
          const settled = progress === 0 && offset === 0 && breathe;
          return (
            <span key={offset} className="grid shrink-0 place-items-center" style={{ width: SLOT, height: SLOT }}>
              <span
                className={`grid place-items-center ${item.name === "TikTok" ? "reel-tiktok" : ""}`}
                style={{
                  color: item.color,
                  opacity: 0.22 + emphasis * 0.78,
                  transform: `scale(${0.62 + emphasis * 0.46})`,
                }}
              >
                <span key={settled ? `breath-${index}` : "still"} className={settled ? "icon-breathe grid place-items-center" : "grid place-items-center"}>
                  <item.Icon size={42} aria-hidden />
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
