import mix from './WcMixin.js'
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

   		<button w-id="menuButton">&#9776;</button>
         &nbsp;
         <app-url></app-url>
         <span></span>
   		<button w-id="backButton">Back<br>&lArr;</button>
   		<button w-id="okButton">OK<br>&rArr;</button>
      `
      mix(this)

      this.menuButton.on('click', () => {
         alert(2)
      })
   }
})
