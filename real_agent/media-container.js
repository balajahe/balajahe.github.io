import wcMixin from '/WcMixin/WcMixin.js'
import './media-player.js'

const me = 'media-container'
customElements.define(me, class extends HTMLElement {
	built = false
	delFlag = false

	connectedCallback() {
		if (!this.built) this.build(null, this.getAttribute('add'), this.getAttribute('del'))
	}

	build(medias, addFlag, delFlag) {
		this.built = true
		this.delFlag = delFlag

		this.innerHTML = `
			<style scoped>
				${me} { 
					width: 100%;
					/*display: grid; grid-template-columns: repeat(auto-fill, minmax(${APP.imgPrevSize}px, 1fr));*/
					display: flex; flex-flow: row wrap;
				}
				${me} > * { 
					height: ${APP.imgPrevSize}px; width: ${APP.imgPrevSize}px;
					margin: var(--margin1);
				}
				${me} > button { 
					height: ${APP.imgPrevSize}px; width: ${APP.imgPrevSize}px;
					border-radius: 0;
				}
				${me} > *:hover { cursor: pointer; }
			</style>

			<button w-id='addBut' style='display:none'>ADD<br>MEDIA</button>	

		`
		wcMixin(this)

		this.addBut.onclick = () => {
	      const mman = document.createElement('media-manager').build(
	         [
	            ['msg', 'Take photo, video, or audio:'],
	            ['but', 'Cancel<br>&lArr;', () => history.go(-1)],
	            ['but', 'Next<br>&rArr;', () => {
	            	mman.getMedias().forEach(media => this.addMedia(media, true))
	               history.go(-1)
	            }]
	         ],
	         this.medias
	      )
			APP.routeModal('media-manager', mman)
		}

		if (medias) {
			for (let el=this.addBut.nexElementSibling; el; el=this.addBut.nexElementSibling) el.remove()
			medias.forEach(media => this.addMedia(media))
		}
		if (addFlag) this.addBut.display()

		return this
	}

	addMedia(media) {
		const med = document.createElement('img')
		med._source = media
		med.src = media.preview

		const delActiion = this.delFlag || this.delFlag ? () => med.remove() : null
		med.onclick = (ev) => {
			ev.stopPropagation()
			APP.routeModal('media-player', document.createElement('media-player').build(media, delActiion))
		}

		this.addBut.before(med)
	}

	getMedias() {
		return Array.from(this.querySelectorAll('img')).map(el => el._source)
	}
})
