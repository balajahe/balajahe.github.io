import * as WcMixin from '/WcApp/WcMixin.js'
import WcApp from '/WcApp/WcApp.js'
import './app-menu.js'
import './sepa-rator.js'
import './media-player.js'
import './media-container.js'
import './media-manager.js'
import './obj-list-item.js'
import './obj-list.js'
import './obj-new.js'
import './obj-edit.js'
import './props-manager.js'
import './props-setup.js'

const me = 'app-app'
customElements.define(me, class extends WcApp {
	imgPrevSize = 80
	db = null
	_props = []

	connectedCallback() {
		super.connectedCallback()

		const dbr = window.indexedDB.open("RealAgent", 3)
		dbr.onerror = (ev) => { console.log(ev); alert(ev.target.error) }
		dbr.onupgradeneeded = (ev) => {
			const db = ev.target.result
			db.createObjectStore("Objects", { keyPath: "created" })
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
	}

	get props() { 
		return this._props 
	}

	set props(props) { 
		this._props = props
		localStorage.setItem('props', this._props) 
	}

	now() {
		return '_' + (new Date()).toISOString().replace(/:/g, '-').replace(/T/g, '_').replace(/\./g, '_').slice(0, -1)
	}
})
