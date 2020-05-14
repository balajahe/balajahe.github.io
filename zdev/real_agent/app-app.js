import wcMixin from '/WcMixin/WcMixin.js'
import './app-bar.js'

const me = 'app-app'
customElements.define(me, class extends HTMLElement {
   _router = []

   connectedCallback() {
      window.APP = this

      this.innerHTML = `
         <style scoped>
            ${me} > app-bar {
               height: var(--app-bar-height);
               margin: var(--margin);
               display: flex; flex-flow: row nowrap;
               overflow: hidden;
            }
            ${me} > main {
               height: calc(100vh - var(--app-bar-height) - var(--margin) * 2);
               padding: 0; padding-left: var(--margin); padding-right: var(--margin);
               overflow: auto;
            }
            ${me} > main > * {
               display: flex; flex-direction: column;
            }
            ${me} > main > * > * {
               margin: var(--margin);
            }
         </style>
         <app-bar w-id='appBar'></app-bar>
         <main w-id='appMain'></main>
      `
      wcMixin(this)

      this.addEventListener('set-buts', (ev) => this.appBar.setButs(ev))
      this.addEventListener('set-msg', (ev) => this.appBar.setMsg(ev))
   }

   async route(hash, elem) {
      for (const el of this.appMain.childNodes) try { el.display(false) } catch(_) {}
      if (elem) {
         this.appMain.appendChild(elem)
         this._router.push({hash, elem})
      } else {
         const el = this._router.find((v) => v.hash === hash)
         if (!el) {
            elem = document.createElement(hash)
            this.appMain.appendChild(elem)
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
