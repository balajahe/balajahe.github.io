import wcMixin from '/WcMixin/WcMixin.js'
import './app-bar.js'

const me = 'app-app'
customElements.define(me, class extends HTMLElement {
	db = null
	imgPrevSize = 70
	 _hashReplacing = false

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} > app-bar {
					position: fixed; z-index: 1000; top: 0;
					height: var(--app-bar-height); 
					width: 100%; max-width: var(--app-max-width);
				}
				${me} {
					height: 100vh; 
					width: 100vw; max-width: var(--app-max-width);
					display: flex; flex-flow: column;
					overflow: auto;
					font-size: smaller;
				}
				${me} > div {
					margin-top1: var(--app-bar-height);
					padding-left: var(--margin1); padding-right: var(--margin1);
					flex-flow: column;
				}
				${me} .appModal {
					position: fixed; top: 0; z-index:10; 
					height: 100vh; 
					width: 100vw; max-width: var(--app-max-width);
					flex-flow: column;
					overflow: auto;
					background-color: white; 
				}
				${me} .appModal > div {
					margin-top1: var(--app-bar-height);
					padding-left: var(--margin1); padding-right: var(--margin1);
					flex-flow: column;
				}
			</style>
			<app-bar w-id='appBar'></app-bar>
			<div></div> <!-- this.lastElementChild -->
		`
		wcMixin(this)
		window.APP = this

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
	setMsg(v) { this.appBar.setMsg(v) }

	route(hash, elem) {
		const curr = this.lastElementChild._currentPage
		if (curr) {
			curr.display(false)
			if (curr.onUnRoute) curr.onUnRoute()
		}
		if (elem) {
			if (!Array.from(this.lastElementChild.children).find(el => el === elem)) {
				this.lastElementChild.append(elem)
			}
		} else {
			elem = Array.from(this.lastElementChild.children).find(el => el.id === hash)
			if (!elem) {
				elem = document.createElement(hash)
				this.lastElementChild.append(elem)
			}
		}

		elem.id = hash
		if (elem.onRoute) elem.onRoute()
		elem.display()

		this.lastElementChild._currentPage = elem
		this._replaceLastHash(hash)
	}

	routeModal(hash, elem) {
		this.appBar.pushBar()
		const modal = document.createElement('div')
		modal.className = 'appModal'
		this.append(modal)		
		modal.append(elem)

		elem.id = hash
		if (elem.onRoute) elem.onRoute()
		elem.display()

		this.lastElementChild._currentPage = elem
		this._pushHash(hash)
	}

	popModal(sys) {
		this.lastElementChild.remove()
		this.appBar.popBar()
		if (!sys) this._popHash()
	}

	remove(el) {
		if (el.onUnRoute) el.onUnRoute()
		el.remove()
	}

	now() {
		return 'D--' + (new Date()).toISOString().replace(/:/g, '-').replace(/T/g, '--').replace(/\./g, '--').slice(0, -1)
	}

	setHash(hash) {
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
})
