const CACHE_NAME = 'arenenberg-audio-cache-v6';
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
        // Attempt to cache all static assets
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        log('Error pre-caching static assets: ' + error);
      })
      .then(() => self.skipWaiting())
  );
});

// Improved fetch handling with URL validation
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Special handling for audio files
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }
  
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

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});