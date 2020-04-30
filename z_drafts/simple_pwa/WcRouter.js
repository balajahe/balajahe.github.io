window._router = {
   router: [],
   reset: (root) => {
      window._router.router = []
      window._router.router.push(root)
      if (root.elem.onDisplay) root.elem.onDisplay()
   }
}

window.onhashchange = (ev) => {
   let oldh = hash(ev.oldURL)
   if (oldh === null) oldh = ''
   const oldc = window._router.router.find(v => v.hash === oldh)
   if (oldc) {
      oldc.elem.display(false)
   }

   let newh = hash(ev.newURL)
   if (newh === null) newh = ''
   let newc = window._router.router.find(v => v.hash === newh)
   if (newc) {
      newc.elem.display()
      if (newc.elem.onDisplay) newc.elem.onDisplay()
   } else if (newh) {
      newc = document.createElement(newh)
      window._router.router.push({hash: newh, elem: newc})
      document.querySelector('main').appendChild(newc)
      if (newc.onDisplay) newc.onDisplay()
   }

   function hash(url) {
      const uu = url.split('#')
      return uu.length > 1 ? uu[uu.length-1] : null
   }
}

window.dom = (sel) => document.querySelector(sel)
