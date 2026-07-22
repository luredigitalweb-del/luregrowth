import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  Play,
  CheckCircle2,
  Circle,
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
  ListChecks,
  LifeBuoy,
  ArrowRight,
} from "lucide-react";
import lureLogo from "@/assets/lure-logo-large.png.asset.json";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { toYouTubeEmbed } from "@/lib/youtube";
import { Avatar, initialsOf } from "@/components/avatar";
import { openSettings } from "@/components/profile-settings-modal";
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
  const [completed, setCompleted] = useState<Set<number>>(
    () => new Set(lessons.filter((l) => l.done).map((l) => l.n)),
  );
  const active = lessons.find((l) => l.n === currentLesson)!;
  const doneCount = completed.size;
  const progress = Math.round((doneCount / lessons.length) * 100);
  const isCurrentDone = completed.has(active.n);
  const nextLesson = lessons.find((l) => l.n > active.n && !l.locked);
  const isLast = !nextLesson;

  const toggleComplete = (n: number) =>
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  const goNext = () => {
    if (nextLesson) setCurrentLesson(nextLesson.n);
  };

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
        <button
          onClick={openSettings}
          title="Editar perfil"
          className="flex items-center gap-3 rounded-full py-1 pl-3 pr-1 text-xs text-muted-foreground transition hover:bg-surface"
        >
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
        </button>
      </header>

      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
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
          <div className="border-b border-border px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-1 w-5 rounded-full bg-primary" />
              {courseTitle}
            </div>
            <h1 className="mt-2.5 font-display text-xl font-bold leading-tight sm:text-2xl lg:text-3xl">
              Aula {active.n}: {active.title}
            </h1>

            {/* Meta chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {active.duration}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Play className="h-3 w-3 fill-current" /> Aula {active.n} de {lessons.length}
              </span>
              {isCurrentDone && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Concluída
                </span>
              )}
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Aprenda como transformar suas redes sociais em uma máquina previsível de vendas de
              alto ticket. Nesta aula, vamos desconstruir o processo exato que os maiores players do
              mercado utilizam para atrair, engajar e converter desconhecidos em clientes fiéis.
            </p>

            {/* Ações principais */}
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                onClick={() => toggleComplete(active.n)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  isCurrentDone
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15"
                    : "border-border bg-surface hover:bg-muted"
                }`}
              >
                {isCurrentDone ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Concluída
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4" /> Marcar como concluída
                  </>
                )}
              </button>
              {!isLast && (
                <button
                  onClick={goNext}
                  className="inline-flex items-center justify-center gap-2 rounded-xl gradient-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110"
                >
                  Próxima aula <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Materiais */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                <FileText className="h-4 w-4" /> Material da aula
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
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
        <aside className="flex flex-col border-t border-border bg-surface/40 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-l lg:border-t-0">
          {/* Header do painel */}
          <div className="shrink-0 border-b border-border p-4 lg:p-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <ListChecks className="h-3.5 w-3.5" /> Conteúdo do curso
            </div>
            <h2 className="mt-2 font-display text-base font-bold leading-tight">{courseTitle}</h2>

            <div className="mt-3.5 flex items-center gap-3">
              {/* Anel de progresso */}
              <div className="relative grid h-11 w-11 shrink-0 place-items-center">
                <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-border"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="oklch(0.78 0.14 70)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(progress / 100) * 97.4} 97.4`}
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute text-[11px] font-bold">{progress}%</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold">
                  {doneCount} de {lessons.length} concluídas
                </div>
                <div className="text-xs text-muted-foreground">Continue de onde parou</div>
              </div>
            </div>
          </div>

          {/* Lista de aulas */}
          <ul className="flex-1 space-y-1 overflow-y-auto p-2.5">
            {lessons.map((l) => {
              const isActive = l.n === currentLesson;
              const isProva = l.kind === "prova";
              const isDone = completed.has(l.n);
              const hasVideo = !!videos[l.n];
              return (
                <li key={l.n}>
                  <button
                    onClick={() => !l.locked && setCurrentLesson(l.n)}
                    disabled={l.locked}
                    className={`group relative flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                      isActive
                        ? "border-primary/40 bg-primary/10 shadow-[var(--shadow-glow)]"
                        : "border-transparent hover:border-border hover:bg-background"
                    } ${l.locked ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                        isProva
                          ? "bg-[oklch(0.62_0.19_255)]/20 text-[oklch(0.75_0.15_255)]"
                          : isDone
                            ? "bg-emerald-500/15 text-emerald-400"
                            : isActive
                              ? "gradient-gold text-primary-foreground"
                              : "bg-background text-muted-foreground"
                      }`}
                    >
                      {isProva ? (
                        <Award className="h-5 w-5" />
                      ) : l.locked ? (
                        <Lock className="h-4 w-4" />
                      ) : isDone ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isActive ? (
                        <Play className="h-4 w-4 fill-current" />
                      ) : (
                        l.n
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`truncate text-sm font-semibold ${isActive ? "text-primary" : ""}`}
                      >
                        {l.title}
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

          {/* Rodapé — suporte */}
          <div className="shrink-0 border-t border-border p-4">
            <a
              href="https://wa.me/5585991112424?text=Ol%C3%A1%2C%20estou%20assistindo%20uma%20aula%20e%20preciso%20de%20ajuda"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 transition hover:border-primary/40"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                <LifeBuoy className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">Precisa de ajuda?</div>
                <div className="text-xs text-muted-foreground">Fale com o suporte LURE</div>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          </div>
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
    <div className="flex w-full justify-center bg-black">
    <div className="relative aspect-video max-h-[calc(100vh-4rem)] w-full max-w-[calc((100vh-4rem)*16/9)] overflow-hidden">
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
          <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
            Aula {lessonN} · {duration}
          </div>
          {isAdmin && (
            <button
              onClick={() => setEditing(true)}
              className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur transition hover:bg-black/80"
            >
              <Pencil className="h-3.5 w-3.5" /> Trocar vídeo
            </button>
          )}
        </>
      )}
    </div>
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
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="font-display text-lg font-bold">
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
