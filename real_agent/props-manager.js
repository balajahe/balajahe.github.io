import wcMixin from '/WcMixin/WcMixin.js'

const me = 'props-manager'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		if(this.innerHTML === '') this.build([])
	}

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
					min-height1: calc(var(--button-height) * 1.4); 
				}
			</style>

			<sepa-rator>Selected properties:</sepa-rator>
			<nav w-id='propsDiv'></nav>
			<sepa-rator>Available properties:</sepa-rator>
			<nav>
				<input w-id='newPropInp/newProp' placeholder='New property...'/>
			</nav>
		`
		wcMixin(this)

		this.appBar = [
			['msg', 'Click to add / remove properties:'],
         ['cancel'],
         ['next', () => {
         	this.bubbleEvent('change-props', this.val)
         	history.go(-1)
         }]
		]

		for (const prop of props) this._addProp(prop)
		for (const prop of APP.props) this._addAvailProp(prop)

		this.newPropInp.onkeypress = (ev) => {
			if (ev.key === 'Enter') {
				this._addAvailProp(this.newProp)
				APP.props = APP.props.concat(this.newProp)
			}
		}

		return this
	}

	get val() {
		return Array.from(this.propsDiv.children).map(el => el.innerHTML)
	}

	_addProp(prop) {
		const but = document.createElement("button")
		but.innerHTML = prop
		but.onclick = () => but.remove()
		this.propsDiv.append(but)
	}

	_addAvailProp(prop) {
		const but = document.createElement("button")
		but.innerHTML = prop
		but.onclick = (ev) => this._addProp(prop)
		this.newPropInp.before(but)
	}
})
