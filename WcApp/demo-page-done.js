import * as WcMixin from './WcMixin.js'

const me = 'demo-page-done'
customElements.define(me, class extends HTMLElement {

   build(text) {
      WcMixin.addAdjacentHTML(this, `
         <style>
            ${me} {
               width: 100%;
               display: flex;
               justify-content: center;
            }
            ${me} > div {
               display: flex; flex-flow: column;
               margin-top: 1rem;
               padding: 1rem;
               border: solid silver 1px;
            }
         </style>
         
         <div>${text}</div>
      `)

      this.appBar = [
         ['sep'],
         ['back']
      ]
      
      return this
   }
})
