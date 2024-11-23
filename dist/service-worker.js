const CACHE_NAME = 'arenenberg-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/audio/kapelle.mp3',
  '/audio/stall-der-zukunft.mp3',
  '/audio/praezis-smart-digital.mp3',
  '/audio/gartenbaukunst.mp3',
  '/audio/a-la-francaise.mp3'
];

// Debug logging helper
const log = (message) => {
  console.log(`[ServiceWorker] ${message}`);
};

// Cache essential assets during installation
self.addEventListener('install', (event) => {
  log('Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Improved fetch handling without Request reconstruction
self.addEventListener('fetch', (event) => {
  // Don't handle non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      // First try the cache
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        // If not in cache, try network
        const networkResponse = await fetch(event.request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }

        return networkResponse;
      } catch (error) {
        // If it's a navigation request, return index.html
        if (event.request.mode === 'navigate') {
          const indexResponse = await caches.match('/index.html');
          if (indexResponse) {
            return indexResponse;
          }
        }
        
        // If we can't handle the request, throw the error
        throw error;
      }
    })()
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});