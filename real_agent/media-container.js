import wcMixin from '/WcMixin/WcMixin.js'
import './media-player.js'

const me = 'media-container'
customElements.define(me, class extends HTMLElement {
	_initMedias = null
	_add = null
	_del = null

	constructor() {
		super()
		this.innerHTML = `
			<style scoped>
				${me} { display: flex; flex-flow: row wrap;}
				${me} > div, ${me} > button {
					height: 70px; width: 70px;
					margin: var(--margin1);
			  		display: inline-flex; flex-flow: row; justify-content: center; align-items: center;
			  		overflow: hidden;
				}
				${me} > div:hover { cursor: pointer; }
				${me} > * { max-height: 100%; max-width: 100%; }
				${me} button { border-radius: 0; }
			</style>
			<button w-id='addBut' style='display:none'>Add media</button>	
		`
		wcMixin(this)

		this.addBut.onclick = () => {
	      const mman = document.createElement('media-manager').build(
	         [
	            ['msg', 'Take photo, video, or audio:'],
	            ['but', 'Cancel<br>&lArr;', () => history.go(-1)],
	            ['but', 'Next<br>&rArr;', () => {
	            	mman.medias.forEach(media => this.add(media))
	               history.go(-1)
	            }]
	         ],
	         this.medias
	      )
			APP.routeModal('media-manager', mman)
		}
	}

	build(medias, add, del) {
		this._initMedias = medias
		this._add = add ? add : this.getAttribute('add')
		this._del = del ? del : this.getAttribute('del')

		if (this._initMedias) {
			for (let el=this.addBut.nexElementSibling; el; el=this.addBut.nexElementSibling) el.remove()
			this._initMedias.forEach(media => this.add(media))
		}

		if (this._add) this.addBut.display('inline-flex')
	}

	add(media) {
		const div = document.createElement('div')
		const med = document.createElement('img')
		med._source = media
		med.src = media.preview ? media.preview : 'aaa'

		const delActiion = this._del ? () => div.remove() : null
		div.onclick = (ev) => {
			ev.stopPropagation()
			APP.routeModal('media-player', document.createElement('media-player').build(media, delActiion))
		}

		div.append(med)
		this.addBut.before(div)
	}

	get value() {
		return Array.from(this.querySelectorAll('div')).map(el => el.firstElementChild._source)
	}
})
