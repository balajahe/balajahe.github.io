customElements.define('app-init',
   class extends HTMLElement {
      connectedCallback() {
         navigator.serviceWorker.register('./app-sw.js')
      }
   }
)
