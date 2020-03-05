customElements.define('video-detector',
  class extends HTMLElement {
    video = null
    aim = null
    canvas = null
    alarm = null
    stream = null
    capture = null
    recorder = null
    model = null
    W = 0
    H = 0
    stop = false

    async connectedCallback() {
      this.innerHTML = `
          <p></p>
          <p style="display:none">
            <button>Start detection</button>&emsp;
            <button>Stop detection</button>
          </p>
          <video autoplay style="position:absolute"></video>
          <canvas style="position:absolute"></canvas>
          <canvas style="display:none"></canvas>
          <audio loop src="./alarm.mp3"></audio>
      `
      this.video = this.querySelector('video')
      this.aim = this.querySelectorAll('canvas')[0]
      this.canvas = this.querySelectorAll('canvas')[1]
      this.alarm = this.querySelector('audio')
      this.querySelectorAll('button')[0].addEventListener('click', _ => { this.stop = false; this.grab() })
      this.querySelectorAll('button')[1].addEventListener('click', _ => { this.stop = true })

      const loading = this.querySelector('p')
      loading.innerHTML = 'Loading neural network...'
      this.model = await cocoSsd.load()

      loading.innerHTML = 'Loading camera...'
      this.stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: "environment"}}})
      this.video.srcObject = this.stream

      this.capture = new ImageCapture(this.stream.getVideoTracks()[0])
      const img = await this.capture.grabFrame()
      this.W = this.aim.width = this.canvas.width = img.width
      this.H = this.aim.height = this.canvas.height = img.height

      this.aim = this.aim.getContext('2d')
      this.canvas = this.canvas.getContext('2d')

      loading.remove()
      this.querySelector('p').style.display = 'block'
    }

    async grab() {
      if (!this.stop) {
        this.canvas.drawImage(this.video, 0, 0)
        const predictions = await this.model.detect(this.canvas.getImageData(0, 0, this.W, this.H))
        const person = predictions.find(v => v.class === 'person')
        if (person !== undefined) {
          const xy = person.bbox
          this.draw_aim((xy[0]*2 + xy[2]) / 2, (xy[1]*2 + xy[3]) / 2)
          this.alarm.play()
        } else {
          this.draw_aim(0, 0)
          this.alarm.pause()
          this.alarm.currentTime = 0
        }
          window.requestAnimationFrame(this.grab.bind(this))
        } else {
          this.draw_aim(0, 0)
          this.alarm.pause()
          this.alarm.currentTime = 0
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
