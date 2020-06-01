import wcMixin from '/WcMixin/WcMixin.js'
import './media-container.js'

const me = 'obj-list-item'
customElements.define(me, class extends HTMLElement {

	build(obj) {
		this.innerHTML = `
			<div w-id='objDesc'></div>
			<div w-id='objProps'></div>
			<media-container w-id='mediaContainer' add='false' del='false'></media-container>
		`
		wcMixin(this)
		
		this.id = obj.created

		this.objDesc.innerHTML = obj.desc
		this.objProps.innerHTML = obj.props?.join(', ')
		this.mediaContainer.build(obj.medias)

		this.onclick = () => APP.routeModal('obj-edit', document.createElement('obj-edit').build(obj))

		return this
	}
})
