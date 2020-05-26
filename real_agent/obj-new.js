import wcMixin from '/WcMixin/WcMixin.js'

const me = 'obj-new'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} button { height: calc(var(--button-height) * 0.8); }
				${me} input { height: calc(var(--button-height) * 0.8); width: 30%; }
				${me} > #descDiv {
					min-height: 5em;
					margin: var(--margin1); padding-left: var(--margin2);
					border: solid 1px silver;
					display: block;
				}
				${me} #labelsDiv { min-height: calc(var(--button-height) * 0.9); }
				${me} .separ { margin-top: var(--margin2); flex-flow: row nowrap; }
				${me} .separ hr { display: inline-block; flex: 1 1 auto; }
				${me} #locDiv { 
					height: 250px; width: 100%; 
					margin-top: var(--margin2); margin-bottom: var(--margin2);
				}
				${me} #locDiv > iframe { width: 85%; }
				${me} #locDiv > div { 
					width: 15%; 
					justify-content: center; align-items: center;
					writing-mode: tb-rl;
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
				<div w-id='/loc'></div>
			</div>
		`
		wcMixin(this)

		if (!localStorage.getItem('labels'))
			localStorage.setItem('labels', 'Дом,Дача,Участок,Заброшен,Ветхий,Разрушен,Жилой,Продается')
		for (const lab of localStorage.getItem('labels').split(',')) this.addAvailLabel(lab)

		this.newLabelInp.onkeypress = (ev) => {
			if (ev.key === 'Enter') {
				this.addAvailLabel(this.newLabel)
				localStorage.setItem('labels', localStorage.getItem('labels') + ',' + this.newLabel)
				this.newLabel = ''
			}
		}
		//APP.locationCallback = this.showLocation.bind(this)
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

	showLocation() {
		if (APP.location) {
			this.loc = APP.location.latitude + ' - ' + APP.location.longitude
			this.mapIframe.contentWindow.location.replace(`https://www.openstreetmap.org/export/embed.html?bbox=${APP.location.longitude-0.002}%2C${APP.location.latitude-0.002}%2C${APP.location.longitude+0.002}%2C${APP.location.latitude+0.002}&layer=mapnik&marker=${APP.location.latitude}%2C${APP.location.longitude}`)
		}
	}

	onRoute() {
		this.showLocation()
		this.descDiv.focus()
		APP.setBar([
			['msg', 'Enter description and add labels:'],
			['back'],
			['but', 'Save<br>&rArr;', () => {
				if (!this.desc) {
					APP.setMsg('<span style="color:red">Empty description !</span>')
					this.descDiv.focus()
				} else if (this.labels.length === 0) {
					APP.setMsg('<span style="color:red">No labels !</span>')
				} else {
					this.saveNewObj()
				}
			}]
		])
	}

	saveNewObj() {
		const pageMedias = document.querySelector('media-manager')
		const pageForm = this
		const now = 'D--' + (new Date()).toISOString().replace(/:/g, '-').replace(/T/g, '--').slice(0, -5)
		const obj = {
			created: now,
			modified: now,
			location: {latitude: APP.location?.latitude, longitude: APP.location?.longitude},
			desc: pageForm.desc,
			labels: Array.from(pageForm.labels).map(el => el.innerHTML),
			medias: pageMedias.medias
		} 
		APP.db.transaction("Objects", "readwrite").objectStore("Objects").add(obj).onsuccess = (ev) => {
			APP.remove(pageMedias)
			APP.remove(this)
			document.querySelector('obj-list').addItem(obj)
			APP.route('obj-list')
			APP.setMsg('Saved !')
		}
	}
})
