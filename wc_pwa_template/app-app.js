import wcmixin from './WcMixin.js'

const me = 'app-app'
customElements.define(me, class extends HTMLElement {
   _router = []
   _elapsed = 0

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               --app-bar-height: 2.5em;
               --margin: 0.25em;
            }
            ${me} > nav {
               height: var(--app-bar-height); width: calc(100% - var(--margin) * 2);
               margin: var(--margin);
               display: flex; flex-flow: row nowrap;
               overflow: hidden;
            }
            ${me} > main {
               height: calc(100vh - var(--app-bar-height) - var(--margin) * 2);
               width: calc(100% - var(--margin) * 2);
               margin: 0; padding: 0; padding-left: var(--margin); padding-right: var(--margin); overflow: auto;
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
            ${me} > nav button { height: 100%; min-width: 15%; line-height: 1em; }
            ${me} > nav small {
               margin-left: 0.5em; margin-right: 0.5em; flex-grow: 1; overflow: hidden;
               display: flex; justify-content: center; align-items: center;
            }
         </style>
         <nav w-id='nav'>
      		<button w-id='menuBut'>&#9776;</button>
            <button w-id='backBut' disabled>Back<br>&lArr;</button>
            <small w-id='msgEl/msg'>Not logged</small>
         </nav>
         <main w-id='main'></main>
         <app-menu w-id='menu' style='display:none'></app-menu>
      `
      wcmixin(this)
      window.APP = this

      this.menuBut.onclick = (ev) => {
         ev.stopPropagation()
         this.menu.display()
         this.onclick = () => {
            this.menu.display(false)
            this.onclick = null
         }
      }
      this.backBut.onclick = () => history.go(-1)

      this.addEventListener('set-buts', (ev) => {
         this.backBut.disabled = ev.val.back === false ? true : false
         for (let b = this.msgEl.nextSibling; b; b = b.nextSibling) b.remove()
         if (ev.val.custom) for (const b of ev.val.custom) this.nav.appendChild(b)
      })

      this.addEventListener('set-msg', (ev) => {
         this.msg = ev.val
      })

      setInterval(() => {
         this._elapsed += 1
         this.drownEvent('notify-timer', this._elapsed)
      }, 1000)
   }

   async route(hash, elem) {
      window.onhashchange = null
      location.hash = hash
      for (const el of this.main.childNodes) try { el.display(false) } catch(_) {}
      if (elem) {
         this.main.appendChild(elem)
         this._router.push({hash, elem})
      } else {
         let el = this._router.find((v) => v.hash === hash)
         if (!el) {
            elem = document.createElement(hash)
            this.main.appendChild(elem)
            this._router.push({hash, elem})
         } else {
            elem = el.elem
         }
         elem.display()
         if (elem.onRoute) elem.onRoute()
      }
      window.onhashchange = async (ev) => {
         const uu = ev.newURL.split('#')
         if (uu.length > 1) this.route(uu[uu.length-1])
         else location.href = '/'
      }
   }
})
