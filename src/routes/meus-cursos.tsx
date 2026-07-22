import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, CheckCircle2, Award, Download, Sparkles } from "lucide-react";
import {
  Sidebar,
  TopBar,
  MobileTopBar,
  MobileTabBar,
  sections,
  type Module,
} from "./index";
import lureTeam from "@/assets/lure-team.jpg.asset.json";

export const Route = createFileRoute("/meus-cursos")({
  head: () => ({
    meta: [
      { title: "Meus cursos — LURE Growth" },
      { name: "description", content: "Seu dashboard de cursos: veja o progresso e baixe seus certificados." },
      { property: "og:title", content: "Meus cursos — LURE Growth" },
      { property: "og:description", content: "Sua jornada de aprendizado na LURE." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    tab: (s.tab as TabKey) ?? "todos",
  }),
  component: MeusCursosPage,
});

type EnrichedModule = Module & { sectionId: string; sectionTitle: string };
type TabKey = "todos" | "andamento" | "concluidos" | "certificados";

// Overrides de demo: garante alguns concluídos + destaques em andamento
const DEMO_OVERRIDES: Record<string, number> = {
  "Prospecção no LinkedIn": 100,
  "Roteiros que retêm atenção": 100,
  "Call Amanda": 100,
  "Fundamentos de IA Generativa": 85,
  "Meta Ads Avançado": 78,
  "Playbook de Objeções": 62,
};

function MeusCursosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const setTab = (t: TabKey) => navigate({ search: { tab: t } });

  const all: EnrichedModule[] = useMemo(
    () =>
      sections.flatMap((s) =>
        s.modules.map((m) => ({
          ...m,
          progress: DEMO_OVERRIDES[m.title] ?? m.progress,
          sectionId: s.id,
          sectionTitle: s.title,
        })),
      ),
    [],
  );

  const inProgress = all.filter((m) => m.progress > 0 && m.progress < 100);
  const completed = all.filter((m) => m.progress >= 100);
  const enrolled = all.filter((m) => m.progress > 0); // "meus cursos" = os que eu estou fazendo

  const visible =
    tab === "andamento" ? inProgress
    : tab === "concluidos" ? completed
    : tab === "certificados" ? completed
    : enrolled;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} current="/meus-cursos" />
        <div className="flex-1 min-w-0">
          <MobileTopBar />
          <div className="hidden lg:block">
            <TopBar />
          </div>

          <main className="pb-28 lg:pb-24">
            <div className="mx-auto max-w-[1400px] px-4 md:px-10 pt-8 lg:pt-10">
              <header>
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  Meus cursos
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Seu dashboard — veja o progresso e baixe seus certificados.
                </p>
              </header>

              {/* Tabs */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <TabChip active={tab === "todos"} onClick={() => setTab("todos")}>
                  Meus cursos <Count n={enrolled.length} />
                </TabChip>
                <TabChip active={tab === "andamento"} onClick={() => setTab("andamento")}>
                  Em andamento <Count n={inProgress.length} />
                </TabChip>
                <TabChip active={tab === "concluidos"} onClick={() => setTab("concluidos")}>
                  Concluídos <Count n={completed.length} />
                </TabChip>
                <TabChip active={tab === "certificados"} onClick={() => setTab("certificados")}>
                  <Award className="mr-1 h-3.5 w-3.5" />
                  Certificados <Count n={completed.length} />
                </TabChip>
              </div>

              {/* Grid */}
              <section className="mt-8">
                {visible.length === 0 ? (
                  <EmptyState tab={tab} />
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {visible.map((m) =>
                      tab === "certificados" ? (
                        <CertificateCard key={m.title} m={m} />
                      ) : (
                        <CourseCard key={m.title} m={m} />
                      ),
                    )}
                  </div>
                )}
              </section>
            </div>
          </main>

          <MobileTabBar />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Cards ---------------- */

function CourseCard({ m }: { m: EnrichedModule }) {
  const done = m.progress >= 100;
  return (
    <Link
      to="/curso/$slug"
      params={{ slug: slugify(m.title) }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
        <img
          src={lureTeam.url}
          alt={m.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
        {done ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            <CheckCircle2 className="h-3 w-3" /> Concluído
          </span>
        ) : (
          <span className="absolute left-3 top-3 rounded-full bg-background/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur">
            {m.progress}%
          </span>
        )}
        <div className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/70 text-primary opacity-0 backdrop-blur transition group-hover:opacity-100">
          <Play className="h-4 w-4 fill-current" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {m.sectionTitle}
        </div>
        <h3 className="mt-1.5 line-clamp-2 font-display text-[15px] font-bold leading-snug">
          {m.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{m.author}</p>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className={done ? "font-semibold text-emerald-400" : "font-semibold text-foreground"}>
              {m.progress}% concluído
            </span>
            <span className="text-muted-foreground">{m.lessons} aulas</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
            <div
              className={`h-full ${done ? "bg-emerald-400" : "bg-foreground/70"}`}
              style={{ width: `${m.progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CertificateCard({ m }: { m: EnrichedModule }) {
  const download = () =>
    downloadCertificate({
      student: "Alvaro Paiva",
      course: m.title,
      section: m.sectionTitle,
      author: m.author,
      lessons: m.lessons,
    });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#0B152D] via-[#050914] to-[#0B152D]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 100%, oklch(0.78 0.14 70 / 0.35), transparent 65%)",
          }}
        />
        <div className="absolute inset-3 rounded-xl border border-primary/40" />
        <div className="absolute inset-5 rounded-lg border border-primary/20" />
        <div className="relative flex h-full flex-col items-center justify-center p-5 text-center">
          <div className="text-[9px] font-bold uppercase tracking-[0.32em] text-primary">
            LURE Growth
          </div>
          <div
            className="mt-1.5 text-2xl italic leading-tight text-white"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Certificado
          </div>
          <div className="mt-2 line-clamp-2 max-w-[85%] text-xs text-white/80">{m.title}</div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.24em] text-white/60">
            <Sparkles className="h-2.5 w-2.5" /> Alvaro Paiva
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {m.sectionTitle}
          </div>
          <div className="mt-1 truncate font-display text-sm font-bold">{m.title}</div>
        </div>
        <button
          onClick={download}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/15 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/25"
        >
          <Download className="h-3.5 w-3.5" />
          Baixar
        </button>
      </div>
    </div>
  );
}

/* ---------------- Bits ---------------- */

function TabChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-foreground text-background"
          : "border border-border bg-surface text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Count({ n }: { n: number }) {
  return <span className="ml-1.5 rounded-full bg-black/10 px-1.5 text-[10px] opacity-70">{n}</span>;
}

function EmptyState({ tab }: { tab: TabKey }) {
  const copy =
    tab === "concluidos" || tab === "certificados"
      ? {
          title: "Nenhum curso concluído ainda",
          desc: "Finalize um curso para desbloquear seu certificado.",
        }
      : {
          title: "Você ainda não começou nenhum curso",
          desc: "Explore o catálogo e comece sua jornada.",
        };
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface text-muted-foreground">
        <BookOpenIcon />
      </div>
      <p className="text-sm font-semibold">{copy.title}</p>
      <p className="max-w-sm text-xs text-muted-foreground">{copy.desc}</p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary/15 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/25"
      >
        Explorar catálogo
      </Link>
    </div>
  );
}

function BookOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

/* ---------------- Helpers ---------------- */

function slugify(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function downloadCertificate(opts: {
  student: string;
  course: string;
  section: string;
  author: string;
  lessons: number;
}) {
  const w = 1600;
  const h = 1100;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#050914");
  bg.addColorStop(0.5, "#0B152D");
  bg.addColorStop(1, "#050914");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w / 2, h, 100, w / 2, h, 900);
  glow.addColorStop(0, "rgba(230, 180, 90, 0.35)");
  glow.addColorStop(1, "rgba(230, 180, 90, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(230, 180, 90, 0.9)";
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 60, w - 120, h - 120);
  ctx.strokeStyle = "rgba(230, 180, 90, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(90, 90, w - 180, h - 180);

  ctx.textAlign = "center";
  ctx.fillStyle = "#E6B45A";
  ctx.font = "bold 24px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText("LURE  GROWTH   ·   ÁREA DE MEMBROS", w / 2, 220);

  ctx.fillStyle = "#ffffff";
  ctx.font = 'italic 96px "Cormorant Garamond", Georgia, serif';
  ctx.fillText("Certificado de Conclusão", w / 2, 350);

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "22px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText("Concedido a", w / 2, 430);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 72px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText(opts.student, w / 2, 520);

  ctx.strokeStyle = "rgba(230, 180, 90, 0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 220, 560);
  ctx.lineTo(w / 2 + 220, 560);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "24px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText("por concluir com êxito o curso", w / 2, 620);

  ctx.fillStyle = "#E6B45A";
  ctx.font = "bold 52px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText(opts.course, w / 2, 700);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "20px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText(
    `${opts.section}  ·  Mentor: ${opts.author}  ·  ${opts.lessons} aulas`,
    w / 2,
    750,
  );

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(300, 920);
  ctx.lineTo(600, 920);
  ctx.moveTo(w - 600, 920);
  ctx.lineTo(w - 300, 920);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "20px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText("Lure Digital", 450, 960);
  ctx.fillText(dateStr, w - 450, 960);

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText("Assinatura", 450, 985);
  ctx.fillText("Data de emissão", w - 450, 985);

  const code =
    "LURE-" +
    Math.random().toString(36).slice(2, 7).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 7).toUpperCase();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "14px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(`Código de verificação: ${code}`, w / 2, h - 110);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificado-${slugify(opts.course)}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}
