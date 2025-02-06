const CACHE_NAME = 'arenenberg-v1';
const ASSETS = [
  '/index.html',
  '/stationen/index.html',
  '/stationen/kapelle/index.html',
  '/audio/*.mp3',
  '/css/*.css',
  '/js/*.js',
  '/images/*.{png,jpg,svg}'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => cachedResponse || fetch(event.request))
  );
});
