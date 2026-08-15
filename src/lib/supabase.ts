import { createClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_SUPABASE_URL"] as string;
const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string;

if (!url || !anonKey) {
  throw new Error(
    "Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env",
  );
}

export const supabase = createClient(url, anonKey);

/** Public URL for a file stored in one of our buckets. */
export function publicUrl(bucket: string, path: string): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
