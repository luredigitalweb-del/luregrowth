import { parseYouTubeId } from "./youtube";

/**
 * De onde vem o vídeo de uma aula.
 *
 * O campo no banco continua se chamando `youtube_url` — é só o nome da coluna,
 * e renomear exigiria migration e mexer em tudo que lê a tabela. O que manda é
 * o que está escrito nela.
 */
export type VideoSource = { kind: "youtube" | "drive"; id: string };

/**
 * Formatos de link que o Google Drive distribui:
 * - .../file/d/<id>/view?usp=sharing   (botão "Copiar link")
 * - .../open?id=<id>, .../uc?id=<id>   (links antigos e de download)
 *
 * O id do Drive é bem mais longo que os 11 caracteres do YouTube. Link de
 * PASTA (/drive/folders/<id>) de propósito não casa com nenhum: pasta não é
 * vídeo, e aceitar ia dar tela de erro na cara do aluno.
 */
const DRIVE_PATTERNS = [
  /(?:drive|docs)\.google\.com\/file\/d\/([a-zA-Z0-9_-]{10,})/,
  /drive\.google\.com\/[^\s]*[?&]id=([a-zA-Z0-9_-]{10,})/,
  /drive\.usercontent\.google\.com\/[^\s]*[?&]id=([a-zA-Z0-9_-]{10,})/,
];

/** Extrai o id do arquivo a partir de um link do Google Drive. */
export function parseDriveId(input: string): string | null {
  const url = input.trim();
  if (!url) return null;
  for (const re of DRIVE_PATTERNS) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

/** Descobre se o link é do YouTube, do Drive, ou de lugar nenhum. */
export function parseVideo(input: string): VideoSource | null {
  const yt = parseYouTubeId(input);
  if (yt) return { kind: "youtube", id: yt };
  const drive = parseDriveId(input);
  if (drive) return { kind: "drive", id: drive };
  return null;
}

/** Link que o Drive aceita dentro de um iframe (o /view não funciona). */
export function driveEmbedUrl(id: string): string {
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function isVideoLink(input: string): boolean {
  return !!parseVideo(input);
}

/** Texto padrão dos campos de link — a mesma explicação em todas as telas. */
export const VIDEO_PLACEHOLDER = "Cole o link do YouTube ou do Google Drive";
export const VIDEO_HELP =
  "YouTube: suba como “Não listado”. Google Drive: compartilhe o arquivo como “Qualquer pessoa com o link”, senão o aluno vê “pedir acesso”.";
export const VIDEO_ERRO =
  "Link inválido. Cole a URL completa de um vídeo do YouTube ou de um arquivo do Google Drive.";
