const CACHE_NAME = 'arenenberg-cache';
const ASSETS = [
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
  '/css/app.css',
  '/js/app.js',
  '/favicon.ico',
];

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('install', event => {
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.allSettled(
          ASSETS.map(asset => {
            return cache.add(asset)
              .catch(error => {
                console.error(`Failed to cache ${asset}:`, error);
                throw error;
              });
          })
        ).then(results => {
          const allSuccessful = results.every(result => result.status === 'fulfilled');
          if (allSuccessful) {
            console.log('all done now really. pinky promise!');
            // Broadcast success message to all clients
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                console.log('Posting message to client:', client);
                client.postMessage('CACHING_COMPLETE');
              });
            });
          }
          
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
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  
  if (url.origin !== self.location.origin) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

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
        console.error('Both cache and network failed');
        return new Response('Network and cache both failed', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

self.addEventListener('message', (event) => {
  console.log('SW received:', event.data);
  if (event.source) {
    event.source.postMessage('Response from SW');
    console.log('SW sent response');
  }
});