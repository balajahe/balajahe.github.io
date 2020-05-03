import wcmixin from './WcMixin.js'

const me = 'page-work'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <p w-id='/msg'>Enter text:</p>
         <p w-id='text' contenteditable='true'>...</p>
      `
      wcmixin(this)

      this.addEventListener('notify-timer', (ev) => {
         this.msg = `Enter text (elapsed ${ev.val}s):`
      })
   }

   async onRoute() {
      this.text.focus()
      const but = document.createElement('button')
      but.innerHTML = 'Done'
      but.onclick = () => alert('Done !')
      this.bubbleEvent('set-buts', { custom: [but] })
   }
})
