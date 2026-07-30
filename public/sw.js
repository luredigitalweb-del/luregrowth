/**
 * Service worker do LURE Growth.
 *
 * Só cuida das notificações push — não guarda cache de página nenhuma, pra não
 * arriscar servir versão velha do app depois de um deploy.
 */

const ICON = "/pwa-icon-192.png";
const BADGE = "/notification-badge-96.png";

self.addEventListener("install", () => {
  // Assume o controle já na primeira visita, sem esperar fechar as abas antigas.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Um listener de fetch (mesmo sem responder nada) mantém o app instalável nos
// navegadores mais antigos, que exigiam service worker com fetch.
self.addEventListener("fetch", () => {});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data && event.data.text() };
  }

  const title = payload.title || "LURE Growth";
  const options = {
    body: payload.body || "",
    icon: payload.icon || ICON,
    badge: BADGE,
    // Mesma tag = a notificação nova substitui a anterior em vez de empilhar.
    tag: payload.tag || "lure",
    renotify: true,
    requireInteraction: false,
    data: { url: payload.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || "/", self.location.origin);

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // Se o app já está aberto, navega a aba existente em vez de abrir outra.
      for (const client of clients) {
        if (new URL(client.url).origin === target.origin && "focus" in client) {
          return client.focus().then((c) => (c.navigate ? c.navigate(target.href) : c));
        }
      }
      return self.clients.openWindow(target.href);
    }),
  );
});
