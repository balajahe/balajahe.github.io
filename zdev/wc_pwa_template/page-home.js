import wcMixin from '/WcMixin/WcMixin.js'

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
      wcMixin(this)
   }

   onRoute() {
      const but = document.createElement('button')
      but.innerHTML = 'Start<br>&rArr;'
      but.onclick = () => APP.route('page-login')
      this.bubbleEvent('set-buts', { back: false, custom: [but] })
   }
})
