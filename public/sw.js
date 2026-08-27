const CACHE_NAME = "island-adventure-v2";
const APP_SHELL = [
  "/adventure",
  "/discover",
  "/discover/kozushima",
  "/discover/niijima",
  "/discover/shikinejima",
  "/sanporoid/avatar_idle_e_01.webp",
  "/sanporoid/avatar_treasure_01.webp",
  "/sanporoid/arrival_ring.webp",
  "/sanporoid/avatar_shadow_map_mode_tiny.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(event.request)) ?? (await caches.match("/adventure"))),
    );
    return;
  }

  const isRuntimeAsset = url.pathname.startsWith("/cesiumStatic/")
    || url.pathname.startsWith("/_next/static/")
    || url.pathname.startsWith("/sanporoid/");
  event.respondWith(caches.match(event.request).then(async (cached) => {
    if (cached) return cached;
    const response = await fetch(event.request);
    if (isRuntimeAsset && response.ok) {
      const copy = response.clone();
      void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
    }
    return response;
  }));
});
