const CACHE_NAME = 'arenenberg-v2-557ade949f94a449f7579ece686d3d57f8b908032c79d33ceb38daff8a7b0151';
const ASSETS = [
  '/index.html',
  '/stationen/index.html',
  '/stationen/kapelle/index.html',
  '/audio/a-la-francaise.mp3',
  '/audio/gartenbaukunst.mp3',
  '/audio/kapelle.mp3',
  '/audio/praezis-smart-digital.mp3',
  '/audio/stall-der-zukunft.mp3',
  '/build/assets/app-JpraZMAh.css',
  '/build/assets/app-MratX3S_.js',
  '/favicon.ico',
  '/images/logo.svg',
  '/fonts/Inter.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        ASSETS.map(asset => {
          return cache.add(asset).catch(error => {
            console.log(`Failed to cache ${asset}:`, error);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  if (!request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => cachedResponse || fetchAndCache(request))
      .catch(() => fetch(request))
  );
});

async function fetchAndCache(request) {
  const response = await fetch(request);
  
  if (response.ok && new URL(response.url).origin === location.origin) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  
  return response;
}
