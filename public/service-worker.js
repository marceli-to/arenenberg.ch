self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('arenenberg-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/src/main.js',
        // Add other assets and routes you want to cache
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
