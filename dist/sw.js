const CACHE_NAME = 'arenenberg-v1';
const ASSETS = [
  '/index.html',
  '/stationen/index.html',
  '/stationen/kapelle/index.html',
  '/audio/a-la-francaise.mp3',
  '/audio/gartenbaukunst.mp3',
  '/audio/kapelle.mp3',
  '/audio/praezis-smart-digital.mp3',
  '/audio/stall-der-zukunft.mp3',
  '/css/app.css',
  '/js/app.js',
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
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
  );
});
