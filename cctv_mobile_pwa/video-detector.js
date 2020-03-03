customElements.define('video-detector',
  class extends HTMLElement {

    welcome = null
    canvas = null
    alarm = null
    W = 0
    H = 0
    capture = null
    model = null

    async connectedCallback() {
      this.innerHTML = `
          <p></p>
          <canvas></canvas>
          <audio loop src="./alarm.mp3"></audio>
      `
      this.welcome = this.querySelector('p')
      this.canvas = this.querySelector('canvas')
      this.alarm = this.querySelector('audio')

      this.welcome.innerHTML = 'Loading camera...'
      const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: "environment"}}})
      this.capture = new ImageCapture(stream.getVideoTracks()[0])

      this.welcome.innerHTML = 'Loading neural network...'
      this.model = (await cocoSsd.load())
      this.welcome.remove()
    
      const img = await this.capture.grabFrame()
      this.W = this.canvas.width = img.width
      this.H = this.canvas.height = img.height
      this.canvas = this.canvas.getContext('2d')

      this.draw()
    }

    async draw() {
      const img = await this.capture.grabFrame()
      this.canvas.drawImage(img, 0, 0)
      const predictions = await this.model.detect(this.canvas.getImageData(0, 0, this.W, this.H))
      const person = predictions.find(v => v.class === 'person')
      if (person !== undefined) {
        this.drawAim(this.canvas, this.W/2, this.H/2)
        this.alarm.play()
      } else {
        this.alarm.pause()
        this.alarm.currentTime = 0
      }
      window.requestAnimationFrame(this.draw.bind(this))
/*    
      const img2 = this.canvas.getImageData(0, 0, W, H);
      const pp = img2.data

      const ppl = pp.length / 4;
      for (let i = 0; i < ppl; i++) {
        const bw = (pp[i * 4 + 0] + pp[i * 4 + 1] + pp[i * 4 + 2]) / 3
        pp[i * 4 + 0] = pp[i * 4 + 1] = pp[i * 4 + 2] = bw
      }
      can2.putImageData(img2, 0, 0);
*/
    }

    drawAim(can, x0, y0) {
      can.lineWidth = 2;
      can.strokeStyle = 'rgba(255,255,255,0.5)'

      can.beginPath()
      can.arc(x0, y0, 100, 0, Math.PI*2, false)
      can.stroke()

      can.beginPath()
      can.moveTo(x0-30, y0)
      can.lineTo(x0+30, y0)
      can.stroke()

      can.beginPath()
      can.moveTo(x0, y0-30)
      can.lineTo(x0, y0+30)
      can.stroke()
    }
  }
)
