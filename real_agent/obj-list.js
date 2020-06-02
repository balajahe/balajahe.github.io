import wcMixin from '/WcMixin/WcMixin.js'
import './obj-list-item.js'
import './media-manager.js'
import './obj-new.js'

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
					padding-bottom: var(--margin1);
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

		this.appBar = [
			['sep'],
			['but', 'New<br>&rArr;', () => {
				let mman = document.querySelector('#obj-new-medias')
				if (!mman) mman = document.createElement('media-manager').build(
					[],
					[
						['msg', 'Take photo, video, or audio:'],
						['cancel'],
						['next', () => APP.route('obj-new')]
					]
				)
				APP.route('obj-new-medias', mman)
			}]
		]

		this.refreshList()

		this.addEventListener('set-item', (ev) => {
			this.querySelector('#' + ev.val.created).replaceWith(document.createElement('obj-list-item').build(ev.val))
		})

		this.addEventListener('del-item', (ev) => {
			this.querySelector('#' + ev.val).remove()
		})
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

	addItem(obj) {
		this.listDiv.prepend(document.createElement('obj-list-item').build(obj))
	}
})
