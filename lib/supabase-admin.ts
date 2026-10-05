import { createClient } from "@supabase/supabase-js";

function supabaseFetch(key: string): typeof fetch {
  return async (input, init) => {
    const headers = new Headers(init?.headers);
    const authorization = headers.get("authorization") ?? "";
    if (/^Bearer\s+sb_(?:secret|publishable)_/i.test(authorization)) {
      headers.delete("authorization");
    }
    if (!headers.has("apikey")) headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: supabaseFetch(key) },
  });
}
