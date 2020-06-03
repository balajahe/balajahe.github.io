import wcMixin from '/WcMixin/WcMixin.js'
import './media-container.js'

const me = 'media-manager'
customElements.define(me, class extends HTMLElement {
	stream
	W = 0
	H = 0
	imgCapturer = null
	imgParams = null
	vidRecorder = null
	audRecorder = null
	canvas = null
	vidPreview = null

	connectedCallback() {
		if(this.innerHTML === '') this.build([], null)
	}

	build(medias, bar) {
		this.innerHTML = `
			<style scoped>
				${me} #video { width: 100%; }
				${me} nav { width: 100%; flex-flow: row nowrap; }
				${me} nav > button { flex: 1 1 auto; }
			</style>

			<div w-id='vidDiv' style='display:none'>
				<video w-id='video' autoplay muted></video>
				<nav>
					<button w-id='audBut/audRecording'>Record audio</button>
					<button w-id='vidBut/vidRecording'>Record video</button>
					<button w-id='imgBut'>Take photo</button>
				</nav>
				<media-container w-id='mediaContainer/medias' add='false' del='true'></media-container>
			</div>

			<canvas w-id='canvas' style='display:none'></canvas>
		`
		wcMixin(this)

		if (bar) {
			this.appBar = bar
		} else {
			this.appBar = [
				['msg', 'Take photo, video, or audio:'],
	         ['ok', () => {
	         	this.bubbleEvent('change-medias', this.val)
	         	history.go(-1)
	         }]
			]
		}

		this.canvas.width = APP.imgPrevSize
		this.canvas.height = APP.imgPrevSize

		this.mediaContainer.build(medias)

		this.imgBut.onclick = async () => {
			const blob = await this.imgCapturer.takePhoto(this.imgParams)

			this.mediaContainer.add(
				{ created: APP.now(), tagName: 'img', preview: this._takePreview('IMG'), origin: await this._takeOrigin(blob) }
			)
		}

		this.vidBut.onclick = () => {
			this.vidBut.className = this.vidRecording
			if (this.vidRecording) {
				this.vidRecorder.start()
				this.vidPreview = this._takePreview('VIDEO')
			} else {
				this.vidRecorder.stop()
			}
		}

		this.audBut.onclick = () => {
			this.audBut.className = this.audRecording
			if (this.audRecording) {
				this.audRecorder.start()
			} else {
				this.audRecorder.stop()
			}
		}

		return this
	}

	get val() {
		return this.medias
	}

	async onRoute() {
		this.stream = await navigator.mediaDevices.getUserMedia(
			{ video: { facingMode: { ideal: "environment" }}, audio: true }
		)
		this.video.srcObject = this.stream
		await new Promise(resolve => this.video.onloadedmetadata = () => resolve())
		this.W = this.video.videoWidth
		this.H = this.video.videoHeight
		this.vidDiv.display('flex')

		this.imgCapturer = new ImageCapture(this.stream.getVideoTracks()[0])
		const caps = await this.imgCapturer.getPhotoCapabilities()
		if (caps.fillLightMode?.includes('auto'))
			this.imgParams = { imageHeight: caps.imageHeight.max, imageWidth: caps.imageWidth.max, fillLightMode: 'auto' }
		else
			this.imgParams = { imageHeight: caps.imageHeight.max, imageWidth: caps.imageWidth.max }

		this.vidRecorder = new MediaRecorder(this.stream, { mimeType : "video/webm" })
		this.vidRecorder.ondataavailable = async (ev) => 
			this.mediaContainer.add({ created: APP.now(), tagName: 'video', preview: this.vidPreview, origin: ev.data })

		this.audRecorder = new MediaRecorder(this.stream, { mimeType : "audio/webm" })
		this.audRecorder.ondataavailable = async (ev) => 
			this.mediaContainer.add({ created: APP.now(), tagName: 'audio', preview: this._takePreview('AUDIO'), origin: ev.data })
	}

	onUnRoute() {
		if (this.vidRecording) this.vidBut.click()
		if (this.audRecording) this.audBut.click()
		this.vidDiv.display(false)
		this.stream.getTracks().forEach(track => track.stop())
	}

	disconnectedCallback() {
		this.stream.getTracks().forEach(track => track.stop())
	}

	_takePreview(tagName) {
		const can = this.canvas.getContext('2d')

		if (tagName === 'IMG') {
			can.drawImage(this.video, 0, 0, APP.imgPrevSize, APP.imgPrevSize)
			return this.canvas.toDataURL()

		} else if (tagName === 'VIDEO') {
			can.drawImage(this.video, 0, 0, APP.imgPrevSize, APP.imgPrevSize)
			can.fillStyle = 'black';
			can.font = 'bold 23px serif';
			can.fillText('VIDEO', 3, 48)
			return this.canvas.toDataURL()
			
		} else if (tagName === 'AUDIO') {
			return 'res/audio.png'
			/*
			can.rect(0, 0, APP.imgPrevSize, APP.imgPrevSize);
			can.fillStyle = 'silver';
			can.fill()
			can.fillStyle = 'black';
			can.font = 'bold 23px serif';
			can.fillText('AUDIO', 1.8, 48)
			return this.canvas.toDataURL()
			*/
		}
	}

	async _takeOrigin(blob) {
	 	const reader = new FileReader()
		reader.readAsDataURL(blob)
		return await new Promise(resolve => {
			reader.onloadend = () => resolve(reader.result)
		})
	}
})
