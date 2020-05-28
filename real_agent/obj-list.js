import wcMixin from '/WcMixin/WcMixin.js'
import './obj-list-item.js'

const me = 'obj-list'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} { margin-top: var(--app-bar-height); }
				${me} > #listDiv {
					flex-flow: column;
					margin-bottom: var(--margin2);
				}
				${me} > #listDiv > * {
					margin-bottom: var(--margin2);
					padding-bottom: var(--margin2);
					border-bottom: 1px solid silver;
					flex-flow: column;
					overflow: auto;
					cursor: pointer; 
				}
				${me} > #listDiv > * > #objDesc {
					display: block;
				}
				${me} > footer { 
					text-align: center;
					padding-left: 1rem; padding-right: 1rem; padding-bottom: 0.5rem;
				}
			</style>
			<div w-id='listDiv'></div>
			<footer>Real Agent is a database of arbitrary objects with geolocation, photos and videos.</footer>
		`
		wcMixin(this)

		APP.setHash(me)

		if (!APP.db) {
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

	getItem(id) {
		return this.querySelector('#' + id)
	}

	setItem(obj) {
		this.querySelector('#' + obj.created).replaceWith(document.createElement('obj-list-item').build(obj))
	}

	addItem(obj) {
		this.listDiv.prepend(document.createElement('obj-list-item').build(obj))
	}

	onRoute() {
		const mman = document.createElement('media-manager').build(
			[
				['msg', 'Take photo, video, or audio:'],
				['back'],
				['but', 'Next<br>&rArr;', () => APP.route('obj-new')]
			],
			null
		)
		APP.setBar([
			['sep'],
			['but', 'New<br>&rArr;', () => APP.route('media-manager', mman)]
		])
	}
})
