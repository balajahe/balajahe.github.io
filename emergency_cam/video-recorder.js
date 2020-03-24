import WC from '../weird_components/WeirdComponentMixin.js'

const CHUNK_DURATION = 5000

customElements.define('video-recorder', class extends HTMLElement {
   location = null
   recorder = {rec: null, interval: null}

   async connectedCallback() {
      this.innerHTML = `
         <p w-name='msg'>Loading camera...</p>
         <div w-name='div' style='display: none; flex-direction: column'>
            <video w-name='video' autoplay muted></video>
            <button w-name='rec/recording'>Start / Stop recording</button>
            <button w-name='gmail' style='display: none'>Connect to Gmail</button>
            <input w-name='/email' type='email' required placeholder='Email to send...'/>
         </div>
      `
      WC.bind(this)
      this.email = localStorage.getItem('email')

      const stream = await navigator.mediaDevices.getUserMedia(
         {video: {facingMode: {ideal: "environment"}}, audio: true}
      )
      this.video.srcObject = stream

      this.recorder.rec = new MediaRecorder(stream, {mimeType : "video/webm"})
      this.recorder.rec.ondataavailable = async (ev) => {
         const date = new Date().toISOString().replace(/:/g, '.').replace(/T/g, ', ').slice(0, -5)
         const subj = this.location?.latitude + ', ' + this.location?.longitude
         let name = '__' + date + ', ' + subj + '.webm'
         console.log(name)
         document.querySelector('video-sender').send(this.email, subj, name, ev.data)
         localStorage.setItem('email', this.email)
      }

      this.gmail.on('w-change', async (_) => {
         try {
            await document.querySelector('video-sender').connect()
            this.gmail.show(false)
         } catch(e) {
            console.error(e)
            this.gmail.show()
         }
      })
      this.gmail.click()

      this.rec.on('w-change', (_) => {
         this.rec.className = this.recording
         if (this.recording) {
            this.recorder.rec.start()
            this.recorder.interval = setInterval(() => {
               this.recorder.rec.stop()
               this.recorder.rec.start()
            }, CHUNK_DURATION)
         } else {
            this.recorder.rec.stop()
            clearInterval(this.recorder.interval)
         }
      })
      this.rec.click()

      navigator.geolocation.getCurrentPosition(
         (loc) => this.location = loc.coords
      )
      navigator.geolocation.watchPosition(
         (loc) => this.location = loc.coords
      )

      this.video.onloadedmetadata = (ev) => {
         document.querySelector('#app').style.width = ev.target.videoWidth + 'px'
         this.msg.remove()
         this.div.show('flex')
      }
   }
})
