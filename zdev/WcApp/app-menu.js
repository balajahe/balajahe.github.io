import wcMixin from './WcMixin.js'
import WcAppMenu from './WcAppMenu.js'

const me = 'app-menu'
customElements.define(me, class extends WcAppMenu {

	connectedCallback() {
		super.connectedCallback()
		
		this.innerHTML += `
			<button w-id='source'>Sources on GitHub</button>
		`
		wcMixin(this)

		this.source.onclick = () => location.href = 'https://github.com/balajahe/balajahe.github.io/tree/master/WcApp'
	}
})
