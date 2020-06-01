import wcMixin from '/WcMixin/WcMixin.js'
import './obj-list-item.js'

const me = 'obj-list'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		APP.setHash(me)

		this.innerHTML = `
			<style scoped>
				${me} > #listDiv {
					flex-flow: column;
					margin-bottom: var(--margin2);
				}
				${me} obj-list-item {
					min-width: 100%;
					margin-top: var(--margin2);
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
				${me} #objProps {
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

		let mman = document.querySelector('#obj-new-medias')
		if (!mman) mman = document.createElement('media-manager').build(
			[],
			[
				['msg', 'Take photo, video, or audio:'],
				['cancel'],
				['next', () => APP.route('obj-new')]
			]
		)
		this.appBar = [
			['sep'],
			['but', 'New<br>&rArr;', () => APP.route('obj-new-medias', mman)]
		]

		this.refreshList()
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
})
