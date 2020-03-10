const VERSION = 'cctv_mobile_pwa.v6'
const CACHED = [
  '/cctv_mobile_pwa/',
  '/cctv_mobile_pwa/app-init.js',
  '/cctv_mobile_pwa/video-detector.js',
  '/cctv_mobile_pwa/video-recorder.js',
  '/cctv_mobile_pwa/video-sender.js',
  '/cctv_mobile_pwa/alarm.mp3',
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js',
  'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd'
]

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(VERSION).then(
      (cache) => cache.addAll(CACHED)
    )
  )
})

self.addEventListener('activate', (event) => {
  var cacheKeeplist = [VERSION]
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }))
    })
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