const CHUNK_DURATION = 7000

customElements.define('video-recorder',
   class extends HTMLElement {
      detector = null
      video = null
      canvas = null
      bbox = null
      msg = null
      button = null
      alarm = null
      recorder = {rec: null, num: 0, interval: null}
      detecting = false
      detected = false
      chunk = null
      W = 0
      H = 0

      async init() {
         this.innerHTML = `
            <div>
               <video autoplay muted style="display:none"></video>
               <canvas style="display:none"></canvas>
               <canvas style="position:fixed; top:0; left:0"></canvas>
            </div>
            <p>Loading...</p>
            <button style="display:none">Start / Stop detecting and recording</button>
            <a style="display:none"></a>
            <audio loop src="./alarm.mp3"></audio>
         `
         this.video = this.querySelector('video')
         this.canvas = this.querySelectorAll('canvas')[0]
         this.bbox = this.querySelectorAll('canvas')[1]
         this.msg = this.querySelector('p')
         this.button = this.querySelector('button')
         this.alarm = this.querySelector('audio')

         this.msg.innerHTML = 'Loading camera...'
         const stream = await navigator.mediaDevices.getUserMedia(
            {video: {facingMode: {ideal: "environment"}}, audio: true}
         )
         this.video.srcObject = stream
         this.video.addEventListener('loadedmetadata', (_) => {
            this.W = this.bbox.width = this.canvas.width = this.video.videoWidth
            this.H = this.bbox.height = this.canvas.height = this.video.videoHeight
            this.button.style.width = this.W + 'px'
            this.bbox = this.bbox.getContext('2d')
            this.canvas = this.canvas.getContext('2d')
            this.video.style.display = ''
         })

         this.recorder.rec = new MediaRecorder(stream, {mimeType : "video/webm"})
         this.recorder.rec.addEventListener('dataavailable', async (ev) => {
            this.chunk = ev.data
            if (this.detected) {
               await this.send_chunk()
            } else if (this.recorder.num > 0) {
               await this.send_chunk()
               this.recorder.num--
            }
         })

         this.msg.innerHTML = 'Loading neural network...'
         this.detector = new Worker('./video-detector.js')
         this.detector.onmessage = (_) => {
            this.msg.remove()
            this.button.style.display = ''
         }

         this.button.addEventListener('click', (ev) => { 
            if (!this.detecting) {
               this.recorder.rec.start()
               this.recorder.num = 0
               this.recorder.interval = setInterval(() => {
                  this.recorder.rec.stop()
                  this.recorder.rec.start()
               }, CHUNK_DURATION)
               ev.target.className = 'recording'
               this.chunk = null
               this.detecting = true
               this.grab_video()
            } else {
               this.detecting = false 
               this.recorder.rec.stop()
               clearInterval(this.recorder.interval)
               ev.target.className = ''
            }
         })
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
               this.alarm.play()
            } else {
               this.stop_alarm()
            }
            //setTimeout(this.grab_video.bind(this), 100)
            window.requestAnimationFrame(this.grab_video.bind(this))
         } else {
            this.stop_alarm()
         }
      }

      stop_alarm() {
         this.detected = false
         this.draw_bbox(null)
         this.alarm.pause()
         this.alarm.currentTime = 0
      }

      async send_chunk() {
         if (this.chunk !== null && this.chunk.size > 0) {
            const a = this.querySelector('a')
            URL.revokeObjectURL(a.href)
            try {
               await document.querySelector('video-mailer').send(this.chunk)
            } catch(e) {
               console.error(e)
               console.warn('Cannot send email, saved locally !')
               a.href = URL.createObjectURL(this.chunk)
               a.download = '__' + new Date().toISOString() + '.webm'
               a.click()
            }
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
