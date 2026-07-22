import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  Lock,
  Award,
  MessageCircle,
  Send,
  FileText,
  Download,
  Clock,
  Youtube,
  Pencil,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import lureLogo from "@/assets/lure-logo-large.png.asset.json";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { toYouTubeEmbed } from "@/lib/youtube";
import { Avatar, initialsOf } from "@/components/avatar";
import { LurePlayer } from "@/components/lure-player";

export const Route = createFileRoute("/curso/$slug")({
  head: ({ params }) => {
    const title = deslug(params.slug);
    return {
      meta: [
        { title: `${title} — LURE Growth` },
        { name: "description", content: `Curso ${title} na plataforma oficial da Lure Digital.` },
        { property: "og:title", content: `${title} — LURE Growth` },
        {
          property: "og:description",
          content: `Assista às aulas do módulo ${title} com o time LURE.`,
        },
      ],
    };
  },
  component: CoursePage,
});

function deslug(slug: string) {
  return slug
    .split("-")
    .map((w) => (w.length <= 2 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

type Lesson = {
  n: number;
  title: string;
  duration: string;
  done?: boolean;
  locked?: boolean;
  kind?: "video" | "prova";
};

const lessons: Lesson[] = [
  { n: 1, title: "O Poder do Social Selling", duration: "25:14", done: true },
  { n: 2, title: "Otimização de Perfil B2B", duration: "18:42" },
  { n: 3, title: "Conteúdo de Conversão", duration: "32:10" },
  { n: 4, title: "Scripts de Abordagem", duration: "21:05" },
  { n: 5, title: "Fechamento e Follow-up", duration: "28:50" },
  {
    n: 6,
    title: "Prova Final — Certificado de Conclusão",
    duration: "—",
    locked: true,
    kind: "prova",
  },
];

type Comment = {
  id: string;
  body: string;
  author_name: string;
  user_id: string;
  created_at: string;
};

function CoursePage() {
  const { slug } = Route.useParams();
  const courseTitle = deslug(slug);
  const { session, profile, isAdmin } = useAuth();
  const [currentLesson, setCurrentLesson] = useState(1);
  const active = lessons.find((l) => l.n === currentLesson)!;
  const doneCount = lessons.filter((l) => l.done).length;
  const progress = Math.round((doneCount / lessons.length) * 100);

  // Vídeos (YouTube) por aula, vindos do banco
  const [videos, setVideos] = useState<Record<number, string>>({});
  const currentUrl = videos[currentLesson];

  const loadVideos = useCallback(async () => {
    const { data } = await supabase
      .from("lesson_videos")
      .select("lesson_n, youtube_url")
      .eq("course_slug", slug);
    const map: Record<number, string> = {};
    (data ?? []).forEach((r: { lesson_n: number; youtube_url: string | null }) => {
      if (r.youtube_url) map[r.lesson_n] = r.youtube_url;
    });
    setVideos(map);
  }, [slug]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const saveVideo = async (url: string) => {
    await supabase.from("lesson_videos").upsert(
      {
        course_slug: slug,
        lesson_n: currentLesson,
        youtube_url: url || null,
        updated_by: session?.user?.id ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "course_slug,lesson_n" },
    );
    await loadVideos();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur-xl md:px-10">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Link>
          <div className="hidden h-6 w-px bg-border md:block" />
          <div className="hidden items-center gap-2 md:flex">
            <img src={lureLogo.url} alt="Lure" className="h-6 w-6 object-contain" />
            <span className="text-sm font-semibold tracking-wider">LURE Growth</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="hidden md:inline">
            {profile?.full_name || profile?.email?.split("@")[0] || "Aluno LURE"} ·{" "}
            {isAdmin ? "Admin" : "Membro"}
          </span>
          <Avatar
            url={profile?.avatar_url}
            name={profile?.full_name}
            email={profile?.email}
            className="h-8 w-8"
            textClassName="text-[11px]"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
        {/* Player + info */}
        <main className="min-w-0">
          <VideoPlayer
            url={currentUrl}
            lessonN={active.n}
            duration={active.duration}
            isAdmin={isAdmin}
            onSave={saveVideo}
          />

          {/* Lesson info */}
          <div className="border-b border-border px-6 py-8 md:px-10">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {courseTitle}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight md:text-4xl">
              Aula {active.n}: {active.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Aprenda como transformar suas redes sociais em uma máquina previsível de vendas de
              alto ticket. Nesta aula, vamos desconstruir o processo exato que os maiores players do
              mercado utilizam para atrair, engajar e converter desconhecidos em clientes fiéis.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentLesson((n) => Math.min(n + 1, lessons.length))}
                className="inline-flex items-center gap-2 rounded-xl gradient-gold px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110"
              >
                Próxima Aula →
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium transition hover:bg-muted">
                <FileText className="h-4 w-4" /> Material da aula
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium transition hover:bg-muted">
                <Download className="h-4 w-4" /> Baixar recursos
              </button>
            </div>
          </div>

          {/* Comments */}
          <CommentsSection
            slug={slug}
            userId={session?.user?.id}
            authorName={profile?.full_name || profile?.email?.split("@")[0] || "Aluno"}
            isAdmin={isAdmin}
          />
        </main>

        {/* Lessons sidebar */}
        <aside className="border-l border-border bg-surface/40 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="border-b border-border p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {courseTitle}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {doneCount} de {lessons.length} etapas concluídas · {progress}%
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background">
              <div
                className="h-full gradient-gold transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="p-3">
            {lessons.map((l) => {
              const isActive = l.n === currentLesson;
              const isProva = l.kind === "prova";
              const hasVideo = !!videos[l.n];
              return (
                <li key={l.n}>
                  <button
                    onClick={() => !l.locked && setCurrentLesson(l.n)}
                    disabled={l.locked}
                    className={`group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      isActive
                        ? "border-primary/40 bg-primary/10"
                        : "border-transparent hover:border-border hover:bg-background"
                    } ${l.locked ? "opacity-60" : ""}`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                        isProva
                          ? "bg-[oklch(0.62_0.19_255)]/20 text-[oklch(0.75_0.15_255)]"
                          : l.done
                            ? "bg-[oklch(0.68_0.15_155)]/15 text-[oklch(0.78_0.15_155)]"
                            : isActive
                              ? "gradient-gold text-primary-foreground"
                              : "bg-background text-muted-foreground"
                      }`}
                    >
                      {isProva ? (
                        <Award className="h-5 w-5" />
                      ) : l.locked ? (
                        <Lock className="h-4 w-4" />
                      ) : l.done ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Play className="h-4 w-4 fill-current" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`truncate text-sm font-semibold ${isActive ? "text-primary" : ""}`}
                      >
                        {l.n}. {l.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        {isProva ? (
                          "Certificado de Conclusão"
                        ) : (
                          <>
                            <Clock className="h-3 w-3" /> {l.duration}
                            {hasVideo && <Youtube className="ml-1 h-3 w-3 text-red-500" />}
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Player ---------------- */

function VideoPlayer({
  url,
  lessonN,
  duration,
  isAdmin,
  onSave,
}: {
  url?: string;
  lessonN: number;
  duration: string;
  isAdmin: boolean;
  onSave: (url: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(url ?? "");
    setEditing(false);
    setError(null);
  }, [url, lessonN]);

  const embed = url ? toYouTubeEmbed(url) : null;

  const handleSave = async () => {
    setError(null);
    if (value.trim() && !toYouTubeEmbed(value)) {
      setError("Link do YouTube inválido. Cole a URL completa do vídeo.");
      return;
    }
    setSaving(true);
    await onSave(value.trim());
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {embed && !editing ? (
        <LurePlayer videoUrl={url!} className="absolute inset-0 h-full w-full" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#0B152D] to-black px-6 text-center">
          {editing ? (
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface/95 p-5 text-left shadow-2xl backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Youtube className="h-4 w-4 text-red-500" /> Link do YouTube — Aula {lessonN}
              </div>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
              />
              {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setEditing(false);
                    setValue(url ?? "");
                    setError(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" /> Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg gradient-gold px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-70"
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-white/5">
                <Youtube className="h-7 w-7 text-white/60" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90">Vídeo em breve</p>
                <p className="mt-1 text-xs text-white/50">
                  Aula {lessonN} · {duration}
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setEditing(true)}
                  className="mt-1 inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
                >
                  <Youtube className="h-4 w-4" /> Adicionar link do YouTube
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Badge + editar (admin) sobre o vídeo */}
      {embed && !editing && (
        <>
          <div className="pointer-events-none absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
            Aula {lessonN} · {duration}
          </div>
          {isAdmin && (
            <button
              onClick={() => setEditing(true)}
              className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur transition hover:bg-black/80"
            >
              <Pencil className="h-3.5 w-3.5" /> Trocar vídeo
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------- Comentários ---------------- */

function CommentsSection({
  slug,
  userId,
  authorName,
  isAdmin,
}: {
  slug: string;
  userId?: string;
  authorName: string;
  isAdmin: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("comments")
      .select("id, body, author_name, user_id, created_at")
      .eq("course_slug", slug)
      .order("created_at", { ascending: false });
    setComments((data as Comment[]) ?? []);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !userId) return;
    setPosting(true);
    const { error } = await supabase.from("comments").insert({
      course_slug: slug,
      user_id: userId,
      author_name: authorName,
      body,
    });
    setPosting(false);
    if (!error) {
      setText("");
      load();
    }
  };

  const remove = async (id: string) => {
    await supabase.from("comments").delete().eq("id", id);
    load();
  };

  return (
    <section className="px-6 py-10 md:px-10">
      <h2 className="font-display text-xl font-bold">
        Comentários {loading ? "" : `(${comments.length})`}
      </h2>

      <form onSubmit={submit} className="mt-6 rounded-xl border border-border bg-surface p-5">
        <label className="mb-3 block text-sm font-semibold">Deixe sua dúvida ou feedback:</label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva seu comentário aqui..."
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={posting || !text.trim()}
            className="inline-flex items-center gap-2 rounded-lg gradient-gold px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {posting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Enviar
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando comentários…
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface/50 py-10 text-center">
            <MessageCircle className="mx-auto h-6 w-6 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Ainda não há comentários. Seja o primeiro!
            </p>
          </div>
        ) : (
          comments.map((c) => {
            const canDelete = isAdmin || c.user_id === userId;
            return (
              <div key={c.id} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-gold text-xs font-bold text-primary-foreground">
                  {initialsOf(c.author_name)}
                </div>
                <div className="flex-1 rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-primary">{c.author_name}</div>
                    {canDelete && (
                      <button
                        onClick={() => remove(c.id)}
                        className="text-muted-foreground transition hover:text-red-400"
                        title="Apagar comentário"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {c.body}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
