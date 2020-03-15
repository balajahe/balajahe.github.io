const CHUNK_DURATION = 5000

customElements.define('video-recorder',
   class extends HTMLElement {
      video = null
      button = null
      recorder = {rec: null, interval: null}
      location = null

      get recording() { return this.button.className === 'true' }

      async connectedCallback() {
         this.innerHTML = `
            <p>Loading camera...</p>
            <div style="display: none">
               <video autoplay muted></video>
               <nav>
                  <button style="width:100%">Start / Stop recording</button>
               </nav>
            </div>
         `
         this.video = this.querySelector('video')
         this.button = this.querySelector('button')

         const stream = await navigator.mediaDevices.getUserMedia(
            {video: {facingMode: {ideal: "environment"}}, audio: true}
         )
         this.video.srcObject = stream

         this.recorder.rec = new MediaRecorder(stream, {mimeType : "video/webm"})
         this.recorder.rec.ondataavailable = async (ev) => {
            const date = new Date().toISOString().replace(/:/g, '.').replace(/T/g, ', ').slice(0, -5)
            const subj = this.location?.latitude + ', ' + this.location?.longitude
            let name = '__' + date + ', ' + subj + '.webm'
            document.querySelector('video-sender').send(subj, name, ev.data.slice())
         }

         this.button.onclick = (ev) => { 
            ev.target.className = !(ev.target.className === 'true')
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
         }
         this.button.click()

         navigator.geolocation.getCurrentPosition(
            (loc) => this.location = loc.coords
         )
         navigator.geolocation.watchPosition(
            (loc) => this.location = loc.coords
         )

         await new Promise((resolve, reject) => {
            this.video.onloadedmetadata = (_) => resolve()
         })
         document.querySelector('#app').style.width = this.video.videoWidth + 'px'
         this.querySelector('p').remove()
         this.querySelector('div').style.display = ''
      }
   }
)
