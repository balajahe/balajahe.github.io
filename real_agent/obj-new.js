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
					margin: var(--margin1); margin-top: var(--margin2);
					padding-left: var(--margin2);
					border: solid 1px silver;
					display: block;
				}
				${me} #labelsDiv { min-height: calc(var(--button-height) * 0.9); }
				${me} .separ { margin-top: var(--margin2); flex-flow: row nowrap; }
				${me} .separ hr { display: inline-block; flex: 1 1 auto; }
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
			<div w-id='labelsDiv/labels/children'></div>
			<div class='separ'>&nbsp;<span>Click to add label:</span>&nbsp;<hr/></div>
			<div w-id='allLabelsDiv'>
				<input w-id='newLabelInp/newLabel' placeholder='New label...'/>
			</div>
			<div id='locDiv'>
				<iframe w-id='mapIframe'></iframe>
			</div>
		`
		wcMixin(this)

		if (!localStorage.getItem('labels'))
			localStorage.setItem('labels', 'Дом,Дача,Участок,Промзона,Заброшка,Зеленка,Жилой,Ветхий,Разрушен,Продается')
		for (const lab of localStorage.getItem('labels').split(',')) this.addAvailLabel(lab)

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
		const set = () => {
			this.mapIframe.contentWindow.location.replace(`https://www.openstreetmap.org/export/embed.html?bbox=${this.location.longitude-0.002}%2C${this.location.latitude-0.002}%2C${this.location.longitude+0.002}%2C${this.location.latitude+0.002}&layer=mapnik&marker=${this.location.latitude}%2C${this.location.longitude}`)
			//this.locBut.innerHTML = APP.location.latitude + ' - ' + APP.location.longitude
		}
		navigator.geolocation.getCurrentPosition(loc => {
			this.location = loc.coords
			set()
		})
		/*
		navigator.geolocation.watchPosition(loc => {
			this.location = loc.coords
			set()
		})
		*/
	}

	onRoute() {
		APP.setBar([
			['but', 'Geo<br>&#8853;', () => this.updateLocation()],
			['msg', 'Enter description and add labels:'],
			['back'],
			['but', 'Save<br>&rArr;', async () => {
				if (!this.desc) {
					APP.setMsg('<span style="color:red"><b>EMPTY DESCRIPTION!</b></span>')
					this.descDiv.focus()
				} else if (this.labels.length === 0) {
					APP.setMsg('<span style="color:red"><b>NO LABELS!</b></span>')
				} else {
					this.saveNewObj()
				}
			}]
		])
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
			labels: Array.from(this.labels).map(el => el.innerHTML),
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
		for (const origin of origins) {
			proms.push(new Promise(resolve => tran.objectStore("Origins").add(origin).onsuccess = resolve))
		}
		await Promise.all(proms)

		document.querySelector('obj-list').addItem(obj)
		APP.remove(pageMedias)
		APP.remove(this)
		APP.route('obj-list')
		APP.setMsg('Saved !')
		APP.scrollTop = 0
	}
})
