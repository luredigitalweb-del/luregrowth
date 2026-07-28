import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import {
  Play,
  Target,
  Search,
  Bell,
  ChevronRight,
  ChevronLeft,
  House,
  BookOpen,
  Users,
  ScrollText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  CreditCard,
  LogOut,
  Crown,
  Headphones,
  Gauge,
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, initialsOf } from "@/components/avatar";
import { openSettings } from "@/components/profile-settings-modal";
import lureLogo from "@/assets/lure-logo-large.png.asset.json";
import lureTeam from "@/assets/lure-team.jpg.asset.json";
import callAmanda from "@/assets/call-vendas-1.png.asset.json";
import callFelipe from "@/assets/call-vendas-felipe.png.asset.json";
import callGustavo from "@/assets/call-vendas-gustavo.png.asset.json";
import call4 from "@/assets/call-vendas-4.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LURE Growth — Área de Membros" },
      { name: "description", content: "Plataforma oficial de cursos e trilhas da Lure Digital." },
      { property: "og:title", content: "LURE Growth — Área de Membros" },
      { property: "og:description", content: "Trilhas de crescimento, IA e performance." },
    ],
  }),
  component: Portal,
});

export type Module = {
  title: string;
  author: string;
  lessons: number;
  progress: number;
  tag?: string;
  accent?: "gold" | "blue" | "green" | "none";
  thumb?: string;
  /** Se presente, o card abre a página de módulo do banco (aulas + vídeos editáveis). */
  moduleId?: string;
};

