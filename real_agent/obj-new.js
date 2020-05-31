import wcMixin from '/WcMixin/WcMixin.js'

const me = 'obj-new'
customElements.define(me, class extends HTMLElement {
	location = null

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
					margin-top: var(--margin1);	
				}
				${me} #locDiv > iframe { 
					display: inline-block; 
					width: 100%;
				}
			</style>
			
			<div w-id='descDiv/desc' contenteditable='true'></div>
			<div w-id='propsDiv/props/children'></div>
			<elem-separator>Click to add property:</elem-separator>
			<div w-id='allpropsDiv'>
				<input w-id='newPropInp/newProp' placeholder='New property...'/>
			</div>
			<div id='locDiv'>
				<iframe w-id='mapIframe'></iframe>
			</div>
		`
		wcMixin(this)

		this.newPropInp.onkeypress = (ev) => {
			if (ev.key === 'Enter') {
				this.addAvailProp(this.newProp)
				APP.props = APP.props.concat(this.newProp)
				this.newProp = ''
			}
		}
	}

	addProp(prop) {
		const but = document.createElement("button")
		but.innerHTML = prop
		but.onclick = () => but.remove()
		this.propsDiv.append(but)
	}

	addAvailProp(prop) {
		const but = document.createElement("button")
		but.innerHTML = prop
		but.onclick = (ev) => this.addProp(ev.target.innerHTML)
		this.newPropInp.before(but)
	}

	updateLocation() {
		navigator.geolocation.getCurrentPosition(loc => {
			this.location = loc.coords
			this.mapIframe.contentWindow.location.replace(`https://www.openstreetmap.org/export/embed.html?bbox=${this.location.longitude-0.002}%2C${this.location.latitude-0.002}%2C${this.location.longitude+0.002}%2C${this.location.latitude+0.002}&layer=mapnik&marker=${this.location.latitude}%2C${this.location.longitude}`)
			//this.locBut.innerHTML = APP.location.latitude + ' - ' + APP.location.longitude
		})
	}

	onRoute() {
		APP.setBar([
			['but', 'Geo<br>&#8853;', () => this.updateLocation()],
			['msg', 'Enter description and add properties:'],
			['back'],
			['but', 'Save<br>&rArr;', async () => {
				if (!this.desc) {
					APP.message('<span style="color:red">EMPTY DESCRIPTION!</span>')
					this.descDiv.focus()
				} else if (this.props.length === 0) {
					APP.message('<span style="color:red">NO PROPERTIES!</span>')
				} else {
					this.saveNewObj()
				}
			}]
		])
		for (const prop of APP.props) this.addAvailProp(prop)
		this.updateLocation()
		this.descDiv.focus()
	}

	async saveNewObj() {
		const pageMedias = document.querySelector('#obj-new-medias')
		const now = APP.now()
		const obj = {
			created: now,
			modified: now,
			location: {latitude: this.location?.latitude, longitude: this.location?.longitude},
			desc: this.desc,
			labels: Array.from(this.props).map(el => el.innerHTML),
			medias: pageMedias.getMedias()
		} 

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

		document.querySelector('obj-list').addItem(obj)
		APP.remove(pageMedias)
		APP.remove(this)
		APP.route('obj-list')
		APP.message('SAVED !')
	}
})
