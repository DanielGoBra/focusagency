import { createClient } from "@supabase/supabase-js";
import { createDemoRepo, createSupabaseRepo, type Repo } from "@negocios/data";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const DEMO_KEY = "negocios-demo-v1";

// Con las variables de Supabase la app usa la base real; sin ellas, la demo.
export const repo: Repo =
  url && anonKey
    ? createSupabaseRepo(createClient(url, anonKey))
    : createDemoRepo({
        storage: {
          load: () => {
            try {
              return localStorage.getItem(DEMO_KEY);
            } catch {
              return null;
            }
          },
          save: (value) => {
            try {
              localStorage.setItem(DEMO_KEY, value);
            } catch {
              // Navegación privada: la demo sigue en memoria.
            }
          },
        },
      });
