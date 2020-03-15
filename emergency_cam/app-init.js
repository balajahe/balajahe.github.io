import './video-recorder.js'
import './video-sender.js'

customElements.define('app-init',
   class extends HTMLElement {
      connectedCallback() {
         this.innerHTML = `
            <div id="app">
               <video-recorder></video-recorder>
               <video-sender></video-sender>
            </div>
         `
         navigator.serviceWorker.register('/emergency_cam/app-sw.js')
      }
   }
)
