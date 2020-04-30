import wcmixin from './WcMixin.js'
import './app-url.js'

const me = 'app-bar'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} { display: flex; flex-flow: row nowrap; }
            ${me} > button { min-width: 15vw; line-height: 1em; }
            ${me} > button#ok { min-width: 25vw; }
            ${me} > span { flex-grow: 10; }
         </style>

   		<button w-id='menu'>&#9776;</button>
         <button w-id='home'>Home</button>
         <!--<app-url></app-url>-->
         <span></span>
   		<button w-id='back'>Back<br>&lArr;</button>
   		<button w-id='ok'>Forward<br>&rArr;</button>
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

      this.ok.onclick = () => {
         history.go(1)
      }
   }

   setButs(buts) {
      if (buts.ok) buts.ok(this.ok)
      if (buts.back) buts.back(this.back)
   }
})
