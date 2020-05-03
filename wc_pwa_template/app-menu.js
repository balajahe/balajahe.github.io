import wcmixin from './WcMixin.js'

const me = 'app-menu'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style>
            ${me} {
               position: fixed; top: var(--margin); left: var(--margin);
               width: 60vw; height: 80vh; padding: 0.5em;
               background-color: LightGrey; border-right: solid 2px grey; border-bottom: solid 2px grey;
            }
            ${me} button {width: 100%; margin-bottom: 0.5em;}
         </style>
         <button w-id='home'>Home</button>
         <button w-id='item1'>Item 1</button>
         <button w-id='item2'>Item 2</button>
         <button w-id='item3'>Item 3</button>
      `
      wcmixin(this)

      this.home.onclick = () => APP.route('page-home')
   }
})
