import wcmixin from './WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML += `
         <p contenteditable='true'>Simple Email Client welcomes you !</p>
         <p>Click "Start" to continue !</p>
      `
      wcmixin(this)
      location.hash = 'page-home'
      window._router.reset({hash: location.hash, elem: this})
   }

   onDisplay() {
      const ok = document.createElement('button')
      ok.innerHTML = 'Start<br>&rArr;'
      ok.onclick = () => location.hash = 'page-login'
      this.ev('set-butts', {
         home: false,
         back: false,
         custom: [ok]
      })
   }
})
