import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play, Settings, Plus, Video } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { SECTIONS, type ModuleRow } from "@/lib/sections";

/**
 * Mostra na home os módulos adicionados pelo admin (banco), agrupados por seção.
 * Para o admin, sempre exibe a engrenagem "Gerenciar módulos" (mesmo sem nenhum).
 */
export function DbModules() {
  const { isAdmin } = useAuth();
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("modules")
      .select("id, section_id, title, description, author, youtube_url, cover_url, sort_order, created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setModules((data as ModuleRow[]) ?? []);
        setLoaded(true);
      });
  }, []);

  if (!loaded) return null;
  // Sem módulos e sem ser admin: não ocupa espaço.
  if (modules.length === 0 && !isAdmin) return null;

  const groups = SECTIONS.map((s) => ({
    section: s,
    items: modules.filter((m) => m.section_id === s.id),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-[0.15em]">SEUS MÓDULOS</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {modules.length > 0
              ? "Conteúdos publicados na plataforma"
              : "Nenhum módulo publicado ainda"}
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/admin/modulos"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            <Settings className="h-3.5 w-3.5" /> Gerenciar módulos
          </Link>
        )}
      </div>

      {groups.length === 0 ? (
        isAdmin ? (
          <Link
            to="/admin/modulos"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center transition hover:border-primary/40"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold">Adicionar seu primeiro módulo</span>
            <span className="text-xs text-muted-foreground">Título + link do YouTube — o vídeo toca no player da LURE</span>
          </Link>
        ) : null
      ) : (
        <div className="space-y-10">
          {groups.map((g) => (
            <div key={g.section.id}>
              <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
                {g.section.title}
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {g.items.map((m) => (
                  <ModuleCard key={m.id} m={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ModuleCard({ m }: { m: ModuleRow }) {
  return (
    <Link
      to="/modulo/$id"
      params={{ id: m.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#0B152D] to-black">
        {m.cover_url ? (
          <img
            src={m.cover_url}
            alt={m.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <Video className="h-7 w-7 text-white/25" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        <div className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/70 text-primary opacity-0 backdrop-blur transition group-hover:opacity-100">
          <Play className="h-4 w-4 fill-current" />
        </div>
        {!m.youtube_url && (
          <span className="absolute left-3 top-3 rounded-md bg-background/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur">
            Em breve
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug">{m.title}</h3>
        {m.author && <p className="mt-1 text-xs text-muted-foreground">{m.author}</p>}
      </div>
    </Link>
  );
}
