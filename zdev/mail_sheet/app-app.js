import wcmixin from './WcMixin.js'

const me = 'app-app'
customElements.define(me, class extends HTMLElement {
   SRV_URL = 'http://127.0.0.1:3000'
   _router = []

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > main {
               height: calc(100vh - var(--app-bar-height)); width: 100%;
               overflow: auto;
            }
            ${me} > nav {
               height: var(--app-bar-height); width: 100%;
               display: flex; flex-flow: row nowrap;
               overflow-x: auto; overflow-y: hidden;
            }
            ${me} > main > * {
               height: 100%; width: 100%;
               display: flex; flex-direction: column;
               justify-content: center;
               align-items: center;
            }
            ${me} > nav button { min-width: 15%; line-height: 1em; }
            ${me} > nav span { flex-grow: 1; white-space: wrap; }
         </style>
         <main w-id='main'></main>
         <nav w-id='nav'>
      		<button w-id='menuBut'>&#9776;</button>
            <button w-id='homeBut' style='display:none'>Home</button>
            <span w-id='/msg'></span>
      		<button w-id='backBut' style='display:none'>Back<br>&lArr;</button>
         </nav>
      `
      wcmixin(this)
      window.APP = this

      this.menuBut.onclick = () => this.showMenu()
      this.homeBut.onclick = () => this.route('page-home')
      this.backBut.onclick = () => history.go(-1)

      this.addEventListener('set-buts', (ev) => {
         this.homeBut.display(ev.val.home)
         this.backBut.display(ev.val.back)
         for (let b = this.backBut.nextSibling; b; b = b.nextSibling) b.remove()
         if (ev.val.custom) for (const b of ev.val.custom) this.nav.appendChild(b)
      })
   }

   async route(hash, elem) {
      window.onhashchange = null
      location.hash = hash
      for (const el of this.main.childNodes) try { el.display(false) } catch(_) {}
      if (elem) {
         this.main.appendChild(elem)
         this._router.push({hash, elem})
         elem.display()
         if (elem.onRoute) elem.onRoute()
      } else {
         let el = this._router.find((v) => v.hash === hash)
         if (!el) {
            el = document.createElement(hash)
            this.main.appendChild(el)
            this._router.push({hash, elem: el})
            el.display()
            if (el.onRoute) el.onRoute()
         } else {
            el.elem.display()
            if (el.elem.onRoute) el.elem.onRoute()
         }
      }
      window.onhashchange = async (ev) => {
         console.log(ev.newURL)
         const uu = ev.newURL.split('#')
         if (uu.length > 1) this.route(uu[uu.length-1])
         else location.href = '/'
      }
   }
})
