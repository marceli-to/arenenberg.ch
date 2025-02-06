
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { clientsClaim } from 'workbox-core';

const ASSETS = [
 { url: '/', revision: null },
 { url: '/index.html', revision: null },
 { url: '/stationen/index.html', revision: null },
 { url: '/stationen/kapelle/index.html', revision: null },
 { url: '/stationen/stall-der-zukunft/index.html', revision: null },
 { url: '/stationen/gartenbaukunst/index.html', revision: null },
 { url: '/css/app.css', revision: null },
 { url: '/js/app.js', revision: null },
 { url: '/favicon.ico', revision: null }
];

clientsClaim();
precacheAndRoute(ASSETS);

// Audio files cache
registerRoute(
 ({ request }) => request.url.includes('/audio/'),
 new CacheFirst({
   cacheName: 'audio-cache',
   plugins: [
     new ExpirationPlugin({
       maxAgeSeconds: 30 * 24 * 60 * 60,
       maxEntries: 10
     })
   ]
 })
);

// HTML/CSS/JS cache
registerRoute(
 ({ request }) => 
   request.destination === 'style' ||
   request.destination === 'script' ||
   request.destination === 'document',
 new StaleWhileRevalidate({
   cacheName: 'static-resources'
 })
);

self.addEventListener('message', (event) => {
 if (event.data && event.data.type === 'SKIP_WAITING') {
   self.skipWaiting();
 }
});