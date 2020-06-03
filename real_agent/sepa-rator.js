const me = 'sepa-rator'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} {
					display: block; width: 100%;
				}
				${me} > div {
					width:100%; 
					margin-top: var(--margin3); 
					display: flex; flex-flow: row nowrap; 
				}
				${me} hr { 
					display: inline-block; flex: 1 1 auto; 
				}
			</style>

			<div>
				&nbsp;<small>${this.innerHTML}</small>&nbsp;<hr/>
			</div>
		`
	}
})
