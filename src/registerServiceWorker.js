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
const log = (message, error = null) => {
  if (error) {
    console.error(`[ServiceWorker] ${message}`, error);
  } else {
    console.log(`[ServiceWorker] ${message}`);
  }
};

// Cache essential assets during installation
self.addEventListener('install', (event) => {
  log('Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS)
          .then(() => log('Static assets cached successfully'))
          .catch((error) => {
            log('Failed to cache static assets', error);
            throw error;
          });
      })
      .then(() => self.skipWaiting())
  );
});

// Improved fetch handling with fallback strategy
self.addEventListener('fetch', (event) => {
  log(`Fetching: ${event.request.url}`);
  
  // Don't handle non-GET requests
  if (event.request.method !== 'GET') {
    log(`Ignoring non-GET request: ${event.request.method}`);
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // First, try the cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          log(`Serving from cache: ${event.request.url}`);
          return cachedResponse;
        }

        // If not in cache, try network
        try {
          log(`Fetching from network: ${event.request.url}`);
          const networkResponse = await fetch(event.request);
          
          if (!networkResponse || networkResponse.status !== 200) {
            log(`Network response was not valid: ${networkResponse?.status}`);
            throw new Error('Invalid network response');
          }

          // Cache the successful response
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, networkResponse.clone());
          log(`Cached new response for: ${event.request.url}`);
          
          return networkResponse;
        } catch (networkError) {
          log(`Network fetch failed for: ${event.request.url}`, networkError);
          
          // If it's a navigation request, try to return the cached index.html
          if (event.request.mode === 'navigate') {
            log('Attempting to serve cached index.html as fallback');
            const indexResponse = await caches.match('/index.html');
            if (indexResponse) {
              return indexResponse;
            }
          }
          
          // If we still have nothing, throw the original error
          throw networkError;
        }
      } catch (error) {
        log('Final error handler reached', error);
        
        // For navigation requests, make one final attempt to serve the root
        if (event.request.mode === 'navigate') {
          const rootResponse = await caches.match('/');
          if (rootResponse) {
            return rootResponse;
          }
        }
        
        // If all else fails, return a simple error response
        return new Response('Network error occurred', {
          status: 408,
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      }
    })()
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  log('Activating Service Worker...');
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              log(`Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ]).then(() => log('Service Worker activated'))
  );
});

// Handle errors that might occur during service worker operation
self.addEventListener('error', (event) => {
  log('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  log('Unhandled rejection in Service Worker:', event.reason);
});