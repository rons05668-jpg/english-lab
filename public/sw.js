/* Cache the app shell and previously requested assets for later offline reading. */
const CACHE = 'english-lab-offline-v1';
const scope = self.registration.scope;
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch(scope, { cache: 'reload' });
    if (!response.ok) throw new Error('Unable to cache the app shell');
    const html = await response.clone().text();
    await cache.put(scope, response);
    const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)]
      .map((match) => new URL(match[1], scope).href)
      .filter((url) => url.startsWith(scope));
    await Promise.all(assets.map(async (url) => {
      const asset = await fetch(url);
      if (asset.ok) await cache.put(url, asset);
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(scope, response.clone());
        return response;
      } catch {
        return (await cache.match(scope)) || Response.error();
      }
    })());
    return;
  }
  if (!new URL(request.url).pathname.includes('/assets/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  })());
});
