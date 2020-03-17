const APP = 'emergency_cam'
const VERSION = '.v3'

self.oninstall = (ev) => ev.waitUntil(
  caches.open(APP + VERSION)
)

self.onactivate = (ev) => ev.waitUntil(
  caches.keys().then((keys) => {
    return Promise.all(
      keys.map((key) => {
        if (key.startsWith(APP) && key !== APP + VERSION) {
          return caches.delete(key)
        }
      })
    )
  })
)

self.onfetch = (ev) => ev.respondWith(
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
