import wcMixin from '/WcMixin/WcMixin.js'

customElements.define('app-init', class extends HTMLElement {
   connectedCallback() {
      this.innerHTML = `
         <div w-id='welcome'>
            <p>
               CCTV system based on a power web application and COCO-SSD neural network. Detects people, records video, and sends it to an email.
            </p>
            <p>
               The application will request permission for the camera, microphone and google authorization (for sending emails through the current account).
            </p>
            <button w-id='do' style='width:100%'>Start</button>
            <footer>
               <a href="https://github.com/balajahe/balajahe.github.io/tree/master/cctv_nn" target="_blank">Sources on GitHub</a>
               <br><a href="/privacy-policy.html" target="_blank">Privacy policy</a>
            </footer>
         </div>
      `
      wcMixin(this)

      this.do.onclick = async (ev) => {
         this.welcome.remove()
         await navigator.serviceWorker.register('./app-sw1.js')
         document.querySelector('video-recorder').init()
         document.querySelector('video-sender').init()
      }
   }
})
