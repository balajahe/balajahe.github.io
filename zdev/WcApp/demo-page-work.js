import wcMixin from './WcMixin.js'

const me = 'demo-page-work'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} #textDiv { 
               min-height: 5em;
               border: 1px solid silver; 
            }
         </style>

         <p w-id='/msg'>Enter text:</p>
         <p w-id='textDiv/text' contenteditable='true'>1)<br>2)<br>3)</p>
      `
      wcMixin(this)

      this.appBar = [
         ['sep'],
         ['back'],
         ['but', 'Done<br>&rArr;', async () => {
            await import('./demo-page-done.js')
            APP.routeModal('demo-page-done', document.createElement('demo-page-done').build(this.text))
         }]
      ]

      this.addEventListener('notify-timer', (ev) => {
         this.msg = `Enter text (elapsed ${ev.val}s):`
      })
   }

   async onRoute() {
      this.textDiv.focus()
      document.execCommand('selectAll',false,null)
   }
})
