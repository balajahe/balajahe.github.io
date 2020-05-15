import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new2-video'
customElements.define(me, class extends HTMLElement {
   _stream = null
   _imgCapturer = null
   _vidRecorder = null
   _audRecorder = null

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} nav { display: flex; flex-flow: row nowrap; }
            ${me} nav button { flex: 1 1 auto; }
            ${me} #_vidPreview { width: calc(100% - 2 * var(--margin)); height: auto; }
            ${me} #_attsDiv { display: flex; flex-flow: row wrap; }
            ${me} #_attsDiv > img, video, audio {
               height: 3em; width: calc(20% - var(--margin));
               margin-right: var(--margin); margin-bottom: var(--margin);
            }
         </style>
         <video w-id='_vidPreview' autoplay muted></video>
         <nav>
            <button w-id='_audBut/_audRecording'>Record audio</button>
            <button w-id='_vidBut/_vidRecording'>Record video</button>
            <button w-id='_imgBut'>Take photo</button>
         </nav>
         <div w-id='_attsDiv'></div>
      `
      wcMixin(this)

      this._imgBut.onclick = async () => {
         const blob = await this._imgCapturer.takePhoto()
         const img = document.createElement("img")
         img.src = URL.createObjectURL(blob)
         this._attsDiv.appendChild(img)
      }

      this._vidBut.onclick = () => {
         this._vidBut.className = this._vidRecording
         if (this._vidRecording) this._vidRecorder.start()
         else this._vidRecorder.stop()
      }

      this._audBut.onclick = () => {
         this._audBut.className = this._audRecording
         if (this._audRecording) this._audRecorder.start()
         else this._audRecorder.stop()
      }
   }

   async onRoute() {
      const but = document.createElement('button')
      but.innerHTML = 'Next<br>&rArr;'
      but.onclick = () => APP.route('page-new3-location')
      this.bubbleEvent('set-buts', { custom: [but] })
      this.bubbleEvent('set-msg', 'Take a photo, audio or video:')

      this._stream = await navigator.mediaDevices.getUserMedia(
         { video: { facingMode: { ideal: "environment" }}, audio: true }
      )
      this._vidPreview.srcObject = this._stream

      this._imgCapturer = new ImageCapture(this._stream.getVideoTracks()[0])

      this._vidRecorder = new MediaRecorder(this._stream, { mimeType : "video/webm" })
      this._vidRecorder.ondataavailable = async (ev) => {
         const vid = document.createElement("video")
         vid.controls = true
         vid.src = URL.createObjectURL(ev.data)
         this._attsDiv.appendChild(vid)
      }

      this._audRecorder = new MediaRecorder(this._stream, { mimeType : "audio/webm" })
      this._audRecorder.ondataavailable = async (ev) => {
         const aud = document.createElement("audio")
         aud.controls = true
         aud.src = URL.createObjectURL(ev.data)
         this._attsDiv.appendChild(aud)

      }
   }

   onUnRoute() {
      this._stream.getTracks().forEach(track => track.stop())
   }
})
