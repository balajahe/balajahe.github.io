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
					width: 100vw; max-width: var(--app-max-width);
					display: flex; flex-flow: column;
				}
				${me} > main {
					overflow: auto;
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
				if (uu.length > 1) this.route(uu[uu.length-1])
				else location.href = APP.baseUrl
			}
			this._hashChanging = false
		}
	}

	setMsg(v) { this.appBar.setMsg(v) }
	setBar(v) { this.appBar.setBar(v) }

	route(hash, elem) {
		for (const el of this.appMain.children) {
			try {
				el.display(false)
				if (el.onUnRoute) el.onUnRoute()
			} catch(_) {}
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
		this.append(elem)
	}

	remove(el) {
		if (el.onUnRoute) el.onUnRoute()
		el.remove()
	}
})
