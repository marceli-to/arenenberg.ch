import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.VUE_APP_BASE_URL}service-worker.js`, {
    ready() {
      console.log('[Service Worker] App is being served from cache by a service worker.')
    },
    registered(registration) {
      console.log('[Service Worker] Service worker has been registered.')
    },
    cached(registration) {
      console.log('[Service Worker] Content has been cached for offline use.')
    },
    updatefound(registration) {
      console.log('[Service Worker] New content is downloading.')
    },
    updated(registration) {
      console.log('[Service Worker] New content is available; please refresh.')
    },
    offline() {
      console.log('[Service Worker] No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('[Service Worker] Error during service worker registration:', error)
    }
  })
}