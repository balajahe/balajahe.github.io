import wcmixin from './WcMixin.js'

const me = 'page-mail-sheet'
customElements.define(me, class extends HTMLElement {
   mails = []

   connectedCallback() {
      this.innerHTML = `
         <span>Enter text:</span>
         <p w-id='text' contenteditable='true'></p>
      `
      wcmixin(this)
   }

   async onRoute() {
      this.text.focus()
      this.bubbleEvent('set-buts', {})
   }
})
