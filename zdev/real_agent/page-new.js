import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new'
customElements.define(me, class extends HTMLElement {
   _location = null
   _imgCapturer = null
   _vidRecorder = null
   _audRecorder = null

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               display: flex; flex-direction: column;
               --margin: 0.2em;
            }
            ${me} > * {
               margin: var(--margin);
            }
            ${me} #textDiv {
               min-height: 2.5em; width1: 100%;
               border: solid 1px silver;
            }
            ${me} nav { display: flex; flex-flow: row nowrap; }
            ${me} nav button { flex: 1 1 auto; }
            ${me} #vidPreview { width: calc(100% - 2 * var(--margin)); }
            ${me} #atts { display: flex; flex-flow: row wrap; }
            ${me} img, video, audio{
               width: calc(20% - 0.2em);
               margin-right: var(--margin); margin-bottom: var(--margin);
            }
         </style>
         <div w-id='textDiv' contenteditable='true'></div>
         <nav>
            <button w-id='imgBut'>Take photo</button>
            <button w-id='vidBut/vidRecording/className'>Record video</button>
            <button w-id='audBut/audRecording/className'>Record audio</button>
         </nav>
         <video w-id='vidPreview' autoplay muted></video>
         <div w-id='atts'></div>
      `
      wcMixin(this)

      const stream = await navigator.mediaDevices.getUserMedia(
         {video: {facingMode: {ideal: "environment"}}, audio: true}
      )
      this.vidPreview.srcObject = stream

      navigator.geolocation.getCurrentPosition(loc => this._location = loc.coords)
      navigator.geolocation.watchPosition(loc => this._location = loc.coords)

      this._imgCapturer = new ImageCapture(stream.getVideoTracks()[0])

      this._vidRecorder = new MediaRecorder(stream, {mimeType : "video/webm"})
      this._vidRecorder.ondataavailable = async (ev) => {
         /*
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
         */
         const vid = document.createElement("video")
         vid.controls = true
         vid.src = URL.createObjectURL(ev.data)
         this.atts.appendChild(vid)
      }

      this._audRecorder = new MediaRecorder(stream, {mimeType : "audio/webm"})
      this._audRecorder.ondataavailable = async (ev) => {
         const aud = document.createElement("audio")
         aud.controls = true
         aud.src = URL.createObjectURL(ev.data)
         this.atts.appendChild(aud)

      }

      this.imgBut.onclick = async () => {
         const blob = await this._imgCapturer.takePhoto()
         const img = document.createElement("img")
         img.src = URL.createObjectURL(blob)
         this.atts.appendChild(img)
      }

      this.vidBut.onclick = async () => {
         if (this.vidRecording) this._vidRecorder.start()
         else this._vidRecorder.stop()
      }

      this.audBut.onclick = async () => {
         if (this.audRecording) this._audRecorder.start()
         else this._audRecorder.stop()
      }
   }

   async onRoute() {
      this.textDiv.focus()
      const but = document.createElement('button')
      but.innerHTML = 'Save<br>&rArr;'
      but.onclick = () => {
         this.bubbleEvent('set-msg', 'Saved !')
         APP.route('page-home')
      }
      this.bubbleEvent('set-buts', { custom: [but] })
      this.bubbleEvent('set-msg', 'Enter text description, take a photo, audio or video:')
   }
})
