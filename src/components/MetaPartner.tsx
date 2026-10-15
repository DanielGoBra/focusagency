const META_LOGO =
  "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z";

const POINTS = [
  {
    title: "Menor riesgo de bloqueos",
    icon: (
      <path d="M12 3.5 19 6.2v5.3c0 4.2-2.8 7.2-7 8.5-4.2-1.3-7-4.3-7-8.5V6.2L12 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    ),
  },
  {
    title: "Automatización alineada a políticas oficiales",
    icon: (
      <path d="M12 4v16M7 7h10M8.5 7 7 17h4L12 7M15.5 7 17 17h-4L12 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
  {
    title: "Acceso a WhatsApp API real",
    icon: <path d="M13 3 6 13h5l-1 8 8-12h-5l0-6Z" fill="currentColor" />,
  },
  {
    title: "Escalabilidad sin hacks",
    icon: (
      <path d="M8 11V8.2a4 4 0 0 1 8 0V11M7 11h10v8H7v-8Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    ),
  },
];

export function MetaInfinity({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d={META_LOGO} fill="currentColor" />
    </svg>
  );
}

function MetaTube() {
  return (
    <div className="meta-stage meta-logo-slot">
      <img src="/brand/whatsapp-icon.png" alt="" className="meta-wa meta-wa-a" />
      <img src="/brand/whatsapp-icon.png" alt="" className="meta-wa meta-wa-b" />
      <img src="/brand/whatsapp-icon.png" alt="" className="meta-wa meta-wa-c" />
      <img src="/brand/whatsapp-icon.png" alt="" className="meta-wa meta-wa-d" />
      <svg viewBox="0 0 24 24" className="meta-mark" role="img" aria-label="Logo de Meta">
        <defs>
          <linearGradient id="meta-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ec8ff" />
            <stop offset="42%" stopColor="#0082fb" />
            <stop offset="100%" stopColor="#044a9e" />
          </linearGradient>
          <clipPath id="meta-clip">
            <path d={META_LOGO} />
          </clipPath>
          <filter id="meta-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="0.55" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="meta-liquid-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="0.32" />
          </filter>
          <filter id="meta-rim-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.28" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <filter id="meta-orb-blur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="0.55" />
        </filter>
        <path id="meta-orbit-l" fill="none" d="M7.1 5.35C4.3 5.7 2.15 8.3 1.7 12.1C1.3 15.7 2.7 18.45 5.15 18.55C7.7 18.65 10.15 16.1 10.2 12.6C10.25 9.1 9.3 6.1 7.1 5.35Z" />
        <path id="meta-orbit-r" fill="none" d="M17.25 5.15C20.1 5.55 22.35 8.5 22.65 12.3C22.95 16.1 21.3 18.6 19.05 18.6C16.5 18.6 14.7 16 14.65 12.7C14.6 9.2 15.3 6.05 17.25 5.15Z" />
        <path d={META_LOGO} className="meta-halo" filter="url(#meta-glow)" />
        <path d={META_LOGO} fill="url(#meta-glass)" />
        <path d={META_LOGO} className="meta-rim" />
        <g clipPath="url(#meta-clip)">
          <circle className="meta-orb meta-orb-l" r="1.45" fill="#f7fbff" filter="url(#meta-orb-blur)" />
          <circle className="meta-orb meta-orb-r" r="1.25" fill="#d9f2ff" filter="url(#meta-orb-blur)" />
        </g>
      </svg>
    </div>
  );
}

export function MetaPartner() {
  return (
    <section id="servicios" data-tone="navy" className="meta-partner relative z-10">
      <div className="meta-layout mx-auto grid max-w-7xl items-end gap-6 px-5 py-16 md:py-20">
        <MetaTube />
        <div className="meta-copy">
          <div className="flex flex-wrap gap-2">
            <span className="meta-badge meta-badge-meta">
              <MetaInfinity className="h-3.5 w-3.5 text-[#0082fb] drop-shadow-[0_0_6px_rgb(0_130_251_/_0.95)]" />
              Meta Business Partners
            </span>
            <span className="meta-badge meta-badge-wa">
              <img src="/brand/whatsapp-icon.png" alt="" className="h-4 w-4 drop-shadow-[0_0_6px_rgb(37_211_102_/_0.95)]" />
              WhatsApp Solution Partner
            </span>
          </div>
          <h2 className="mt-5 max-w-xl text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            ¿Por qué importa ser Meta Business Partner?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Trabajamos directamente con Meta para brindarte estabilidad, cumplimiento y acceso oficial a WhatsApp API.
          </p>
        </div>
        <img src="/brand/mascot/cafe.png" alt="FOCU con una taza de café" className="meta-focu" />
        <ul className="meta-points grid gap-3 sm:grid-cols-2">
            {POINTS.map((point) => (
              <li key={point.title} className="meta-point">
                <span className="meta-point-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    {point.icon}
                  </svg>
                </span>
                <span>{point.title}</span>
              </li>
            ))}
          </ul>
      </div>
    </section>
  );
}
