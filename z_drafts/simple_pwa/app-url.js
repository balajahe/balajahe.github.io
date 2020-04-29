import mix from './WcMixin.js'

const me = 'app-url'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               display: flex; flex-flow: row nowrap;
               overflow-x: auto; overflow-y: hidden;
            }
            ${me} button#home { width: 15vw; }
            ${me} button { width: 10vw; }
         </style>

         <button w-id='home'>home</button>
         <button>step 1</button>
         <button>step 2</button>
         <button>step 3</button>
      `
      mix(this)

      this.home.on('click', () => {
         location.href = '/'
      })
   }
})
