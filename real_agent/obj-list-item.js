import wcMixin from '/WcMixin/WcMixin.js'
import './media-container.js'

const me = 'obj-list-item'
customElements.define(me, class extends HTMLElement {

	build(obj) {
		this.innerHTML = `
			<div w-id='objLabels'></div>
			<div w-id='objDesc'></div>
			<media-container w-id='objMedias'></media-container>
		`
		wcMixin(this)
		
		this.id = obj.created

		this.objLabels.innerHTML = obj.labels
		this.objDesc.innerHTML = obj.desc
		this.objMedias.build(obj.medias)

		this.onclick = () => APP.routeModal('obj-edit', document.createElement('obj-edit').build(obj))
		return this
	}
})
