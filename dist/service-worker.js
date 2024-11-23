self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('arenenberg-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/audio/kapelle.mp3',
        '/audio/stall-der-zukunft.mp3',
        '/audio/praezis-smart-digital.mp3',
        '/audio/gartenbaukunst.mp3',
        '/audio/a-la-francaise.mp3'
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
