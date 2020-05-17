import wcMixin from '/WcMixin/WcMixin.js'
import save from './page-new3-save.js'

const me = 'page-new2-video'
customElements.define(me, class extends HTMLElement {
   _stream = null
   _imgCapturer = null
   _vidRecorder = null
   _audRecorder = null

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > #_vidPreview { margin: 0; width: 100%; height: auto; }
            ${me} nav { display: flex; flex-flow: row nowrap; }
            ${me} nav button { flex: 1 1 auto; }
            ${me} > #_mediasDiv { display: flex; flex-flow: row wrap; }
            ${me} #_imgShowDiv {
               position: fixed; top: 0; left: 0;
               height: 100vh; width: 100vw;
               background-color: black;
               display: flex; flex-flow: column; justify-content: center;
            }
            ${me} #_imgShowDiv > img {
               height: auto; width: 100%;
               max-height: 90%;
            }
         </style>
         <video w-id='_vidPreview' autoplay muted></video>
         <nav>
            <button w-id='_audBut/_audRecording'>Record audio</button>
            <button w-id='_vidBut/_vidRecording'>Record video</button>
            <button w-id='_imgBut'>Take photo</button>
         </nav>
         <div w-id='_mediasDiv/medias/children'></div>
         <div w-id='_imgShowDiv' style='display:none'>
            <img w-id='_imgShowImg'/>
            <button w-id='_imgShowDel'>Delete</button>
         </div>
      `
      wcMixin(this)

      this._imgBut.onclick = async () => {
         const blob = await this._imgCapturer.takePhoto()
         const img = document.createElement("img")
         img.src = URL.createObjectURL(blob)
         img._blob = blob
         img.className = 'smallMedia'
         this._mediasDiv.appendChild(img)
         img.onclick = () => {
            this._imgShowImg.src = URL.createObjectURL(blob)
            this._imgShowDiv._source = img
            this._imgShowDiv.display()
         }
      }
      this._imgShowDiv.onclick = () => this._imgShowDiv.display(false)
      this._imgShowDel.onclick = () => this._imgShowDiv._source.remove()

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
      this.bubbleEvent('set-bar', {
         msg: 'Take photo, video or audio:',
         buts: [{
            html: 'Save<br>&rArr;',
            click: () => save()
         }]
      })

      this._stream = await navigator.mediaDevices.getUserMedia(
         { video: { facingMode: { ideal: "environment" }}, audio: true }
      )
      this._vidPreview.srcObject = this._stream
      this._imgCapturer = new ImageCapture(this._stream.getVideoTracks()[0])

      this._vidRecorder = new MediaRecorder(this._stream, { mimeType : "video/webm" })
      this._vidRecorder.ondataavailable = async (ev) => {
         const el = document.createElement("video")
         el.src = URL.createObjectURL(ev.data)
         el._blob = ev.data
         el.controls = true
         el.className = 'smallMedia'
         this._mediasDiv.appendChild(el)
      }

      this._audRecorder = new MediaRecorder(this._stream, { mimeType : "audio/webm" })
      this._audRecorder.ondataavailable = async (ev) => {
         const el = document.createElement("audio")
         el.src = URL.createObjectURL(ev.data)
         el._blob = ev.data
         el.controls = true
         el.className = 'smallMedia'
         this._mediasDiv.appendChild(el)
      }
      console.log(+1)
   }

   onUnRoute() {
      this._stream.getTracks().forEach(track => track.stop())
      console.log(-1)
   }
})
