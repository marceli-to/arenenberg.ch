const CACHE_NAME = 'arenenberg-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/station1.html',
  '/station2.html',
  '/style.css',
  '/main.js',
  '/station.js',
  '/db.js',
  '/manifest.json',
  '/station1.mp3',
  '/station2.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache all assets immediately
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        // Force service worker to become active right away
        return self.skipWaiting();
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