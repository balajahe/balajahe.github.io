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
               overflow: hidden;
            }
            ${me} > main > * {
               height: 100%; width: 100%;
               display: flex; flex-direction: column;
               justify-content: center;
               align-items: center;
            }
            ${me} > nav > button { min-width: 15vw; line-height: 1em; }
            ${me} > nav > button#ok { min-width: 25vw; }
            ${me} > nav > span { flex-grow: 10; }
         </style>
         <main>
         </main>
         <nav>
      		<button w-id='menu'>&#9776;</button>
            <button w-id='home' style='display:none'>Home</button>
            <span></span>
      		<button w-id='back' style='display:none'>Back<br>&lArr;</button>
      		<button w-id='ok' style='display:none'>Forward<br>&rArr;</button>
         </nav>
      `
      wcmixin(this)
      location.hash = 'page-home'

      this.menu.onclick = () => {
         alert(2)
      }

      this.home.onclick = () => location.hash = 'page-home'

      this.back.onclick = () => history.go(-1)

      this.ok.onclick = () => history.go(1)

      this.addEventListener('set-buttons', (ev) => {
         if (ev.val.home === false) this.home.display(false); else this.home.display()
         if (ev.val.back === false) this.back.display(false); else this.back.display()
         if (ev.val.ok) {
            this.ok.innerHTML = ev.val.ok.text + '<br>&rArr;'
            this.ok.onclick = ev.val.ok.onclick
            document.onkeypress = (ev1) => { if (ev1.key === 'Enter' && ev1.ctrlKey) ev.val.ok.onclick() }
            this.ok.display()
         } else {
            document.onkeypress = null
            this.ok.display(false)
         }
      })
   }
})
