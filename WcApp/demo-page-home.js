import * as WcMixin from './WcMixin.js'

const me = 'demo-page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      WcMixin.addAdjacentHTML(this, `
         <style>
            ${me} {
               height: 90%; width: 100%;
               display: flex; flex-flow: column;
               justify-content: center; align-items: center;
               text-align: center;
            }
         </style>
         
         <p>Vanilla web components PWA template<br>welcomes you !</p>
      `)

      this.appBar = [
         ['sep'],
         ['next', async () => {
            await import('./demo-page-login.js')
            APP.route('demo-page-login')
         }]
      ]
   }
})
