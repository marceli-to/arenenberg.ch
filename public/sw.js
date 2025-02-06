const CACHE_NAME = 'arenenberg-v2';
const ASSETS = [
  '/',  // Add root path
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
  '/css/app.css',
  '/js/app.js',
  '/favicon.ico',
];

// Add message port variable
let messagePort = null;

// Add message event listener for port initialization
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INIT_PORT') {
    messagePort = event.ports[0];
  }
});

// Add notification function
function notifyClientsOfCachingComplete() {
  if (messagePort) {
    messagePort.postMessage({
      type: 'CACHING_COMPLETE'
    });
  }
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'CACHING_COMPLETE'
      });
    });
  });
}

// Immediately activate new service worker
self.addEventListener('activate', event => {
  // Remove old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

self.addEventListener('install', event => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache all assets with proper error handling
        return Promise.allSettled(
          ASSETS.map(asset => {
            return cache.add(asset)
              .catch(error => {
                console.error(`Failed to cache ${asset}:`, error);
                // Re-throw to mark this asset as rejected
                throw error;
              });
          })
        ).then(results => {
          // Check if all assets were cached successfully
          const allSuccessful = results.every(result => result.status === 'fulfilled');
          if (allSuccessful) {
            notifyClientsOfCachingComplete();
          }
          
          // Log results of caching attempts
          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              console.error(`Failed to cache ${ASSETS[index]}`);
            } else {
              console.log(`Successfully cached ${ASSETS[index]}`);
            }
          });
        });
      })
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached response
          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response since we need to use it twice
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('Failed to cache response:', error);
              });

            return response;
          });
      })
      .catch(() => {
        // If both cache and network fail, return a fallback response
        console.error('Both cache and network failed');
        return new Response('Network and cache both failed', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});