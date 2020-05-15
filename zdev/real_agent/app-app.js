import wcMixin from '/WcMixin/WcMixin.js'
import './app-bar.js'

const me = 'app-app'
customElements.define(me, class extends HTMLElement {
   _router = []
   location = null

   connectedCallback() {
      window.APP = this

      this.innerHTML = `
         <style scoped>
            ${me} > app-bar {
               height: var(--app-bar-height);
               margin-bottom: calc(2 * var(--margin));
            }
            ${me} > main {
               height: calc(100vh - var(--app-bar-height) - var(--margin) * 2);
               padding: 0; padding-left: var(--margin); padding-right: var(--margin);
               overflow: auto;
            }
            ${me} > main > * { display: flex; flex-direction: column; }
            ${me} > main > * > * { margin: calc(2 * var(--margin)); }
         </style>
         <app-bar w-id='_appBar'></app-bar>
         <main w-id='_appMain'></main>
      `
      wcMixin(this)

      this.addEventListener('set-buts', (ev) => this._appBar.setButs(ev))
      this.addEventListener('set-msg', (ev) => this._appBar.setMsg(ev))

      navigator.geolocation.getCurrentPosition(loc => this._location = loc.coords)
      navigator.geolocation.watchPosition(loc => this._location = loc.coords)
   }

   async route(hash, elem) {
      for (const el of this._appMain.childNodes) {
         try {
            el.display(false)
            if (el.onUnRoute) el.onUnRoute()
         } catch(_) {}
      }
      if (elem) {
         this._appMain.appendChild(elem)
         this._router.push({hash, elem})
      } else {
         const el = this._router.find((v) => v.hash === hash)
         if (!el) {
            elem = document.createElement(hash)
            this._appMain.appendChild(elem)
            this._router.push({hash, elem})
         } else {
            elem = el.elem
            elem.display()
         }
      }
      if (elem.onRoute) elem.onRoute()
      window.onhashchange = null
      location.hash = hash
      window.onhashchange = async (ev) => {
         const uu = ev.newURL.split('#')
         if (uu.length > 1) this.route(uu[uu.length-1])
         else location.href = '/'
      }
   }
})
