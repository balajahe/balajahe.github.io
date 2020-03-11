const VERSION = 'cctv_mobile_pwa.v11'

self.oninstall = (ev) => ev.waitUntil(
  caches.open(VERSION)
)

self.onactivate = (ev) => ev.waitUntil(
  caches.keys().then((keys) => {
    return Promise.all(
      keys.map((key) => {
        if ([VERSION].indexOf(key) === -1) {
          return caches.delete(key);
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
        (await caches.open(VERSION)).put(ev.request, resp.clone())
        return resp
      } else {
        return caches.match(ev.request)
      }
    } catch(e) {
      return caches.match(ev.request)
    }
  })()
)
