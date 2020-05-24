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
			<style scoped>
				${me} > div {
					margin-bottom: var(--margin2);
					border-bottom: 1px solid silver;
					overflow: auto;
				}
				${me} #objLabels {
					display: flex; flex-flow: row wrap;
				} 
				${me} #objDesc:hover, #objLabels:hover { 
					cursor: pointer; 
				}
			</style>
			<div w-id='body'>
				<div w-id='objLabels'></div>
				<div w-id='objDesc'></div>
			</div>
		`
		wcMixin(this)

		this.objLabels.innerHTML = this.obj.labels
		this.objLabels.onclick = () => this.edit()

		this.objDesc.innerHTML = this.obj.desc
		this.objDesc.onclick = () => this.edit()

		this.body.append(document.createElement('obj-media-div').build(this.obj))
	}

	edit() {
		APP.routeModal(document.createElement('page-obj-edit').build(this.obj))
	}
})
