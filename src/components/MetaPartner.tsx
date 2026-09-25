export function MetaInfinity({ className = "h-5 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 86 40" className={className} fill="none" aria-hidden="true">
      <path
        d="M22 20c0-8 5-13 11-13 5 0 8 4 14 13s9 13 14 13 11-5 11-13-5-13-11-13-8 4-14 13-9 13-14 13-11-5-11-13z"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MetaPartner({ className = "" }: { className?: string }) {
  return (
    <div id="marca-partner" data-cue="partner" className={`gold-seal ${className}`}>
      <p className="gold-seal-inner flex items-center gap-2.5 px-3 py-1.5 text-navy">
        <span className="text-xs font-extrabold tracking-[0.16em] uppercase">Somos</span>
        <img src="/brand/meta-business-partner.png" alt="Meta Business Partner" className="h-9 w-auto sm:h-11" />
      </p>
    </div>
  );
}
