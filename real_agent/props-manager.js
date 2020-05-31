import wcMixin from '/WcMixin/WcMixin.js'

const me = 'props-manager'
customElements.define(me, class extends HTMLElement {

	build(props) {
		this.innerHTML = `
			<style scoped>
				${me} { 
					width: 100%;
					display: flex; flex-flow: row wrap; 
				}
				${me} button { 
					height: calc(var(--button-height) * 0.8); 
				}
				${me} input { 
					height: calc(var(--button-height) * 0.8); width: 30%; 
				}
				${me} #propsDiv { 
					min-height: calc(var(--button-height) * 0.9); 
				}
			</style>

			<sepa-rator>Selected properties:</sepa-rator>
			<nav w-id='propsDiv/props/children'></nav>
			<nav>
				<sepa-rator>Available properties:</sepa-rator>
				<input w-id='newPropInp/newProp' placeholder='New property...'/>
			</nav>
		`
		wcMixin(this)

		this.appBar = [
			['msg', 'Click to add / remove properties:'],
         ['cancel'],
         ['next', () => {
         	document.querySelector('obj-edit').bubbleEvent('change-props', Array.from(this.props).map(el => el.innerHTML))
         	history.go(-1)
         }]
		]

		for (const prop of props) this.addProp(prop)
		for (const prop of APP.props) this.addAvailProp(prop)

		this.newPropInp.onkeypress = (ev) => {
			if (ev.key === 'Enter') {
				this.addAvailProp(this.newProp)
				APP.props = APP.props.concat(this.newProp)
			}
		}

		return this
	}

	addProp(prop) {
		const but = document.createElement("button")
		but.innerHTML = prop
		but.onclick = () => but.remove()
		this.propsDiv.append(but)
	}

	addAvailProp(prop) {
		const but = document.createElement("button")
		but.innerHTML = prop
		but.onclick = (ev) => this.addProp(prop)
		this.newPropInp.before(but)
	}
})
