import * as WcMixin from './WcMixin.js'
import WcAppBar from './WcAppBar.js'

export default class extends HTMLElement {
	_stackOfLayers = []
	_hashReplacing = false

	connectedCallback() {
		customElements.define('app-bar', WcAppBar)
		const me = this.tagName

		WcMixin.addAdjacentHTML(this, `
			<style scoped>
				${me} {
					height: 100vh;
					width: 100vw; max-width: var(--app-max-width);
				}
				${me} > app-bar {
					position: fixed; z-index: 1000; top: 0;
					height: var(--app-bar-height); 
					width: 100%; max-width: var(--app-max-width);
				}
				${me} .modalPageLayer {
					position: fixed; top: 0; z-index:10; 
					height: calc(100vh - var(--app-bar-height));
					width: 100vw; max-width: var(--app-max-width);
					margin-top: var(--app-bar-height); 
					padding-bottom: 0.5rem;
					display: flex; flex-flow: column;
					overflow: auto;
					background-color: white;
				}
				${me} .modalPageLayer > div {
					padding-left: var(--margin1); padding-right: var(--margin1);
					flex-flow: column;
				}
			</style>

			<app-bar w-id='appBar'></app-bar>
			<div class='modalPageLayer'></div>
		`)
	
		window.APP = this
		this._stackOfLayers.push({ layer: this.querySelector('div'), currentPage: null })

		window.onhashchange = async (ev) => {
			if (!this._hashReplacing) {
				if (this._hashLevel(ev.oldURL) - this._hashLevel(ev.newURL) === 1) { //history.go(-1)
					this.popModal(true)
				} else if (this._lastHash(ev.newURL)) {
					this.route(this._lastHash(ev.newURL))
				} else {
					location.reload()
				}
			}
			this._hashReplacing = false
		}
	}

	setBar(v) { this.appBar.setBar(v) }

	setMessage(msg, timeout) { this.appBar.setMessage(msg, timeout) }

	route(id, elem) {
		const top = this._stackOfLayers[this._stackOfLayers.length-1]
		const layer = top.layer
		const curr = top.currentPage
		if (curr) {
			curr.display(false)
			if (curr.onUnRoute) curr.onUnRoute()
		}

		if (!elem) {
			elem = Array.from(layer.children).find(el => el.id === id)
			if (!elem) {
				elem = document.createElement(id)
				layer.append(elem)
			}
		} else {
			layer.append(elem)
		}

		elem.id = id
		top.currentPage = elem
		this._replaceLastHash(id)

		elem.display()
		if (elem.appBar) this.appBar.setBar(elem.appBar)
		if (elem.onRoute) elem.onRoute()
	}

	routeModal(id, elem) {
		this.appBar.pushBar()

		const curr = this._stackOfLayers[this._stackOfLayers.length-1].currentPage
		const layer = document.createElement('div')
		layer.className = 'modalPageLayer'
		curr.append(layer)		

		if (!elem) elem = document.createElement(id)
		layer.append(elem)

		elem.id = id
		this._stackOfLayers.push({ layer: layer, currentPage: elem })
		this._pushHash(id)

		elem.display()
		if (elem.appBar) this.setBar(elem.appBar)
		if (elem.onRoute) elem.onRoute()
	}

	popModal(sys) {
		this._stackOfLayers.pop().layer.remove()
		this.appBar.popBar()
		if (!sys) this._popHash()
	}

	remove(el) {
		if (el.onUnRoute) el.onUnRoute()
		el.remove()
	}

	forceSetHash(hash) {
		this._hashReplacing = true
		location.hash = hash
	}

	_hashLevel(url) {
		return url.split('#').length
	}

	_lastHash(url) {
		const uu = url.split('#')
		return uu.length > 0 ? uu[uu.length-1] : ''
	}

	_replaceLastHash(hash) {
		this._hashReplacing = true
		const i = location.hash.lastIndexOf('#')
		if (i > 0)
			location.hash = location.hash.slice(0, i+1) + hash
		else
			location.hash = hash
	}

	_pushHash(hash) {
		this._hashReplacing = true
		location.hash += '#' + hash
	}

	_popHash() {
		this._hashReplacing = true
		const i = location.hash.lastIndexOf('#')
		if (i > 0) location.hash = location.hash.slice(0, i)
	}
}
