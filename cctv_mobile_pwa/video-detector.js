customElements.define('video-detector',
  class extends HTMLElement {
    model = null
    video = null
    aim = null
    canvas = null
    alarm = null
    stream = null
    recorder = null
    chunk = null
    chunk_url = null
    chunk_a = null
    W = 0
    H = 0
    stop = true

    async connectedCallback() {
      this.innerHTML = `
          <p>Loading...</p>
          <video autoplay muted></video>
          <canvas style="position:fixed; top:0; left:0"></canvas>
          <canvas style="display:none"></canvas>
          <div style="display:none">
            <button>Start detection</button>&emsp;
            <button>Stop detection</button>&emsp;
            <a target="_blank">Last video chunk</a>
          </div>
          <audio loop src="./alarm.mp3"></audio>
      `
      this.video = this.querySelector('video')
      this.aim = this.querySelectorAll('canvas')[0]
      this.canvas = this.querySelectorAll('canvas')[1]
      this.alarm = this.querySelector('audio')
      this.chunk_a = this.querySelector('a')
      this.querySelectorAll('button')[0].addEventListener('click', (_) => { 
        this.stop = false; 
        this.grab() 
      })
      this.querySelectorAll('button')[1].addEventListener('click', (_) => { 
        this.stop = true 
      })

      const msg = this.querySelector('p')
      msg.innerHTML = 'Loading neural network...'
      this.model = await cocoSsd.load()

      msg.innerHTML = 'Loading camera...'
      this.stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: "environment"}}, audio: true})
      const img = await (new ImageCapture(this.stream.getVideoTracks()[0])).grabFrame()
      this.W = this.aim.width = this.canvas.width = img.width
      this.H = this.aim.height = this.canvas.height = img.height
      this.aim = this.aim.getContext('2d')
      this.canvas = this.canvas.getContext('2d')
      this.video.srcObject = this.stream

      this.recorder = new MediaRecorder(this.stream, {mimeType : "video/webm"})
      this.recorder.addEventListener('dataavailable', (ev) => {
        this.chunk = ev.data
        URL.revokeObjectURL(this.chunk_url)
        this.chunk_url = URL.createObjectURL(this.chunk)
        this.chunk_a.href = this.chunk_url
      })
      this.recorder.start()
      setInterval(() => {
        this.recorder.stop()
        this.recorder.start()
      }, 5200)

      msg.remove()
      this.querySelector('div').style.display = 'block'
    }

    async grab() {
      if (!this.stop) {
        this.canvas.drawImage(this.video, 0, 0)
        const predictions = await this.model.detect(this.canvas.getImageData(0, 0, this.W, this.H))
        const person = predictions.find(v => v.class === 'person')
        if (person !== undefined) {
          if (this.recorder.state !== 'recording') this.recorder.start(5000)
          this.draw(person.bbox)
          this.alarm.play()
        } else {
          this.stop_grab()
        }
        window.requestAnimationFrame(this.grab.bind(this))
      } else {
        this.stop_grab()
      }
    }

    stop_grab() {
      this.draw(null)
      this.alarm.pause()
      this.alarm.currentTime = 0
    }

    draw(b) {
      const c = this.aim
      c.clearRect(0, 0, this.W, this.H)
      if (b !== null) {
        c.lineWidth = 2;
        c.strokeStyle = 'rgba(255,255,255,0.5)'
        c.strokeRect(b[0], b[1], b[2], b[3])
      }
    }

    draw_aim(x, y) {
      const can = this.aim
      can.clearRect(0, 0, this.W, this.H)
      if (x !== 0 && y !== 0) {
        can.lineWidth = 2;
        can.strokeStyle = 'rgba(255,255,255,0.5)'

        can.beginPath()
        can.arc(x, y, 30, 0, Math.PI*2, false)
        can.stroke()

        can.beginPath()
        can.moveTo(x-10, y)
        can.lineTo(x+10, y)
        can.stroke()

        can.beginPath()
        can.moveTo(x, y-10)
        can.lineTo(x, y+10)
        can.stroke()
      }
    }
  }
)
