import wcMixin from '/WcMixin/WcMixin.js'
import './media-container.js'
import './props-manager.js'

const me = 'obj-edit'
customElements.define(me, class extends HTMLElement {
	obj = null
	location = null

	build(obj) {
		this.obj = obj
		return this
	}

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} button { height: calc(var(--button-height) * 0.8); }
				${me} input { height: calc(var(--button-height) * 0.8); width: 30%; }
				${me} > #descDiv {
					min-height: 5em;
					margin: var(--margin1);
					padding-left: var(--margin2);
					border: solid 1px silver;
					display: block;
				}
				${me} #propsDiv { min-height: calc(var(--button-height) * 0.9); }
				${me} #locDiv { 
					height: 250px; width: 100%; 
					margin-top: var(--margin1); margin-bottom: var(--margin1);
				}
				${me} #locDiv > iframe { 
					display: inline-block; 
					width: 100%; /*calc(100% - var(--button-height)); */
				}
				${me} #locDiv > div { 
					display: none;
					height: 100%; width: var(--button-height);
					flex-direction: column; justify-content: center; align-items: margin-bottom;
					writing-mode: tb-rl; text-align: right; padding-bottom: 0.3rem;
				}
			</style>

			<div w-id='descDiv/desc' contenteditable='true'></div>
			<nav w-id='propsDiv'>
				<button w-id='editPropsBut'>ADD / REMOVE</button>
			</nav>
			<media-container w-id='mediaContainer'></media-container>
			<div id='locDiv'>
				<iframe w-id='mapIframe'></iframe>
				<div w-id='/loc'></div>
			</div>
		`
		wcMixin(this)

		if (this.obj) {
			this.desc = this.obj.desc
			this.setProps(this.obj.labels)
		}
		this.mediaContainer.build(this.obj.medias, true, true)

		this.addEventListener('change-props', (ev) => {
			this.setProps(ev.val)
		})

		this.updateLocation()

		this.editPropsBut.onclick = (ev) => APP.routeModal('props-manager', document.createElement('props-manager').build(this.getProps()))
	}

	setProps(props) {
		for (let el = this.editPropsBut.previousElementSibling; el; el = this.editPropsBut.previousElementSibling) el.remove()
		for (const prop of props) {
			const but = document.createElement("button")
			but.innerHTML = prop
			this.editPropsBut.before(but)
		}
	}

	getProps() {
		return Array.from(this.propsDiv.children).slice(0, -1).map(el => el.innerHTML)
	}

	updateLocation() {
		const draw = () => this.mapIframe.contentWindow.location.replace(`https://www.openstreetmap.org/export/embed.html?bbox=${this.location.longitude-0.002}%2C${this.location.latitude-0.002}%2C${this.location.longitude+0.002}%2C${this.location.latitude+0.002}&layer=mapnik&marker=${this.location.latitude}%2C${this.location.longitude}`)
	
		if (this.obj.location.latitude && this.obj.location.longitude) {
			this.location = { latitude: this.obj.location.latitude, longitude: this.obj.location.longitude }
			draw()
	
		} else {
			navigator.geolocation.getCurrentPosition(loc => {
				this.location = { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
				draw()
				APP.message('LOCATION UPDATED!')
			})
		}
	}

	onRoute() {
		APP.setBar([
			['but', 'Delete<br>&#8224;', async () => {
				if (confirm('Delete current object forever ?')) this.deleteObj()
			}],
			['sep'],
			['cancel', () => history.go(-1)],
			['save', async () => {
				if (!this.desc) {
					APP.message('<span style="color:red">EMPTY DESCRIPTION!</span>')
					this.descDiv.focus()
				} else if (this.getProps().length === 0) {
					APP.message('<span style="color:red">NO PROPERTIES!</span>')
				} else {
					this.saveExistObj()
				}
			}]
		])
	}

	async saveExistObj() {
		const now = APP.now()
		const obj = {
			created: this.obj.created,
			modified: now,
			location: {latitude: this.location?.latitude, longitude: this.location?.longitude},
			desc: this.desc,
			labels: this.getProps(),
			medias: this.mediaContainer.getMedias()
		}

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

		document.querySelector('obj-list').setItem(obj)
		history.go(-1)
		APP.message('SAVED !')
	}

	async deleteObj(id) {
		const tran = APP.db.transaction(['Objects', 'Origins'], 'readwrite')
		const proms = []

		proms.push(new Promise(resolve => tran.objectStore("Objects").delete(this.obj.created).onsuccess = resolve))
		proms.push(new Promise(resolve => tran.objectStore("Origins").delete(IDBKeyRange.bound(this.obj.created, this.obj.created + '_'.repeat(this.obj.created.length))).onsuccess = resolve))
		await Promise.all(proms)

		document.querySelector('obj-list').delItem(this.obj.created)
		history.go(-1)
		APP.message('DELETED !')
	}
})
