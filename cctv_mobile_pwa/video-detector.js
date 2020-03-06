customElements.define('video-detector',
  class extends HTMLElement {
    model = null
    video = null
    aim = null
    canvas = null
    controls = null
    alarm = null
    stream = null
    recorder = null
    chunk = null
    chunks = []
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
          <div style="display:none; width: 100vw">
            Email to send:
            <input type="email"/>&nbsp;
            <button>Start / Stop detection</button><br>
          </div>
          <audio loop src="./alarm.mp3"></audio>
      `
      this.video = this.querySelector('video')
      this.aim = this.querySelectorAll('canvas')[0]
      this.canvas = this.querySelectorAll('canvas')[1]
      this.controls = this.querySelector('div')
      this.alarm = this.querySelector('audio')
      this.chunk_a = this.querySelector('a')
      this.querySelector('button').addEventListener('click', (ev) => { 
        if (!this.detecting) {
          this.detecting = true
          this.grab_video()
        } else {
          this.detecting = false 
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
        this.chunk = ev.data
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
      }, 5500)

      msg.innerHTML = 'Loading neural network...'
      this.model = await cocoSsd.load()

      msg.remove()
      this.controls.style.display = 'block'
    }

    async grab_video() {
      if (this.detecting) {
        this.canvas.drawImage(this.video, 0, 0)
        const predictions = await this.model.detect(this.canvas.getImageData(0, 0, this.W, this.H))
        const person = predictions.find(v => v.class === 'person')
        if (person !== undefined) {
          this.detected = true
          if (!this.recording) {
            this.send_chunk()
            this.recording = 2
          }
          this.draw_frame(person.bbox)
          this.alarm.play()
        } else {
          this.stop_alarm()
        }
        //window.requestAnimationFrame(this.grab_video.bind(this))
        setTimeout(this.grab_video.bind(this), 100)
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
        this.chunks.push(this.chunk)
        const i = this.chunks.length
        const url = URL.createObjectURL(this.chunks[i-1])
        const a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.innerHTML = ''+i
        this.controls.appendChild(document.createTextNode(' '))
        this.controls.appendChild(a)
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
