type Tone = "navy" | "white" | "green" | "blue";

export function BrandLogo({
  variant = "navy",
  layout = "horizontal",
  className = "h-12 w-auto",
}: {
  variant?: "navy" | "white";
  layout?: "horizontal" | "vertical";
  className?: string;
}) {
  const vertical = layout === "vertical";
  const src = vertical
    ? variant === "white"
      ? "/brand/logo-chat-v-white.png"
      : "/brand/logo-chat-v.png"
    : variant === "white"
      ? "/brand/logo-chat-h-white.png"
      : "/brand/logo-chat-h.png";
  return (
    <img
      src={src}
      alt="Focus Chat & Agency"
      width={vertical ? 254 : 475}
      height={vertical ? 371 : 171}
      draggable={false}
      className={`${className} object-contain`}
    />
  );
}

export function Mascot({ tone = "navy", className = "h-64 w-auto" }: { tone?: Tone; className?: string }) {
  return <img src={`/brand/mascot-${tone}.png`} alt="" className={className} />;
}

export function Constellation() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g stroke="#48a4dc" strokeOpacity="0.55" fill="#48a4dc">
        <path d="M80 120 L210 80 L300 180 L180 240 Z M210 80 L420 140 L300 180 M420 140 L560 60 L640 160 L480 220 L420 140 M640 160 L820 90 L900 200 L760 250 L640 160 M180 240 L260 360 L120 420 M300 180 L360 340 L520 300 L480 220 M900 200 L1040 120 L1120 240 L980 320 L900 200" fill="none" strokeWidth="1.2" />
        {[
          [80, 120], [210, 80], [300, 180], [180, 240], [420, 140], [560, 60], [640, 160], [480, 220],
          [820, 90], [900, 200], [760, 250], [260, 360], [120, 420], [360, 340], [520, 300], [1040, 120],
          [1120, 240], [980, 320],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.2" />
        ))}
      </g>
    </svg>
  );
}
