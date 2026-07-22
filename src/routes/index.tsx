import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Play,
  Target,
  Search,
  Bell,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  GraduationCap,
  Users,
  Award,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  CreditCard,
  LogOut,
  Crown,
  LifeBuoy,
  Sun,
  Moon,
  Hexagon,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, initialsOf } from "@/components/avatar";
import { openSettings } from "@/components/profile-settings-modal";
import { DbModules } from "@/components/db-modules";
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
    id: "social",
    title: "SOCIAL SELLING",
    subtitle: "Prospecção e autoridade nas redes",
    modules: [
      {
        title: "Prospecção no LinkedIn",
        author: "Julia Farias",
        lessons: 10,
        progress: 72,
        tag: "NOVO",
        accent: "gold",
      },
      {
        title: "Perfil Magnético B2B",
        author: "Julia Farias",
        lessons: 6,
        progress: 35,
        accent: "blue",
      },
      { title: "Copy para DMs", author: "Time LURE", lessons: 5, progress: 0, accent: "none" },
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
      },
      {
        title: "Onboarding de Alta Performance",
        author: "Bruna Dias",
        lessons: 5,
        progress: 0,
        accent: "blue",
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
];

function Portal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
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
          <main className="pb-28 lg:pb-24">
            {/* Mobile-only G4-style hero */}
            <div className="lg:hidden">
              <MobileHero />
            </div>
            {/* Desktop hero */}
            <div className="hidden lg:block">
              <HeroBanner />
            </div>
            <div className="mx-auto max-w-[1400px] px-4 md:px-10">
              <DbModules />
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
  );
}

export function MobileTopBar() {
  const { profile, session } = useAuth();
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between border-b border-border/40 bg-background/85 px-4 pb-3 backdrop-blur-xl lg:hidden"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
    >
      <div className="flex items-center gap-2.5">
        <img src={lureLogo.url} alt="LURE" className="h-8 w-8 rounded-full object-contain" />
        <div className="leading-tight">
          <div className="font-display text-[13px] font-bold tracking-[0.16em]">LURE</div>
          <div className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground">Growth</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          aria-label="Buscar"
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted-foreground"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          aria-label="Notificações"
          className="relative grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-muted-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-background" />
        </button>
        <button
          onClick={openSettings}
          aria-label="Editar perfil"
          className="relative h-9 w-9 shrink-0 rounded-full ring-2 ring-primary/40 transition active:scale-95"
        >
          <Avatar
            url={profile?.avatar_url}
            name={profile?.full_name}
            email={profile?.email || session?.user?.email}
            className="h-9 w-9"
            textClassName="text-[11px]"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
        </button>
      </div>
    </header>
  );
}

