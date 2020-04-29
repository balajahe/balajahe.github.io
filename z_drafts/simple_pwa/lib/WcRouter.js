window._router = {
   router: [],
   reset: (root) => {
      window._router.router = []
      window._router.router.push(root)
   }
}

window.onhashchange = (ev) => {
   let oldh = hash(ev.oldURL)
   if (oldh === null) oldh = ''
   const oldc = window._router.router.find(v => v[0] === oldh)
   if (oldc) {
      oldc[1].display(false)
   }

   let newh = hash(ev.newURL)
   if (newh === null) newh = ''
   let newc = window._router.router.find(v => v[0] === newh)
   if (newc) {
      newc[1].display()
   } else if (newh) {
      newc = document.createElement(newh)
      document.querySelector('main').appendChild(newc)
      window._router.router.push([newh, newc])
   }

   function hash(url) {
      const uu = url.split('#')
      return uu.length > 1 ? uu[uu.length-1] : null
   }
}
