customElements.define('app-init',
   class extends HTMLElement {
      connectedCallback() {
         navigator.serviceWorker.register('/emergency_cam/app-sw.js')
      }
   }
)
