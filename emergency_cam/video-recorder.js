import WC from '/weird_components/WeirdComponentMixin.js'

const CHUNK_DURATION = 5000

customElements.define('video-recorder', class extends HTMLElement {
   location = null
   recorder = {
      rec: null,
      interval: null,
      setInterval: () => {
         this.recorder.interval = setInterval(() => {
            this.recorder.rec.stop()
            this.recorder.rec.start()
         }, CHUNK_DURATION)
      },
      clearInterval: () => clearInterval(this.recorder.interval)
   }

   async connectedCallback() {
      this.innerHTML = `
         <p w-name='msg'>Loading camera...</p>
         <div w-name='recdiv' id='recdiv' style='display:none; flex-flow:column'>
            <video w-name='video' autoplay muted></video>
            <nav style='display:flex; flex-flow:row nowrap'>
               <button w-name='rec/recording/className' style='flex-grow:3'>Start / Stop recording</button>
               &nbsp;<button w-name='/noemail/className' style='flex-grow:1'>No email</button>
               &nbsp;<button w-name='no_chunk/nochunk/className' style='flex-grow:1'>No chunk</button>
               &nbsp;<button w-name='lock' style='flex-grow:1'>Lock</button>
            </nav>
            <button w-name='gmail' style='display:none'>Connect to Gmail</button>
            <input w-name='/email' type='email' required placeholder='Email to send...'/>
         </div>
         <div w-name='locdiv' id='locdiv' style='display:none; flex-flow:column; position:fixed; top:0; left:0; width:100vw; height:100vh'>
            <button w-name='unlock' style='width:100%; height:4%'>Unlock</button>
            <iframe src='https://ru.wikipedia.org' style='width:100%; height:96%' sandbox='allow-forms allow-scripts'></iframe>
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
         if (!this.noemail) {
            document.querySelector('video-sender').send(this.email, subj, name, ev.data)
            localStorage.setItem('email', this.email)
         } else {
            document.querySelector('video-sender').send(null, subj, name, ev.data)
         }
      }

      this.gmail.on('w-change', async (_) => {
         try {
            await document.querySelector('video-sender').connect()
            this.gmail.display(false)
         } catch(e) {
            console.error(e)
            this.gmail.display()
         }
      })
      this.gmail.click()

      this.rec.on('w-change', (_) => {
         if (this.recording) {
            this.recorder.rec.start()
            if (!this.nochunk) this.recorder.setInterval()
         } else {
            this.recorder.rec.stop()
            this.recorder.clearInterval()
         }
      })
      this.rec.click()

      this.no_chunk.on('w-change', (ev) => {
         if (this.nochunk) {
            this.recorder.clearInterval()
         } else {
            this.recorder.setInterval()
         }
      })

      this.lock.on('w-change', (ev) => this.locdiv.display('flex'))
      this.unlock.on('w-change', (ev) => this.locdiv.display(false))

      navigator.geolocation.getCurrentPosition(
         (loc) => this.location = loc.coords
      )
      navigator.geolocation.watchPosition(
         (loc) => this.location = loc.coords
      )

      this.video.onloadedmetadata = (ev) => {
         this.msg.remove()
         this.recdiv.display('flex')
      }
   }
})