export const sections: { id: string; title: string; subtitle: string; modules: Module[] }[] = [
  {
    id: "intro",
    title: "INTRODUÇÃO",
    subtitle: "Comece por aqui — a base do ecossistema LURE",
    modules: [
      {
        title: "Boas-vindas à LURE",
        author: "Time LURE",
        lessons: 3,
        progress: 40,
        tag: "COMECE AQUI",
        accent: "gold",
      },
      {
        title: "Mentalidade de Crescimento",
        author: "Time LURE",
        lessons: 5,
        progress: 55,
        accent: "blue",
      },
      {
        title: "Como usar a plataforma",
        author: "Time LURE",
        lessons: 4,
        progress: 0,
        accent: "none",
      },
      {
        title: "Setup do aluno de alta performance",
        author: "Time LURE",
        lessons: 6,
        progress: 20,
        accent: "green",
      },
    ],
  },
  {
    id: "social",
    title: "SOCIAL SELLING",
    subtitle: "Prospecção e autoridade nas redes",
    modules: [
      {
        title: "Social Selling com Julia",
        author: "Julia Farias",
        lessons: 2,
        progress: 0,
        tag: "NOVO",
        accent: "gold",
        thumb: "/social-fundamentos.jpg",
        moduleId: "ebdc9d1a-4369-4ffc-96f0-016ba3f78a85",
      },
      {
        title: "Prospecção no LinkedIn",
        author: "Julia Farias",
        lessons: 10,
        progress: 72,
        tag: "NOVO",
        accent: "gold",
        thumb: "/social-posicionamento.jpg",
      },
      {
        title: "Perfil Magnético B2B",
        author: "Julia Farias",
        lessons: 6,
        progress: 35,
        accent: "blue",
        thumb: "/social-prospeccao.jpg",
      },
      {
        title: "Copy para DMs",
        author: "Time LURE",
        lessons: 5,
        progress: 0,
        accent: "none",
        thumb: "/social-pratica.jpg",
      },
      {
        title: "Autoridade em Nicho",
        author: "Julia Farias",
        lessons: 8,
        progress: 15,
        accent: "green",
      },
    ],
  },
  {
    id: "call",
    title: "CALL DE VENDAS",
    subtitle: "Do primeiro contato ao fechamento",
    modules: [
      {
        title: "Call Amanda",
        author: "Amanda",
        lessons: 8,
        progress: 60,
        tag: "TOP",
        accent: "gold",
        thumb: callAmanda.url,
      },
      {
        title: "Call Anderson",
        author: "Anderson",
        lessons: 6,
        progress: 0,
        accent: "gold",
        thumb: "/call-anderson.jpg",
      },
      {
        title: "Call Matheus",
        author: "Matheus",
        lessons: 6,
        progress: 20,
        accent: "blue",
        thumb: callFelipe.url,
      },
      {
        title: "Call Felipe",
        author: "Felipe",
        lessons: 7,
        progress: 10,
        accent: "green",
        thumb: callGustavo.url,
      },
      {
        title: "Call Gustavo",
        author: "Gustavo",
        lessons: 6,
        progress: 0,
        accent: "blue",
        thumb: call4.url,
      },
    ],
  },
  {
    id: "rh",
    title: "RH & CULTURA",
    subtitle: "Time forte, cultura forte, resultado forte",
    modules: [
      {
        title: "Recrutamento por Competência",
        author: "Bruna Dias",
        lessons: 6,
        progress: 20,
        accent: "gold",
        thumb: "/rh-recrutamento.jpg",
      },
      {
        title: "Onboarding de Alta Performance",
        author: "Bruna Dias",
        lessons: 5,
        progress: 0,
        accent: "blue",
        thumb: "/rh-onboarding.jpg",
      },
      {
        title: "Cultura Data-Driven",
        author: "Time LURE",
        lessons: 7,
        progress: 40,
        accent: "none",
      },
      {
        title: "Gestão de Times Remotos",
        author: "Bruna Dias",
        lessons: 8,
        progress: 10,
        accent: "green",
      },
    ],
  },
  {
    id: "comercial",
    title: "COMERCIAL",
    subtitle: "Processos, funil e conversão de alto ticket",
    modules: [
      {
        title: "Diagnóstico Comercial",
        author: "Anderson Lima",
        lessons: 6,
        progress: 30,
        tag: "ESSENCIAL",
        accent: "gold",
      },
      {
        title: "Funil de Vendas B2B",
        author: "Anderson Lima",
        lessons: 9,
        progress: 12,
        accent: "blue",
      },
      {
        title: "Negociação Avançada",
        author: "Mateus Alves",
        lessons: 8,
        progress: 0,
        accent: "none",
      },
      {
        title: "Playbook de Objeções",
        author: "Time LURE",
        lessons: 7,
        progress: 45,
        accent: "green",
      },
    ],
  },
  {
    id: "marketing",
    title: "MARKETING",
    subtitle: "Estratégia, marca e posicionamento",
    modules: [
      {
        title: "Fundamentos de Marca",
        author: "Camila Rocha",
        lessons: 7,
        progress: 25,
        accent: "gold",
      },
      {
        title: "Posicionamento Estratégico",
        author: "Camila Rocha",
        lessons: 9,
        progress: 40,
        accent: "blue",
      },
      { title: "Funil Full Funnel", author: "Time LURE", lessons: 12, progress: 0, accent: "none" },
      {
        title: "Branding para Growth",
        author: "Julia Farias",
        lessons: 8,
        progress: 55,
        accent: "green",
      },
    ],
  },
  {
    id: "trafego",
    title: "GESTÃO DE TRÁFEGO",
    subtitle: "Meta, Google e mensuração em escala",
    modules: [
      {
        title: "Meta Ads Avançado",
        author: "Camila Rocha",
        lessons: 14,
        progress: 62,
        tag: "POPULAR",
        accent: "gold",
      },
      {
        title: "Google Ads: Search & PMax",
        author: "Camila Rocha",
        lessons: 11,
        progress: 45,
        accent: "blue",
      },
      {
        title: "Estruturas de Conta",
        author: "Time LURE",
        lessons: 6,
        progress: 0,
        accent: "none",
      },
      {
        title: "Mensuração & Atribuição",
        author: "Camila Rocha",
        lessons: 8,
        progress: 15,
        accent: "green",
      },
    ],
  },
  {
    id: "ia",
    title: "IA APLICADA",
    subtitle: "Inteligência artificial no dia a dia de marketing",
    modules: [
      {
        title: "Fundamentos de IA Generativa",
        author: "Rafael Mendes",
        lessons: 8,
        progress: 72,
        tag: "NOVO",
        accent: "gold",
      },
      {
        title: "Prompt Engineering para Marketing",
        author: "Rafael Mendes",
        lessons: 12,
        progress: 30,
        accent: "blue",
      },
      {
        title: "Automação com n8n + GPT",
        author: "Time LURE",
        lessons: 9,
        progress: 0,
        accent: "none",
      },
      {
        title: "Criando agentes personalizados",
        author: "Rafael Mendes",
        lessons: 7,
        progress: 12,
        accent: "green",
      },
    ],
  },
  {
    id: "conteudo",
    title: "CONTEÚDO & CRIATIVOS",
    subtitle: "Narrativa, roteiro e produção que converte",
    modules: [
      {
        title: "Roteiros que retêm atenção",
        author: "Julia Farias",
        lessons: 10,
        progress: 80,
        tag: "POPULAR",
        accent: "gold",
      },
      {
        title: "Edição para Reels & TikTok",
        author: "Julia Farias",
        lessons: 12,
        progress: 25,
        accent: "blue",
      },
      { title: "Copy para anúncios", author: "Time LURE", lessons: 7, progress: 0, accent: "none" },
      {
        title: "Direção de arte para marcas",
        author: "Julia Farias",
        lessons: 9,
        progress: 10,
        accent: "green",
      },
    ],
  },
];

