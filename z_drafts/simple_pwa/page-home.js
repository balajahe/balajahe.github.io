import mix from './WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML += `
         <style scoped>
            ${me} > button { width: 30vw; }
         </style>

         <button w-id="start">Start</button>
      `
      mix(this)
      location.hash = ''
      window._router.reset(['', this])

      this.start.on('click', () => {
         window.location.hash = 'page-login'
      })
   }
})
