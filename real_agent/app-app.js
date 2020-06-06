import wcMixin from '/WcMixin/WcMixin.js'
import './app-bar.js'
import './obj-list.js'

const me = 'app-app'
customElements.define(me, class extends HTMLElement {
	_stack = []
	_hashReplacing = false

	imgPrevSize = 80
	db = null
	_props = []

	connectedCallback() {
		this.innerHTML = `
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
				${me} .modalPagePlace {
					position: fixed; top: 0; z-index:10; 
					height: calc(100vh - var(--app-bar-height));
					width: 100vw; max-width: var(--app-max-width);
					margin-top: var(--app-bar-height); 
					padding-bottom: 0.5rem;
					display: flex; flex-flow: column;
					overflow: auto;
					background-color: white;
			}
				${me} .modalPagePlace > div {
					padding-left: var(--margin1); padding-right: var(--margin1);
					flex-flow: column;
				}
			</style>

			<app-bar w-id='appBar'></app-bar>
			<div class='modalPagePlace'></div>
		`
		wcMixin(this)
		window.APP = this

		this._stack.push({ place: this.querySelector('div'), currentPage: null })

		const dbr = window.indexedDB.open("RealAgent", 3)
		dbr.onerror = (ev) => { console.log(ev); alert(ev.target.error) }
		dbr.onupgradeneeded = (ev) => {
			const db = ev.target.result
			try {
				db.createObjectStore("Objects", { keyPath: "created" })
			} catch(_) {}
			db.createObjectStore("Origins", { keyPath: "created" })
		}
		dbr.onsuccess = (ev) => {
			this.db = ev.target.result

			if (localStorage.getItem('props'))
				this.props = localStorage.getItem('props').split(',')
			else
				this.props = 'Дом,Дача,Участок,Промзона,Заброшка,Зеленка,Архитектура,Черта города,Жилое,Ветхое,Разрушено,Продается'.split(',')

			APP.route('obj-list')
		}

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

	get props() { return this._props }

	set props(props) { 
		this._props = props
		localStorage.setItem('props', this._props) 
	}

	setBar(v) { this.appBar.setBar(v) }

	message(msg, timeout) { this.appBar.message(msg, timeout) }

	route(id, elem) {
		const top = this._stack[this._stack.length-1]
		const place = top.place
		const curr = top.currentPage
		if (curr) {
			curr.display(false)
			if (curr.onUnRoute) curr.onUnRoute()
		}
		if (elem) {
			if (!Array.from(place.children).find(el => el === elem)) {
				place.append(elem)
			}
		} else {
			elem = Array.from(place.children).find(el => el.id === id)
			if (!elem) {
				elem = document.createElement(id)
				place.append(elem)
			}
		}

		elem.id = id
		top.currentPage = elem
		this._replaceLastHash(id)

		if (elem.appBar) this.appBar.setBar(elem.appBar)
		elem.display()
		if (elem.onRoute) elem.onRoute()
	}

	routeModal(id, elem) {
		this.appBar.pushBar()

		const curr = this._stack[this._stack.length-1].currentPage
		const place = document.createElement('div')
		place.className = 'modalPagePlace'
		curr.prepend(place)		

		if (!elem) elem = document.createElement(id)
		place.append(elem)

		elem.id = id
		this._stack.push({ place: place, currentPage: elem })
		this._pushHash(id)
		if (elem.appBar) this.setBar(elem.appBar)

		if (elem.onRoute) elem.onRoute()
	}

	popModal(sys) {
		this._stack.pop().place.remove()
		this.appBar.popBar()
		if (!sys) this._popHash()
	}

	remove(el) {
		if (el.onUnRoute) el.onUnRoute()
		el.remove()
	}

	now() {
		return '_' + (new Date()).toISOString().replace(/:/g, '-').replace(/T/g, '_').replace(/\./g, '_').slice(0, -1)
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