/**
 * Capas vindas do banco (painel admin), indexadas por `${section_id}|${title}`.
 * Quando existe uma capa salva no painel, ela substitui a imagem fixa do código.
 */
const CoversContext = createContext<Record<string, string>>({});
const coverKey = (sectionId: string, title: string) => `${sectionId}|${title.trim()}`;

function Portal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [covers, setCovers] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    supabase
      .from("modules")
      .select("section_id, title, cover_url")
      .not("cover_url", "is", null)
      .then(({ data }) => {
        if (!alive || !data) return;
        const map: Record<string, string> = {};
        for (const row of data as { section_id: string; title: string; cover_url: string }[]) {
          if (row.cover_url) map[coverKey(row.section_id, row.title)] = row.cover_url;
        }
        setCovers(map);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <CoversContext.Provider value={covers}>
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
        <div className="flex-1 min-w-0">
          {/* Mobile-only top bar */}
          <MobileTopBar />
          {/* Desktop top bar */}
          <div className="hidden lg:block">
            <TopBar />
          </div>
          <main className="pb-32 lg:pb-24">
            {/* Mobile-only G4-style hero */}
            <div className="lg:hidden">
              <MobileHero />
            </div>
            {/* Desktop hero */}
            <div className="hidden lg:block">
              <HeroBanner />
            </div>
            <div className="mx-auto max-w-[1400px] px-4 md:px-10">
              {/* Catálogo único da home (com as fotos das calls de vendas) */}
              {sections.map((s) => (
                <SectionRow key={s.id} section={s} />
              ))}
            </div>
          </main>
          {/* Mobile bottom tab bar */}
          <MobileTabBar />
        </div>
      </div>
    </div>
    </CoversContext.Provider>
  );
}

export function MobileTopBar() {
  const { profile, session } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 flex items-center justify-between bg-background/80 px-4 pb-3 backdrop-blur-xl lg:hidden"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
          className="grid h-10 w-10 place-items-center rounded-xl text-foreground transition active:scale-95"
        >
          <Menu className="h-6 w-6" strokeWidth={1.8} />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <img src={lureLogo.url} alt="LURE" className="h-7 w-7 object-contain" />
          <span className="font-display text-[17px] leading-none tracking-tight">
            <span className="font-normal">Lure</span> <span className="font-bold">Growth</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            aria-label="Notificações"
            className="relative grid h-10 w-10 place-items-center rounded-xl text-foreground transition active:scale-95"
          >
            <Bell className="h-[22px] w-[22px]" strokeWidth={1.7} />
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--nav)] ring-2 ring-background" />
          </button>
          <button
            onClick={openSettings}
            aria-label="Editar perfil"
            className="relative h-10 w-10 shrink-0 rounded-full ring-2 ring-white/15 transition active:scale-95"
          >
            <Avatar
              url={profile?.avatar_url}
              name={profile?.full_name}
              email={profile?.email || session?.user?.email}
              className="h-10 w-10"
              textClassName="text-[12px]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

