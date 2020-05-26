import wcMixin from '/WcMixin/WcMixin.js'
import './app-bar.js'

const me = 'app-app'
let _hashReplacing = false

customElements.define(me, class extends HTMLElement {
	db = null
	location = null
	locationCallback = null

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} {
					margin-top: var(--app-bar-height);
					height: calc(100vh - var(--app-bar-height)); 
					width: 100vw; max-width: var(--app-max-width);
					display: flex; flex-flow: column;
					overflow: auto;
					font-size: smaller;
				}
				${me} > app-bar {
					position: fixed; z-index: 1000; top: 0;
					height: var(--app-bar-height); 
					width: 100%; max-width: var(--app-max-width);
				}
				${me} > div {
					padding-left: var(--margin1); padding-right: var(--margin1);
					flex-flow: column;
				}
				${me} .appModal {
					position: fixed; z-index:10; 
					height: calc(100vh - var(--app-bar-height)); 
					width: 100vw; max-width: var(--app-max-width);
					flex-flow: column;
					overflow: auto;
					background-color: white; 
				}
				${me} .appModalCenter {
					position: fixed; z-index:100;
					height: calc(100vh - var(--app-bar-height)); 
					width: 100vw; max-width: var(--app-max-width);
					flex-flow: column; justify-content: center; align-items: center;  
					overflow: auto;
					background-color: white; 
				}
			</style>
			<app-bar w-id='appBar'></app-bar>
			<div></div> <!-- this.lastElementChild -->
		`
		wcMixin(this)
		window.APP = this

		window.onhashchange = async (ev) => {
			if (!_hashReplacing) {
				if (hashLevel(ev.oldURL) - hashLevel(ev.newURL) === 1) { //history.go(-1)
					this.popModal()
				} else if (lastHash(ev.newURL)) {
					this.route(lastHash(ev.newURL))
				} else {
					location.reload()
				}
			}
			_hashReplacing = false
		}

		navigator.geolocation.getCurrentPosition(loc => {
			this.location = loc.coords
			if (this.locationCallback) this.locationCallback()
		})
		navigator.geolocation.watchPosition(loc => {
			this.location = loc.coords
			if (this.locationCallback) this.locationCallback()
		})		
	}

	setBar(v) { this.appBar.setBar(v) }
	setMsg(v) { this.appBar.setMsg(v) }

	route(hash, elem) {
		const curr = this.lastElementChild._currentPage
		if (curr) {
			curr.display(false)
			if (curr.onUnRoute) curr.onUnRoute()
		}
		if (elem) {
			elem._hash = hash
			this.lastElementChild.append(elem)
		} else {
			elem = Array.from(this.lastElementChild.children).find(el => el._hash === hash)
			if (!elem) {
				elem = document.createElement(hash)
				elem._hash = hash
				this.lastElementChild.append(elem)
			} else {
				elem.display()
			}
		}
		if (elem.onRoute) elem.onRoute()
		this.lastElementChild._currentPage = elem
		replaceLastHash(hash)
	}

	routeModal(hash, elem, className = 'appModal') {
		this.appBar.pushBar()
		const modal = document.createElement('div')
		modal.className = className
		this.append(modal)		

		elem._hash = hash
		modal.append(elem)
		if (elem.onRoute) elem.onRoute()

		this.lastElementChild._currentPage = elem
		pushHash(hash)
	}

	popModal() {
		this.lastElementChild.remove()
		this.appBar.popBar()
	}

	remove(el) {
		if (el.onUnRoute) el.onUnRoute()
		el.remove()
	}

	setHash(hash) {
		_hashReplacing = true
		location.hash = hash
	}
})

function hashLevel(url) {
	return url.split('#').length
}

function lastHash(url) {
	const uu = url.split('#')
	return uu.length > 0 ? uu[uu.length-1] : ''
}

function replaceLastHash(hash) {
	_hashReplacing = true
	const i = location.hash.lastIndexOf('#')
	if (i > 0)
		location.hash = location.hash.slice(0, i+1) + hash
	else
		location.hash = hash
}

function pushHash(hash) {
	_hashReplacing = true
	location.hash += '#' + hash
}

function popHash() {
	_hashReplacing = true
	const i = location.hash.lastIndexOf('#')
	if (i > 0) location.hash = location.hash.slice(0, i)
}
