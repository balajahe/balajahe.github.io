const APP = 'cctv_nn'
const VERSION = '.v1'

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
  (async () => {
    try {
      const resp = await fetch(ev.request)
      if (resp) {
        (await caches.open(APP + VERSION)).put(ev.request, resp.clone())
        return resp
      } else {
        return caches.match(ev.request)
      }
    } catch(e) {
      return caches.match(ev.request)
    }
  })()
)