/** Gaveta lateral do mobile — abre no botão de menu da barra de topo. */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile, session, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Trava o scroll do fundo enquanto a gaveta está aberta.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const links = [
    { icon: House, label: "Início", to: "/" },
    { icon: BookOpen, label: "Meus cursos", to: "/meus-cursos" },
    { icon: Gauge, label: "Diagnóstico", to: "/diagnostico" },
    { icon: Users, label: "Comunidade", to: "/comunidade" },
    { icon: ScrollText, label: "Certificados", to: "/meus-cursos" },
  ] as const;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className={`lg:hidden ${open ? "" : "pointer-events-none"}`}>
      {/* Fundo escuro */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Painel */}
      <aside
        className={`dark-scope fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-[320px] flex-col border-r border-border/60 bg-gradient-to-b from-surface to-background shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 1rem)" }}
      >
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <img src={lureLogo.url} alt="LURE" className="h-9 w-9 object-contain" />
            <span className="font-display text-[17px] leading-none tracking-tight">
              <span className="font-normal">Lure</span> <span className="font-bold">Growth</span>
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Perfil */}
        <button
          onClick={() => {
            onClose();
            openSettings();
          }}
          className="mx-4 mt-6 flex items-center gap-3 rounded-2xl border border-border/60 bg-surface-elevated/60 p-3 text-left transition active:scale-[0.99]"
        >
          <Avatar
            url={profile?.avatar_url}
            name={profile?.full_name}
            email={profile?.email || session?.user?.email}
            className="h-11 w-11"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">
              {profile?.full_name || "Aluno LURE"}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {isAdmin ? "Administrador" : "Membro"}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        {/* Navegação */}
        <nav className="mt-6 flex flex-col gap-1 px-3">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium text-foreground/90 transition active:bg-muted/60"
            >
              <l.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.6} />
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mx-3 my-4 h-px bg-border/50" />

        <div className="flex flex-col gap-1 px-3">
          <a
            href="https://wa.me/5585991112424?text=Ol%C3%A1%2C%20estou%20na%20%C3%81rea%20de%20Membros%20e%20preciso%20de%20ajuda"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium text-foreground/90 transition active:bg-muted/60"
          >
            <Headphones className="h-5 w-5 text-muted-foreground" strokeWidth={1.6} /> Suporte
          </a>
          <button
            onClick={() => {
              onClose();
              openSettings();
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] font-medium text-foreground/90 transition active:bg-muted/60"
          >
            <Settings className="h-5 w-5 text-muted-foreground" strokeWidth={1.6} /> Configurações
          </button>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium text-foreground/90 transition active:bg-muted/60"
            >
              <ShieldCheck className="h-5 w-5 text-muted-foreground" strokeWidth={1.6} />{" "}
              Administração
            </Link>
          )}
        </div>

        <div className="mt-auto px-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium text-red-400 transition active:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.6} /> Sair
          </button>
        </div>
      </aside>
    </div>
  );
}

const MOBILE_SLIDES = [
  {
    eyebrow: "Bem-vindo ao",
    title: "LURE Growth",
    lines: [
      "A plataforma oficial da agência que já rodou +R$100M em mídia.",
      "Trilhas guiadas, mentorias ao vivo e a comunidade que cresce junto com você.",
    ],
    cta: "Explorar agora",
    to: "/meus-cursos",
    image: "/banner-home.jpg",
  },
  {
    eyebrow: "Nova trilha",
    title: "IA Aplicada",
    lines: [
      "Domine as ferramentas de IA que já estão dentro da operação da LURE.",
      "Do primeiro prompt aos agentes que trabalham por você.",
    ],
    cta: "Começar trilha",
    to: "/meus-cursos",
    image: "/social-prospeccao.jpg",
  },
  {
    eyebrow: "Toda quinta, ao vivo",
    title: "Mentorias",
    lines: [
      "Encontros semanais com os sócios para destravar o seu negócio.",
      "Traga o seu caso e saia com um plano.",
    ],
    cta: "Ver agenda",
    to: "/comunidade",
    image: "/social-pratica.jpg",
  },
] as const;

function MobileHero() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const total = MOBILE_SLIDES.length;

  const scrollTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(total - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  // Passa sozinho de slide; para assim que o dedo encosta.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % total;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, 6000);
    return () => window.clearInterval(t);
  }, [paused, total]);

  return (
    <section
      className="px-4 pt-2"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[26px] border border-white/10 shadow-[0_24px_60px_-30px_oklch(0_0_0/0.9)]">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {MOBILE_SLIDES.map((slide, i) => (
            <article key={slide.title} className="relative w-full flex-shrink-0 snap-center">
              {/* Foto ocupando a direita, esmaecendo para o texto respirar */}
              <img
                src={slide.image}
                alt=""
                aria-hidden
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-y-0 right-0 h-full w-[68%] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050914] via-[#050914]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-transparent to-transparent" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 85% 60%, oklch(0.62 0.19 250 / 0.35), transparent 70%)",
                }}
              />

              <div className="relative flex min-h-[300px] flex-col justify-center px-6 py-9">
                <h1 className="font-display text-[30px] font-bold leading-[1.08] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  <span className="block text-[19px] font-normal text-white/90">{slide.eyebrow}</span>
                  {slide.title}
                </h1>
                <div className="mt-4 max-w-[62%] space-y-2.5">
                  {slide.lines.map((l) => (
                    <p key={l} className="text-[12.5px] leading-relaxed text-white/70">
                      {l}
                    </p>
                  ))}
                </div>
                <Link
                  to={slide.to}
                  className="mt-6 inline-flex w-fit items-center gap-2.5 rounded-full gradient-blue px-5 py-3 text-[14px] font-semibold text-white shadow-[0_12px_30px_-10px_var(--nav)] transition active:scale-95"
                >
                  {slide.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Indicadores */}
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5">
          {MOBILE_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para o slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-7 bg-white" : "w-4 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MobileTabBar({ current = "/" }: { current?: string }) {
  const items = [
    { icon: House, label: "Início", to: "/" },
    { icon: BookOpen, label: "Cursos", to: "/meus-cursos" },
    { icon: Gauge, label: "Diagnóstico", to: "/diagnostico" },
    { icon: Users, label: "Comunidade", to: "/comunidade" },
  ] as const;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 px-6 lg:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.6rem)" }}
    >
      {/* Degrade atras da barra: o conteudo some suavemente por baixo dela */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-background via-background/85 to-transparent"
        aria-hidden
      />
      <ul className="mx-auto flex max-w-[360px] items-center justify-between rounded-full border border-white/10 bg-surface/75 px-1.5 py-1.5 shadow-[0_12px_32px_-10px_oklch(0_0_0/0.9)] backdrop-blur-2xl">
        {items.map((it) => {
          const active = it.to === current;
          return (
            <li key={it.label} className="flex-1">
              <Link
                to={it.to}
                title={it.label}
                className={`flex w-full flex-col items-center gap-0.5 rounded-full py-1.5 transition ${
                  active ? "text-[var(--nav)]" : "text-muted-foreground active:text-foreground"
                }`}
              >
                <it.icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.1 : 1.7} />
                <span className="text-[9.5px] font-medium leading-none tracking-tight">
                  {it.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Sidebar({
  open,
  onToggle,
  current = "/",
}: {
  open: boolean;
  onToggle: () => void;
  current?: string;
}) {
  const primary = [
    { icon: House, label: "Início", to: "/" },
    { icon: BookOpen, label: "Meus cursos", to: "/meus-cursos" },
    { icon: Gauge, label: "Diagnóstico", to: "/diagnostico" },
    { icon: ScrollText, label: "Certificados", to: "/meus-cursos" },
  ];
  const secondary = [
    {
      icon: Headphones,
      label: "Suporte",
      href: "https://wa.me/5585991112424?text=Ol%C3%A1%2C%20estou%20na%20%C3%81rea%20de%20Membros%20e%20preciso%20de%20ajuda",
    },
    { icon: Settings, label: "Configurações", onClick: openSettings },
  ];
  const withActive = <T extends { to?: string; href?: string }>(items: T[]) =>
    items.map((it) => ({ ...it, active: it.to ? it.to === current : false }));

  return (
    <aside
      className={`dark-scope sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-border/60 bg-gradient-to-b from-surface/80 to-background transition-all duration-300 lg:flex ${
        open ? "w-[260px] px-4 py-5" : "w-[76px] items-center py-5 px-3"
      }`}
    >
      {/* Logo */}
      <button
        onClick={onToggle}
        className={`group mb-8 flex items-center rounded-xl transition ${
          open ? "gap-3 px-2" : "justify-center"
        }`}
        title={open ? "Fechar menu" : "Abrir menu"}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-md opacity-0 transition group-hover:opacity-100" />
          <img
            src={lureLogo.url}
            alt="Lure Digital"
            className={`relative shrink-0 rounded-full object-contain transition-all duration-300 ${
              open ? "h-10 w-10" : "h-9 w-9"
            }`}
          />
        </div>
        {open && (
          <div className="text-left leading-tight">
            <div className="font-display text-[15px] font-bold tracking-[0.14em]">LURE</div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Growth
            </div>
          </div>
        )}
      </button>

      {/* Nav */}
      <nav className={`flex w-full flex-1 flex-col ${open ? "gap-6" : "items-center gap-6"}`}>
        <NavGroup label="Menu" open={open} items={withActive(primary)} />
        <NavGroup label="Geral" open={open} items={withActive(secondary)} />
      </nav>

      {/* Footer */}
      <div className={`mt-6 flex w-full flex-col ${open ? "gap-3" : "items-center gap-3"}`}>
        {open ? (
          <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-surface-elevated/70 p-4">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/20 text-primary">
                  <Crown className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs font-semibold tracking-wide text-primary">Plano Premium</p>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Acesso vitalício a todas as trilhas, mentorias e comunidade.
              </p>
              <button className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/15 px-3 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary/25">
                Ver benefícios
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ) : (
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-primary/25 bg-primary/10 text-primary transition hover:bg-primary/20"
            title="Plano Premium"
          >
            <Crown className="h-4 w-4" />
          </button>
        )}
        <ProfileMenu open={open} />
      </div>
    </aside>
  );
}

function NavGroup({
  label,
  open,
  items,
}: {
  label: string;
  open: boolean;
  items: {
    icon: typeof House;
    label: string;
    active?: boolean;
    href?: string;
    to?: string;
    onClick?: () => void;
  }[];
}) {
  return (
    <div className={`flex w-full flex-col ${open ? "gap-1" : "items-center gap-1.5"}`}>
      {open ? (
        <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground/60">
          {label}
        </div>
      ) : (
        <div className="mb-0.5 h-px w-6 bg-border/60" aria-hidden />
      )}
      {items.map((it) => {
        const base = (
          <>
            {it.active && (
              <>
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/25 to-primary/5 ring-1 ring-primary/30" />
                {open && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_16px_-2px_var(--primary)]" />
                )}
              </>
            )}
            <it.icon
              strokeWidth={1.6}
              className={`relative h-[19px] w-[19px] shrink-0 ${it.active ? "text-primary" : ""}`}
            />
            {open && <span className="relative">{it.label}</span>}
          </>
        );
        const cls = `group relative flex items-center transition ${
          open
            ? "gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium"
            : "h-11 w-11 items-center justify-center rounded-xl"
        } ${
          it.active
            ? "text-primary"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        }`;

        return it.href ? (
          <a
            key={it.label}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cls}
            title={!open ? it.label : undefined}
          >
            {base}
          </a>
        ) : it.to ? (
          <Link key={it.label} to={it.to} className={cls} title={!open ? it.label : undefined}>
            {base}
          </Link>
        ) : (
          <button
            key={it.label}
            onClick={it.onClick}
            className={cls}
            title={!open ? it.label : undefined}
          >
            {base}
          </button>
        );
      })}
    </div>
  );
}

export { initialsOf };

function ProfileMenu({ open }: { open: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { profile, session, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const name = profile?.full_name || profile?.email?.split("@")[0] || "Aluno LURE";
  const email = profile?.email || session?.user?.email || "";
  const roleLabel = isAdmin ? "Administrador" : "Membro";

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    navigate({ to: "/login", replace: true });
  };

  const openProfileSettings = () => {
    setMenuOpen(false);
    openSettings();
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      {open ? (
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${
            menuOpen
              ? "border-primary/40 bg-surface-elevated"
              : "border-border bg-surface hover:bg-surface-elevated"
          }`}
        >
          <Avatar
            url={profile?.avatar_url}
            name={profile?.full_name}
            email={email}
            className="h-10 w-10"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{name}</div>
            <div className="truncate text-xs text-muted-foreground">{roleLabel}</div>
          </div>
          <ChevronRight
            className={`h-4 w-4 shrink-0 text-muted-foreground transition ${menuOpen ? "rotate-90" : ""}`}
          />
        </button>
      ) : (
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="relative flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-transparent transition hover:ring-primary/40"
          title={name}
          aria-label="Abrir menu do perfil"
        >
          <Avatar
            url={profile?.avatar_url}
            name={profile?.full_name}
            email={email}
            className="h-10 w-10"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-surface" />
        </button>
      )}

      {menuOpen && (
        <div
          className={`absolute z-50 w-56 overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-2xl ${
            open ? "bottom-full left-0 right-0 mb-2 w-auto" : "bottom-0 left-full ml-3"
          }`}
        >
          <div className="border-b border-border px-3 py-3">
            <div className="truncate text-sm font-semibold">{name}</div>
            <div className="truncate text-xs text-muted-foreground">{email}</div>
          </div>
          <div className="p-1.5">
            <button
              onClick={openProfileSettings}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground/90 transition hover:bg-muted"
            >
              <Settings className="h-4 w-4" />
              Editar perfil
            </button>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground/90 transition hover:bg-muted"
              >
                <ShieldCheck className="h-4 w-4" />
                Administração
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressPill() {
  // Progresso geral: soma ponderada pelas aulas de cada módulo.
  const mods = sections.flatMap((s) => s.modules);
  const total = mods.reduce((a, m) => a + m.lessons, 0);
  const done = mods.reduce((a, m) => a + Math.round((m.lessons * m.progress) / 100), 0);
  const pct = total ? Math.round((done / total) * 100) : 0;

  const r = 15.5;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div
      title={`${done} de ${total} aulas concluídas`}
      className="group relative hidden items-center gap-3 overflow-hidden rounded-full border border-primary/25 bg-surface/80 py-1.5 pl-1.5 pr-4 shadow-sm backdrop-blur-md transition hover:border-primary/55 hover:shadow-[0_0_24px_-8px_var(--primary)] sm:flex"
    >
      {/* brilho azul que acompanha o progresso */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-primary/22 to-transparent transition-all duration-700"
        style={{ width: `${Math.max(pct, 8)}%` }}
      />
      <div className="relative h-10 w-10 shrink-0">
        <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-90">
          <circle
            cx="20"
            cy="20"
            r={r}
            fill="none"
            strokeWidth="3.5"
            className="stroke-foreground/12"
          />
          <circle
            cx="20"
            cy="20"
            r={r}
            fill="none"
            stroke="url(#lureProgress)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              filter: "drop-shadow(0 0 4px var(--primary))",
            }}
          />
          <defs>
            <linearGradient id="lureProgress" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F6CE86" />
              <stop offset="100%" stopColor="#DE9F44" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums text-foreground">
          {pct}%
        </span>
      </div>
      <div className="relative flex flex-col leading-tight">
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Seu progresso
        </span>
        <span className="text-[12px] font-semibold tabular-nums text-foreground">
          {done}
          <span className="text-muted-foreground">/{total} aulas</span>
        </span>
      </div>
    </div>
  );
}

