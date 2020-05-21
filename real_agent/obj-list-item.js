import wcMixin from '/WcMixin/WcMixin.js'

const me = 'obj-list-item'
customElements.define(me, class extends HTMLElement {
	obj = null

	build(obj) {
		this.obj = obj
		return this
	}

	connectedCallback() {
		this.innerHTML = `
			<div>
				<div w-id='objLabels'></div>
				<div w-id='objDesc'></div>
				<div w-id='objMedias'></div>
			</div>
		`
		wcMixin(this)

		this.objLabels.innerHTML = this.obj.labels
		this.objDesc.innerHTML = this.obj.desc
		this.objLabels.onclick = () => this.edit()
		this.objDesc.onclick = () => this.edit()

		for (const media of this.obj.medias) {
			const med = document.createElement(media.tagName)
			med.src = URL.createObjectURL(media.blob)
			med._blob = media.blob
			if (med.tagName === 'IMG') {
				med.onclick = () => APP.routeModal(document.createElement('modal-img-show').build(med.src))
			} else {
				med.controls = true
			}

			const div = document.createElement('div')
			div.className = 'smallMedia'
			div.append(med)
			this.objMedias.append(div)
		}
	}

	edit() {
		APP.routeModal(document.createElement('page-obj-edit').build(this.obj))
	}
})
