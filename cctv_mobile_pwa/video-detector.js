customElements.define('video-detector',
  class extends HTMLElement {
    model = null
    video = null
    aim = null
    canvas = null
    buttons = null
    alarm = null
    stream = null
    recorder = null
    chunk0 = null
    chunks = []
    W = 0
    H = 0
    detecting = false
    detected = false
    recording = false

    async connectedCallback() {
      this.innerHTML = `
          <p>Loading...</p>
          <video autoplay muted></video>
          <canvas style="position:fixed; top:0; left:0"></canvas>
          <canvas style="display:none"></canvas>
          <div style="display:none; width: 100vw">
            <button>Start detection</button><br>
          </div>
          <audio loop src="./alarm.mp3"></audio>
      `
      this.video = this.querySelector('video')
      this.aim = this.querySelectorAll('canvas')[0]
      this.canvas = this.querySelectorAll('canvas')[1]
      this.buttons = this.querySelector('div')
      this.alarm = this.querySelector('audio')
      this.chunk_a = this.querySelector('a')
      this.querySelector('button').addEventListener('click', (ev) => { 
        if (!this.detecting) {
          this.detecting = true
          this.grab()
          ev.target.innerHTML = 'Stop detection'
        } else {
          this.detecting = false 
          ev.target.innerHTML = 'Start detection'
        }
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
        if (this.detected) {
          this.send(ev.data)
        } else if (this.recording) {
          this.send(ev.data)
          this.recording = false
        }
        this.chunk0 = ev.data
      })
      this.recorder.start()
      setInterval(() => {
        this.recorder.stop()
        this.recorder.start()
      }, 5100)

      msg.remove()
      this.querySelector('div').style.display = 'block'
    }

    async grab() {
      if (this.detecting) {
        this.canvas.drawImage(this.video, 0, 0)
        const predictions = await this.model.detect(this.canvas.getImageData(0, 0, this.W, this.H))
        const person = predictions.find(v => v.class === 'person')
        if (person !== undefined) {
          this.detected = true
          if (!this.recording) {
            this.send(this.chunk0)
            this.recording = true
          }
          this.draw(person.bbox)
          this.alarm.play()
        } else {
          this.stop_alarm()
        }
        //window.requestAnimationFrame(this.grab.bind(this))
        setTimeout(this.grab.bind(this), 100)
      } else {
        this.stop_alarm()
      }
    }

    stop_alarm() {
      this.detected = false
      this.draw(null)
      this.alarm.pause()
      //this.alarm.currentTime = 0
    }

    send(data) {
      if (data !== null && data.size > 0) {
        const url = URL.createObjectURL(data)
        this.chunks.push({data, url})
        const a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.innerHTML = this.chunks.length
        this.buttons.appendChild(document.createTextNode(' '))
        this.buttons.appendChild(a)
      }
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
  }
)
