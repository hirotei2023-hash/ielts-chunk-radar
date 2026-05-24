const CACHE = "ielts-chunk-radar-v1";

const PRE_CACHE = [
  "/ielts-chunk-radar/",
  "/ielts-chunk-radar/manifest.json",
  "/ielts-chunk-radar/icon-192.png",
  "/ielts-chunk-radar/icon-512.png",
];

// 安装：预缓存核心资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 请求：缓存优先，网络回退
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response;

        const clone = response.clone();
        caches.open(CACHE).then((cache) => {
          cache.put(event.request, clone);
        });

        return response;
      });
    })
  );
});
