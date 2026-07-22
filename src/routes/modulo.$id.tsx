import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Youtube, Loader2, Pencil, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { LurePlayer } from "@/components/lure-player";
import { Comments } from "@/components/comments";
import { sectionTitle, type ModuleRow } from "@/lib/sections";
import lureLogo from "@/assets/lure-logo-large.png.asset.json";

export const Route = createFileRoute("/modulo/$id")({
  head: () => ({ meta: [{ title: "Módulo — LURE Growth" }] }),
  component: ModulePage,
});

function ModulePage() {
  const { id } = Route.useParams();
  const { profile, isAdmin } = useAuth();
  const [mod, setMod] = useState<ModuleRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    supabase
      .from("modules")
      .select("id, section_id, title, description, author, youtube_url, cover_url, sort_order, created_at")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (!active) return;
        setMod((data as ModuleRow) ?? null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur-xl md:px-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Link>
          <div className="hidden h-6 w-px bg-border md:block" />
          <div className="hidden items-center gap-2 md:flex">
            <img src={lureLogo.url} alt="Lure" className="h-6 w-6 object-contain" />
            <span className="text-sm font-semibold tracking-wider">LURE Growth</span>
          </div>
        </div>
        {isAdmin && (
          <Link
            to="/admin/modulos"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
          >
            <Pencil className="h-3.5 w-3.5" /> Gerenciar módulos
          </Link>
        )}
      </header>

      <main className="mx-auto max-w-[960px]">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando módulo…
          </div>
        ) : !mod ? (
          <div className="px-6 py-24 text-center">
            <p className="font-display text-lg font-bold">Módulo não encontrado</p>
            <p className="mt-2 text-sm text-muted-foreground">Ele pode ter sido removido.</p>
            <Link to="/" className="mt-6 inline-flex rounded-lg bg-primary/15 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/25">
              Voltar ao início
            </Link>
          </div>
        ) : (
          <>
            {/* Player */}
            {mod.youtube_url ? (
              <LurePlayer videoUrl={mod.youtube_url} className="aspect-video w-full" />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#0B152D] to-black text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-white/5">
                  <Youtube className="h-7 w-7 text-white/50" />
                </div>
                <p className="text-sm font-semibold text-white/90">Vídeo em breve</p>
                {isAdmin && (
                  <Link to="/admin/modulos" className="mt-1 inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20">
                    <Pencil className="h-4 w-4" /> Adicionar o vídeo
                  </Link>
                )}
              </div>
            )}

            {/* Info */}
            <div className="border-b border-border px-6 py-8 md:px-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {sectionTitle(mod.section_id)}
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">{mod.title}</h1>
              {mod.author && <p className="mt-2 text-sm text-muted-foreground">com {mod.author}</p>}
              {mod.description && (
                <p className="mt-4 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground md:text-base">
                  {mod.description}
                </p>
              )}
              {isAdmin && (
                <div className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Você é admin — {profile?.full_name || "editor"}. Edite este módulo em "Gerenciar módulos".
                </div>
              )}
            </div>

            {/* Comentários (chave própria por módulo) */}
            <Comments slug={`mod-${mod.id}`} />
          </>
        )}
      </main>
    </div>
  );
}
