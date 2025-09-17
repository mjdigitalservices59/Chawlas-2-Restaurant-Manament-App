import { createClient, SupabaseClient } from "@supabase/supabase-js";

function env(k: string): string | undefined {
  // Netlify/Vite envs
  // e.g. set VITE_SUPABASE_URL and VITE_SUPABASE_ANON in Netlify
  // @ts-ignore
  return (import.meta as any).env?.[k];
}

/** Build client from env OR saved local values */
export function createSB(url?: string, key?: string): SupabaseClient | null {
  const U =
    url ||
    localStorage.getItem("sb_url") ||
    env("VITE_SUPABASE_URL") ||
    (globalThis as any).__SB_URL__;
  const K =
    key ||
    localStorage.getItem("sb_anon") ||
    env("VITE_SUPABASE_ANON") ||
    (globalThis as any).__SB_ANON__;
  if (!U || !K) return null;
  return createClient(U, K);
}

export function saveSB(url: string, key: string) {
  localStorage.setItem("sb_url", url.trim());
  localStorage.setItem("sb_anon", key.trim());
}

export function loadSB() {
  return {
    url: localStorage.getItem("sb_url") || env("VITE_SUPABASE_URL") || "",
    key: localStorage.getItem("sb_anon") || env("VITE_SUPABASE_ANON") || "",
  };
}

export async function checkConnection(url?: string, key?: string) {
  const sb = createSB(url, key);
  if (!sb) throw new Error("URL or anon key missing");
  const { error } = await sb.from("outlets").select("id").limit(1);
  if (error && /relation .* does not exist/i.test(error.message)) {
    throw new Error("Schema missing. Run the SQL migration in Supabase.");
  }
  if (error) throw error;
  saveSB(url!, key!);
  return true;
}
