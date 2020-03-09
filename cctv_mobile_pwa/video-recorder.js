const CHUNK_DURATION = 7000

customElements.define('video-recorder',
   class extends HTMLElement {
      detector = null
      video = null
      canvas = null
      bbox = null
      msg = null
      nav = null
      audio = null
      recorder = {rec: null, num: 0, interval: null}
      detected = false
      chunk = null
      W = 0
      H = 0

      get detecting() { return this.querySelector('#detecting').className === 'true' }
      get sound_alarm() { return this.querySelector('#sound_alarm').className === 'true' }

      async init() {
         this.innerHTML = `
            <video autoplay muted style="display:none"></video>
            <canvas style="display:none"></canvas>
            <canvas style="position:absolute; top:0; left:0"></canvas>
            <p>Loading...</p>
            <nav style="display:none; text-align:center">
               <button id="detecting" style="width:69%">Start / Stop detecting & recording</button>
               <button id="sound_alarm" class="true" style="width:30%">Sound alarm</button>
            </nav>
            <audio loop src="./alarm.mp3"></audio>
         `
         this.video = this.querySelector('video')
         this.canvas = this.querySelectorAll('canvas')[0]
         this.bbox = this.querySelectorAll('canvas')[1]
         this.msg = this.querySelector('p')
         this.nav = this.querySelector('nav')
         this.audio = this.querySelector('audio')

         this.msg.innerHTML = 'Loading camera...'
         const stream = await navigator.mediaDevices.getUserMedia(
            {video: {facingMode: {ideal: "environment"}}, audio: true}
         )
         this.video.srcObject = stream
         this.video.onloadedmetadata = (_) => {
            this.W = this.bbox.width = this.canvas.width = this.video.videoWidth
            this.H = this.bbox.height = this.canvas.height = this.video.videoHeight
            this.nav.style.width = this.W + 'px'
            this.bbox = this.bbox.getContext('2d')
            this.canvas = this.canvas.getContext('2d')
            this.video.style.display = ''
         }

         this.recorder.rec = new MediaRecorder(stream, {mimeType : "video/webm"})
         this.recorder.rec.ondataavailable = async (ev) => {
            this.chunk = ev.data
            if (this.detected) {
               await this.send_chunk()
            } else if (this.recorder.num > 0) {
               await this.send_chunk()
               this.recorder.num--
            }
         }

         this.querySelector('#detecting').onclick = (ev) => { 
            ev.target.className = !(ev.target.className === 'true')
            if (this.detecting) {
               this.recorder.rec.start()
               this.recorder.num = 0
               this.recorder.interval = setInterval(() => {
                  this.recorder.rec.stop()
                  this.recorder.rec.start()
               }, CHUNK_DURATION)
               this.chunk = null
               this.grab_video()
            } else {
               this.recorder.rec.stop()
               clearInterval(this.recorder.interval)
            }
         }

         this.querySelector('#sound_alarm').onclick = (ev) => { 
            ev.target.className = !(ev.target.className === 'true')
            if (!this.sound_alarm) this.audio.pause()
         }

         this.msg.innerHTML = 'Loading neural network...'
         this.detector = new Worker('./video-detector.js')
         this.detector.onmessage = (_) => {
            this.msg.remove()
            this.nav.style.display = ''
         }
      }

      async grab_video() {
         if (this.detecting) {
            this.canvas.drawImage(this.video, 0, 0)
            const img = this.canvas.getImageData(0, 0, this.W, this.H)
            this.detector.postMessage(img)
            const result = await new Promise((resolve, reject) => {
               this.detector.onmessage = (ev) => resolve(ev.data)
            })
            if (result.ok) {
               this.detected = true
               if (this.recorder.num === 0) {
                  await this.send_chunk()
                  this.recorder.num = 2
               }
               this.draw_bbox(result.bbox)
               if (this.sound_alarm) this.audio.play()
            } else {
               this.stop_alarm()
            }
            //setTimeout(this.grab_video.bind(this), 100)
            //window.requestAnimationFrame(this.grab_video.bind(this))
            this.grab_video()
         } else {
            this.stop_alarm()
         }
      }

      stop_alarm() {
         this.detected = false
         this.draw_bbox(null)
         this.audio.pause()
         this.audio.currentTime = 0
      }

      async send_chunk() {
         if (this.chunk !== null && this.chunk.size > 0) {
            const type = this.recorder.num === 0 ? 'before' : this.recorder.num === 2 ? 'during' : 'after'
            const name = '__' + new Date().toISOString() + '_' + type + '.webm'
            await document.querySelector('video-sender').send(type, name, this.chunk)
         }
      }

      draw_bbox(b) {
         const c = this.bbox
         c.clearRect(0, 0, this.W, this.H)
         if (b !== null) {
            c.lineWidth = 2;
            c.strokeStyle = 'rgba(255,255,255,0.5)'
            c.strokeRect(b[0], b[1], b[2], b[3])
         }
      }
   }
)
