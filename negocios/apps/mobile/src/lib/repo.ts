import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { createDemoRepo, createSupabaseRepo, type Repo } from "@negocios/data";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Con las variables de Supabase usa la base real; sin ellas, la demo en memoria.
export const repo: Repo =
  url && anonKey
    ? createSupabaseRepo(
        createClient(url, anonKey, {
          auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
        }),
      )
    : createDemoRepo();
