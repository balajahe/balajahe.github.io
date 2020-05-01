import wcmixin from './WcMixin.js'

const me = 'app-app'
customElements.define(me, class extends HTMLElement {
   SRV_URL = 'http://127.0.0.1:3000'

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
            ${me} > nav button { min-width: 20%; line-height: 1em; }
            ${me} > nav button.std { min-width: 15%; }
            ${me} > nav span#status { flex-grow: 1; white-space: wrap; }
         </style>
         <main>
            <page-home/>
         </main>
         <nav w-id='nav'>
      		<button w-id='menu' class='std'>&#9776;</button>
            <button w-id='home' class='std' style='display:none'>Home</button>
            <span w-id='status'></span>
      		<button w-id='back' style='display:none'>Back<br>&lArr;</button>
         </nav>
      `
      wcmixin(this)

      this.menu.onclick = () => {
         alert(2)
      }

      this.home.onclick = () => location.hash = 'page-home'

      this.back.onclick = () => history.go(-1)

      this.addEventListener('set-butts', (ev) => {
         this.home.display(ev.val.home)
         this.back.display(ev.val.back)
         for (let b = this.back.nextSibling; b; b = b.nextSibling) b.remove()
         if (ev.val.custom) for (const b of ev.val.custom) this.nav.appendChild(b)
      })
   }
})
