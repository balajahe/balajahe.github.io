import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-obj-new1'
let stream
let W = 0
let H = 0
let imgCapturer
let imgParams
let vidRecorder
let audRecorder

customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} #vidPreview { width: 100%; }
            ${me} nav { width: 100%; flex-flow: row nowrap; }
            ${me} nav > button { flex: 1 1 auto; }
         </style>
         <div w-id='vidDiv' style='display:none'>
            <video w-id='vidPreview' autoplay muted></video>
            <nav>
               <button w-id='audBut'>Record audio</button>
               <button w-id='vidBut'>Record video</button>
               <button w-id='imgBut'>Take photo</button>
            </nav>
         </div>
         <div w-id='mediasDiv/medias/children'></div>
      `
      wcMixin(this)

      this.imgBut.onclick = async () => {
         const blob = await imgCapturer.takePhoto(imgParams)

         const med = document.createElement('img')
         med.src = URL.createObjectURL(blob)
         med._blob = blob
         med.onclick = () => APP.showModal('modal-img-show', document.createElement('modal-img-show').build(med.src, () => med.parentNode.remove()))

         const div = document.createElement('div')
         div.className = 'smallMedia'
         div.append(med)
         this.mediasDiv.append(div)
      }

      this.vidBut.onclick = () => {
         this.vidBut.className = this.vidBut.val
         if (this.vidBut.val) vidRecorder.start()
         else vidRecorder.stop()
      }

      this.audBut.onclick = () => {
         this.audBut.className = this.audBut.val
         if (this.audBut.val) audRecorder.start()
         else audRecorder.stop()
      }
   }

   async onRoute() {
      APP.setBar([
         ['msg', 'Take photo, video, or audio:'],
         ['back'],
         ['but', 'Next<br>&rArr;', () => APP.route('page-obj-new2')]
      ])

      stream = await navigator.mediaDevices.getUserMedia(
         { video: { facingMode: { ideal: "environment" }}, audio: true }
      )
      this.vidPreview.srcObject = stream
      await new Promise(res => this.vidPreview.onloadedmetadata = (_) => res())
      W = this.vidPreview.videoWidth
      H = this.vidPreview.videoHeight
      this.vidDiv.display('flex')

      imgCapturer = new ImageCapture(stream.getVideoTracks()[0])
      const caps = await imgCapturer.getPhotoCapabilities()
      imgParams = { imageHeight: caps.imageHeight.max, imageWidth: caps.imageWidth.max }

      vidRecorder = new MediaRecorder(stream, { mimeType : "video/webm" })
      vidRecorder.ondataavailable = async (ev) => {
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

      audRecorder = new MediaRecorder(stream, { mimeType : "audio/webm" })
      audRecorder.ondataavailable = async (ev) => {
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
      stream.getTracks().forEach(track => track.stop())
      this.vidDiv.display(false)
   }
})
