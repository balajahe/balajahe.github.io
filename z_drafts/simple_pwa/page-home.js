import mix from './WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML += `
         <style scoped>
            ${me} > button { width: 30vw; }
         </style>

         <button w-id="sign">sign in</button>
         &nbsp;
         <button>sign up</button>
      `
      mix(this)
      location.hash = 'page-home'

      this.sign.on('click', () => {
         window.location.hash = 'page-login'
      })
   }
})
