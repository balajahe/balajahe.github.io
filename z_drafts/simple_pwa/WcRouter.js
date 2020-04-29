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
   console.log(oldh)
   const oldc = _router.router.find(v => v[0] === oldh)
   if (oldc) {
      oldc[1].display(false)
   }

   let newh = hash(ev.newURL)
   if (newh === null) newh = ''
   console.log(newh)
   let newc = _router.router.find(v => v[0] === newh)
   if (newc) {
      newc[1].display()
   } else if (newh) {
      newc = document.createElement(newh)
      console.log(newc)
      document.querySelector('main').appendChild(newc)
      _router.router.push([newh, newc])
   }

   function hash(url) {
      const uu = url.split('#')
      return uu.length > 1 ? uu[uu.length-1] : null
   }
}
