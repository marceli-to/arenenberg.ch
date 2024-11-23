const CACHE_NAME = 'arenenberg-cache-v1';
const STATIC_ASSETS = [
  '/',  // Root path without /dist
  '/index.html',
  '/manifest.json',
  '/audio/kapelle.mp3',
  '/audio/stall-der-zukunft.mp3',
  '/audio/praezis-smart-digital.mp3',
  '/audio/gartenbaukunst.mp3',
  '/audio/a-la-francaise.mp3'
];

// Helper function to normalize URLs
const normalizeUrl = (url) => {
  const urlObj = new URL(url, self.location.origin);
  // Remove /dist from the path if present
  return urlObj.pathname.replace(/^\/dist\//, '/');
};

// Cache essential assets during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate new service worker immediately
  );
});

// Improved fetch handling with better error management
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const normalizedUrl = normalizeUrl(event.request.url);
      const cacheKey = new Request(normalizedUrl, {
        mode: event.request.mode,
        credentials: event.request.credentials,
        headers: event.request.headers
      });

      // Try to get from cache first
      try {
        const cachedResponse = await caches.match(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, try network
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(cacheKey, networkResponse.clone());
          return networkResponse;
        }

        // If network fails and it's a navigation request, return cached index
        if (event.request.mode === 'navigate') {
          const indexResponse = await caches.match('/index.html');
          if (indexResponse) {
            return indexResponse;
          }
        }

        return networkResponse;
      } catch (error) {
        // If everything fails and it's a navigation request, return cached index
        if (event.request.mode === 'navigate') {
          const indexResponse = await caches.match('/index.html');
          if (indexResponse) {
            return indexResponse;
          }
        }
        throw error;
      }
    })()
  );
});

// Clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients after activation
      self.clients.claim()
    ])
  );
});