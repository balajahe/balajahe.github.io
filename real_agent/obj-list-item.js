import wcMixin from '/WcMixin/WcMixin.js'
import './obj-media-div.js'

const me = 'obj-list-item'

customElements.define(me, class extends HTMLElement {
	obj = null

	build(obj) {
		this.obj = obj
		return this
	}

	connectedCallback() {
		this.innerHTML = `
			<div w-id='objLabels'></div>
			<div w-id='objDesc'></div>
		`
		wcMixin(this)
		
		this.id = this.obj.created

		this.objLabels.innerHTML = this.obj.labels
		this.objDesc.innerHTML = this.obj.desc
		this.append(document.createElement('obj-media-div').build(this.obj))

		this.onclick = () => APP.routeModal('page-obj-edit', document.createElement('page-obj-edit').build(this.obj))
	}
})
