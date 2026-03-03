import { createClient } from "@supabase/supabase-js";
import { createStorageAdapter } from "./storage";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// por padrão, localStorage (trocaremos em runtime no login)
export function makeSupabase(storage) {
  return createClient(url, anon, {
    auth: {
      persistSession: true,
      storage: createStorageAdapter(storage),
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}