import wcMixin from '/WcMixin/WcMixin.js'

const me = 'obj-media-div'
customElements.define(me, class extends HTMLElement {
	obj = null
	del = null

	build(obj, del) {
		this.obj = obj
		this.del = del
		return this
	}

	connectedCallback() {
		this.innerHTML = `
		`
		wcMixin(this)

		for (const media of this.obj.medias) {
			const med = document.createElement(media.tagName)
			med.src = URL.createObjectURL(media.blob)
			med._blob = media.blob
			if (med.tagName === 'IMG') {
				if (this.del) this.del = () => med.parentNode.remove()
				med.onclick = (ev) => {
					ev.stopPropagation()
					APP.showModal('modal-img-show', document.createElement('modal-img-show').build(med.src, this.del))
				}
			} else {
				med.controls = true
			}

			const div = document.createElement('div')
			div.className = 'smallMedia'
			div.append(med)
			this.append(div)
		}
	}
})
