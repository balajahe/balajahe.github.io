import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new1-media'
customElements.define(me, class extends HTMLElement {
   stream = null
   imgCapturer = null
   vidRecorder = null
   audRecorder = null

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > #vidPreview { margin: 0; width: 100%; height: auto; }
            ${me} > nav { display: flex; flex-flow: row nowrap; }
            ${me} > nav > button {
              flex: 1 1 auto;
              height: var(--app-bar-height)
            }
            ${me} > #mediasDiv { display: flex; flex-flow: row wrap; }
         </style>
         <video w-id='vidPreview' autoplay muted></video>
         <nav>
            <button w-id='audBut/audRecording'>Record audio</button>
            <button w-id='vidBut/vidRecording'>Record video</button>
            <button w-id='imgBut'>Take photo</button>
         </nav>
         <div w-id='mediasDiv/medias/children'></div>
      `
      wcMixin(this)

      this.imgBut.onclick = async () => {
         const blob = await this.imgCapturer.takePhoto()
         const img = document.createElement("img")
         img.src = URL.createObjectURL(blob)
         img._blob = blob
         img.className = 'smallMedia'
         this.mediasDiv.append(img)
         img.onclick = () => APP.imgShow(img, true)
      }

      this.vidBut.onclick = () => {
         this.vidBut.className = this.vidRecording
         if (this.vidRecording) this.vidRecorder.start()
         else this.vidRecorder.stop()
      }

      this.audBut.onclick = () => {
         this.audBut.className = this.audRecording
         if (this.audRecording) this.audRecorder.start()
         else this.audRecorder.stop()
      }
   }

   async onRoute() {
      APP.setBar({
         msg: 'Take photo, video or audio:',
         buts: [{
            html: 'Next<br>&rArr;',
            click: () => APP.route('page-new2-form')
         }]
      })

      this.stream = await navigator.mediaDevices.getUserMedia(
         { video: { facingMode: { ideal: "environment" }}, audio: true }
      )
      this.vidPreview.srcObject = this.stream
      this.imgCapturer = new ImageCapture(this.stream.getVideoTracks()[0])

      this.vidRecorder = new MediaRecorder(this.stream, { mimeType : "video/webm" })
      this.vidRecorder.ondataavailable = async (ev) => {
         const el = document.createElement("video")
         el.src = URL.createObjectURL(ev.data)
         el._blob = ev.data
         el.controls = true
         el.className = 'smallMedia'
         el.onloadedmetadata = () => el.style.width = 'auto'
         this.mediasDiv.append(el)
      }

      this.audRecorder = new MediaRecorder(this.stream, { mimeType : "audio/webm" })
      this.audRecorder.ondataavailable = async (ev) => {
         const el = document.createElement("audio")
         el.src = URL.createObjectURL(ev.data)
         el._blob = ev.data
         el.controls = true
         el.className = 'smallMedia'
         this.mediasDiv.append(el)
      }
   }

   onUnRoute() {
      this.stream.getTracks().forEach(track => track.stop())
   }
})
