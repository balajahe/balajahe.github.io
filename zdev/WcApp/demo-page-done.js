import wcMixin from './WcMixin.js'

const me = 'demo-page-done'
customElements.define(me, class extends HTMLElement {

   build(text) {
      this.innerHTML = `
         <style>
            ${me} {
               height: 90%; width: 100%;
               display: flex; flex-flow: column;
               justify-content: center; align-items: center;
            }
         </style>
         
         <p>${text}</p>
      `
      wcMixin(this)

      this.appBar = [
         ['sep'],
         ['ok', history.go(-1)]
      ]
   }
})
