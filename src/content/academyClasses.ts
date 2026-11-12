// Contenido del área de estudiantes de Focus Academy (/academy/clases).
// Para publicar una clase: agrega su video comprimido y su portada en /public/clases
// y completa `video`, `poster` y `duration`. Para un video de YouTube "no listado",
// usa `embed` con la URL https://www.youtube-nocookie.com/embed/ID.
// Las clases sin video se muestran como "Próximamente".

export type AcademyClass = {
  id: string;
  title: string;
  summary: string;
  duration?: string;
  video?: string;
  poster?: string;
  embed?: string;
};

export type TopicIcon = "start" | "live" | "ads" | "capcut" | "viral" | "crm";

export type AcademyTopic = {
  id: string;
  title: string;
  icon: TopicIcon;
  classes: AcademyClass[];
};

export const TOPICS: AcademyTopic[] = [
  {
    id: "bienvenida",
    title: "Empieza aquí",
    icon: "start",
    classes: [
      {
        id: "bienvenida-academy",
        title: "Bienvenida a Focus Academy",
        summary: "Cómo funciona la academia, qué vas a aprender y cómo aprovechar las clases en vivo y la comunidad.",
        duration: "1:32",
        video: "/videos/academy.mp4",
        poster: "/videos/academy-poster.webp",
      },
    ],
  },
  {
    id: "en-vivo",
    title: "Clases en vivo",
    icon: "live",
    classes: [
      { id: "en-vivo-1", title: "Clase 1", summary: "Grabación de la clase en vivo. Se publica aquí después de cada sesión." },
      { id: "en-vivo-2", title: "Clase 2", summary: "Grabación de la clase en vivo. Se publica aquí después de cada sesión." },
      { id: "en-vivo-3", title: "Clase 3", summary: "Grabación de la clase en vivo. Se publica aquí después de cada sesión." },
    ],
  },
  {
    id: "pauta",
    title: "Pauta publicitaria",
    icon: "ads",
    classes: [
      { id: "pauta-1", title: "Clase 1", summary: "Contenido por publicar." },
      { id: "pauta-2", title: "Clase 2", summary: "Contenido por publicar." },
    ],
  },
  {
    id: "capcut",
    title: "CapCut",
    icon: "capcut",
    classes: [
      { id: "capcut-1", title: "Clase 1", summary: "Contenido por publicar." },
      { id: "capcut-2", title: "Clase 2", summary: "Contenido por publicar." },
    ],
  },
  {
    id: "virales",
    title: "Videos virales",
    icon: "viral",
    classes: [
      { id: "virales-1", title: "Clase 1", summary: "Contenido por publicar." },
      { id: "virales-2", title: "Clase 2", summary: "Contenido por publicar." },
    ],
  },
  {
    id: "crm",
    title: "CRM",
    icon: "crm",
    classes: [
      { id: "crm-1", title: "Clase 1", summary: "Contenido por publicar." },
      { id: "crm-2", title: "Clase 2", summary: "Contenido por publicar." },
    ],
  },
];

export type LiveSession = {
  id: string;
  title: string;
  /** id del tema en TOPICS. */
  topic: string;
  /** Fecha y hora con zona horaria, p. ej. "2026-11-18T19:00:00-05:00" (hora Colombia). */
  start: string;
  minutes: number;
  /** Link de Meet/Zoom. Si no se pone, la página indica que se comparte en la comunidad. */
  link?: string;
};

// Sesiones de EJEMPLO para revisar el diseño: el equipo de Focus las reemplaza por las reales.
export const LIVE_SESSIONS: LiveSession[] = [
  { id: "vivo-2026-11-18", title: "Pauta publicitaria: tu primera campaña", topic: "pauta", start: "2026-11-18T19:00:00-05:00", minutes: 60 },
  { id: "vivo-2026-11-25", title: "CapCut: edita un video en 15 minutos", topic: "capcut", start: "2026-11-25T19:00:00-05:00", minutes: 60 },
  { id: "vivo-2026-12-02", title: "Videos virales: ganchos que retienen", topic: "virales", start: "2026-12-02T19:00:00-05:00", minutes: 60 },
  { id: "vivo-2026-12-09", title: "CRM: organiza y convierte tus leads", topic: "crm", start: "2026-12-09T19:00:00-05:00", minutes: 60 },
];
