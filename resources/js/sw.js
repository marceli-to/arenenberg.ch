const CACHE_NAME = 'arenenberg-cache-v1';
const ASSETS_TO_CACHE = [
  // '/',
  // '/index.html',
  // '/station1.html',
  // '/station2.html',
  // '/style.css',
  // '/main.js',
  // '/station.js',
  // '/db.js',
  // '/manifest.json',
  // '/station1.mp3',
  // '/station2.mp3'

  '/',
  '/index.html',
  '/stationen/index.html',
  '/stationen/kapelle/index.html',
  '/stationen/stall-der-zukunft/index.html',
  '/stationen/gartenbaukunst/index.html',
  '/audio/a-la-francaise.mp3',
  '/audio/gartenbaukunst.mp3',
  '/audio/kapelle.mp3',
  '/audio/praezis-smart-digital.mp3',
  '/audio/stall-der-zukunft.mp3',
  '/assets/css/app.css',
  '/assets/js/main.js',
  '/assets/js/db.js',
  '/assets/js/station.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        return self.skipWaiting(); // Force service worker to become active right away
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});