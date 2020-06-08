import wcMixin from './WcMixin.js'

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
         ['next', async () => {
            await import('./demo-page-login.js')
            APP.route('demo-page-login')
         }]
      ]
   }
})
