const VERSION = 'v1'
const CACHED = [
  '/cctv_mobile_pwa/',
  '/cctv_mobile_pwa/video-detector.js',
  '/cctv_mobile_pwa/alarm.mp3',
  '/cctv_mobile_pwa/install-pwa.js'
]

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(VERSION).then(
      (cache) => cache.addAll(CACHED)
    )
  )
})

self.addEventListener('fetch', (ev) => {
  ev.respondWith(
    caches.match(ev.request).then(
      (resp) => resp || fetch(ev.request).then(
        (resp1) => caches.open(VERSION).then(
          (cache) => {
            cache.put(ev.request, resp1.clone())
            return resp1
          }
        )
      )
    )
  )
})