/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly TURNSTILE_SITE_KEY?: string;
}

/** "production", "preview" o "development" (lo inyecta vite.config.ts). */
declare const __VERCEL_ENV__: string;
