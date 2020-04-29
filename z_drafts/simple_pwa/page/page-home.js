import wcmixin from '../lib/WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML += `
         <style scoped>
            ${me} > button { width: 30vw; }
         </style>
         
         <button w-id="start">Start</button>
      `
      wcmixin(this)
      location.hash = ''
      window._router.reset(['', this])

      this.start.onclick = () => {
         location.hash = 'page-login'
      }
   }
})
