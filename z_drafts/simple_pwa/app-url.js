import wcmixin from './WcMixin.js'

const me = 'app-url'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               display: flex; flex-flow: row nowrap;
               overflow-x: auto; overflow-y: hidden;
            }
            ${me} button { width: 10vw; }
         </style>

         <button>step 1</button>
         <button>step 2</button>
         <button>step 3</button>
      `
      wcmixin(this)
   }
})
