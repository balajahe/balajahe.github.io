import WeirdComponent from './weird-component.js'

const CHUNK_DURATION = 7000

customElements.define('video-recorder',
   class extends WeirdComponent {
      video = null
      location = null
      recorder = {rec: null, interval: null}

      async connectedCallback() {
         this.innerHTML = `
            <p>Loading camera...</p>
            <div style="display: none; flex-direction: column;">
               <video el="video" autoplay muted></video>
               <button el="rec" vl="recording">Start / Stop recording</button>
               <button el="conn" style="display: none">Connect to Gmail</button>
               <input vl="email" type="email" required placeholder="Email to send..."/>
            </div>
            <div el="log"></div>
            <a style="display:none"></a>
            <form el="lock" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh;">
               To unlock screen enter "123":
               <input type="text"/>
            </form>
         `
         this.genGetSet()
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
            document.querySelector('video-sender').send(this.email, subj, name, ev.data.slice())
         }

         this.rec.onclick = (ev) => { 
            this.recording = !this.recording
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

         this.conn.onclick = async (ev) => {
            try {
               await document.querySelector('video-sender').connect()
               this.conn.style.dislpay = 'none'
            } catch(e) {
               console.error(e)
               this.conn.style.display = ''
            }
         }

         this.lock.onsubmit = (ev) => {
            ev.preventDefault()
            const rep = ev.target.querySelector('input')
            if (rep.value === '123') {
               rep.value = ''
               ev.target.style.display = 'none'
               this.recording = false
               this.recorder.rec.stop()
               clearInterval(this.recorder.interval)
            }
         }

         navigator.geolocation.getCurrentPosition(
            (loc) => this.location = loc.coords
         )
         navigator.geolocation.watchPosition(
            (loc) => this.location = loc.coords
         )

         this.video.onloadedmetadata = (ev) => {
            document.querySelector('#app').style.width = ev.target.videoWidth + 'px'
            this.q('p').remove()
            this.q('div').style.display = 'flex'
         }

         this.rec.click()
         this.conn.click()
      }
   }
)
