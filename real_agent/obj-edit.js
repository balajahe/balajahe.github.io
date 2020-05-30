import wcMixin from '/WcMixin/WcMixin.js'
import './media-container.js'

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
				${me} #labelsDiv { min-height: calc(var(--button-height) * 0.9); }
				${me} .separ { margin-top: var(--margin2); flex-flow: row nowrap; }
				${me} .separ hr { display: inline-block; flex: 1 1 auto; }
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
			<nav w-id='labelsDiv/labels/children'></nav>
			<div class='separ'>&nbsp;<small>Click to add label:</small>&nbsp;<hr/></div>
			<div w-id='allLabelsDiv'>
				<input w-id='newLabelInp/newLabel' placeholder='New label...'/>
			</div>
			<media-container w-id='mediaContainer'></media-container>
			<div id='locDiv'>
				<iframe w-id='mapIframe'></iframe>
				<div w-id='/loc'></div>
			</div>
		`
		wcMixin(this)

		for (const lab of localStorage.getItem('labels').split(',')) this.addAvailLabel(lab)

		if (this.obj) {
			this.desc = this.obj.desc
			for (const lab of this.obj.labels) this.addLabel(lab)
		}
		this.mediaContainer.build(this.obj.medias, true, true)

		this.updateLocation()

		this.newLabelInp.onkeypress = (ev) => {
			if (ev.key === 'Enter') {
				this.addAvailLabel(this.newLabel)
				localStorage.setItem('labels', localStorage.getItem('labels') + ',' + this.newLabel)
				this.newLabel = ''
			}
		}
	}

	addLabel(lab) {
		const but = document.createElement("button")
		but.innerHTML = lab
		but.onclick = () => but.remove()
		this.labelsDiv.append(but)
	}

	addAvailLabel(lab) {
		const but = document.createElement("button")
		but.innerHTML = lab
		but.onclick = (ev) => this.addLabel(ev.target.innerHTML)
		this.newLabelInp.before(but)
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
			['but', 'Cancel<br>&lArr;', () => history.go(-1)],
			['but', 'Save<br>&rArr;', async () => {
				if (!this.desc) {
					APP.message('<span style="color:red">EMPTY DESCRIPTION!</span>')
					this.descDiv.focus()
				} else if (this.labels.length === 0) {
					APP.message('<span style="color:red">NO LABELS!</span>')
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
			labels: Array.from(this.labels).map(el => el.innerHTML),
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
console.log(this.obj.created)
		proms.push(new Promise(resolve => tran.objectStore("Origins").delete(IDBKeyRange.bound(this.obj.created, this.obj.created + '_'.repeat(this.obj.created.length))).onsuccess = resolve))
		await Promise.all(proms)

		document.querySelector('obj-list').delItem(this.obj.created)
		history.go(-1)
		APP.message('DELETED !')
	}
})
