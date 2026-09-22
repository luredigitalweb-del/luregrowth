import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // Ajuda a diagnosticar rápido se o .env não foi carregado.
  console.error(
    "[supabase] Variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ausentes. Confira o arquivo .env.",
  );
}

// Cliente único do navegador. A sessão é guardada no localStorage.
export const supabase = createClient(url ?? "", anonKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

/** `free` = conta gratuita: só enxerga a seção gratuita (ver FREE_SECTION_ID). */
export type Role = "admin" | "member" | "free";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  active: boolean;
  created_at: string;
};
