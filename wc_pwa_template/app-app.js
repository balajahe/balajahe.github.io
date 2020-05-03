import wcmixin from './WcMixin.js'

const me = 'app-app'
customElements.define(me, class extends HTMLElement {
   _router = []

   connectedCallback() {
      this.innerHTML = `
         <style>
            :root { --app-bar-height: 3em; }
         </style>
         <style scoped>
            ${me} > nav {
               height: var(--app-bar-height); width: 100%;
               display: flex; flex-flow: row nowrap;
               overflow-x: auto; overflow-y: hidden;
            }
            ${me} > main {
               height: calc(100vh - var(--app-bar-height)); width: 100%;
               overflow: auto;
            }
            ${me} button {
               height: var(--app-bar-height);
               border-radius: calc(var(--app-bar-height)/2)/calc(var(--app-bar-height));
            }
            ${me} input {
               height: calc(var(--app-bar-height) * 0.7);
               border-radius: calc(var(--app-bar-height)/2)/calc(var(--app-bar-height));
               padding-left: 1em;
            }
            ${me} > nav button { min-width: 17%; line-height: 1em; }
            ${me} > nav small { margin: 0.5em; flex-grow: 1; display: flex; justify-content: center; align-items: center; }
         </style>
         <nav w-id='nav'>
      		<button w-id='menuBut'>&#9776;</button>
            <button w-id='homeBut' style='display:none'>Home</button>
            <small w-id='/msg'>Not logged</small>
      		<button w-id='backBut' style='display:none'>Back</button>
         </nav>
         <main w-id='main'></main>
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

      this.addEventListener('set-msg', (ev) => {
         this.msg = ev.val
      })
   }

   showMenu() {
      alert('showMenu() is not implemented !')
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
         const uu = ev.newURL.split('#')
         if (uu.length > 1) this.route(uu[uu.length-1])
         else location.href = '/'
      }
   }
})
