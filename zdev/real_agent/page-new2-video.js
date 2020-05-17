import wcMixin from '/WcMixin/WcMixin.js'
import save from './page-new3-save.js'

const me = 'page-new2-video'
customElements.define(me, class extends HTMLElement {
   stream = null
   imgCapturer = null
   vidRecorder = null
   audRecorder = null

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > #vidPreview { margin: 0; width: 100%; height: auto; }
            ${me} nav { display: flex; flex-flow: row nowrap; }
            ${me} nav button { flex: 1 1 auto; }
            ${me} > #mediasDiv { display: flex; flex-flow: row wrap; }
            ${me} #imgShowDiv {
               position: fixed; top: 0; left: 0;
               height: 100vh; width: 100vw;
               background-color: black;
               display: flex; flex-flow: column; justify-content: center;
            }
            ${me} #imgShowDiv > img {
               height: auto; width: 100%;
               max-height: 90%;
            }
         </style>
         <video w-id='vidPreview' autoplay muted></video>
         <nav>
            <button w-id='audBut/audRecording'>Record audio</button>
            <button w-id='vidBut/vidRecording'>Record video</button>
            <button w-id='imgBut'>Take photo</button>
         </nav>
         <div w-id='mediasDiv/medias/children'></div>
         <div w-id='imgShowDiv' style='display:none'>
            <img w-id='imgShowImg'/>
            <button w-id='imgShowDel'>Delete</button>
         </div>
      `
      wcMixin(this)

      this.imgBut.onclick = async () => {
         const blob = await this.imgCapturer.takePhoto()
         const img = document.createElement("img")
         img.src = URL.createObjectURL(blob)
         img._blob = blob
         img.className = 'smallMedia'
         this.mediasDiv.append(img)
         img.onclick = () => {
            this.imgShowImg.src = URL.createObjectURL(blob)
            this.imgShowDiv._source = img
            this.imgShowDiv.display()
         }
      }
      this.imgShowDiv.onclick = () => this.imgShowDiv.display(false)
      this.imgShowDel.onclick = () => this.imgShowDiv._source.remove()

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
            html: 'Save<br>&rArr;',
            click: () => save()
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
