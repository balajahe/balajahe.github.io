import WC from './weird-component.js'

const CHUNK_DURATION = 7000

customElements.define('video-recorder', class extends WC {
   detector = null
   stream = null
   capture = null
   recorder = {rec: null, num: 0, interval: null}
   detected = false
   chunk = null
   W = 0
   H = 0

   async init() {
      this.innerHTML = `
         <video el='video' autoplay muted style='display:none'></video>
         <canvas el='c_canvas' style='display:none'></canvas>
         <canvas el='c_bbox' style='position:absolute; top:0; left:0'></canvas>
         <div ih='msg'>Loading...</div>
         <nav el='nav' style='display:none'>
            <button el='detect' vl='detecting'>Start / Stop detecting</button>
            <button el='b_noplayer' vl='noplayer'>No player</button>
            <button el='b_noalarm' vl='noalarm'>No alarm</button>
         </nav>
         <audio el='alarm' loop src='./alarm.mp3'></audio>
      `
      this.generate_props()
      this.canvas = this.c_canvas.getContext('2d')
      this.bbox = this.c_bbox.getContext('2d')

      this.msg = 'Loading camera...'
      this.stream = await navigator.mediaDevices.getUserMedia(
         {video: {facingMode: {ideal: 'environment'}}, audio: true}
      )
      this.capture = new ImageCapture(this.stream.getVideoTracks()[0])

      this.video.srcObject = this.stream
      await new Promise((resolve, reject) => {
         this.video.onloadedmetadata = (_) => resolve()
      })
      this.W = this.c_bbox.width = this.c_canvas.width = this.video.videoWidth
      this.H = this.c_bbox.height = this.c_canvas.height = this.video.videoHeight
      //this.nav.style.width = this.W + 'px'
      document.querySelector('#app').style.width = this.W + 'px'
      this.video.style.display = ''

      this.recorder.rec = new MediaRecorder(this.stream, {mimeType : 'video/webm'})
      this.recorder.rec.ondataavailable = (ev) => {
         this.chunk = ev.data
         if (this.detected) {
            this.send_chunk()
         } else if (this.recorder.num > 0) {
            this.send_chunk()
            this.recorder.num--
         }
      }

      this.detect.onclick = (ev) => { 
         this.detecting = !this.detecting
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
      this.b_noplayer.onclick = (ev) => { 
         this.noplayer = !this.noplayer
         if (this.noplayer) 
            this.video.pause()
         else 
            this.video.play()
      }
      this.b_noalarm.onclick = (ev) => { 
         this.noalarm = !this.noalarm
         if (this.noalarm) this.alarm.pause()
      }

      this.msg = 'Loading neural network...'
      this.detector = new Worker('./video-detector.js')
      await new Promise((resolve, reject) => {
         this.detector.onmessage = (_) => resolve()
      })
      
      this.msg = ''
      this.nav.style.display = ''
   }

   async grab_video() {
      if (this.detecting) {
         this.canvas.drawImage(await this.capture.grabFrame(), 0, 0)
         const img = this.canvas.getImageData(0, 0, this.W, this.H)
         this.detector.postMessage(img)
         const result = await new Promise((resolve, reject) => {
            this.detector.onmessage = (ev) => resolve(ev.data)
         })
         if (result.ok) {
            this.detected = true
            if (this.recorder.num === 0) {
               this.send_chunk()
               this.recorder.num = 2
            }
            this.draw_bbox(result.bbox)
            if (!this.noalarm) this.alarm.play()
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
      this.alarm.pause()
      this.alarm.currentTime = 0
   }

   async send_chunk() {
      if (this.chunk !== null && this.chunk.size > 0) {
         const type = this.recorder.num === 0 ? 'before' : this.recorder.num === 2 ? 'during' : 'after'
         const date = new Date().toISOString().replace(/:/g, '.').replace(/T/g, ', ').slice(0, -5)
         let name = '__' + date + ', ' + type + '.webm'
         console.log(name)
         await document.querySelector('video-sender').send(type, name, this.chunk.slice())
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
})
