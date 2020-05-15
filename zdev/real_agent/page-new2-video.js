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
            ${me} #vidPreview { width: calc(100% - 2 * var(--margin)); height: auto; }
            ${me} #atts { display: flex; flex-flow: row wrap; }
            ${me} #atts > img, video, audio {
               height: 3em; width: calc(20% - var(--margin));
               margin-right: var(--margin); margin-bottom: var(--margin);
            }
         </style>
         <video w-id='vidPreview' autoplay muted></video>
         <nav>
            <button w-id='audBut/audRecording/className'>Record audio</button>
            <button w-id='vidBut/vidRecording/className'>Record video</button>
            <button w-id='imgBut'>Take photo</button>
         </nav>
         <div w-id='atts'></div>
      `
      wcMixin(this)

      this.imgBut.onclick = async () => {
         const blob = await this._imgCapturer.takePhoto()
         const img = document.createElement("img")
         img.src = URL.createObjectURL(blob)
         this.atts.appendChild(img)
      }

      this.vidBut.onclick = () => {
         if (this.vidRecording) this._vidRecorder.start()
         else this._vidRecorder.stop()
      }

      this.audBut.onclick = () => {
         if (this.audRecording) this._audRecorder.start()
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
         {video: {facingMode: {ideal: "environment"}}, audio: true}
      )
      this.vidPreview.srcObject = this._stream

      this._imgCapturer = new ImageCapture(this._stream.getVideoTracks()[0])

      this._vidRecorder = new MediaRecorder(this._stream, {mimeType : "video/webm"})
      this._vidRecorder.ondataavailable = async (ev) => {
         const vid = document.createElement("video")
         vid.controls = true
         vid.src = URL.createObjectURL(ev.data)
         this.atts.appendChild(vid)
      }

      this._audRecorder = new MediaRecorder(this._stream, {mimeType : "audio/webm"})
      this._audRecorder.ondataavailable = async (ev) => {
         const aud = document.createElement("audio")
         aud.controls = true
         aud.src = URL.createObjectURL(ev.data)
         this.atts.appendChild(aud)

      }
   }

   onUnRoute() {
      console.log(-1)
      this._stream.getTracks().forEach(track => track.stop())
   }
})
