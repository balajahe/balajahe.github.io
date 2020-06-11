import * as WcMixin from './WcMixin.js'

const me = 'demo-page-done'
customElements.define(me, class extends HTMLElement {

   build(text) {
      WcMixin.addAdjacentHTML(this, `
         <style>
            ${me} {
               height: 90%; width: 100%;
               display: flex; flex-flow: column;
               justify-content: center; align-items: center;
            }
            ${me} > div {
               display: flex; flex-flow: column;
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
