import wcMixin from '/WcMixin/WcMixin.js'
import './app-bar.js'

const me = 'app-app'
customElements.define(me, class extends HTMLElement {
	_hashChanging = false
	baseUrl = ''
	db = null
	location = null
	locationCallback = null

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} {
					height: 100vh; 
					width: 100vw; max-width: var(--app-max-width);
					display: flex; flex-flow: column;
					overflow: auto;
				}
				${me} > app-bar {
					position: fixed; z-index: 10;
					height: calc(var(--app-bar-height)); 
					width: 100%; max-width: var(--app-max-width);
				}
				${me} > main {
					margin-top: calc(var(--app-bar-height) + 2*var(--margin1));
					padding-left: var(--margin1);
					font-size: smaller;
				}
				${me} > main > * {
					display: flex; flex-flow: column;
				}
			</style>
			<app-bar w-id='appBar'></app-bar>
			<main w-id='appMain'></main>
		`
		wcMixin(this)

		window.APP = this
		this.baseUrl = location.href

		navigator.geolocation.getCurrentPosition(loc => {
			this.location = loc.coords
			if (this.locationCallback) this.locationCallback()
		})
		navigator.geolocation.watchPosition(loc => {
			this.location = loc.coords
			if (this.locationCallback) this.locationCallback()
		})
		
		window.onhashchange = async (ev) => {
			if (!this._hashChanging) {
				const uu = ev.newURL.split('#')
				if (uu.length > 1) {
					this.route(uu[uu.length-1])
				} else {
					location.href = APP.baseUrl
				}
			}
			this._hashChanging = false
		}
	}

	setMsg(v) { this.appBar.setMsg(v) }
	setBar(v) { this.appBar.setBar(v) }

	route(hash, elem) {
		for (const el of this.appMain.children) {
			el.display(false)
			if (el.onUnRoute) el.onUnRoute()
		}
		if (elem) {
			elem._hash = hash
			this.appMain.append(elem)
		} else {
			elem = Array.from(this.appMain.children).find(el => el._hash === hash)
			if (!elem) {
				elem = document.createElement(hash)
				elem._hash = hash
				this.appMain.append(elem)
			} else {
				elem.display()
			}
		}
		if (elem.onRoute) elem.onRoute()
		this._hashChanging = true
		location.hash = hash
	}

	routeModal(elem) {
		this.appMain.append(elem)
	}

	routeModal1(elem) {
		//for (const el of this.appMain.children) el.display(false)
		this.appMain.prepend(elem)
		if (elem.onRoute) elem.onRoute()
		const backSave = this.appBar.backBut.onclick
		this.appBar.backBut.onclick = () => {
			elem.remove()
			this.appBar.backBut.onclick = backSave
		}
		if (elem.onRoute) elem.onRoute()
	}

	remove(el) {
		if (el.onUnRoute) el.onUnRoute()
		el.remove()
	}
})
