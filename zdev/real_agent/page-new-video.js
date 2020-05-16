import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new-video'
customElements.define(me, class extends HTMLElement {
   _stream = null
   _imgCapturer = null
   _vidRecorder = null
   _audRecorder = null

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} #_vidPreview { width: 100%; height: auto; }
            ${me} nav { display: flex; flex-flow: row nowrap; }
            ${me} nav button { flex: 1 1 auto; }
            ${me} #_attsDiv { display: flex; flex-flow: row wrap; }
            ${me} #_attsDiv > img, video, audio {
               height: 3.5em; width: calc(20% - var(--margin1));
               margin-right: var(--margin1); margin-bottom: var(--margin1);
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
      this.bubbleEvent('set-bar', {
         msg: 'Take photo, audio or video:',
         buts: [{
            html: 'Next<br>&rArr;',
            click: () => {
               APP.route('page-home')
               this.bubbleEvent('set-msg', 'Saved !')
            }
         }]
      })

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
      console.log(+1)
   }

   onUnRoute() {
      this._stream.getTracks().forEach(track => track.stop())
      console.log(-1)
   }
})
