import * as WcMixin from './WcMixin.js'

const me = 'demo-page-work'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      WcMixin.addAdjacentHTML(this, `
         <style scoped>
            ${me} {
               padding-left: 0.5rem; padding-right: 0.5rem;
            }
            ${me} #textDiv { 
               min-height: 5rem;
               border: 1px solid silver; 
            }
         </style>

         <p w-id='/msg'>Enter text:</p>
         <p w-id='textDiv/text' contenteditable='true'>
            WEB-REACTIVITY<br>IS OPTIONAL !
         </p>
      `)

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

   onRoute() {
      this.textDiv.focus()
      document.execCommand('selectAll', false, null)
   }
})
