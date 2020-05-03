import wcmixin from './WcMixin.js'

const me = 'app-menu'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style>
            ${me} {
               position: fixed; top: var(--margin); left: var(--margin);
               width: 60vw; height: 80vh; padding: 0.5em;
               background-color: LightGrey;
            }
            ${me} button {width: 100%; margin-bottom: 0.5em;}
         </style>
         <button w-id='item1'>Item 1</button>
         <button w-id='item2'>Item 2</button>
         <button w-id='item3'>Item 1</button>
      `
      wcmixin(this)
   }
})
