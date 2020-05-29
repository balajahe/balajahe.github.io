import wcMixin from '/WcMixin/WcMixin.js'
import './media-container.js'

const me = 'organize-labels'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} { margin-top: var(--app-bar-height); }
				${me} > #labelsDiv {
					min-height: 5em;
					margin: var(--margin1); padding-left: var(--margin2);
					border: solid 1px silver;
					display: block;
				}
			</style>
			<div w-id='labelsDiv/labels' contenteditable='true'></div>
		`
		wcMixin(this)

		this.labels = localStorage.getItem('labels')
	}

	onRoute() {
		APP.setBar([
			['msg', 'Edit available label list:'],
         ['but', 'Cancel<br>&lArr;', () => history.go(-1)],
         ['but', 'Save<br>&rArr;', () => {
         	localStorage.setItem('labels', this.labels)
         	APP.remove(this)
         	APP.route('obj-list')
				setTimeout(() => APP.setMsg('Saved !'), 100)
         }]
		])
	}
})
