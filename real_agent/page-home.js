import wcMixin from '/WcMixin/WcMixin.js'
import './obj-list-item.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} #listDiv > * > div {
					border-bottom: 1px solid silver;
					margin-bottom: var(--margin2);
					overflow: auto;
				}
				${me} #objLabels {
					display: flex; flex-flow: row wrap;
				} 
				${me} #objDesc:hover, #objLabels:hover { 
					cursor: pointer; 
				}
				${me} #objMedias { 
					display: flex; flex-flow: row wrap; 
					margin-bottom: var(--margin2);
				}
				${me} > center { margin: 1em; }
			</style>
			<div w-id='listDiv'></div>
			<center>Real Agent is a database of arbitrary objects with geolocation, photos and videos.</center>
		`
		wcMixin(this)

		if (!APP.db) {
			const dbr = window.indexedDB.open("RealAgent", 1)
			dbr.onerror = (ev) => console.log(ev)
			dbr.onupgradeneeded = (ev) => {
				const db = ev.target.result
				db.createObjectStore("Objects", { keyPath: "created" })
			}
			dbr.onsuccess = (ev) => {
				APP.db = ev.target.result
				this.refreshList()
			}
		} else {
			this.refreshList()
		}
	}

	refreshList() {
		this.listDiv.innerHTML = ''
		APP.db.transaction("Objects").objectStore("Objects").openCursor(null,'prev').onsuccess = (ev) => {
			const cursor = ev.target.result
			if (cursor) {
				const obj = cursor.value
				this.listDiv.append(document.createElement('obj-list-item').build(obj))
				cursor.continue()
			}
		}
	}

	addObj(obj) {
		this.listDiv.prepend(document.createElement('obj-list-item').build(obj))
	}

	onRoute() {
		APP.setBar({
			msg: '',
			back: false,
			buts: [{
				html: 'New<br>&rArr;',
				click: () => APP.route('page-obj-new1')
			}]
		})
	}
})
