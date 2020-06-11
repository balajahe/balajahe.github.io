import * as WcMixin from '/WcApp/WcMixin.js'

const me = 'obj-list-item'
customElements.define(me, class extends HTMLElement {

	build(obj) {
		WcMixin.addAdjacentHTML(this, `
			<div w-id='objDesc'></div>
			<div w-id='objProps'></div>
			<media-container w-id='mediaContainer' add='false' del='false'></media-container>
		`)
		
		this.id = obj.created

		this.objDesc.innerHTML = obj.desc
		this.objProps.innerHTML = obj.props?.join(', ')
		this.mediaContainer.build(obj.medias)

		this.onclick = async () => {
			await import('./obj-edit.js')
			APP.routeModal('obj-edit', document.createElement('obj-edit').build(obj))
		}

		return this
	}
})
