const CHUNK_DURATION = 7000

customElements.define('video-recorder',
  class extends HTMLElement {
    worker = null
    video = null
    bbox = null
    canvas = null
    alarm = null
    recorder = {rec: null, interval: null, num: 0}
    detecting = false
    detected = false
    chunk = null
    W = 0
    H = 0

    async connectedCallback() {
      this.innerHTML = `
          <video autoplay muted style="display:none"></video>
          <canvas style="position:fixed; top:0; left:0"></canvas>
          <canvas style="display:none"></canvas>
          <p>Loading...</p>
          <p style="display:none">
            <button>Start / Stop</button>&nbsp;
            Email: <input type="email"/>
          </p>
          <a style="display:none"></a>
          <audio loop src="./alarm.mp3"></audio>
      `
      this.video = this.querySelector('video')
      this.bbox = this.querySelectorAll('canvas')[0]
      this.canvas = this.querySelectorAll('canvas')[1]
      this.alarm = this.querySelector('audio')
      this.querySelector('button').addEventListener('click', (ev) => { 
        if (!this.detecting) {
          this.recorder.rec.start()
          this.recorder.interval = setInterval(() => {
            this.recorder.rec.stop()
            this.recorder.rec.start()
          }, CHUNK_DURATION)
          this.recorder.num = 0
          this.chunk = null
          this.detecting = true
          this.grab_video()
          ev.target.className = 'recording'
        } else {
          this.recorder.rec.stop()
          clearInterval(this.recorder.interval)
          this.detecting = false 
          ev.target.className = ''
        }
      })

      const msg = this.querySelector('p')
      msg.innerHTML = 'Loading camera...'
      const stream = await navigator.mediaDevices.getUserMedia(
        {video: {facingMode: {ideal: "environment"}}, audio: true}
      )
      this.video.srcObject = stream
      this.video.addEventListener('loadedmetadata', (_) => {
        this.W = this.bbox.width = this.canvas.width = this.video.videoWidth
        this.H = this.bbox.height = this.canvas.height = this.video.videoHeight
        this.bbox = this.bbox.getContext('2d')
        this.canvas = this.canvas.getContext('2d')
        this.video.style.display = ''
      })

      this.recorder.rec = new MediaRecorder(stream, {mimeType : "video/webm"})
      this.recorder.rec.addEventListener('dataavailable', (ev) => {
        this.chunk = ev.data
        if (this.detected) {
          this.send_chunk()
        } else if (this.recorder.num > 0) {
          this.send_chunk()
          this.recorder.num--
        }
      })

      msg.innerHTML = 'Loading neural network...'
      this.worker = new Worker('./video-detector.js')
      this.worker.onmessage = (_) => {
        msg.remove()
        this.querySelector('p').style.display = ''
      }
    }

    async grab_video() {
      if (this.detecting) {
        this.canvas.drawImage(this.video, 0, 0)
        const img = this.canvas.getImageData(0, 0, this.W, this.H)
        this.worker.postMessage(img)
        const result = await new Promise((resolve, reject) => {
          this.worker.onmessage = (ev) => resolve(ev.data)
        })
        if (result.ok) {
          this.detected = true
          if (this.recorder.num === 0) {
            this.send_chunk()
            this.recorder.num = 2
          }
          this.draw_frame(result.bbox)
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
      this.draw_frame(null)
      this.alarm.pause()
      this.alarm.currentTime = 0
    }

    send_chunk() {
      if (this.chunk !== null && this.chunk.size > 0) {
        const a = this.querySelector('a')
        URL.revokeObjectURL(a.href)
        a.href = URL.createObjectURL(this.chunk)
        a.download = '__' + new Date().toISOString() + '.webm'
        a.click()
      }
    }

    draw_frame(b) {
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
