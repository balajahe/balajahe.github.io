import * as WcMixin from './WcMixin.js'

export default class extends HTMLElement {

	connectedCallback() {
		const me = this.tagName
		
		WcMixin.addAdjacentHTML(this, `
			<style>
				${me} {
					position: absolute;
					width: 70%; max-width: calc(var(--app-max-width) * 0.7);
					margin: var(--margin1); padding: 0.5em;
					border-right: solid 2px grey; border-bottom: solid 2px grey;
					display: flex; flex-direction: column;
					background-color: LightGrey;
				}
				${me} > button {flex: 1 1 auto; margin: 0.2em;}
			</style>

			<button w-id='home'>HOME</button>
		`)

		this.home.onclick = () => location.reload()
	}
}
