import wcmixin from './WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style>
            ${me} {
               height: 90%; width: 100%;
               display: flex; flex-direction: column;
               justify-content: center; align-items: center;
            }
         </style>
         <p>WC PWA Template welcomes you !</p>
      `
      wcmixin(this)
   }

   onRoute() {
      const but = document.createElement('button')
      but.innerHTML = 'Start'
      but.onclick = () => APP.route('page-login')
      this.bubbleEvent('set-buts', {
         home: false,
         back: false,
         custom: [but]
      })
   }
})
