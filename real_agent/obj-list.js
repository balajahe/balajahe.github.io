import * as WcMixin from '/WcApp/WcMixin.js'

const me = 'obj-list'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		WcMixin.addAdjacentHTML(this, `
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
		`)

		APP.forceSetHash(me)

		this.appBar = [
			['sep'],
			['new', async () => {
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

		this.addEventListener('save-item', async (ev) => {
			await this.saveExistObj(ev.val)
			this.querySelector('#' + ev.val.created).replaceWith(document.createElement('obj-list-item').build(ev.val))
		})

		this.addEventListener('delete-item', async (ev) => {
			await this.deleteObj(ev.val)
			this.querySelector('#' + ev.val).remove()
		})

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

	async addItem(obj) {
		await this.saveNewObj(obj)
		this.listDiv.prepend(document.createElement('obj-list-item').build(obj))
	}

	async saveNewObj(obj) {
		const origins = []
		for (const media of obj.medias) {
			media.created = obj.created + media.created
			origins.push({ created: media.created, origin: media.origin })
			media.origin = null
		}

		const tran = APP.db.transaction(['Objects', 'Origins'], 'readwrite')
		const proms = []
		proms.push(new Promise(resolve => tran.objectStore("Objects").add(obj).onsuccess = resolve))
		for (const origin of origins)
			proms.push(new Promise(resolve => tran.objectStore("Origins").add(origin).onsuccess = resolve))
		await Promise.all(proms)
	}

	async saveExistObj(obj) {
		const origins = []
		for (const media of obj.medias) {
			if (media.origin) {
				media.created = obj.created + media.created
				origins.push({ created: media.created, origin: media.origin })
				media.origin = null
			}
		}
		const tran = APP.db.transaction(['Objects', 'Origins'], 'readwrite')
		const proms = []
		proms.push(new Promise(resolve => tran.objectStore("Objects").put(obj).onsuccess = resolve))
		for (const origin of origins)
			proms.push(new Promise(resolve => tran.objectStore("Origins").put(origin).onsuccess = resolve))
		await Promise.all(proms)
	}

	async deleteObj(id) {
		const tran = APP.db.transaction(['Objects', 'Origins'], 'readwrite')
		const proms = []
		proms.push(new Promise(resolve => tran.objectStore("Objects").delete(id).onsuccess = resolve))
		proms.push(new Promise(resolve => tran.objectStore("Origins").delete(IDBKeyRange.bound(id, id + '_'.repeat(id.length))).onsuccess = resolve))
		await Promise.all(proms)
	}
})