const MOBILE_SLIDES = [
  {
    kicker: "Conheça agora o novo",
    title: "App LURE",
    headline: ["A MAIOR", "NOVIDADE", "DA LURE"],
    caption: "desde 2019",
    cta: "Clique e saiba mais",
    image: () => lureTeam.url,
  },
  {
    kicker: "Nova trilha disponível",
    title: "IA Aplicada",
    headline: ["DOMINE", "AS FERRAMENTAS", "DE IA"],
    caption: "do zero ao avançado",
    cta: "Começar trilha",
    image: () => lureTeam.url,
  },
  {
    kicker: "Toda quinta, ao vivo",
    title: "Mentorias",
    headline: ["ENCONTROS", "SEMANAIS", "COM OS SÓCIOS"],
    caption: "sessões exclusivas",
    cta: "Ver agenda",
    image: () => lureTeam.url,
  },
  {
    kicker: "Comunidade LURE",
    title: "Networking",
    headline: ["CONECTE-SE", "COM +2.400", "ALUNOS"],
    caption: "comunidade ativa",
    cta: "Entrar agora",
    image: () => lureTeam.url,
  },
];

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

  return (
    <section className="relative px-4 pt-6">
      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-[28px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {MOBILE_SLIDES.map((slide, i) => (
            <div key={i} className="w-full flex-shrink-0 snap-center">
              <div className="relative overflow-hidden rounded-[28px] border border-primary/25 bg-surface shadow-[0_30px_80px_-30px_oklch(0_0_0/0.7)]">
                <img
                  src={slide.image()}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 90% 60% at 50% 100%, oklch(0.78 0.14 70 / 0.35), transparent 65%)",
                  }}
                />
                <div className="relative flex min-h-[520px] flex-col items-center px-6 pb-16 pt-10 text-center">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={lureLogo.url}
                      alt="LURE"
                      className="h-9 w-9 rounded-full object-contain"
                    />
                    <span className="font-display text-lg font-bold tracking-[0.22em]">LURE</span>
                  </div>

                  <p className="mt-8 text-sm text-muted-foreground">{slide.kicker}</p>
                  <h1
                    className="mt-1 text-5xl font-medium italic leading-[0.95] tracking-tight text-primary"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {slide.title}
                  </h1>

                  <div className="mt-10 w-full">
                    <h2 className="font-display text-[34px] font-black uppercase leading-[0.95] tracking-tight text-foreground">
                      {slide.headline[0]}
                      <br />
                      {slide.headline[1]}
                      <br />
                      <span
                        className="bg-clip-text text-transparent"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, oklch(0.9 0.11 85), oklch(0.78 0.13 70), oklch(0.7 0.15 55))",
                        }}
                      >
                        {slide.headline[2]}
                      </span>
                    </h2>
                    <p
                      className="mt-3 text-lg italic text-muted-foreground"
                      style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                      {slide.caption}
                    </p>
                  </div>

                  <button className="mt-8 inline-flex items-center gap-2 rounded-full gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
                    <Target className="h-4 w-4" />
                    {slide.cta}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating arrows */}
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollTo(index - 1)}
          disabled={index === 0}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-primary/30 bg-background/60 p-2 text-foreground shadow-[0_8px_24px_-8px_oklch(0_0_0/0.6)] backdrop-blur-md transition hover:bg-background/80 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Próximo"
          onClick={() => scrollTo(index + 1)}
          disabled={index === total - 1}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-primary/30 bg-background/60 p-2 text-foreground shadow-[0_8px_24px_-8px_oklch(0_0_0/0.6)] backdrop-blur-md transition hover:bg-background/80 disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Floating dots */}
        <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-1.5">
          {MOBILE_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-primary shadow-[0_0_12px_oklch(0.78_0.14_70/0.7)]"
                  : "w-1.5 bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MobileTabBar() {
  const items = [
    { icon: LayoutGrid, label: "Início", active: true },
    { icon: GraduationCap, label: "Cursos" },
    { icon: Users, label: "Comunidade" },
    { icon: User, label: "Perfil" },
  ];
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/90 px-2 pt-2 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.5rem)" }}
    >
      <ul className="flex items-stretch justify-between">
        {items.map((it) => (
          <li key={it.label} className="flex-1">
            <button
              className={`flex w-full flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition ${
                it.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full transition ${
                  it.active
                    ? "bg-primary/15 ring-1 ring-primary/40 shadow-[0_0_20px_-4px_oklch(0.78_0.14_70/0.55)]"
                    : ""
                }`}
              >
                <it.icon className="h-4 w-4" />
              </span>
              {it.label}
            </button>
          </li>
        ))}
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
    { icon: LayoutGrid, label: "Início", to: "/" },
    { icon: GraduationCap, label: "Meus cursos", to: "/meus-cursos" },
    { icon: Hexagon, label: "Diagnóstico", to: "/diagnostico" },
    { icon: Award, label: "Certificados", to: "/meus-cursos" },
  ];
  const secondary = [
    {
      icon: LifeBuoy,
      label: "Suporte",
      href: "https://wa.me/5585991112424?text=Ol%C3%A1%2C%20estou%20na%20%C3%81rea%20de%20Membros%20e%20preciso%20de%20ajuda",
    },
    { icon: Settings, label: "Configurações", onClick: openSettings },
  ];
  const withActive = <T extends { to?: string; href?: string }>(items: T[]) =>
    items.map((it) => ({ ...it, active: it.to ? it.to === current : false }));

  return (
    <aside
      className={`dark-scope sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/60 bg-gradient-to-b from-surface/80 to-background transition-all duration-300 lg:flex ${
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
    icon: typeof LayoutGrid;
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
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary/5" />
                {open && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-glow" />
                )}
              </>
            )}
            <it.icon
              className={`relative h-[18px] w-[18px] shrink-0 ${it.active ? "text-primary" : ""}`}
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

function ThemeToggle() {
  const [light, setLight] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("light");
  });

  useEffect(() => {
    const saved = localStorage.getItem("lure-theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
      setLight(true);
    }
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("lure-theme", next ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      aria-label={light ? "Ativar modo escuro" : "Ativar modo claro"}
      title={light ? "Modo escuro" : "Modo claro"}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-sm transition hover:text-foreground hover:border-primary/40 hover:shadow-glow"
    >
      {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
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
        <ThemeToggle />
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
      <div className="relative h-[520px] md:h-[600px] w-full">
        <img
          src={lureTeam.url}
          alt="Time Lure Digital"
          className="absolute inset-0 h-full w-full object-cover object-center brightness-110 saturate-110"
        />
        {/* Subtle dark vignette — keeps text readable without washing the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050914]/80 via-[#050914]/20 to-transparent" />
        {/* Soft left-to-right readability mask using dark navy, not the light background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050914]/70 via-[#050914]/30 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-center p-8 md:p-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Área de Membros · Temporada 2026
            </div>

            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-6xl">
              Bem-vindo ao <span className="text-white">LURE Growth</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              A plataforma oficial da agência que já rodou +R$100M em mídia. Trilhas guiadas,
              mentorias ao vivo e a comunidade que cresce junto com você.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button className="group inline-flex items-center gap-2 rounded-xl gradient-gold px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110">
                <Target className="h-4 w-4" />
                Fazer Diagnóstico
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15">
                <Play className="h-4 w-4 fill-current" />
                Assistir tour
              </button>
            </div>
          </div>
        </div>
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
    <section className="mt-14">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-bold tracking-[0.15em]">{section.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{section.subtitle}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{section.modules.length} módulos</span>
          <button className="flex items-center gap-1 transition hover:text-foreground">
            Ver todos <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollBy(-1)}
          className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-lg backdrop-blur transition hover:border-primary/50 hover:text-primary md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Próximo"
          onClick={() => scrollBy(1)}
          className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-lg backdrop-blur transition hover:border-primary/50 hover:text-primary md:flex"
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
              <ModuleCard m={m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ m }: { m: Module }) {
  // Cor neutra e fixa para todos os cards — sem paleta colorida
  const accentBar = "bg-foreground/70";
  const glow = "oklch(from var(--foreground) l c h / 0.12)";

  const slug = m.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const emGravacao = m.progress === 0;

  return (
    <Link
      to="/curso/$slug"
      params={{ slug }}
      onClick={(e) => {
        if (emGravacao) e.preventDefault();
      }}
      aria-disabled={emGravacao}
      className={`group relative flex h-[440px] flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-card)] ${
        emGravacao ? "cursor-not-allowed" : ""
      }`}
    >
      {/* Optional thumb background */}
      {m.thumb && (
        <img
          src={m.thumb}
          alt={m.title}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      )}
      {!m.thumb && (
        <>
          {/* Bottom-center glow */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
            style={{
              background: `radial-gradient(ellipse 70% 90% at 50% 100%, ${glow}, transparent 70%)`,
            }}
          />
          {/* Top sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.04] to-transparent" />
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
        <h3 className="font-display text-xl font-bold leading-snug">{m.title}</h3>

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