export function TopBar() {
  const { profile, session, isAdmin } = useAuth();
  const name = profile?.full_name || profile?.email?.split("@")[0] || "Aluno LURE";
  const email = profile?.email || session?.user?.email;
  const roleLabel = isAdmin ? "Administrador" : "Membro";
  return (
    <header className="dark-scope sticky top-0 z-30 flex h-18 items-center justify-between gap-4 border-b border-border/50 bg-background/90 px-6 md:px-10 backdrop-blur-xl shadow-[0_10px_30px_-20px_oklch(0_0_0/0.6)]">
      <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Buscar cursos, aulas, mentores..."
          className="w-56 bg-transparent outline-none placeholder:text-muted-foreground md:w-80"
        />
      </div>
      <div className="flex items-center gap-3">
        <ProgressPill />
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted-foreground transition hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </button>
        <button
          onClick={openSettings}
          title="Editar perfil"
          className="flex items-center gap-3 rounded-full border border-border bg-surface pl-1 pr-4 py-1 transition hover:border-primary/40"
        >
          <div className="relative h-8 w-8">
            <Avatar
              url={profile?.avatar_url}
              name={profile?.full_name}
              email={email}
              className="h-8 w-8"
              textClassName="text-[11px]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-surface" />
          </div>
          <div className="text-sm text-left">
            <div className="font-medium leading-tight">{name}</div>
            <div className="text-[11px] leading-tight text-muted-foreground">{roleLabel}</div>
          </div>
        </button>
      </div>
    </header>
  );
}

