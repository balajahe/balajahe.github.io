window.wcrouter = {
   all: [],
   route: (hash, elem) => {
      for (const el of document.querySelector('main').childNodes) el.display(false)
      if (elem) {
         document.querySelector('main').appendChild(elem)
         if (elem.onDisplay) elem.onDisplay()
         this.all.push({hash, elem})
      } else {
         const el = this.all.find(v => v.hash === hash)
         if (el) {
            el.display()
            if (el.onDisplay) el.onDisplay()
         }
      }
   }
}

window.onhashchange = (ev) => {
   console.log(wcrouter.all
/*
   let oldh = hash(ev.oldURL)
   console.log(oldh)
   const oldc = wcrouter.all.find(v => v.hash === oldh)
   if (oldc) {
      oldc.elem.display(false)
   }
*/
   let newh = hash(ev.newURL)
   console.log(newh)
   if (newh) {
      let newel = wcrouter.all.find(v => v.hash === newh)
      if (newel) {
         newel.elem.display()
         if (newel.elem.onDisplay) newel.elem.onDisplay()
      } else if (newh) {
         newc = document.createElement(newh)
         window._router.router.push({hash: newh, elem: newc})
         document.querySelector('main').appendChild(newc)
         if (newc.onDisplay) newc.onDisplay()
      }
   }

   function hash(hash) {
      const uu = hash.split('#')
      return uu.length > 1 ? uu[uu.length-1] : null
   }
}

window.dom = (sel) => document.querySelector(sel)
