import wcmixin from './WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML += `
         <style scoped>
            ${me} > button { width: 25vw; }
         </style>

         <!--<button w-id="start">Start</button>-->
      `
      wcmixin(this)
      location.hash = ''
      window._router.reset({hash: '', elem: this})

      //this.start.onclick = () => location.hash = 'page-login'
   }

   onDisplay() {
      dom('app-bar').setButs({
         ok: (el) => {
            el.innerHTML = 'Start<br>&rArr;'
            el.onclick = () => location.hash = 'page-login'
         },
         back: (el) => el.disabled = true,
         home: (el) => el.disabled = true
      })
   }
})
