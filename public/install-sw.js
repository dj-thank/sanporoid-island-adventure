const CACHE_PREFIX = "shioboshi-install-";
const CACHE_NAME = `${CACHE_PREFIX}v7`;
const ROOT_URL = new URL("./", self.location.href).href;
const CORE_URLS = [
  ROOT_URL,
  new URL("./install.webmanifest", ROOT_URL).href,
  new URL("./shioboshi-icon-192.png", ROOT_URL).href,
  new URL("./shioboshi-icon-512.png", ROOT_URL).href,
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_URLS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
    .map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then((response) => {
      if (response.ok) void caches.open(CACHE_NAME).then((cache) => cache.put(ROOT_URL, response.clone()));
      return response;
    }).catch(() => caches.match(ROOT_URL)));
    return;
  }

  event.respondWith(caches.match(event.request).then(async (cached) => {
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok) void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
    return response;
  }));
});
