import { createClient } from "@supabase/supabase-js";

const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || "https://myskqtyhoinngdslgccd.supabase.co";
const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15c2txdHlob2lubmdkc2xnY2NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNjk4ODIsImV4cCI6MjEwMTg0NTg4Mn0.HcIvxtDwuUS_luLNpRjLcmouC01I9JjeEj_WJq0XoPk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

