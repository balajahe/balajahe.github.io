import wcMixin from '/WcMixin/WcMixin.js'
import './media-container.js'

const me = 'media-manager'
customElements.define(me, class extends HTMLElement {
	bar = [['sep'], ['back']]
	stream
	W = 0
	H = 0
	imgCapturer = null
	imgParams = null
	vidRecorder = null
	audRecorder = null
	canvas = null

	build(bar, medias) {
		this.innerHTML = `
			<style scoped>
				${me} #vidPreview { width: 100%; }
				${me} nav { width: 100%; flex-flow: row nowrap; }
				${me} nav > button { flex: 1 1 auto; }
			</style>
			<div w-id='vidDiv' style='display:none'>
				<video w-id='vidPreview' autoplay muted></video>
				<nav>
					<button w-id='audBut'>Record audio</button>
					<button w-id='vidBut'>Record video</button>
					<button w-id='imgBut'>Take photo</button>
				</nav>
				<media-container w-id='mediaContainer/medias'></media-container>
			</div>
			<canvas w-id='canvas' style='display:none'></canvas>
		`
		wcMixin(this)
		if (bar) this.bar = bar
		this.canvas.width = APP.imgPrevSize
		this.canvas.height = APP.imgPrevSize

		if (medias) medias.forEach(media => this.mediaContainer.addMedia(media, true))

		this.imgBut.onclick = async () => {
			const blob = await this.imgCapturer.takePhoto(this.imgParams)

			this.mediaContainer.addMedia(
				{ created: APP.now(), tagName: 'img', preview: this._takePrev('IMG'), origin: await this._takeOrigin(blob) }, 
				true
			)
		}

		this.vidBut.onclick = () => {
			this.vidBut.className = this.vidBut.val
			if (this.vidBut.val) this.vidRecorder.start()
			else this.vidRecorder.stop()
		}

		this.audBut.onclick = () => {
			this.audBut.className = this.audBut.val
			if (this.audBut.val) this.audRecorder.start()
			else this.audRecorder.stop()
		}

		return this
	}

	getMedias() {
		return this.medias
	}

	async onRoute() {
		APP.setBar(this.bar)

		this.stream = await navigator.mediaDevices.getUserMedia(
			{ video: { facingMode: { ideal: "environment" }}, audio: true }
		)
		this.vidPreview.srcObject = this.stream
		await new Promise(resolve => this.vidPreview.onloadedmetadata = () => resolve())
		this.W = this.vidPreview.videoWidth
		this.H = this.vidPreview.videoHeight
		this.vidDiv.display('flex')

		this.imgCapturer = new ImageCapture(this.stream.getVideoTracks()[0])
		const caps = await this.imgCapturer.getPhotoCapabilities()
		if (caps.fillLightMode?.includes('auto'))
			this.imgParams = { imageHeight: caps.imageHeight.max, imageWidth: caps.imageWidth.max, fillLightMode: 'auto' }
		else
			this.imgParams = { imageHeight: caps.imageHeight.max, imageWidth: caps.imageWidth.max }

		this.vidRecorder = new MediaRecorder(this.stream, { mimeType : "video/webm" })
		this.vidRecorder.ondataavailable = async (ev) => 
			this.mediaContainer.addMedia({ created: APP.now(), tagName: 'video', preview: this._takePrev('VIDEO'), origin: ev.data }, true)

		this.audRecorder = new MediaRecorder(this.stream, { mimeType : "audio/webm" })
		this.audRecorder.ondataavailable = async (ev) => 
			this.mediaContainer.addMedia({ created: APP.now(), tagName: 'audio', preview: this._takePrev('AUDIO'), origin: ev.data }, true)
	}

	onUnRoute() {
		this.vidDiv.display(false)
		this.stream.getTracks().forEach(track => track.stop())
	}

	disconnectedCallback() {
		this.stream.getTracks().forEach(track => track.stop())
	}

	_takePrev(tagName) {
		const can = this.canvas.getContext('2d')

		if (tagName === 'IMG') {
			can.drawImage(this.vidPreview, 0, 0, APP.imgPrevSize, APP.imgPrevSize)
			return this.canvas.toDataURL()

		} else if (tagName === 'VIDEO') {
			can.drawImage(this.vidPreview, 0, 0, APP.imgPrevSize, APP.imgPrevSize)
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
