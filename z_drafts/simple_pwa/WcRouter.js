window._components = []

window.onhashchange = (ev) => {
   const oldh = hash(ev.oldURL)
   console.log(oldh)
   if (oldh) {
      const oldc = _components.find(v => v.h === oldh)
      if (oldc) {
         oldc.c.display(false)
      }
   }
   const newh = hash(ev.newURL)
   console.log(newh)
   if (newh) {
      let newc = _components.find(v => v.h === newh)
      if (newc) {
         newc.disply()
      } else {
         newc = document.createElement(newh)
         console.log(newc)
         document.querySelector('main').appendChild(newc)
         _components.push({h: newh, c: newc})
      }
   }

   function hash(url) {
      const uu = url.split('#')
      return uu.length > 1 ? uu[uu.length-1] : null
   }
}
