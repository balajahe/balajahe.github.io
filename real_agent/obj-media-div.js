import wcMixin from '/WcMixin/WcMixin.js'

const me = 'obj-media-div'
customElements.define(me, class extends HTMLElement {
	obj = null
	del = false

	build(obj, del) {
		this.obj = obj
		this.del = del
		return this
	}

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} > div {
					display: flex; flex-flow: row wrap; 
					margin-bottom: var(--margin2);
				}
			</style>
			<div w-id='body'></div>	
		`
		wcMixin(this)

		for (const media of this.obj.medias) {
			const med = document.createElement(media.tagName)
			med.src = URL.createObjectURL(media.blob)
			med._blob = media.blob
			if (med.tagName === 'IMG') {
				if (this.del) {
					med.onclick = () => APP.showModal('modal-img-show', document.createElement('modal-img-show').build(med.src, () => med.parentNode.remove()))
				} else {
					med.onclick = () => APP.showModal('modal-img-show', document.createElement('modal-img-show').build(med.src))
				}
			} else {
				med.controls = true
			}

			const div = document.createElement('div')
			div.className = 'smallMedia'
			div.append(med)
			this.body.append(div)
		}
	}
})
