import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Heart, MessageCircle, Share2, Image as ImageIcon, Sparkles,
  Send, MoreHorizontal, TrendingUp,
} from "lucide-react";
import { Sidebar, TopBar, MobileTopBar, MobileTabBar } from "./index";

export const Route = createFileRoute("/comunidade")({
  head: () => ({
    meta: [
      { title: "Comunidade — LURE Growth" },
      { name: "description", content: "Conecte-se com +2.400 alunos da Lure Digital. Compartilhe conquistas, dúvidas e networking." },
      { property: "og:title", content: "Comunidade LURE" },
      { property: "og:description", content: "O feed da maior comunidade de marketing digital do Brasil." },
    ],
  }),
  component: ComunidadePage,
});

type Post = {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  category: "Conquista" | "Dúvida" | "Networking" | "Case" | "Insight";
  text: string;
  image?: string;
  likes: number;
  comments: number;
  liked?: boolean;
};

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: "Mariana Alves",
    role: "Gestora de Tráfego",
    avatar: "https://i.pravatar.cc/120?img=47",
    time: "há 12 min",
    category: "Conquista",
    text: "Primeira campanha rodando com o método da trilha de Meta Ads e já bati 4x ROAS no primeiro dia. Obrigada Lure. Alguém mais aplicando o framework de criativos UGC?",
    likes: 84,
    comments: 23,
  },
  {
    id: "2",
    author: "Rafael Nunes",
    role: "Copywriter · Premium",
    avatar: "https://i.pravatar.cc/120?img=12",
    time: "há 1h",
    category: "Insight",
    text: "Insight da mentoria de ontem: parar de vender o produto e começar a vender a transformação. Refiz 3 páginas de venda com esse ângulo e o CTR subiu 62%.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    likes: 156,
    comments: 41,
  },
  {
    id: "3",
    author: "Camila Rocha",
    role: "Social Media · SP",
    avatar: "https://i.pravatar.cc/120?img=32",
    time: "há 3h",
    category: "Dúvida",
    text: "Alguém aqui já testou automação com n8n + GPT pra responder DM de leads no Instagram? Tô montando um fluxo mas travei na parte de qualificação.",
    likes: 22,
    comments: 15,
  },
  {
    id: "4",
    author: "João Pedro",
    role: "Fundador · Agência JPX",
    avatar: "https://i.pravatar.cc/120?img=15",
    time: "há 5h",
    category: "Case",
    text: "Fechei 3 clientes esse mês só com o pitch que aprendi na trilha Comercial. Cliente falou que foi a proposta mais clara que ele já viu. R$18k em MRR novo.",
    likes: 312,
    comments: 78,
  },
  {
    id: "5",
    author: "Beatriz Lima",
    role: "Aluna · Fortaleza-CE",
    avatar: "https://i.pravatar.cc/120?img=45",
    time: "ontem",
    category: "Networking",
    text: "Tem alguém do Ceará por aqui? Bora marcar um meetup presencial em Fortaleza. Já são 8 pessoas confirmadas.",
    likes: 47,
    comments: 19,
  },
];

const CATEGORIES = ["Todos", "Conquista", "Dúvida", "Networking", "Case", "Insight"] as const;

function ComunidadePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("Todos");
  const [draft, setDraft] = useState("");

  const filtered = filter === "Todos" ? posts : posts.filter((p) => p.category === filter);

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p
      )
    );
  };

  const publish = () => {
    const text = draft.trim();
    if (!text) return;
    setPosts((prev) => [
      {
        id: crypto.randomUUID(),
        author: "Alvaro Paiva",
        role: "Web Designer · Você",
        avatar: "https://i.pravatar.cc/120?img=68",
        time: "agora",
        category: "Insight",
        text,
        likes: 0,
        comments: 0,
      },
      ...prev,
    ]);
    setDraft("");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} current="/comunidade" />

      <main className="relative flex min-h-screen flex-1 flex-col">
        <div className="hidden lg:block">
          <TopBar />
        </div>
        <div className="lg:hidden">
          <MobileTopBar />
        </div>

        {/* Editorial header */}
        <section className="px-6 pt-14 pb-8 md:px-14 md:pt-20 md:pb-12">
          <div className="mx-auto max-w-5xl">
            <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Comunidade · Temporada 2026
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Onde alunos <span className="italic text-primary/90">crescem juntos.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Um espaço editorial para conquistas, dúvidas e insights da rede Lure. Sem ruído.
            </p>

            <div className="mt-10 flex items-center gap-10 border-t border-border/40 pt-6 text-sm">
              <Stat value="2.4k" label="Membros" />
              <div className="h-8 w-px bg-border/40" />
              <Stat value="184" label="Posts hoje" />
              <div className="h-8 w-px bg-border/40" />
              <Stat value="97%" label="Satisfação" />
            </div>
          </div>
        </section>

        <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 gap-14 px-6 pb-16 md:px-14 lg:grid-cols-[1fr_280px]">
          {/* Feed column */}
          <div className="flex flex-col gap-8">
            {/* Composer */}
            <div className="border-b border-border/40 pb-6">
              <div className="flex gap-4">
                <img
                  src="https://i.pravatar.cc/120?img=68"
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border/60"
                />
                <div className="flex-1">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Compartilhe uma conquista, um insight ou uma dúvida…"
                    className="w-full resize-none border-0 bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground/70 focus:ring-0"
                    rows={2}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-muted-foreground/70">
                      <button className="rounded-md p-2 transition hover:text-foreground" title="Adicionar imagem">
                        <ImageIcon className="h-4 w-4" />
                      </button>
                      <button className="rounded-md p-2 transition hover:text-foreground" title="Categoria">
                        <Sparkles className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={publish}
                      disabled={!draft.trim()}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Send className="h-3 w-3" />
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter — quiet inline nav */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`relative py-1 transition ${
                    filter === c
                      ? "text-foreground"
                      : "text-muted-foreground/70 hover:text-foreground"
                  }`}
                >
                  {c}
                  {filter === c && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="flex flex-col">
              {filtered.map((p, i) => (
                <PostCard key={p.id} post={p} onLike={() => toggleLike(p.id)} first={i === 0} />
              ))}
              {filtered.length === 0 && (
                <div className="border-t border-border/40 py-16 text-center text-sm text-muted-foreground">
                  Nenhum post nessa categoria ainda.
                </div>
              )}
            </div>
          </div>

          {/* Right rail — editorial */}
          <aside className="hidden flex-col gap-10 pt-2 lg:flex">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                <TrendingUp className="h-3 w-3" /> Em alta
              </div>
              <ul className="flex flex-col divide-y divide-border/30">
                {[
                  { tag: "MetaAds2026", posts: "182" },
                  { tag: "IAparaCopy", posts: "134" },
                  { tag: "FunilPerpétuo", posts: "97" },
                  { tag: "UGCcriativo", posts: "71" },
                ].map((t) => (
                  <li key={t.tag} className="flex items-baseline justify-between py-2.5 text-[13px]">
                    <span className="text-foreground">
                      <span className="text-muted-foreground/50">#</span>{t.tag}
                    </span>
                    <span className="text-[11px] tabular-nums text-muted-foreground/60">{t.posts}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Quem seguir
              </div>
              <ul className="flex flex-col gap-4">
                {[
                  { name: "Lucas Ferreira", role: "Sócio · Lure", img: "https://i.pravatar.cc/80?img=8" },
                  { name: "Isabela Prado", role: "Head de IA", img: "https://i.pravatar.cc/80?img=25" },
                  { name: "Diego Martins", role: "Mentor Comercial", img: "https://i.pravatar.cc/80?img=13" },
                ].map((u) => (
                  <li key={u.name} className="flex items-center gap-3">
                    <img src={u.img} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-border/60" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium">{u.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground/70">{u.role}</div>
                    </div>
                    <button className="text-[11px] font-medium text-primary/90 transition hover:text-primary">
                      Seguir
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border/40 pt-6 text-[11px] leading-relaxed text-muted-foreground/70">
              <div className="mb-2 font-medium uppercase tracking-[0.2em] text-muted-foreground">Manifesto</div>
              Respeito acima de tudo. Zero spam. Resultados reais com prints. Ajude antes de pedir ajuda.
            </div>
          </aside>
        </div>

        <div className="lg:hidden">
          <MobileTabBar />
        </div>
      </main>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="leading-tight">
      <div className="font-display text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">{label}</div>
    </div>
  );
}

function PostCard({ post, onLike, first }: { post: Post; onLike: () => void; first?: boolean }) {
  return (
    <article className={`group py-8 ${first ? "" : "border-t border-border/30"}`}>
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={post.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-border/60" />
          <div className="leading-tight">
            <div className="text-[13px] font-medium">{post.author}</div>
            <div className="text-[11px] text-muted-foreground/70">
              {post.role} · {post.time}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary/80">
            {post.category}
          </span>
          <button className="rounded-md p-1 text-muted-foreground/60 opacity-0 transition hover:text-foreground group-hover:opacity-100">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </header>

      <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.7] text-foreground/90">
        {post.text}
      </p>

      {post.image && (
        <div className="mt-5 overflow-hidden rounded-lg">
          <img src={post.image} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <footer className="mt-5 flex items-center gap-5 text-[12px] text-muted-foreground/70">
        <button
          onClick={onLike}
          className={`inline-flex items-center gap-1.5 transition hover:text-foreground ${
            post.liked ? "text-primary" : ""
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${post.liked ? "fill-current" : ""}`} />
          <span className="tabular-nums">{post.likes}</span>
        </button>
        <button className="inline-flex items-center gap-1.5 transition hover:text-foreground">
          <MessageCircle className="h-3.5 w-3.5" />
          <span className="tabular-nums">{post.comments}</span>
        </button>
        <button className="ml-auto inline-flex items-center gap-1.5 transition hover:text-foreground">
          <Share2 className="h-3.5 w-3.5" />
          <span>Compartilhar</span>
        </button>
      </footer>
    </article>
  );
}
