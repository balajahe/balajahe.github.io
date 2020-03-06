customElements.define('video-recorder',
  class extends HTMLElement {
    worker = null
    video = null
    aim = null
    canvas = null
    controls = null
    alarm = null
    stream = null
    recorder = null
    chunk = {data: null, num: 0}
    W = 0
    H = 0
    detecting = false
    detected = false
    recording = 0

    async connectedCallback() {
      this.innerHTML = `
          <video autoplay muted style="display:none"></video>
          <canvas style="position:fixed; top:0; left:0"></canvas>
          <canvas style="display:none"></canvas>
          <p>Loading...</p>
          <div style="display:none">
            <button>Start / Stop detection</button>&nbsp;
            Email: <input type="email"/>
          </div>
          <a style="display:none"></a>
          <audio loop src="./alarm.mp3"></audio>
      `
      this.video = this.querySelector('video')
      this.aim = this.querySelectorAll('canvas')[0]
      this.canvas = this.querySelectorAll('canvas')[1]
      this.controls = this.querySelector('div')
      this.alarm = this.querySelector('audio')
      this.querySelector('button').addEventListener('click', (ev) => { 
        if (!this.detecting) {
          this.detecting = true
          this.grab_video()
          ev.target.className = 'recording'
        } else {
          this.detecting = false 
          ev.target.className = ''
        }
      })

      const msg = this.querySelector('p')
      msg.innerHTML = 'Loading camera...'
      this.stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: "environment"}}, audio: true})
      this.video.srcObject = this.stream
      this.video.addEventListener('loadedmetadata', (_) => {
        this.W = this.aim.width = this.canvas.width = this.video.videoWidth
        this.H = this.aim.height = this.canvas.height = this.video.videoHeight
        this.aim = this.aim.getContext('2d')
        this.canvas = this.canvas.getContext('2d')
        this.video.style.display = 'block'
      })

      this.recorder = new MediaRecorder(this.stream, {mimeType : "video/webm"})
      this.recorder.addEventListener('dataavailable', (ev) => {
        this.chunk.data = ev.data
        if (this.detected) {
          this.send_chunk()
        } else if (this.recording > 0) {
          this.send_chunk()
          this.recording--
        }
      })
      this.recorder.start()
      setInterval(() => {
        this.recorder.stop()
        this.recorder.start()
      }, 7000)

      msg.innerHTML = 'Loading neural network...'
      this.worker = new Worker('./video-detector.js')
      this.worker.onmessage = (_) => {
        msg.remove()
        this.controls.style.display = 'block'
      }
    }

    async grab_video() {
      if (this.detecting) {
        this.canvas.drawImage(this.video, 0, 0)
        this.worker.postMessage(this.canvas.getImageData(0, 0, this.W, this.H))
        const result = await new Promise((resolve, reject) => {
          this.worker.onmessage = (ev) => resolve(ev.data)
        })
        if (result.ok) {
          this.detected = true
          if (!this.recording) {
            this.send_chunk()
            this.recording = 2
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
      if (this.chunk.data !== null && this.chunk.data.size > 0) {
        this.chunk.num++
        const a = this.querySelector('a')
        URL.revokeObjectURL(a.href)
        a.href = URL.createObjectURL(this.chunk.data)
        a.download = '_' + new Date().toISOString() + '.webm'
        a.click()
      }
    }

    draw_frame(b) {
      const c = this.aim
      c.clearRect(0, 0, this.W, this.H)
      if (b !== null) {
        c.lineWidth = 2;
        c.strokeStyle = 'rgba(255,255,255,0.5)'
        c.strokeRect(b[0], b[1], b[2], b[3])
      }
    }
  }
)
