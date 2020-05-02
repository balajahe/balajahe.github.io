import wcmixin from './WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <p contenteditable='true'>Simple Email Client welcomes you !</p>
         <p>Click "Start" to continue !!!!!!!!</p>
      `
      wcmixin(this)
   }

   onRoute() {
      const but = document.createElement('button')
      but.innerHTML = 'Start<br>&rArr;'
      but.onclick = () => APP.route('page-login')
      this.bubbleEvent('set-buts', {
         home: false,
         back: false,
         custom: [but]
      })
   }
})
