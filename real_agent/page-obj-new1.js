import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-obj-new1'
customElements.define(me, class extends HTMLElement {
   stream = null
   imgCapturer = null
   imgParams = null
   vidRecorder = null
   audRecorder = null

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > #vidPreview { margin: 0; width: 100%; height: 0; }
            ${me} > nav { display: flex; flex-flow: row nowrap; }
            ${me} > nav > button { flex: 1 1 auto; }
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
         const blob = await this.imgCapturer.takePhoto(this.imgParams)

         const med = document.createElement('img')
         med.src = URL.createObjectURL(blob)
         med._blob = blob
         med.onclick = () => APP.showModal(document.createElement('modal-img-show').build(med.src, () => med.parentNode.remove()))

         const div = document.createElement('div')
         div.className = 'smallMedia'
         div.append(med)
         this.mediasDiv.append(div)
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
            click: () => APP.route('page-obj-new2')
         }]
      })

      this.stream = await navigator.mediaDevices.getUserMedia(
         { video: { facingMode: { ideal: "environment" }}, audio: true }
      )
      this.vidPreview.srcObject = this.stream
      this.vidPreview.onloadedmetadata = () => this.vidPreview.style.height = 'auto'

      this.imgCapturer = new ImageCapture(this.stream.getVideoTracks()[0])
      const caps = await this.imgCapturer.getPhotoCapabilities()
      this.imgParams = { imageHeight: caps.imageHeight.max, imageWidth: caps.imageWidth.max }

      this.vidRecorder = new MediaRecorder(this.stream, { mimeType : "video/webm" })
      this.vidRecorder.ondataavailable = async (ev) => {
         const med = document.createElement('video')
         med.src = URL.createObjectURL(ev.data)
         med._blob = ev.data
         med.controls = true
         med.onloadedmetadata = () => med.style.width = 'auto'

         const div = document.createElement('div')
         div.className = 'smallMedia'
         div.append(med)
         this.mediasDiv.append(div)
      }

      this.audRecorder = new MediaRecorder(this.stream, { mimeType : "audio/webm" })
      this.audRecorder.ondataavailable = async (ev) => {
         const med = document.createElement('audio')
         med.src = URL.createObjectURL(ev.data)
         med._blob = ev.data
         med.controls = true

         const div = document.createElement('div')
         div.className = 'smallMedia'
         div.append(med)
         this.mediasDiv.append(div)
      }
   }

   onUnRoute() {
      this.stream.getTracks().forEach(track => track.stop())
      this.vidPreview.style.height = '0'
   }
})
