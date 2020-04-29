import wcmixin from '../lib/WcMixin.js'
import './app-url.js'

const me = 'app-bar'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} { display: flex; flex-flow: row nowrap; }
            ${me} > button { height: var(--app-bar-height); width: 15vw; }
            ${me} > span { flex-grow: 3; }
         </style>

   		<button w-id='menu'>&#9776;</button>
         <button w-id='home'>home</button>
         <!--<app-url></app-url>-->
         <span></span>
   		<button w-id='back'>Back<br>&lArr;</button>
   		<button w-id='ok'>OK<br>&rArr;</button>
      `
      wcmixin(this)

      this.menu.onclick = () => {
         alert(2)
      }

      this.home.onclick = () => {
         location.hash = ''
      }

      this.back.onclick = () => {
         history.go(-1)
      }
   }
})
