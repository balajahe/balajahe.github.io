import wcMixin from '/WcMixin/WcMixin.js'
import './obj-list-item.js'

const me = 'obj-list'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} > #listDiv {
					flex-flow: column;
					margin-bottom: var(--margin2);
				}
				${me} obj-list-item {
					margin-bottom: var(--margin2);
					padding-bottom: var(--margin2);
					border-bottom: 1px solid silver;
					flex-flow: column;
					overflow: auto;
					cursor: pointer; 
				}
				${me} #objDesc {
					display: block;
					padding-left: var(--margin2);
				}
				${me} #objLabels {
					display: flex; flex-flow: row wrap;
					padding-left: var(--margin2);
				}
				${me} > footer { 
					text-align: center;
					padding-left: 1rem; padding-right: 1rem;
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
				this.listDiv.append(document.createElement('obj-list-item').build(cursor.value))
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

	delItem(id) {
		this.querySelector('#' + id).remove()
	}

	onRoute() {
		let mman = document.querySelector('#obj-new-medias')
		if (!mman) mman = 
			document.createElement('media-manager').build(
				[
					['msg', 'Take photo, video, or audio:'],
					['back'],
					['next', () => APP.route('obj-new')]
				],
				null
			)
		APP.setBar([
			['sep'],
			['but', 'New<br>&rArr;', () => APP.route('obj-new-medias', mman)]
		])
	}
})
