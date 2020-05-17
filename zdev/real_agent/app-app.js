import wcMixin from '/WcMixin/WcMixin.js'
import './app-bar.js'
import './app-img-show.js'

const me = 'app-app'
customElements.define(me, class extends HTMLElement {
   routeHashChanging = false
   db = null
   location = null
   locationCallback = null

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               display: flex; flex-flow: column;
            }
            ${me} > app-bar {
               height: calc(var(--app-bar-height) + var(--margin1) * 2);
            }
            ${me} > main {
               height: calc(100vh - var(--app-bar-height) - var(--margin1) * 2);
               overflow: auto;
            }
            ${me} > main > * {
               display: flex; flex-flow: column;
            }
         </style>
         <app-bar w-id='appBar'></app-bar>
         <main w-id='appMain'></main>
         <app-img-show w-id='imgShowWc'></app-img-show>
      `
      wcMixin(this)
      window.APP = this

      navigator.geolocation.getCurrentPosition(loc => {
         this.location = loc.coords
         if (this.locationCallback) this.locationCallback()
      })
      navigator.geolocation.watchPosition(loc => {
         this.location = loc.coords
         if (this.locationCallback) this.locationCallback()
      })

      window.onhashchange = async (ev) => {
         if (!this.routeHashChanging) {
            const uu = ev.newURL.split('#')
            if (uu.length > 1) this.route(uu[uu.length-1])
            else location.href = '/'
         }
         this.routeHashChanging = false
      }
   }

   setMsg(v) { this.appBar.setMsg(v) }
   setBar(v) { this.appBar.setBar(v) }
   imgShow(v) {
      console.log(1)
      this.imgShowWc.show(v)
   }

   route(hash, elem) {
      for (const el of this.appMain.children) {
         try {
            el.display(false)
            if (el.onUnRoute) el.onUnRoute()
         } catch(_) {}
      }
      if (elem) {
         elem._hash = hash
         this.appMain.append(elem)
      } else {
         elem = Array.from(this.appMain.children).find(el => el._hash === hash)
         if (!elem) {
            elem = document.createElement(hash)
            elem._hash = hash
            this.appMain.append(elem)
         } else {
            elem.display()
         }
      }
      if (elem.onRoute) elem.onRoute()
      this.routeHashChanging = true
      location.hash = hash
   }

   remove(el) {
      if (el.onUnRoute) el.onUnRoute()
      el.remove()
   }
})
