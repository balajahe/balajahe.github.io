import * as WcMixin from '/WcApp/WcMixin.js'

const me = 'props-setup'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		WcMixin.addAdjacentHTML(this, `
			<style scoped>
				${me} > #propsDiv {
					min-height: 5em;
					margin: var(--margin1); margin-top: calc(2*var(--margin2));
					padding-left: var(--margin2);
					border: solid 1px silver;
					display: block;
				}
			</style>
			
			<div w-id='propsDiv/props' contenteditable='true'></div>
		`)
		
		this.appBar = [
			['msg', 'Enter properties separated by commas:'],
			['cancel'],
			['save', () => {
				APP.props = this.props.split(',').map(v => v.trim())
				history.go(-1)
				APP.setMessage('SAVED !', 5000)
			}]
		]

		this.props = APP.props.join(',')
	}
})
