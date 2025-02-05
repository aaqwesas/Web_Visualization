import { createClient } from "@supabase/supabase-js";

const supabaseUrl:string = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey:string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key');
}

// Create a SupabaseClient instance, which will be used to make API requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// For web, we can use the Page Visibility API to detect when the page is visible or hidden
if (typeof document !== 'undefined') {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
