import { useRef, useState } from "react";
import { Play } from "lucide-react";

/**
 * Video propio alojado en /public/videos. Hasta que alguien pulsa play solo se descarga
 * la portada (WebP de ~40 KB); el MP4 está optimizado para streaming (faststart), así que
 * arranca sin esperar a bajarse completo.
 */
export function BrandVideo({
  src,
  poster,
  title,
  duration,
  priority = false,
  portrait = false,
  className = "",
}: {
  src: string;
  poster: string;
  title: string;
  duration?: string;
  /** Portada visible al cargar la página (hero): se pide con prioridad en vez de en diferido. */
  priority?: boolean;
  /** Video vertical 9:16 (testimonios grabados con el celular). */
  portrait?: boolean;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className={`relative w-full overflow-hidden bg-[#071428] ${portrait ? "aspect-[9/16]" : "aspect-video"} ${className}`}>
      {playing ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full bg-black object-contain"
          src={src}
          poster={poster}
          title={title}
          controls
          autoPlay
          playsInline
          preload="auto"
          controlsList="nodownload"
          onEnded={() => {
            const video = videoRef.current;
            if (video && document.fullscreenElement === video) void document.exitFullscreen();
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer"
          aria-label={`Reproducir: ${title}`}
        >
          <img
            src={poster}
            alt=""
            width={portrait ? 720 : 1280}
            height={portrait ? 1280 : 720}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(7_20_40/0.05),rgb(7_20_40/0.45))] transition group-hover:opacity-70" />
          <span className="pointer-events-none absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
            <span className="ping-soft absolute h-20 w-20 rounded-full bg-[#2bbdef]/40 sm:h-24 sm:w-24" />
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#2ad8ff] to-lime text-navy shadow-[0_0_40px_rgb(43_189_239/0.6)] transition duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
              <Play className="ml-1 h-7 w-7 fill-current sm:h-9 sm:w-9" strokeWidth={0} />
            </span>
          </span>
          {duration ? (
            <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-[#071428]/80 px-2.5 py-1 text-xs font-extrabold text-white backdrop-blur-sm">
              {duration}
            </span>
          ) : null}
        </button>
      )}
    </div>
  );
}
