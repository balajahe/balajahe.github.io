import wcMixin from './WcMixin.js'
import './demo-page-login.js'

const me = 'demo-page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style>
            ${me} {
               height: 90%; width: 100%;
               display: flex; flex-flow: column;
               justify-content: center; align-items: center;
            }
         </style>

         <p>WC PWA Template welcomes you !</p>
      `
      wcMixin(this)

      this.appBar = [
         ['sep'],
         ['next', () => APP.route('demo-page-login')]
      ]
   }
})