function HeroBanner() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Banner estilo Kiwify: imagem completa (texto ja embutido na arte), exibida inteira
          na proporcao nativa — w-full/h-auto, entao nunca corta e escala em todo device. */}
      <div className="relative w-full">
        <img
          src="/banner-home.jpg"
          alt="LURE Growth"
          className="block w-full h-auto"
        />
      </div>
    </section>
  );
}

function SectionRow({ section }: { section: (typeof sections)[number] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="mt-10 lg:mt-14">
      <div className="mb-4 flex items-end justify-between gap-3 lg:mb-5">
        <div className="min-w-0">
          <h2 className="font-display text-[19px] font-bold tracking-[0.14em] lg:text-xl lg:tracking-[0.15em]">
            {section.title}
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground lg:text-sm">{section.subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-4 text-sm text-muted-foreground">
          <span className="hidden lg:inline">{section.modules.length} módulos</span>
          <button className="flex items-center gap-1 whitespace-nowrap text-[13px] text-[var(--nav)] transition hover:brightness-125 lg:text-sm lg:text-muted-foreground lg:hover:text-foreground">
            Ver todos <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile: grade de duas colunas, como um app */}
      <div className="grid grid-cols-2 gap-3.5 lg:hidden">
        {section.modules.map((m, i) => (
          <MobileModuleCard key={m.title} m={m} sectionId={section.id} index={i} />
        ))}
      </div>

      {/* Desktop: carrossel horizontal */}
      <div className="relative hidden lg:block">
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollBy(-1)}
          className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-lg backdrop-blur transition hover:border-primary/50 hover:text-primary lg:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Próximo"
          onClick={() => scrollBy(1)}
          className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-lg backdrop-blur transition hover:border-primary/50 hover:text-primary lg:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {section.modules.map((m) => (
            <div
              key={m.title}
              data-card
              className="w-[calc(100%-1rem)] shrink-0 snap-start sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)] xl:w-[calc(25%-0.9375rem)]"
            >
              <ModuleCard m={m} sectionId={section.id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Card do mobile: capa quadrada, titulo embaixo e progresso — layout de app. */
export function MobileModuleCard({
  m,
  sectionId,
  index = 0,
}: {
  m: Module;
  sectionId: string;
  index?: number;
}) {
  const covers = useContext(CoversContext);
  const thumb = covers[coverKey(sectionId, m.title)] ?? m.thumb;

  const slug = m.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const linkProps = m.moduleId
    ? ({ to: "/modulo/$id", params: { id: m.moduleId } } as const)
    : ({ to: "/curso/$slug", params: { slug } } as const);

  return (
    <Link
      {...linkProps}
      className="lure-rise group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/60 transition active:scale-[0.98]"
      style={{ "--d": `${index * 70}ms` } as React.CSSProperties}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#0B152D] to-black">
            <img src={lureLogo.url} alt="" aria-hidden className="h-12 w-12 object-contain opacity-90" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        {m.tag && (
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-black/70 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur">
            {m.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-foreground">
          {m.title}
        </h3>
        <div className="mt-3 flex items-center gap-2.5">
          <span className="shrink-0 text-[12px] tabular-nums text-muted-foreground">
            {m.progress}%
          </span>
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <span
              className="block h-full rounded-full gradient-blue transition-all duration-700"
              style={{ width: `${m.progress}%` }}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ModuleCard({ m, sectionId }: { m: Module; sectionId: string }) {
  // Cor neutra e fixa para todos os cards — sem paleta colorida
  const accentBar = "bg-foreground/70";
  const glow = "oklch(from var(--foreground) l c h / 0.12)";

  // Capa salva no painel admin (banco) tem prioridade sobre a imagem fixa do código.
  const covers = useContext(CoversContext);
  const thumb = covers[coverKey(sectionId, m.title)] ?? m.thumb;

  const slug = m.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Todos os cards são clicáveis (removido o estado "em gravação").
  const emGravacao = false;

  const linkProps = m.moduleId
    ? ({ to: "/modulo/$id", params: { id: m.moduleId } } as const)
    : ({ to: "/curso/$slug", params: { slug } } as const);

  return (
    <Link
      {...linkProps}
      onClick={(e) => {
        if (emGravacao) e.preventDefault();
      }}
      aria-disabled={emGravacao}
      className={`group relative flex h-[440px] flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-card)] ${
        emGravacao ? "cursor-not-allowed" : ""
      }`}
    >
      {/* Optional thumb background */}
      {thumb && (
        <img
          src={thumb}
          alt={m.title}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      )}
      {!thumb && (
        <>
          {/* Sem foto: logo da LURE em fundo preto */}
          <div className="pointer-events-none absolute inset-0 bg-black" />
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <img
              src={lureLogo.url}
              alt="LURE"
              className="h-20 w-20 object-contain opacity-90 transition duration-500 group-hover:scale-105"
            />
          </div>
          {/* Brilho sutil embaixo pra dar profundidade */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
            style={{
              background: `radial-gradient(ellipse 70% 90% at 50% 100%, ${glow}, transparent 70%)`,
            }}
          />
        </>
      )}

      {/* Hover play */}
      {!emGravacao && (
        <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 opacity-0 backdrop-blur transition group-hover:opacity-100">
          <Play className="h-4 w-4 fill-primary text-primary" />
        </div>
      )}

      {/* Header */}
      <div className="relative flex flex-1 flex-col p-6">
        {m.tag && (
          <span className="mb-4 inline-flex w-fit items-center rounded-md bg-background/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur">
            {m.tag}
          </span>
        )}
        {/* A capa ja traz o titulo escrito; so mostramos texto quando nao ha capa. */}
        {!thumb && <h3 className="font-display text-xl font-bold leading-snug">{m.title}</h3>}

        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
          <span className="truncate">{m.author}</span>
          <span className="flex shrink-0 items-center gap-1">
            <Play className="h-3 w-3" /> {m.lessons} aulas
          </span>
        </div>
      </div>

      {/* Progress bar flush to card bottom */}
      <div className="relative h-1.5 w-full bg-background/70">
        <div className={`h-full ${accentBar}`} style={{ width: `${m.progress}%` }} />
      </div>

      {/* "Em gravação" overlay — aparece ao passar o mouse */}
      {emGravacao && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-background/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-5 py-3 backdrop-blur">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Em gravação...
            </span>
            <span className="text-[11px] text-muted-foreground">Novo módulo em breve</span>
          </div>
        </div>
      )}
    </Link>
  );
}
