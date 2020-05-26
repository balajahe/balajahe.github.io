import wcMixin from '/WcMixin/WcMixin.js'
import './media-container.js'

const me = 'media-manager'
customElements.define(me, class extends HTMLElement {
	initMedias = null
	bar = [['sep'], ['back']]
	stream
	W = 0
	H = 0
	imgCapturer
	imgParams
	vidRecorder
	audRecorder

	build(bar, medias) {
		if (bar) this.bar = bar
		if (medias) this.initMedias = medias
		return this
	}

	connectedCallback() {
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
			</div>
			<media-container w-id='objMedias/medias/value'></media-container>
		`
		wcMixin(this)

		if (this.initMedias) this.initMedias.forEach(media => this.objMedias.addMedia(media, true))

		this.imgBut.onclick = async () => {
			const blob = await this.imgCapturer.takePhoto(this.imgParams)
			this.objMedias.addMedia({tagName: 'img', blob: blob}, true)
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
	}

	async onRoute() {
		APP.setBar(this.bar)

		this.stream = await navigator.mediaDevices.getUserMedia(
			{ video: { facingMode: { ideal: "environment" }}, audio: true }
		)
		this.vidPreview.srcObject = this.stream
		await new Promise(res => this.vidPreview.onloadedmetadata = (_) => res())
		this.W = this.vidPreview.videoWidth
		this.H = this.vidPreview.videoHeight
		this.vidDiv.display('flex')

		this.imgCapturer = new ImageCapture(this.stream.getVideoTracks()[0])
		const caps = await this.imgCapturer.getPhotoCapabilities()
		this.imgParams = { imageHeight: caps.imageHeight.max, imageWidth: caps.imageWidth.max }

		this.vidRecorder = new MediaRecorder(this.stream, { mimeType : "video/webm" })
		this.vidRecorder.ondataavailable = (ev) => this.objMedias.addMedia({tagName: 'video', blob: ev.data}, true)

		this.audRecorder = new MediaRecorder(this.stream, { mimeType : "audio/webm" })
		this.audRecorder.ondataavailable = (ev) => this.objMedias.addMedia({tagName: 'audio', blob: ev.data}, true)
	}

	onUnRoute() {
		this.vidDiv.display(false)
		this.stream.getTracks().forEach(track => track.stop())
	}
})
