import * as WcMixin from '../WcMixin.js'
import WcAppMenu from '../WcAppMenu.js'

const me = 'app-menu'
customElements.define(me, class extends WcAppMenu {

	connectedCallback() {
		super.connectedCallback()
		
		WcMixin.addAdjacentHTML(this, `
			<button w-id='source'>Sources on GitHub</button>
		`)

		this.source.onclick = () => location.href = 'https://github.com/balajahe/balajahe.github.io/tree/master/WcApp'
	}
})
