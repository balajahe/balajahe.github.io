import wcmixin from './WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML += `
         <p contenteditable='true'>Simple Email Client welcomes you !</p>
         <p>Click "Start" to continue !</p>
      `
      wcmixin(this)

      window._router.reset({hash: location.hash, elem: this})
   }

   onDisplay() {
      this.ev('set-buttons', {
         home: false,
         back: false,
         ok: {
            text: 'Start',
            onclick: () => location.hash = 'page-login'
         }
      })
   }
})
