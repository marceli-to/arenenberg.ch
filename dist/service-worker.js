const CACHE_NAME = 'arenenberg-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './audio/kapelle.mp3',
  './audio/stall-der-zukunft.mp3',
  './audio/praezis-smart-digital.mp3',
  './audio/gartenbaukunst.mp3',
  './audio/a-la-francaise.mp3'
];

// Debug logging helper
const log = (message, error = null) => {
  if (error) {
    console.error(`[ServiceWorker] ${message}`, error);
  } else {
    console.log(`[ServiceWorker] ${message}`);
  }
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
        log('Attempting to cache static assets...');
        // Cache assets one by one to identify problematic URLs
        return Promise.all(
          STATIC_ASSETS.map(url => {
            return cache.add(url)
              .then(() => log(`Successfully cached: ${url}`))
              .catch(error => {
                log(`Failed to cache: ${url}`, error);
                // Don't throw the error to allow other assets to be cached
                return Promise.resolve();
              });
          })
        );
      })
      .then(() => {
        log('Installation completed');
        return self.skipWaiting();
      })
      .catch(error => {
        log('Installation failed', error);
        return Promise.resolve();
      })
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
        log(`Serving from cache: ${event.request.url}`);
        return cachedResponse;
      }

      try {
        // If not in cache, try network
        const networkResponse = await fetch(event.request);
        
        // Only cache valid responses
        if (networkResponse && networkResponse.status === 200 && isValidUrl(event.request.url)) {
          const responseToCache = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, responseToCache);
          log(`Cached new response for: ${event.request.url}`);
          return networkResponse;
        }

        return networkResponse;
      } catch (error) {
        // If it's a navigation request, return index.html
        if (event.request.mode === 'navigate') {
          const indexResponse = await caches.match('./index.html');
          if (indexResponse) {
            return indexResponse;
          }
        }
        
        log(`Fetch failed for: ${event.request.url}`, error);
        throw error;
      }
    })()
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  log('Activating Service Worker...');
  event.waitUntil(
    Promise.all([
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (cacheName !== CACHE_NAME) {
                log(`Deleting old cache: ${cacheName}`);
                return caches.delete(cacheName);
              }
            })
          );
        }),
      self.clients.claim()
    ])
  );
});