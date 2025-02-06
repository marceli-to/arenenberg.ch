const CACHE_NAME = 'arenenberg-cache-v1';
const STATIC_ASSETS = [
  '/stations/',
  '/stations/index.html',
  '/stations/manifest.json',
  '/stations/audio/kapelle.mp3',
  '/stations/audio/stall-der-zukunft.mp3',
  '/stations/audio/praezis-smart-digital.mp3',
  '/stations/audio/gartenbaukunst.mp3',
  '/stations/audio/a-la-francaise.mp3'
];

// Debug logging helper
const log = (message) => {
  console.log(`[ServiceWorker] ${message}`);
};

// Check if URL is valid for caching
const isValidUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (e) {
    return false;
  }
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

// Improved fetch handling with URL validation
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
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
        
        // Only cache valid responses
        if (networkResponse && networkResponse.status === 200 && isValidUrl(event.request.url)) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }

        return networkResponse;
      } catch (error) {
        // If it's a navigation request, return index.html
        if (event.request.mode === 'navigate') {
          const indexResponse = await caches.match('/stations/index.html');
          if (indexResponse) {
            return indexResponse;
          }
        }
        
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