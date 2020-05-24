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
					height: calc(100vh - var(--app-bar-height) - 2*var(--margin1)); 
					margin-top: calc(var(--app-bar-height) + 2*var(--margin1));
					width: 100vw; max-width: var(--app-max-width);
					display: flex; flex-flow: column;
					overflow: auto;
				}
				${me} > app-bar {
					position: fixed; z-index: 100; top: 0;
					height: calc(var(--app-bar-height)); 
					width: 100%; max-width: var(--app-max-width);
				}
				${me} > main {
					font-size: smaller;
				}
				${me} > main > * {
					padding-left: var(--margin1);
					display: flex; flex-flow: column;
				}
				${me} .appModal {
					position: fixed; z-index:10; 
					height: calc(100vh - var(--app-bar-height) - 2*var(--margin1)); 
					width: 100vw; max-width: var(--app-max-width);
					display: flex; flex-flow: column;
					background-color: white; 
					overflow: scroll;
				}
				${me} .appModalFixed {
					position: fixed; z-index:1000; top: 0; left; 0;
					height: 100vh; width: 100vw; max-width: var(--app-max-width);
					display: flex; flex-flow: column; justify-content: center; align-items: center;  
					background-color: white; 
					overflow: scroll;
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
		const modal = document.createElement('div')
		modal.className = 'appModal'
		modal.append(elem)
		this.appMain.prepend(modal)		
		this.appBar.pushBar()
		this.appBar.addBackBut(() => this.popModal())
		if (elem.onRoute) elem.onRoute()
	}

	popModal() {
		this.appMain.firstElementChild.remove()
		this.appBar.popBar()
	}

	showModal(elem) {
		const modal = document.createElement('div')
		modal.className = 'appModalFixed'
		modal.append(elem)
		modal.onclick = () => modal.remove()
		this.prepend(modal)
		if (elem.onRoute) elem.onRoute()
	}

	remove(el) {
		if (el.onUnRoute) el.onUnRoute()
		el.remove()
	}
})
