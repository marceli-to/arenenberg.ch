const CACHE_NAME = 'arenenberg-cache-v1';
const ASSETS_TO_CACHE = [
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

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => {
//         return cache.addAll(ASSETS_TO_CACHE);
//       })
//       .then(() => {
//         return self.skipWaiting(); // Force service worker to become active right away
//       })
//   );
// });

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.allSettled(
          ASSETS_TO_CACHE.map(asset => {
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
                client.postMessage('CACHING_COMPLETE');
              });
            });
          }
          
          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              console.error(`Failed to cache ${ASSETS_TO_CACHE[index]}`);
            } else {
              console.log(`Successfully cached ${ASSETS_TO_CACHE[index]}`);
            }
          });
        });
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